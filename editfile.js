
promptEditFile = function(panel) {
	var path = panel.list.path
	var win = TInputBox.create(55, 'Новая папка', 'Создать директорию', function() {
		glxwin.native_sh("mkdir '" + path + '/' + win.input.getText() + "'")
		panel.list.reload()
		var it = panel.list.items
		for (var i = 0; i < it.length; i++) {
			if (it[i].name == win.input.getText()) { panel.list.sid = i; panel.repaint(); break }
		}
	})
	panel.getDesktop().showModal(win)
}
