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

TBeginCopyDialog = kindof(TDialog)
TBeginCopyDialog.can.init = function(W, H, title, message) {
	dnaof(this, W, H)
	this.title = title
	this.msg = TLabel.create()
	this.msg.title = message
	this.add(this.msg, 45, 1)
	this.addRow()

	this.to = TInput.create()
	this.add(this.to, 45, 1)
	this.addRow()
	this.addRow()
	
	this.ok = TButton.create(36, 'Давай', function() {
		this.close()
		copylist(this.selection, this.from, this.to.text)
		return true
	})
	
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(9, 'Отмена', function() { this.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
}

startCopyFile = function(Desktop) {
	var Operation = 'Копировать'
//	if (operation == 'move') Operation = 'Перенести'
	var sel = { length: 555 }
	var dialog = TBeginCopyDialog.create(55, 1, Operation, Operation + ' ' + sel.length + ' штук в:')
	Desktop.showModal(dialog)

}
