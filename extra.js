
TInputAndPanels.can.onKey1 = function (char, key, down, physical) {
	if (down) {
		if(true) {

		} else if (key == 70 && key_modifiers[0] != true) { // F4 -- EDIT
			var dest = this.left
			if (this.actor == this.left) dest = this.right
			with (this.actor.list) {
				if (items[sid].dir == false && items[sid].hint != true) {
					if (key_modifiers[3] != true)
							editFile(path + '/' + items[sid].name)
						else editFileAlt(path + '/' + items[sid].name)
				}
			}
		} else if (key == 72 && key_modifiers[0] != true) { // F6 -- MOVE
			var dest = this.left
			if (this.actor == this.left) dest = this.right
			var it = this.actor.list.items, sid = it.length - 1
			for (var i = 0; i < it.length; i++) {
				if (it[i].selected) { sid = i; break }
			}
			if (this.actor.list.sid < sid) sid = this.actor.list.sid
			var src = this.actor
			promptCopyFile('move', this.actor, dest, function() {
				var it = $.actor.list.items
				if (sid >= it.length) sid = it.length - 1
				$.actor.list.sid = sid
				$.actor.list.onItem(sid)
			})
			repaint()
		} else if (key == 34) { // [
			if (key_modifiers[0]) { // Control-[
				var s = this.left.list.path
				this.input.text += s + ' '
				repaint()
				return true
			}
		} else if (key == 35) { // [
			if (key_modifiers[0]) { // Control-]
				var s = this.right.list.path
				this.input.text += s + ' '
				repaint()
				return true
			}
		} else if (key == 30 && key_modifiers[0] == true) { // Control-U
			var swap = function(list, a, b) { for (i in list) { var n = list[i], tmp = a[n]; a[n] = b[n]; b[n] = tmp } }
			swap(['x', 'y', 'w', 'h'], this.right, this.left)
			repaint()
		} else if (key == 33 && key_modifiers[0] == true) { // Control-P
			if (this.actor == this.left) { if (this.right.visible()) this.hide(this.right); else this.show(this.right) }
			if (this.actor == this.right) { if (this.left.visible()) this.hide(this.left); else this.show(this.left) }
			repaint()
			
		} else if (key == 27 && key_modifiers[0] == true) { // Control-R
			if (this.actor.name == 'TFilePanel') {
				this.actor.list.reload()
				this.actor.list.onItem(this.actor.list.sid)
				repaint()
			}
		}
	}
	this.actor.onKey(key, down, physical)
}
TInputAndPanels.can.onPipe = function(str) {
	if (str == undefined) {
		if (this.flip) this.exitOutputMode()
		if (TODO) glxwin.native_force_repaint(display.handle); else repaint()
		//todo: set output frame title (make it windowed first)
		return
	}
	this.print(str)
	if (time1000() > this.pipe_redraw_time + 30) {
		if (TODO) glxwin.native_force_repaint(display.handle); else repaint()
		this.pipe_redraw_time = time1000()
		// todo: move all pipe login into a separate class
	}
	//native_repaint(display.handle)
	return true
}

TInputAndPanels.can.print = function(str) {
	str = str.split('\n')
	this.output.view.lines = this.output.view.lines.concat(str)
	this.output.view.lines = this.output.view.lines.splice(-this.h * 2)
	this.output.view.scrollToBottom()
	repaint()
}

TInputAndPanels.can.log = function(anything) {
	var T0 = new Date().getTime()
	var T = T0 - logT
	var s = '> ';
	if (T > 1) s = '' + T + '> ';
	s = '~ ' // comment to enable timing
	this.print(s + Array.prototype.slice.call(arguments).join(' '))
	logT = T0
}
