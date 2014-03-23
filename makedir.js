TMakeDirDialog = kindof(TDialog)
TMakeDirDialog.can.init = function(message, callback) {
	dnaof(this, 55, 1)
	this.title = 'Новая папка'
	this.msg = TLabel.create(); this.msg.title = message
	this.add(this.msg, 45, 1); this.addRow()
	this.dir = TInput.create(''); this.add(this.dir, 45, 1); this.addRow(); this.addRow()
	this.ok = TButton.create(keycode.ENTER, 'Создать', function() { this.close(); callback(); return true })
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(keycode.ESCAPE, 'Отмена', function() { this.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
	this.actor = this.dir
}

promptMakeDir = function(panel) {
	var path = panel.list.path
	var mkdirDialog = TMakeDirDialog.create('Создать директорию:', function() {
		glxwin.native_sh("mkdir '" + path + '/' + mkdirDialog.dir.getText() + "'")
		panel.list.reload()
		var it = panel.list.items
		for (var i = 0; i < it.length; i++) {
			if (it[i].name == mkdirDialog.dir.getText()) { panel.list.sid = i; repaint(); break }
		}
	})
	panel.getDesktop().showModal(mkdirDialog)
}
