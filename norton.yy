
TNorton = kindof(TGroup)
TNorton.can.init = ➮(panelW, panelH) {
	panelW >>= 1
	panelH--
	dnaof(⚪)
	⚫pos(0, 0)
	⚫name = 'TNorton'
	⚫output = TConsole.create()
	⚫left = TFilePanel.create() ⦙ ⚫left.name = 'Left' ⦙ ⚫left.list.name = 'LeftList'
	⚫right = TFilePanel.create() ⦙ ⚫right.name = 'Right'
	⚫label = TLabel.create('c:\\')
	⚫input = TInput.create()
	⚫output.norton = ⚪

	⚫add(⚫label)
	⚫add(⚫output)
	⚫add(⚫left)
	⚫add(⚫right)
	⚫add(⚫input)
	⚫output.pos(0, 0)
	⚫right.pos(panelW, 0)
	⚫right.size(panelW, panelH) ⦙
	⚫left.pos(0, 0) ⦙ ⚫left.size(panelW, panelH) ⦙
	⚫input.pal = getColor.syntaxBlack
	⚫label.pal = getColor.syntaxBlack
//	this.input.pal[1] = 0
//	this.input.pal[0] = 0xaaa; this.input.pal[1] = 0x000
	⚫input.pos(0, panelH) ⦙ ⚫input.size(panelW * 2, 1)
	⚫input.setText('')
	⚫actor = ⚫left
	∇ a = '.', b = '~'
//	a = '/v/deodar/find'
	a = expandPath(a)
	b = expandPath(b)
	⚫panelReduce ⊜
	⚫left.list.load(a)
	⚫right.list.load(b)
	⚫updateInputLabel()
	⚫size(2 * panelW, panelH + 1)

	⚫react(10, keycode.F7, ⚫userFindModal, { arg:⚪, role:['panel', 'input'] })
	⚫react(100, keycode['f'], ⚫userFindModal, { arg:⚪, role:['panel', 'input'] })
	⚫react(10, keycode.F1, showHelp, { arg:⚪, role:['panel', 'input'] })
	⚫react(0, keycode.TAB, ⚫switchPanel, {role:['panel']})
	⚫react(100, keycode['o'], ⚫outputFlip, {role:['panel', 'input', 'output']})
	⚫react(0, keycode.F1, ⚫driveMenu, {arg: 'left', role:['panel', 'input']})
	⚫react(0, keycode.F2, ⚫driveMenu, {arg: 'right', role:['panel']})
	⚫react(0, keycode.BACK_SPACE, ⚫smartBackSpace, {role:['panel', 'input']})
	⚫react(100, keycode.BACK_SPACE, ⚫input.commandDeleteWordBack.bind(⚫input), {role:['panel', 'input']})

	⚫react(0, keycode.ENTER, ⚫pressEnter, {role:['panel','input']})
	⚫react(1, keycode.ENTER, ⚫runInBackground, {role:['panel','input']})
	⚫react(100, keycode.ENTER, ⚫pressAppendFocusedName, {role:['panel']})
	⚫react(100, keycode.UP, ⚫panelsResize, { arg: 'up', role:['panel'] })
	⚫react(100, keycode.DOWN, ⚫panelsResize, { arg: 'down', role:['panel'] })
	⚫react(100, keycode['e'], ⚫historyNavigate, { arg: 'up', role:['panel','input'] })
	⚫react(100, keycode['x'], ⚫historyNavigate, { arg: 'down', role:['panel','input'] })
	⚫react(0, keycode.UP, ⚫historyNavigate, { arg: 'up', role:['input'] })
	⚫react(0, keycode.DOWN, ⚫historyNavigate, { arg: 'down', role:['input'] })
	⚫react(0, keycode.F3, ⚫viewFile, { arg: TTextView, role:['panel'] })
	⚫react(10, keycode.F3, ⚫viewFile, { arg: THexView, role:['panel'] })
	⚫react(0, keycode.F4, ⚫viewFile, { arg: TFileEdit, role:['panel'] })
	⚫react(1, keycode.F4, ⚫editFileInput, { arg: TFileEdit, role:['panel'] })
	⚫react(0, keycode.F5, ⚫commandCopy, { arg: 'copy', role:['panel'] })
	⚫react(0, keycode.F6, ⚫commandCopy, { arg: 'move', role:['panel'] })
	⚫react(0, keycode.F7, ⚫commandMakeDir, { role:['panel'] })
	⚫react(0, keycode.F8, ⚫commandDelete, { role:['panel'] })

	⚫react(100, keycode['k'], ⚫showKeyCode, {role:['panel','input']})
	⚫react(0, keycode.ESCAPE, ⚫escape, {role:['panel', 'input']})
	⚫react(100, keycode.INSERT, ⚫input.userCopy.bind(⚫input), {role:['panel', 'input']})
	⚫react(1, keycode.INSERT, ⚫input.userPaste.bind(⚫input), {role:['panel', 'input']})
	⚫react(0, keycode.LEFT, ⚫input.handleCursorKey.bind(⚫input), {arg:'left', role:['input']})
	⚫react(0, keycode.RIGHT, ⚫input.handleCursorKey.bind(⚫input), {arg:'right', role:['input']})
	⚫react(100, keycode.LEFT, ⚫input.handleCursorKey.bind(⚫input),
		{arg:'wordleft', role:['input', 'panel']})
	⚫react(100, keycode.RIGHT, ⚫input.handleCursorKey.bind(⚫input),
		{arg:'wordright', role:['input', 'panel']})
	⚫react(0, keycode.HOME, ⚫keyChooser, {arg:'home', role:['input','panel']})
	⚫react(0, keycode.END, ⚫keyChooser, {arg:'end', role:['input','panel']})

	⚫react(1, keycode.HOME, ⚫input.shiftSel.bind(⚫input), {arg:'home', role:['input']})
	⚫react(1, keycode.END, ⚫input.shiftSel.bind(⚫input), {arg:'end', role:['input']})
	⚫react(1, keycode.LEFT, ⚫input.shiftSel.bind(⚫input), {arg:'left', role:['input']})
	⚫react(1, keycode.RIGHT, ⚫input.shiftSel.bind(⚫input), {arg:'right', role:['input']})
	⚫react(101, keycode.LEFT, ⚫input.shiftSel.bind(⚫input), 
		{arg:'wordleft', role:['panel','input']})
	⚫react(101, keycode.RIGHT, ⚫input.shiftSel.bind(⚫input), 
		{arg:'wordright', role:['panel', 'input']})
	⚫react(100, keycode['c'], ⚫output.kill.bind(⚫output), { role:['panel','input'] })

	⚫react(1, keycode.PAGE_UP, 
		⚫output.scrollHistory.bind(⚫output), { arg: 'up', role: ['input', 'output'] })
	⚫react(1, keycode.PAGE_DOWN, 
		⚫output.scrollHistory.bind(⚫output), { arg: 'down', role:['input','output'] })
	⚫react(100, keycode.END, 
		⚫output.scrollHistory.bind(⚫output), { arg: 'home', role:['input','output'] })
	⚫react(101, keycode['o'], 
		⚫output.fitSize.bind(⚫output), { arg: 'home', role:['panel', 'input','output'] })
	⚫react(100, keycode['r'], ⚫reloadPanel, { role: ['panel'] })
	⚫react(100, keycode['p'], ⚫hidePanel, { role: ['panel'] })
	⚫react(100, keycode['u'], ⚫swapPanels, { role: ['panel', 'input'] })
	⚫react(100, keycode['['], ⚫dropPath, {arg:'left',role:['panel','input']})
	⚫react(100, keycode[']'], ⚫dropPath, {arg:'right',role:['panel','input']})
	⚫react(101, keycode.INSERT, ⚫copyFullPath, { role:['panel','input'] })
//	⚫react(1, keycode['`'], ⚫guideOpen, {role:['panel','input']})//why not work?
	⚫react(10, keycode.UP, ⚫guideOpen, { role:['panel','input'] })
	⚫react(10, keycode.DOWN, ⚫guideOpen, { role:['panel','input'] })
	⚫react(100, keycode.ESCAPE, ⚫quitProgram, { role:['panel', 'input'] })
	⚫shortcuts.enable('all', ⦾)
	⚫shortcuts.enable('panel', ⦿)
}

