promptMakeDir = function(panel) {
	var path = panel.list.path
	var mkdirDialog = TInputBox.create(55, 'Новая папка', 'Создать каталог', function() {
		fs.mkdir(path + '/' + mkdirDialog.input.getText(), 
		function (e) {
			if (e) {
				console.log('Error:', e)
				return
			}
			panel.list.reload()
			var it = panel.list.items
			for (var i = 0; i < it.length; i++) {
				if (it[i].name == mkdirDialog.input.getText()) {
					panel.list.sid = i; 
					panel.repaint();
					break
				}
			}
		})
	})
	panel.getDesktop().showModal(mkdirDialog)
}
