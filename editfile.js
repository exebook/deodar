promptEditFile = function(panel, callback) {
	var path = panel.list.path
	var win = TInputBox.create(55, 'Правка', 'Имя файла для правки', function() {
		var file = path + '/' + win.input.getText()
		if (fs.existsSync(file)) {
			if (!fs.statSync(file).isFile()) { 
				messageBox(panel.getDesktop(), '"' + win.input.getText() + '" существует, и это не файл', 'Обстоятельтво')
				return
			}
		} else {
			fs.writeFileSync(file, '')
			panel.list.reload()
		}
		var it = panel.list.items
		for (var i = 0; i < it.length; i++) {
			if (it[i].name == win.input.getText()) { panel.list.sid = i; panel.repaint(); break }
		}
		callback()
	})
	panel.getDesktop().showModal(win)
}
