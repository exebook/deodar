// внимание, написаное ниже не совсем верно, на самом деле задачи выполняются по-очереди

//  основа для очереди задач
//  на каждом шаге очереди запускается
//  шаг каждой из висящих задач
//  некоторые задачи при выполнении
//  разворачиваются на подзадачи
//  по завершении могут запускать
//  задачи из очереди ожидания - очередные
//  могут создавать новые задачи
//  например по завершении копирования
//  файла может запускаться его удаление
//  бывают задачи созданые пользователем
//  они называются задания
//  у этих заданий есть общий ход выполнения
//  он же прогрессбар, у некоторых подзадач он тоже может быть

TChain = kindof(TObject)
TChain.can.init = function() {
	dnaof(this)
	this.tasks = []
	this.pos = 0
}

TChain.can.next = function() {
	this.progress.repaint()
	if (this.pos == this.tasks.length) {
		this.progress.getDesktop().hideModal()
		this.sPanel.list.reload()
		this.dPanel.list.reload()
		return
	}
	var T = this.tasks[this.pos]
	if (T.state == undefined) {
		T.state = 'active'
		T.chain = this
		T.task = T.task.bind(T)
	}
	
	if (T.state == 'done') {
		if (T.id != undefined) this.sPanel.list.selectItem(T.id, false)
		this.pos++
		this.progress.total.pos++
		this.tick()
	} else if (T.state == 'canceled') {
		this.pos++
		this.progress.total.pos++
		this.tick()
	} else if (T.state == 'active') {
		T.task()
	} else if (T.state == 'cancel') {
		T.task()
	}
}


TChain.can.cancel = function() {
	this.tasks.splice(this.pos + 1, this.tasks.length - this.pos - 1)
	var T = this.tasks[this.pos]
	if (T) {
		if (T.state == 'active') T.state = 'cancel'
		else {
			this.tasks.splice(this.pos, 1)
		}
	}
}

TChain.can.tick = function() {
	setImmediate(this.next.bind(this))
//	setTimeout(this.next.bind(this), 100)
}

TCopyProgress = kindof(TDialog)
TCopyProgress.can.init = function (interrupt) {
	var $ = this
	dnaof(this, 55, 10)
	$.title = 'Исполнение задач'
	$.filename = TLabel.create('$file')
	$.totalname = TLabel.create('Общий ход:')
	$.file = TDoneBar.create()
	$.total = TDoneBar.create()

	$.add($.totalname, 45, 1), $.addRow()
	$.add($.total, 45, 1), $.addRow()
	$.add($.filename, 45, 1), $.addRow()
	$.add($.file, 45, 1), $.addRow()
	$.addRow()
	$.cancel = TButton.create(9, 'Отмена', interrupt)
	$.add($.cancel, 10, 1)
}

TBeginCopyDialog = kindof(TDialog)
TBeginCopyDialog.can.init = function(W, title, message, dest, callback) {
	dnaof(this, W, 1)
	var $ = this
	this.title = title
	this.msg = TLabel.create()
	this.msg.title = message
	this.add(this.msg, 45, 1), this.addRow()
	this.to = TInput.create(dest)
	this.add(this.to, 45, 1), this.addRow()
	this.addRow()
	this.ok = TButton.create(36, 'Давай', function() {
		$.close()
		callback()
		return true
	})
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(9, 'Отмена', function() { $.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
}

taskCopyItem = function() {
	try {
		var stat = fs.statSync(this.idir +'/'+ this.iname)
		if (stat.isFile() == true) {
			this.task = taskCopyFile.bind(this)
		} else if (stat.isDirectory() == true) {
			this.task = taskCopyDir.bind(this)
		} else this.state = 'canceled' // unknown inode
	} catch (e) { this.state = 'canceled' }
	this.chain.tick()
}

promptCopyFile = function(operation, sPanel, dPanel, do_after) {
	var list = [], 
		it = sPanel.list.items,
		sid = sPanel.list.sid,
		sel = sPanel.list.selection
	if (sel.length == 0) {
		if (it[sid].dir && it[sid].name == '..') return
		list.push({ id: sid, name: it[sid].name })
	} else 
		for (var i = 0; i < sel.length; i++)
			list.push({ name: it[sel[i]].name, id: sel[i] })
	var Operation = 'Списать'
	if (operation == 'move') Operation = 'Перенести'
	var copyDialog = TBeginCopyDialog.create(55, Operation, 
		Operation + ' ' + list.length + ' штук в:', 
		dPanel.list.path, copyFunc)
	
//	copier.do_after = do_after
	copyDialog.actor = copyDialog.to
	sPanel.getDesktop().showModal(copyDialog)

	var chain
	
	function interrupt() {
		chain.cancel()
		return true
	}

	function copyFunc() {
		var typed = copyDialog.to.getText(), oname
		var odir = dPanel.list.path
		if (dPanel.list.path != typed) { // что то ввели
			var odir = sPanel.list.path
			if (typed.charAt(0) == '/') odir = ''
			var isDir = false
			try { isDir = fs.statSync(odir + '/' + typed).isDirectory() } catch (e) {}
			if (!isDir) {
				if (list.length == 1) { list[0].oname = typed }
				else { log('что поделать, нельзя списать много файлов в один'); return }
			} else {
				odir = sPanel.list.path + '/' + typed
			}
		}
		chain = TChain.create()
		chain.progress = TCopyProgress.create(interrupt)
		chain.progress.total.pos = 0
		chain.progress.total.max = list.length
		chain.sPanel = sPanel
		chain.dPanel = dPanel
		sPanel.getDesktop().showModal(chain.progress)
		for (var i = 0; i < list.length; i++) {
			var iname = list[i].name, oname = list[i].name
			if (list[i].oname) oname = list[i].oname
			chain.tasks.push({
				task: taskCopyItem, chain: chain, id: list[i].id, 
				iname: iname, oname: oname, 
				op: operation, idir: sPanel.list.path, odir: odir
			})
		}
		chain.tick()
	}
}