TNorton.can.quitProgram = ➮ {
	w ∆ TOkCancel.create('Выйти совсем?', ➮ {
		process.exit()
	})
	w.title = 'Прощание'
	⚫getDesktop().showModal(w)
}

TNorton.can.guideOpen = ➮ {
	showGuide(⚪)
	me ∆ ⚪
	signal('guide', 'clean')
	wait('guide', 'select', ➮ {
		me.viewFileName(TFileEdit, a)
	})
	$⦿
}

TNorton.can.keyChooser = ➮(arg) {
	⌥ (⚫input.getText() ↥ > 0)
		⚫input.handleCursorKey(arg)
	⥹ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right)
		⚫actor.list.moveCursor(arg)

	$ ⦿
}

TNorton.can.copyFullPath = ➮{
	∇ s, list
	⌥ (⚫actor ≟ ⚫left) list = ⚫left.list
	⎇ list = ⚫right.list
	s = list.items[list.sid].name
	⌥ (s) s = list.path + '/' + s ⦙ ⎇ s = list.path
	clipboardSet(s)
}

TNorton.can.dropPath = ➮(arg) {
	∇ s
	⌥ (arg ≟ 'left') s = ⚫left.list.path
	⎇ s = ⚫right.list.path
	⚫input.setText(⚫input.getText() + s + ' ')
	⚫input.sel.clear()
	⚫repaint()
	$ ⦿
}

