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

//copier
//newTask

var tasks = []

function copylist(op, desktop, sel, src, dest) {
	var progress = TCopyProgress.create()
	desktop.showModal(progress)
	for (var i = 0; i < sel.length; i++) {
		tasks.push({
			op: op, name: sel[i]
		})
	}
	log(op, sel, src, dest)
}


TDoneBar = kindof(TView)
TDoneBar.can.init = function() {
	dnaof(this)
	this.pos = 0, this.max = 100
	//'█▒▓░▍▌'
}

TDoneBar.can.draw = function(state) {
	dnaof(this, state)
	var X = (this.max / this.w)
	if (X == 0) return
	X = Math.round(this.pos / X)
	this.rect(X, 0, this.w, 1, '░', 0xaaa, 0x888, 0x0)
	this.rect(0, 0, X, 1, ' ', this.pal[1], this.pal[0]) //█
}


TCopyProgress = kindof(TDialog)
TCopyProgress.can.init = function () {
	var $ = this
	dnaof(this, 55, 10)
	$.title = 'Исполнение задач'
	$.filename = TLabel.create('$file')
	$.totalname = TLabel.create('Общий ход:')
	$.file = TDoneBar.create()
	$.total = TDoneBar.create()
	$.add($.filename, 45, 1)
	$.addRow()
	$.add($.file, 45, 1)
	$.addRow()
	$.add($.totalname, 45, 1)
	$.addRow()
	$.add($.total, 45, 1)
	$.addRow()
	$.addRow()
	$.cancel = TButton.create(9, 'Отмена', function() {
		log('Вы изволили нажать "Отмена", но эта возможность пока ещё не разработана, простите.')
		//$.close()
		return true
	})
	$.add($.cancel, 10, 1)
}

TBeginCopyDialog = kindof(TDialog)
TBeginCopyDialog.can.init = function(W, H, title, message) {
	dnaof(this, W, H)
	var $ = this
	this.title = title
	this.msg = TLabel.create()
	this.msg.title = message
	this.add(this.msg, 45, 1)
	this.addRow()

	this.to = TInput.create('')
	this.add(this.to, 45, 1)
	this.addRow()
	this.addRow()
	
	this.ok = TButton.create(36, 'Давай', function() {
		$.close()
		copylist($.operation, $.getDesktop(), $.selection, $.from, $.to.text.getText())
		return true
	})
	
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(9, 'Отмена', function() { $.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
}

promptCopyFile = function(operation, src, dest, do_after) {
	var sel = [], it = src.list.items, sid = src.list.sid
	if (src.list.selection.length == 0) {
		if (it[sid].dir && it[sid].name == '..') return
		sel.push(it[sid].name)
	} else {
		for (var i = 0; i < src.list.selection.length; i++) {
			sel.push(it[src.list.selection[i]].name)
		}
	}
	var Operation = 'Копировать'
	if (operation == 'move') Operation = 'Перенести'
	var copyDialog = TBeginCopyDialog.create(55, 1, Operation, Operation + ' ' + sel.length + ' штук в:')
	copyDialog.msg.title = Operation + ' ' + sel.length + ' штук в:'
	copyDialog.from = src.list.path
	copyDialog.to.setText(dest.list.path)
	copyDialog.actor = copyDialog.to
	copyDialog.selection = sel
	copyDialog.operation = operation
//	copier.sourcePanel = src
//	copier.destPanel = dest
//	copier.operation = operation
//	copier.do_after = do_after
	src.getDesktop().showModal(copyDialog)
}
