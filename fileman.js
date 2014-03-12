TInputAndPanels = kindof(TGroup)
TInputAndPanels.can.init = function(panelW, panelH) {
	panelW >>= 1
	panelH--
	dnaof(this)
	this.name = 'TInputAndPanels'
	this.left = TFilePanel.create(); this.left.name = 'Left'; this.left.list.name = 'LeftList'
	this.right = TFilePanel.create(); this.right.name = 'Right'
	this.input = TLabeledEdit.create()
	this.output = TConsole.create(panelW * 2, panelH)
	this.add(this.output)
	this.add(this.left)
	this.add(this.right)
	this.add(this.input)
	this.output.pos(0, 0)
	this.right.pos(panelW, 0)
	this.right.size(panelW, panelH);
	this.left.pos(0, 0); this.left.size(panelW, panelH);
	this.input.pal = getColor.console
//	this.input.pal[0] = 0xaaa; this.input.pal[1] = 0x000
	this.input.pos(0, panelH); this.input.size(panelW * 2, 1)
	this.input.text = ''
	this.actor = this.left
	var a = '~', b = '.'
	a = expandPath(a)
	b = expandPath(b)
	this.right.list.load(a)
	this.left.list.load(b)
	this.updateInputLabel()
	this.pos(0, 0)
	this.size(2 * panelW, panelH + 1)

	this.react(0, keycode.F1, showHelp, { arg:this, role:['panel'] })
	this.react(0, keycode.TAB, this.switchPanel, {role:['panel']})
	this.react(100, keycode['o'], this.outputFlip, {role:[]})
	this.react(10, keycode.F1, this.driveMenu, {arg: 'left', role:['panel']})
	this.react(10, keycode.F2, this.driveMenu, {arg: 'right', role:['panel']})
	this.react(0, keycode.BACK_SPACE, this.inputEdit, { arg: 'back' })
	this.react(100, keycode.BACK_SPACE, this.inputEdit, { arg: 'backword' })

	this.react(0, keycode.ENTER, this.pressEnter)
	this.react(100, keycode.ENTER, this.pressAppendFocusedName)
	this.react(100, keycode.UP, this.historyNavigate, { arg: 'up' })
	this.react(100, keycode['e'], this.historyNavigate, { arg: 'up' })
	this.react(100, keycode.DOWN, this.historyNavigate, { arg: 'down' })
	this.react(100, keycode['x'], this.historyNavigate, { arg: 'down' })
}

TInputAndPanels.can.test = function() {
	log('test')
}

TInputAndPanels.can.inputEdit = function(arg) {
	if (this.actor == this.left || this.actor == this.right) {
		if (arg == 'back') return this.input.editBack()
		if (arg == 'backword') return this.input.editBackWord()
	}
}

TInputAndPanels.can.pressAppendFocusedName = function() {
	var list = this.actor.list; if (this.actor != this.left) list = this.right.list
	//if (this.input.text.length > 0) this.input.text += ' '
	var s = list.items[list.sid].name
	if (s == '..') s = list.path
	this.input.text += s + ' '
	return true
}

fs.readFile(expandPath('~/.deodar/command_history.js'),
function(err, data) {
	if(err != undefined) commandHistory = []
	else commandHistory = eval(data.toString())
})

TInputAndPanels.can.pressEnter = function() {
	if (this.input.text.length > 0) {
		var s = this.input.text
		if (commandHistory.list == undefined) commandHistory.list = []
		var L = commandHistory.list
		var j = L.indexOf(s); if (j >= 0) L.splice(j, 1)
		L.push(s)
//		saveCommandHistory()
//		fs.writeFileSync(expandPath('~/.deodar/command_history.js'),  'commandHistory=' + JSON.stringify(commandHistory,0, ' '))
		this.input.text = ''
//		repaint()
		var me = this
		if (s.charAt(0) == ' ') {
			//this.log(s)
			return true
		} else setTimeout(function() { me.execute(s) }, 10)
		return true
	}
}

TInputAndPanels.can.historyNavigate = function(arg) {
	var L = commandHistory.list
	if (L == undefined) return
	if (arg == 'up') {
		var s = L.pop()
		if (s == this.input.text) L.unshift(s), s = L.pop()
		L.unshift(s)
	} else if (arg == 'down') {
		var s = L.shift()
		if (s == this.input.text) L.push(s), s = L.shift()
		L.push(s)
	}
	this.input.text = s
	return true
}

