TNorton = kindof(TGroup)
TNorton.can.init = function(panelW, panelH) {
	panelW >>= 1
	panelH--
	dnaof(this)
	this.name = 'TNorton'
	this.output = TConsole.create(1,1)//panelW * 2, panelH-1)
	this.left = TFilePanel.create(); this.left.name = 'Left'; this.left.list.name = 'LeftList'
	this.right = TFilePanel.create(); this.right.name = 'Right'
	this.label = TLabel.create('c:\\')
	this.input = TEdit.create()
	this.output.fileman = this
	this.input.multiLine = false

	this.add(this.label)
	this.add(this.output)
	this.add(this.left)
	this.add(this.right)
	this.add(this.input)
	this.output.pos(0, 0)
	this.right.pos(panelW, 0)
	this.right.size(panelW, panelH);
	this.left.pos(0, 0); this.left.size(panelW, panelH);
	this.input.pal = getColor.syntaxBlack
	this.label.pal = getColor.syntaxBlack
//	this.input.pal[1] = 0
//	this.input.pal[0] = 0xaaa; this.input.pal[1] = 0x000
	this.input.pos(0, panelH); this.input.size(panelW * 2, 1)
	this.input.setText('')
	this.actor = this.left
	var a = '~', b = '.'
	a = expandPath(a)
	b = expandPath(b)
	this.panelReduce = 0
	this.left.list.load(a)
	this.right.list.load(b)
	this.updateInputLabel()
	this.pos(0, 0)
	this.size(2 * panelW, panelH + 1)

	this.react(0, keycode.F1, showHelp, { arg:this, role:['panel', 'input'] })
	this.react(0, keycode.TAB, this.switchPanel, {role:['panel']})
	this.react(100, keycode['o'], this.outputFlip, {role:['panel', 'input', 'output']})
	this.react(10, keycode.F1, this.driveMenu, {arg: 'left', role:['panel', 'input']})
	this.react(10, keycode.F2, this.driveMenu, {arg: 'right', role:['panel']})
	this.react(0, keycode.BACK_SPACE, this.input.commandDeleteBack.bind(this.input), {role:['panel', 'input']})
	this.react(100, keycode.BACK_SPACE, this.input.commandDeleteWordBack.bind(this.input), {role:['panel', 'input']})

	this.react(0, keycode.ENTER, this.pressEnter, {role:['panel','input']})
	this.react(100, keycode.ENTER, this.pressAppendFocusedName, {role:['panel']})
	this.react(100, keycode.UP, this.panelsResize, { arg: 'up', role:['panel'] })
	this.react(100, keycode.DOWN, this.panelsResize, { arg: 'down', role:['panel'] })
	this.react(100, keycode['e'], this.historyNavigate, { arg: 'up', role:['panel','input'] })
	this.react(100, keycode['x'], this.historyNavigate, { arg: 'down', role:['panel','input'] })
	this.react(0, keycode.F3, this.viewFile, { arg: TTextView, role:['panel'] })
	this.react(0, keycode.F4, this.viewFile, { arg: TFileEdit, role:['panel'] })
	this.react(1, keycode.F4, this.editFileInput, { arg: TFileEdit, role:['panel'] })
	this.react(0, keycode.F5, this.commandCopy, {  role:['panel'] })
	this.react(0, keycode.F6, this.commandMove, {  role:['panel'] })
	this.react(0, keycode.F7, this.commandMakeDir, { role:['panel'] })
	this.react(0, keycode.F8, this.commandDelete, { role:['panel'] })

	this.react(100, keycode['k'], this.showKeyCode, {role:['panel','input']})
	this.react(0, keycode.ESCAPE, this.escape, {role:['panel', 'input']})
	this.react(0, keycode.LEFT, this.input.handleCursorKey.bind(this.input), {arg:'left', role:['input']})
	this.react(0, keycode.RIGHT, this.input.handleCursorKey.bind(this.input), {arg:'right', role:['input']})
	this.react(100, keycode.LEFT, this.input.handleCursorKey.bind(this.input), {arg:'wordleft', role:['input', 'panel']})
	this.react(100, keycode.RIGHT, this.input.handleCursorKey.bind(this.input), {arg:'wordright', role:['input', 'panel']})
	this.react(0, keycode.HOME, this.input.handleCursorKey.bind(this.input), {arg:'home', role:['input']})
	this.react(0, keycode.END, this.input.handleCursorKey.bind(this.input), {arg:'end', role:['input']})

	this.react(1, keycode.HOME, this.input.shiftSel.bind(this.input), {arg:'home', role:['input']})
	this.react(1, keycode.END, this.input.shiftSel.bind(this.input), {arg:'end', role:['input']})
	this.react(1, keycode.LEFT, this.input.shiftSel.bind(this.input), {arg:'left', role:['input']})
	this.react(1, keycode.RIGHT, this.input.shiftSel.bind(this.input), {arg:'right', role:['input']})
	this.react(101, keycode.LEFT, this.input.shiftSel.bind(this.input), {arg:'wordleft', role:['input']})
	this.react(101, keycode.RIGHT, this.input.shiftSel.bind(this.input), {arg:'wordright', role:['input']})


	this.shortcuts.enable('all', false)
	this.shortcuts.enable('panel', true)
}