TNorton.can.swapPanels = ➮ {
	∇ swap = ➮(list, a, b) {
		⧗ (i in list) { ∇ n = listⁱ, tmp = aⁿ ⦙ aⁿ = bⁿ ⦙ bⁿ = tmp }
	}
	swap(['x', 'y', 'w', 'h'], ⚫right, ⚫left)
	// помни: они могут быть разного размера
	⚫repaint()
}

TNorton.can.hidePanel = ➮ {
	⌥ (⚫actor ≟ ⚫left) { 
		⌥ (⚫right.visible()) ⚫hide(⚫right) ⦙ 
		⎇ ⚫show(⚫right)
	}
	⌥ (⚫actor ≟ ⚫right) {
		⌥ (⚫left.visible()) ⚫hide(⚫left) ⦙ 
		⎇ ⚫show(⚫left)
	}
	⚫repaint()
}

TNorton.can.reloadPanel = ➮{
log('ctrl r')
	⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right) {
		log('reloadin')
		⚫actor.list.reload()
		⚫actor.list.onItem(⚫actor.list.sid)
		⚫repaint()
	}
	$ ⦿
}

TNorton.can.smartBackSpace = ➮{
	⌥ (⚫input.getText() ≠ '') {
		⚫input.commandDeleteBack()
		⏀ ⚫blockBackspaceUpLevel
		⚫blockBackspaceUpLevel = ⌛(➮{
			⏀ ⚫blockBackspaceUpLevel
		}.bind(⚪), 2000)
	}
	⎇ {
		⌥ (⚫blockBackspaceUpLevel) $ ⦿
		⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right)
			⚫actor.list.goUpLevel()
	}
	$ ⦿
}

TNorton.can.panelsResize = ➮(arg) {
	⌥ (arg ≟ 'up') ⚫panelReduce++
	⌥ (arg ≟ 'down') ⚫panelReduce--
	⌥ (⚫panelReduce < 0) ⚫panelReduce ⊜
	⌥ (⚫panelReduce > ⚫h >> 1) ⚫panelReduce = ⚫h >> 1
	∇ W = ⚫w >> 1, H = ⚫h - 1
	⌥ (⚫input.visible() ≠ ⦿) H++
	⚫left.size(W, H - ⚫panelReduce) ⦙
	⚫right.size(⚫w-W, H - ⚫panelReduce) ⦙
	$ ⦿
}

TNorton.can.showKeyCode = ➮{
	∇ keyCode = TKeyCode.create()
	⚫getDesktop().showModal(keyCode)
}

TNorton.can.test = ➮{
}

TNorton.can.inputEdit = ➮(arg) {
	⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right) {
		⌥ (arg ≟ 'back') $ ⚫input.commandBack()
		⌥ (arg ≟ 'backword') $ ⚫input.commandBackWord()
	}
}

