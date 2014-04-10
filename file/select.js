TFileList.can.maskSelectionAdd = function() {
	var me = this
	var win = TInputBox.create(55, 'Выделить', 'Маска', function(txt) {
		var m = txt
		for (var i = 0; i < me.items.length; i++) {
			var s = me.items[i].name
			var b = maskMatch(s, m)
			if (b) me.selectItem(i, true)
		}
	})
	this.getDesktop().showModal(win)
}

TFileList.can.maskSelectionRemove = function() {
	var me = this
	var win = TInputBox.create(55, 'Снять выделение', 'Маска', function(txt) {
		var m = txt
		for (var i = 0; i < me.items.length; i++) {
			var s = me.items[i].name
			var b = maskMatch(s, m)
			if (b) me.selectItem(i, false)
		}
	})
	this.getDesktop().showModal(win)
}