TNorton.can.panelsResize = function(arg) {
	if (arg == 'up') this.panelReduce++
	if (arg == 'down') this.panelReduce--
	if (this.panelReduce < 0) this.panelReduce = 0
	if (this.panelReduce > this.h >> 1) this.panelReduce = this.h >> 1
	var W = this.w >> 1, H = this.h - 1
	if (this.input.visible() != true) H++
	this.left.size(W, H - this.panelReduce);
	this.right.size(this.w-W, H - this.panelReduce);
	return true
}

TNorton.can.showKeyCode = function() {
	var keyCode = TKeyCode.create()
	this.getDesktop().showModal(keyCode)
}

TNorton.can.test = function() {
}

TNorton.can.escape =  function() {
	if (this.input.getText().length > 0) this.input.setText(''); else this.outputFlip()
	return true
}


TNorton.can.inputEdit = function(arg) {
	if (this.actor == this.left || this.actor == this.right) {
		if (arg == 'back') return this.input.commandBack()
		if (arg == 'backword') return this.input.commandBackWord()
	}
}

TNorton.can.pressAppendFocusedName = function() {
	var list = this.left.list
	if (this.actor == this.right) list = this.right.list
	var s = list.items[list.sid].name
	if (s == '..') s = list.path
	this.input.setText(this.input.getText() + s + ' ')
	this.input.sel.clear()
	return true
}

fs.readFile(expandPath('~/.deodar/command_history.js'),
function(err, data) {
	if(err != undefined) commandHistory = []
	else commandHistory = eval(data.toString())
})
TNorton.can.historyNavigate = function(arg) {
	var L = commandHistory.list
	if (L == undefined) return
	if (arg == 'up') {
		var s = L.pop()
		if (s == this.input.getText()) L.unshift(s), s = L.pop()
		L.unshift(s)
	} else if (arg == 'down') {
		var s = L.shift()
		if (s == this.input.getText()) L.push(s), s = L.shift()
		L.push(s)
	}
	this.input.setText(s)
	this.input.sel.clear()
	return true
}

TNorton.can.checkFocus = function(view) {
	if  (view == this.input) {
		return ((this.actor == view || this.actor == this.left || this.actor == this.right) && this.getDesktop().modal == undefined)
	}
	return dnaof(this, view)
}
TNorton.can.switchPanel = function() {
	this.left.list.showFocused = false // TODO: move to onFocus
	this.right.list.showFocused = false // это чтобы видеть что удаляешь
	if (this.actor == this.left) this.actor = this.right; else this.actor = this.left
	this.updateInputLabel()
	return true
}
TNorton.can.updateInputLabel = function() {
	this.setLabel(this.actor.list.path)
}
TNorton.can.driveMenu = function(which) {
	if (which == 'left') panel = this.left
	if (which == 'right') panel = this.right
	this.actor = panel
	showDriveMenu(this.getDesktop(), panel)
	return true
}
TNorton.can.getOpposite = function(panel) {
	if (panel == this.right) return this.left
	if (panel == this.left) return this.right
}

TNorton.can.setLabel = function(s) {
	this.label.title = s + '>'
	this.label.size(this.label.title.length, 1)
	this.input.pos(this.label.w, this.input.y)
	this.input.size(this.w - this.label.w, 1)
}

TNorton.can.size = function(w, h) {
	dnaof(this, w, h)
	var W = w >> 1, H = h - 1
	this.output.pos(0, 0)
	this.output.size(w, h-1)
	this.left.pos(0, 0);
	if (this.input.visible() != true) H++
	this.left.size(W, H - this.panelReduce);
	this.right.pos(W, 0)
	this.right.size(w-W, H - this.panelReduce);
	this.label.pos(0, H)
	this.label.size(this.label.title.length, 1)
	this.input.pos(this.label.w, H)
	this.input.size(w - this.label.w, 1)
	if (this.viewer != undefined) this.viewer.size(w, h)
}
TNorton.can.cwd = function() {
	if (this.actor == this.right) return this.right.list.path
	return this.left.list.path
}

function visibleChar(c) {
	c = c.charCodeAt(0)
	if (c < 32) return false
	return true
}

TNorton.can.onKey = function (K) {
	if (this.actor == this.right || this.actor == this.left) {
		if (K.char != undefined && K.mod.control == false && K.mod.alt == false && visibleChar(K.char) && this.input.visible()) {
			return this.input.onKey(K)
		}
	}
	return dnaof(this, K)
}