TNorton.can.pressAppendFocusedName = ➮{
	∇ list = ⚫left.list
	⌥ (⚫actor ≟ ⚫right) list = ⚫right.list
	∇ s = list.items[list.sid].name
	⌥ (s ≟ '..') s = list.path
	⌥ (s≀(' ') >=0) s = '"' + s + '"'
	⚫input.setText(⚫input.getText() + s + ' ')
	⚫input.sel.clear()
	$ ⦿
}

fs.readFile(expandPath('~/.deodar/command_history.js'),
➮(err, data) {
	⌥(err ≠ ∅) commandHistory = []
	⎇ commandHistory = eval(data≂)
})
TNorton.can.historyNavigate = ➮(arg) {
	∇ L = commandHistory.list
	⌥ (L ≟ ∅) $
	⌥ (arg ≟ 'up') {
		∇ s = L.pop()
		⌥ (s ≟ ⚫input.getText()) L ⬋(s), s = L.pop()
		L ⬋(s)
	} ⥹ (arg ≟ 'down') {
		∇ s = L.shift()
		⌥ (s ≟ ⚫input.getText()) L ⬊(s), s = L.shift()
		L ⬊(s)
	}
	⚫input.setText(s)
	⚫input.sel.clear()
	$ ⦿
}

TNorton.can.checkFocus = ➮(view) {
	⌥  (view ≟ ⚫input) {
		$ ((⚫actor ≟ view || ⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right) && ⚫getDesktop().modal ≟ ∅)
	}
	$ dnaof(⚪, view)
}
TNorton.can.switchPanel = ➮{
	⚫left.list.showFocused = ⦾ // TODO: move to onFocus
	⚫right.list.showFocused = ⦾ // это чтобы видеть что удаляешь
	⌥ (⚫actor ≟ ⚫left) ⚫actor = ⚫right ⦙ ⎇ ⚫actor = ⚫left
	⚫updateInputLabel()
	$ ⦿
}

TNorton.can.updateInputLabel = ➮{
	∇ w = 20
	⌥ (⚫w) w = ⚫w / 3
	∇ s = pathCompress(⚫actor.list.path, w)
	⚫setLabel(s)
}
TNorton.can.driveMenu = ➮(which) {
	⌥ (which ≟ 'left') panel = ⚫left
	⌥ (which ≟ 'right') panel = ⚫right
	⚫actor = panel
	showDriveMenu(⚫getDesktop(), panel)
	$ ⦿
}
TNorton.can.getOpposite = ➮(panel) {
	⌥ (panel ≟ ⚫right) $ ⚫left
	⌥ (panel ≟ ⚫left) $ ⚫right
}

TNorton.can.setLabel = ➮(s) {
	⚫label.title = s + '>'
	⚫label.size(⚫label.title ↥, 1)
	⚫input.pos(⚫label.w, ⚫input.y)
	⚫input.size(⚫w - ⚫label.w, 1)
}

TNorton.can.size = ➮(w, h) {
	dnaof(⚪, w, h)
	∇ W = w >> 1, H = h - 1, outmode = ⦾
	⌥ (⚫output.working()) outmode = ⦿
	⚫output.pos(0, 0)
	⚫output.size(w, outmode ? h : h-1)
	⚫left.pos(0, 0) ⦙
	⌥ (outmode) H++
	⚫left.size(W, H - ⚫panelReduce) ⦙
	⚫right.pos(W, 0)
	⚫right.size(w-W, H - ⚫panelReduce) ⦙
	⚫label.pos(0, H)
	⚫label.size(⚫label.title ↥, 1)
	⚫input.pos(⚫label.w, H)
	⚫input.size(w - ⚫label.w, 1)
	⌥ (⚫viewer ≠ ∅) ⚫viewer.size(w, h)
}

TNorton.can.cwd = ➮{
	⌥ (⚫actor ≟ ⚫right) $ ⚫right.list.path
	$ ⚫left.list.path
}

➮ visibleChar c {
	c = c◬(0)
	⌥ (c < 32) $ ⦾
	$ ⦿
}

TNorton.can.onKey = ➮ (K) {
	⌥ (⚫actor ≟ ⚫right || ⚫actor ≟ ⚫left) {
		⌥ (K.char ≠ ∅ && K.mod.control ≟ ⦾
			&& K.key ≠ keycode.NUM_PLUS && K.key ≠ keycode.NUM_MINUS
			&& K.mod.alt ≟ ⦾ && visibleChar(K.char) && ⚫input.visible()) {
			$ ⚫input.onKey(K)
		}
	}
	$ dnaof(⚪, K)
}