TInputAndPanels.can.checkFocus = function(view) {
	if  (view == this.input) {
		return ((this.actor == view || this.actor == this.left || this.actor == this.right) && this.getDesktop().modal == undefined)
	}
	return dnaof(this, view)
}
TInputAndPanels.can.switchPanel = function() {
	if (this.actor == this.left) this.actor = this.right; else this.actor = this.left
	this.updateInputLabel()
	return true
}
TInputAndPanels.can.updateInputLabel = function() {
	this.input.label = this.actor.list.path
}
TInputAndPanels.can.driveMenu = function(which) {
	if (which == 'left') panel = this.left
	if (which == 'right') panel = this.right
	this.actor = panel
	showDriveMenu(this.getDesktop(), panel)
	return true
}
TInputAndPanels.can.getOpposite = function(panel) {
	if (panel == this.right) return this.left
	if (panel == this.left) return this.right
}

TInputAndPanels.can.size = function(w, h) {
	dnaof(this, w, h)
	var W = w >> 1, H = h - 1
	this.left.pos(0, 0);
	this.left.size(W, H);
	this.right.pos(W, 0)
	this.right.size(w-W, H);
	this.input.pos(0, H)
	this.input.size(w, 1)
	this.output.pos(0, 0)
	this.output.size(w, h - 1)
}
TInputAndPanels.can.cwd = function() {
	if (this.actor == this.right) return this.right.list.path
	return this.left.list.path
}

function visibleChar(c) {
	c = c.charCodeAt(0)
	if (c < 32) return false
	return true
}

