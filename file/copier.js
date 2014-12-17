
TCopyProgress = kindof(TDialog)
TCopyProgress.can.init = function (interrupt) {
	var $ = this
	dnaof(this, 55, 10)
	$.title = 'Исполнение задач'
	$.filename = TLabel.create('$file')
	$.totalname = TLabel.create('Общий ход')
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
		var stat = fs.lstatSync(this.idir +'/'+ this.iname)
		if (stat.isFile() == true) {
			if (this.op == 'move') {
				this.task = taskMoveFile.bind(this)
			} else
			this.task = taskCopyFile.bind(this)
		} else if (stat.isDirectory() == true) {
			if (this.op == 'move') {
				this.task = taskMoveDir.bind(this)
			} else
			this.task = taskCopyDir.bind(this)
		} else this.state = 'done' // unknown inode
	} catch (e) { this.state = 'done' }
	this.chain.tick()
}

function taskSync() {
	var me = this
	if (this.state == 'cancel') {
		this.state = 'canceled'
		this.chain.tick()
		return
	}
	this.chain.progress.filename.title = 'Сброс из памяти'
	require('child_process').exec('sync', function() {
		me.state = 'done'
		me.chain.tick()
	})
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
		var odir = dPanel.list.path, mask, maskDir
		if (dPanel.list.path != typed) { // что то ввели
			var odir = sPanel.list.path
			maskDir = typed.split('/')
			mask = maskDir.pop()
			maskDir = maskDir.join('/')
			if (maskDir.length > 0) return
			if (mask.indexOf('*') >= 0 || mask.indexOf('?') >= 0) {
				for (var i = 0; i < list.length; i++) {
					list[i].oname = maskNewName(list[i].name, mask)
				}
				if (list.length == 1) typed = list[0].oname
			} else {
				if (typed.charAt(0) == '/') odir = ''
				var isDir = false
				try { isDir = fs.lstatSync(odir + '/' + typed).isDirectory() } catch (e) {}
				if (!isDir) {
					if (list.length == 1) { list[0].oname = typed }
					else { log('что поделать, нельзя списать много файлов в один'); return }
				} else {
					odir = sPanel.list.path + '/' + typed
				}
			}
		}
		chain = TChain.create()
		chain.progress = TCopyProgress.create(interrupt)
		chain.progress.total.position = 0
		chain.progress.total.max = list.length
		chain.sPanel = sPanel
		chain.dPanel = dPanel
		sPanel.getDesktop().showModal(chain.progress)
		chain.tasks.push({ task: taskSync, chain: chain, state: 'pending' })
		
		for (var i = 0; i < list.length; i++) {
			var iname = list[i].name, oname = list[i].name
			if (list[i].oname) oname = list[i].oname
			chain.tasks.push({
				task: taskCopyItem, chain: chain, id: list[i].id, 
				iname: iname, oname: oname, 
				op: operation, idir: sPanel.list.path, odir: odir
			})
		}

		chain.onPaint = function() {
			//if (this.progress) 
			this.progress.repaint()
		}
		
		chain.onFinish = function() {
			//if (this.progress) {
				this.progress.getDesktop().hideModal()
				this.sPanel.list.reload()
				this.dPanel.list.reload()
			//}
		}
		
		chain.onTask = function(T) {
		if (T.id != undefined) this.sPanel.list.selectItem(T.id, false)
			this.progress.total.position++
		}
		
		chain.tick()
	}
}