TNorton.can.historyAdd = ➮(text) {
	⌥ (commandHistory.list ≟ ∅) commandHistory.list = []
	∇ L = commandHistory.list
	∇ j = L≀(text) ⦙ ⌥ (j >= 0) L⨄(j, 1)
	L ⬊(text)
//		saveCommandHistory()
//		fs.writeFileSync(expandPath('~/.deodar/command_history.js'),  
//			'commandHistory=' + JSON.stringify(commandHistory,0, ' '))
}

TNorton.can.runInBackground = ➮{
	∇ s = ⚫input.getText()
	⌥ (s ↥ > 0) {
		⚫historyAdd(s)
		⚫input.setText('')
		try {
			∇ prog = ≣('child_process').spawn(s)
			prog.on('error', ➮{ log('child error') })
		} catch (e) {
			messageBox(⚫getDesktop(), 'Ошибка запуска: ' + e≂)
		}
	}
	$ ⦿
}

TNorton.can.pressEnter = ➮{
	∇ s = ⚫input.getText()
	⌥ (s ↥ > 0) {
		⚫historyAdd(s)
		⚫input.setText('')
		∇ me = ⚪
		⌥ (s△(0) ≟ ' ') {
			$ ⦿
		} ⎇ ⌛(➮{ 
			me.execute(s) 
		}, 10)
		$ ⦿
	}
}

TNorton.can.onItemEnter = ➮(list, item) {
	⌥ (list.parent.visible()) {
		⌥ (applyEnterRules) {
			∇ X = applyEnterRules(item.name)
			⌥ (X) {
				⌥ (X.deodar ≟ ⦿) {
					//var src = fs.readFileSync(list.path + '/' + X.name).toString()
					∇ src = list.path + '/' + X.name
					⏀ ≣.cache[≣.resolve(src)]
					try {
						∇ O = ≣(src)
						O(⚪)
					} catch (e) {
						ロ'Plugin error:\n', e.stack
						⚫output.log('Plugin error:\n', e.stack)
						fs.writeFileSync('/var/tmp/deo.report', e.stack)
						//(this.getDesktop(), name, viewClass, colors)
						∇ D = ⚫viewFileName(TTextView, 
						'/var/tmp/deo.report')
						//messageBox(this.getDesktop(), e.stack)
						//TODO: show dialog
					}
					$
				} ⥹ (X.spawn) {
					spawn(X.spawn, [list.path + '/' + X.name])
					$
				} ⥹ (X.tty) {
					⚫historyAdd(X.tty + ' ' + X.name)
					⚫execute(X.tty + ' ' + X.name)
					$
				}
			}
		}
		⌥ (item.flags≀('x') >= 0) {
			⌥ (⚫input.getText() ≟ '') ⚫input.setText('./' + item.name) ⦙
			⚫pressEnter()
		}
	}
}

TNorton.can.execDone = ➮(command) {
	⚫shortcuts.enable('all', ⦾)
	⚫shortcuts.enable('input', ⦿)
	⚫show(⚫input)
	⌥ (⚫flip) ⚫exitOutputMode()
	⚫actor = ⚫preCommandFocus
	⌥ (⚫right.list.items ↥ < 300)//smallDirectorySize) 
		⚫right.list.reload()
	⌥ (⚫left.list.items ↥ < 300)//smallDirectorySize) 
		⚫left.list.reload()
	// else: может как то пометить в ободке окна что список не 
	// обновлён и человек нажал control-R?
	⚫size(⚫w, ⚫h)
}