TNorton.can.pressEnter = function() {
	var s = this.input.getText()
	if (s.length > 0) {
		if (commandHistory.list == undefined) commandHistory.list = []
		var L = commandHistory.list
		var j = L.indexOf(s); if (j >= 0) L.splice(j, 1)
		L.push(s)
//		saveCommandHistory()
//		fs.writeFileSync(expandPath('~/.deodar/command_history.js'),  'commandHistory=' + JSON.stringify(commandHistory,0, ' '))
		this.input.setText('')
//		repaint()
		var me = this
		if (s.charAt(0) == ' ') {
			//this.log(s)
			return true
		} else setTimeout(function() { 
			me.execute(s) 
		}, 10)
		return true
	}
}

TNorton.can.onItemEnter = function(list, item) {
	if (applyEnterRules) {
		var X = applyEnterRules(item.name)
		if (X.spawn) {
			spawn(X.spawn, [list.path + '/' + X.name])
			return
		}
		if (X.tty) {
			this.execute(X.tty + ' ' + X.name)
			return
		}
	}
	if (item.flags.indexOf('x') >= 0) {
		if (this.input.getText() == '') this.input.setText(item.name);
		this.pressEnter()
	}
}

TNorton.can.execDone = function(command) {
	this.shortcuts.enable('all', false)
	this.shortcuts.enable('input', true)
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

TNorton.can.execute = function(command) {
	if (this.output.working()) {
		this.enterOutputMode(true)
		return
	}
	//TODO: check if pipes "cat | grep" in command work
	var cwd = this.cwd()
//	var args = command.split(' ')
//	command = args.shift()
//	if (args[args.length - 1] == '') args.pop()
	var me = this
	this.preCommandFocus = this.actor
	this.flip = this.enterOutputMode(true)
	this.repaint()
	this.actor = this.output
	this.output.size(this.output.w, this.output.h + 1)
	this.left.size(this.left.w, this.left.h + 1)
	this.right.size(this.right.w, this.right.h + 1)
	this.hide(this.input)
	var f = this.execDone.bind(this)
	this.shortcuts.enable('all', false)
	this.shortcuts.enable('output', true)
	this.output.respawn(command, '', cwd, f)
}

TNorton.can.outputFlip = function() {
	if (this.left.visible() || this.right.visible()) {
		this.enterOutputMode()
	} else {
		this.exitOutputMode()
	}
	return true
}

TNorton.can.enterOutputMode = function(focusConsole) {
	this.actor_before_output = this.actor
	if (!this.left.visible() && !this.right.visible()) {
		return false
	}
	this.left_was_visible = this.left.visible()
	this.right_was_visible = this.right.visible()
	if (this.left.visible() || this.right.visible())
		this.hide(this.right), this.hide(this.left);
	this.shortcuts.enable('all', false)
	if (this.output.working() || focusConsole) {
		this.shortcuts.enable('output', true)
		this.actor = this.output
	} else {
		this.shortcuts.enable('input', true)
	}
	return true
}
TNorton.can.exitOutputMode = function() {
	this.shortcuts.enable('all', false)
	this.shortcuts.enable('panel', true)
//	this.shortcuts.enable('input', true)
	this.actor = this.actor_before_output
	if(this.actor != this.left && this.actor != this.right) this.actor = this.left
	if (this.left_was_visible) this.show(this.left)
	if (this.right_was_visible) this.show(this.right)
	this.getDesktop().display.caretReset()
}

TNorton.can.viewFile = function(viewClass) {
	if (this.actor == this.left || this.actor == this.right) {
		with (this.actor.list) {
			var panel = this.actor
			if (items[sid].dir == false && items[sid].hint != true) {
				var colors
				if (viewClass === TFileEdit) colors = getColor.syntaxCyan
				if (viewClass === TTextView) colors = getColor.syntaxCyan
				this.viewer = viewFile(this.getDesktop(), path + '/' 
					+ items[sid].name, viewClass, colors)
				this.viewer.onHide = function() {
					panel.list.reload()
				}
			} else log('not a file')
		}
	}
}

TNorton.can.editNew = function() {
	this.viewFile(TFileEdit)
}

TNorton.can.editFileInput = function() {
	if (this.actor == this.left || this.actor == this.right)
		promptEditFile(this.actor, this.editNew.bind(this))
	return true
}

TNorton.can.commandMakeDir = function() {
	if (this.actor == this.left || this.actor == this.right)
		promptMakeDir(this.actor)
	return true
}

TNorton.can.commandDelete = function() {
	if (this.actor == this.left || this.actor == this.right) {
		this.actor.list.showFocused = true
		promptDeleteFile(this.actor)
	}
	return true
}

TNorton.can.commandCopy = function() {
	if (this.actor == this.left || this.actor == this.right) {
		var dest = this.left
		if (this.actor == this.left) dest = this.right
		promptCopyFile('copy', this.actor, dest)
	}
	return true
}

editFileAlt = function(s) {
	glxwin.sh_async('pluma '+ s)
}

