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

function copylist(a, b, c) {
	log(a, b, c)
}


TDoneBar = kindof(TView)
TDoneBar = 
	var $ = TView()
	$.pos = 0, $.max = 100
	$.bg = 0xaaa, $.fg = 0x800
	$.override('draw')
	$.draw = function() {
		this.inherited('draw')
		var X = (this.max / this.w)
		if (X == 0) return
		X = Math.round(this.pos / X)
		this.rect(X, 0, this.w, 1, '░', 0xaaa, 0x888, 0x0)
		this.rect(0, 0, X, 1, ' ', this.bg, this.fg) //█
	}
	return $ //'█▒▓░▍▌'
}

TCopyProgress = function() {
	var $ = TDialog(55, 10)
	$.filename = TLabel('$file')
	$.totalname = TLabel('Общий ход:')
	$.file = TDoneBar()
	$.total = TDoneBar()
	$.add($.filename, 45, 1)
	$.addRow()
	$.add($.file, 45, 1)
	$.addRow()
	$.add($.totalname, 45, 1)
	$.addRow()
	$.add($.total, 45, 1)
	$.addRow()
	$.addRow()
	$.cancel = TButton(9, 'Отмена', function() {
		log('Вы изволили нажать "Отмена", но эта возможность пока ещё не разработана, простите.')
		//$.close()
		return true
	})
	$.add($.cancel, 10, 1)
	return $
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
		copylist($.selection, $.from, $.to.text.getText())
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
//	copier.sourcePanel = src
//	copier.destPanel = dest
//	copier.operation = operation
//	copier.do_after = do_after
	src.getDesktop().showModal(copyDialog)
}