TNorton.can.execute = ➮(command) {
	⌥ (⚫output.working()) {
		⚫enterOutputMode(⦿)
		$
	}
	∇ cwd = ⚫cwd()
//	var args = command.split(' ')
//	command = args.shift()
//	if (args[args.length - 1] == '') args.pop()
	∇ me = ⚪
	⚫preCommandFocus = ⚫actor
	⚫flip = ⚫enterOutputMode(⦿)
	⚫repaint()
	⚫actor = ⚫output
//	лучше сделать все эти ресайзы в особом 
//  колбэке (при первых полученых даных с терминала)
//	а то ведь может комманда вобще ничего не выведет на экран
//	а так можно будет просто вызвать size(this.w, this.h)
	⚫output.size(⚫output.w, ⚫output.h + 1)
	⚫left.size(⚫left.w, ⚫left.h + 1)
	⚫right.size(⚫right.w, ⚫right.h + 1)
	⚫hide(⚫input)
	∇ f = ⚫execDone.bind(⚪)
	⚫shortcuts.enable('all', ⦾)
	⚫shortcuts.enable('output', ⦿)
	⚫output.respawn(command, '', cwd, f)
}

TNorton.can.escape =  ➮{
	⌥ (⚫input.getText() ↥ > 0) ⚫input.setText('') ⦙ 
	⎇ ⚫outputFlip()
	$ ⦿
}

TNorton.can.outputFlip = ➮{
	⌥ (⚫left.visible() || ⚫right.visible()) {
		⚫enterOutputMode()
	} ⎇ {
		⚫exitOutputMode()
	}
	$ ⦿
}

TNorton.can.enterOutputMode = ➮(focusConsole) {
	⚫actor_before_output = ⚫actor
	⌥ (!⚫left.visible() && !⚫right.visible()) {
		$ ⦾
	}
	⚫left_was_visible = ⚫left.visible()
	⚫right_was_visible = ⚫right.visible()
	⌥ (⚫left.visible() || ⚫right.visible())
		⚫hide(⚫right), ⚫hide(⚫left) ⦙
	⚫shortcuts.enable('all', ⦾)
	⌥ (⚫output.working() || focusConsole) {
		⚫shortcuts.enable('output', ⦿)
		⚫actor = ⚫output
	} ⎇ {
		⚫shortcuts.enable('input', ⦿)
	}
	$ ⦿
}
TNorton.can.exitOutputMode = ➮{
	⚫shortcuts.enable('all', ⦾)
	⚫shortcuts.enable('panel', ⦿)
//	this.shortcuts.enable('input', true)
	⚫actor = ⚫actor_before_output
	⌥(⚫actor ≠ ⚫left && ⚫actor ≠ ⚫right) ⚫actor = ⚫left
	⌥ (⚫left_was_visible) ⚫show(⚫left)
	⌥ (⚫right_was_visible) ⚫show(⚫right)
	⚫getDesktop().display.caretReset()
}

globalConfigLoad = ➮{
}

TNorton.can.viewFileName = ➮(viewClass, name) {
//	var colors = getColor[theme.editor]
//	require('./intervision/palette')
	⚫viewer = viewFile(⚫getDesktop(), name, viewClass)
	⚫viewer.norton = ⚪
	$ ⦿
}

TNorton.can.viewFile = ➮(viewClass) {
	⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right) {
		☛ (⚫actor.list) {
			∇ panel = ⚫actor
			⌥ (items[sid].dir ≟ ⦾ && items[sid].hint ≠ ⦿) {
				// сделай isFile()
				⚫viewFileName(viewClass, path + '/' + items[sid].name)
				⌥ (⚫viewer) {
					⚫viewer.onHide = ➮{
						panel.list.reload()
					}
				}
			} ⎇ ロ 'not a file'
		}
	}
}

TNorton.can.editNew = ➮{
	⚫viewFile(TFileEdit)
}

TNorton.can.editFileInput = ➮{
	⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right)
		promptEditFile(⚫actor, ⚫editNew.bind(⚪))
	$ ⦿
}

TNorton.can.commandMakeDir = ➮{
	⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right)
		promptMakeDir(⚫actor)
	$ ⦿
}

TNorton.can.commandDelete = ➮{
	⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right) {
		⚫actor.list.showFocused = ⦿
		promptDeleteFile(⚫actor)
	}
	$ ⦿
}

TNorton.can.commandCopy = ➮(arg) {
	⌥ (⚫actor ≟ ⚫left || ⚫actor ≟ ⚫right) {
		∇ dest = ⚫left
		⌥ (⚫actor ≟ ⚫left) dest = ⚫right
		promptCopyFile(arg, ⚫actor, dest)
	}
	$ ⦿
}

editFileAlt = ➮(s) {
	glxwin.sh_async('geany '+ s)
}

