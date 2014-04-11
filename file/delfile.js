TDeleteDialog = kindof(TDialog)

TDeleteDialog.can.init = function(message, callback) {
	var $ = this
	dnaof($, 55, 1)
	$.title = 'Удаление'
	$.msg = TLabel.create(); $.msg.title = message
	$.add($.msg, 45, 1)
	$.addRow()
	$.ok = TButton.create(36, 'Удалить', function() {
		$.close()
		callback()
		return true
	})
	$.add($.ok, 10, 1)
	$.cancel = TButton.create(9, 'Отмена', function() {
		$.close()
		$.panel.showFocused = false
		return true
	})
	$.add($.cancel, 10, 1)
	$.size($.w, $.addY + 3)
}

promptDeleteFile = function(panel) {
	var
		list = [], sel = panel.list.selection, it = panel.list.items,
		sid = panel.list.sid, path = panel.list.path
	if (sel.length == 0) {
		if (it[sid].dir && it[sid].name == '..') return
		list.push(it[sid].name)
	} else {
		for (var i = 0; i < sel.length; i++) {
			if (it[sel[i]].dir && it[sel[i]].name == '..') continue
			list.push(it[sel[i]].name)
		}
	}
	var delDialog = TDeleteDialog.create('Удалить ' + list.length + ' штук?', function() {
		for (var i = 0; i < list.length; i++)
			glxwin.native_sh
			("rm -R '" + path + '/' + list[i] + "'")
		panel.list.reload()
		 // теперь переставить курсор
		if (sid > panel.list.items.length - 1) sid = panel.list.items.length - 1
		if (sid < 0) sid = 0
		panel.list.sid = sid
		panel.repaint()
	})
	delDialog.panel = panel
	panel.getDesktop().showModal(delDialog)
}