TInputAndPanels.can.onKey = function (K) {
	if (this.actor == this.right || this.actor == this.left) {
		if (K.char != undefined && K.plain && visibleChar(K.char)) {
			return this.input.onKey(K)
		}
	}
	return dnaof(this, K)
}
TInputAndPanels.can.onKey1 = function (char, key, down, physical) {

	if (down) {
		if(true) {

		} else if (key == 69 && key_modifiers[0] != true) { // F3 -- VIEW
			var dest = this.left
			if (this.actor == this.left) dest = this.right
			with (this.actor.list) {
				if (items[sid].dir == false && items[sid].hint != true) viewFile(path + '/' + items[sid].name); else log('not a file')
			}
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
		} else if (key == 71 && key_modifiers[0] != true) { // F5 -- COPY
			var dest = this.left
			if (this.actor == this.left) dest = this.right
			promptCopyFile('copy', this.actor, dest)
			repaint()
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
		} else if (key == 73 && key_modifiers[0] != true) { // F7 -- MAKE DIR
			if (this.actor.name == 'TFilePanel')
				promptMakeDir(this.actor)
			repaint()
		} else if (key == 74 && key_modifiers[0] != true) { // F8 -- DELETE
			if (this.actor.name == 'TFilePanel')
				promptDeleteFile(this.actor)
			repaint()
		} else if (key == 9 && key_modifiers[0] != true) { // Escape
			if (this.input.text.length > 0) this.input.text = ''; else this.outputFlip()
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
		} else if (key == 32 && key_modifiers[0] == true) { // Control-O
			this.outputFlip()
			return
		} else if (key == 33 && key_modifiers[0] == true) { // Control-P
			if (this.actor == this.left) { if (this.right.visible()) this.hide(this.right); else this.show(this.right) }
			if (this.actor == this.right) { if (this.left.visible()) this.hide(this.left); else this.show(this.left) }
			repaint()
		} else if (key == 54 && key_modifiers[0] == true) { // Control-C
//			native_sh_signal(this.w);
//			this.log('Control-C pressed')
		} else if (key == 45 && key_modifiers[0] == true) { // Control-K
			showKeyCode()
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
TInputAndPanels.can.onChar = function (char) {
	if (key_modifiers[3]) {
		var q = TWindow.create()
		q.text = '^' + char
		//q.bg = 0xabb, q.frame.fg_focus = 0, q.frame.fg = 0, q.frame.bg = q.frame.bg_focus = 0xabb
		q.pal = getColor.window
		q.size(20, 3)
		q.link = this.actor
		q.title = 'Поиск (RegEx)'
		q.bottom_title = 'Escape: отмена'
		q.onKey = function(key, down, physical) { with (this) {
			if (((key >= 110 && key <= 118) || (key >= 67 && key <= 76) || [9, 36].indexOf(key) >= 0) && down) {
				var Desktop = this.parent
				Desktop.hideModal(q)
				if (key == 36) this.link.list.onEnter()
				if ((key >= 110 && key <= 118) || (key >= 67 && key <= 76)) this.link.onKey(key, down)
				repaint()
			} else if (key == 22 && down) {
				if (key_modifiers[0] == true) text = ''; else text = text.substr(0, text.length - 1)
				onchange()
				repaint()
			}
		}}
		q.onChar = function(char) {
			this.text += char
			this.onchange()
			repaint()
		}
		q.onchange = function() {
			var it = this.link.list.items
			var R = new RegExp(this.text, "")
			for (var i = 0; i < it.length; i++) {
				if (R.test(it[i].name) || R.test(it[i].name.toLowerCase())) {
					this.link.list.sid = i
					this.link.list.onItem(i)
					this.link.list.scrollIntoView()
					break
				}
			}
		}
		q.inherit('draw', function(state) {
			dnaof(this, state)
			this.rect(1, 1, this.w-2, 1, ' ', undefined, 0x880)
			this.print(1, 1, this.text)
		})
		q.onchange()
		var Desktop = this.parent
		Desktop.showModal(q, this.actor.x + 10, this.h - 3)
		return
	}
	if (this.actor == this.left || this.actor == this.right || this.actor == this.input) this.input.onChar(char)
	if (this.actor == this.output) this.output.onChar(char)
}

function tabize(s, tabsize) {
	var R = '', t = 0
	for (var i = 0; i < s.length; i++) {
		if (s[i] == '\t') {
			while (t < tabsize) R += ' ', t++;
		} else R += s[i], t++
		if (t == tabsize) t = 0
	}
	return R
}

TInputAndPanels.can.execDone = function(command) {
	this.show(this.input)
	this.output.size(this.output.w, this.output.h - 1)
	this.left.size(this.left.w, this.left.h - 1)
	this.right.size(this.right.w, this.right.h - 1)
	if (this.flip) this.exitOutputMode()
	this.actor = this.preCommandFocus
	//if (this.right.list.items.length < smallDirectorySize) 
	this.right.list.reload()
	this.left.list.reload()
}

TInputAndPanels.can.execute = function(command) {
	if (this.output.working()) {
		this.enterOutputMode(true)
		return
	}
	this.output.log(this.cwd() + '> ' + command)
	var args = command.split(' ')
	command = args.shift()
//	this.output.view.scrollToBottom()
	var me = this
	this.preCommandFocus = this.actor
	this.flip = this.enterOutputMode(true)
	this.actor = this.output
	this.output.size(this.output.w, this.output.h + 1)
	this.left.size(this.left.w, this.left.h + 1)
	this.right.size(this.right.w, this.right.h + 1)
	this.hide(this.input)
	var f = this.execDone.bind(this)
	this.output.respawn(command, args, this.cwd(), f)
}

TInputAndPanels.can.outputFlip = function() {
	if (this.left.visible() || this.right.visible()) {
		this.enterOutputMode()
	} else {
		this.exitOutputMode()
	}
	return true
}

TInputAndPanels.can.enterOutputMode = function(focusConsole) {
	this.actor_before_output = this.actor
	if (!this.left.visible() && !this.right.visible()) {
		return false
	}
	this.left_was_visible = this.left.visible()
	this.right_was_visible = this.right.visible()
	if (this.left.visible() || this.right.visible())
		this.hide(this.right), this.hide(this.left);
	if (this.output.working() || focusConsole) {
		log('focusing console')
		this.shortcuts.enable('panel', false)
		this.actor = this.output
		//this.getDesktop().modal = this.output
	} else log('only show console, no focus')
	return true
}
TInputAndPanels.can.exitOutputMode = function() {
	this.shortcuts.enable('panel', true)
	this.actor = this.actor_before_output
	if(this.actor != this.left && this.actor != this.right) this.actor = this.left, log('restoring lost focus on panel')
	if (this.left_was_visible) this.show(this.left)
	if (this.right_was_visible) this.show(this.right)
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
