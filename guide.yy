TGuideList = kindof(TList)
TGuideList.can.init = ➮ {
	dnaof(⚪)
	// Должно работать при зажатом ALT
	⚫react(10, keycode.UP, ⚫moveCursor, { arg:'up', role:['move'] })
	⚫react(10, keycode.DOWN, ⚫moveCursor, { arg:'down', role:['move'] })
	⚫react(10, keycode.LEFT, ⚫moveCursor, { arg:'left', role:['move'] })
	⚫react(10, keycode.RIGHT, ⚫moveCursor, { arg:'right', role:['move'] })
	⚫react(10, keycode.HOME, ⚫moveCursor, { arg:'home', role:['move'] })
	⚫react(10, keycode.END, ⚫moveCursor, { arg:'end', role:['move'] })
	⚫react(10, keycode.PAGE_UP, ⚫moveCursor, { arg:'pageup', role:['move'] })
	⚫react(10, keycode.PAGE_DOWN, ⚫moveCursor, { arg:'pagedown', role:['move'] })
}

TGuideList.can.drawItem = ➮(X) {
	∇ F = ⚫pal⁰, B = ⚫pal¹
	⌥ (X.focused) F = ⚫pal², B = ⚫pal³
	⌥ (X.selected) F = ⚫pal⁴
	∇ s = '', t = X.item.path, lights = []
	i ⬌ t {
		⌥ (tⁱ ≟ '^') { lights ⬊(i) ⦙ ♻ }
		s += tⁱ
	}
	⌥ (s ↥ > X.w) s = s⩪(0, X.w)
	⚫rect(X.x, X.y, X.w, 1, ∅, ∅, B)
	∇ x ⊜
	⚫print(x, X.y, s, F, B)
	i ⬌ lights
		⚫set(lightsⁱ + x, X.y, t[lightsⁱ+1],
			⚫pal⁶, ⚫pal³)
	$ ⦿
}

∇ sourceFile = ∅

TGuide = kindof(TDialog)
➮ loadList {
	∇ L = [ ]
	⌥ (fs.existsSync(expandPath('~/.deodar/guide.js'))) {
		∇ js = expandPath('~/.deodar/guide.js')
		try {
			∇ src = fs.readFileSync(js)≂
			L = eval(src)
		} catch (e) { }
		sourceFile = js
	}
//	i ⬌ L {
//		∇ t = Lⁱ.path
//		Lⁱ.title = t
//		Lⁱ.name = t
//		// TODO: улучшить
//	}
	$L
}

TGuide.can.init = ➮ (norton) {
	dnaof(⚪, 40, 1)
	∇ me = ⚪
	⚫norton = norton
	⚫title = 'Вожатый'
	⚫list = TGuideList.create()
	⚫list.columns = 1
	∇ L = loadList()
	⚫L = L
	∇ width ⊜
	i ⬌ L {
		∇ t = Lⁱ.path
		⌥ (t ↥ > width) width = t ↥
		⚫list.items ⬊(Lⁱ)
	}
	width += 2
	⚫list.pal = ⚫pal
	⚫add(⚫list, width, L↥)
	⚫addRow()
	⚫size(width + ⚫border * 3 * 2 + 4, ⚫addY + 2)
	⚫bottomTitle = 'Esc:отмена,F4:правка?'
	⚫react(0, keycode.ESCAPE, ⚫close)
	⚫react(10, keycode.ESCAPE, ⚫close)
	⚫react(0, keycode.ENTER, ⚫onEnter)
	⚫react(0, keycode.DELETE, ⚫onDelete)
	⚫react(10, keycode.DELETE, ⚫onDelete)
	⚫react(0, keycode.F4, ⚫editSource)
}

➮ saveList L {
	∇ src = fs.readFileSync(sourceFile)≂
	src = src.split('[')⁰ + '\n'
		+ ꗌ(L,0,'  ')
		+ '\n' + src.split(']')¹
	fs.writeFileSync(sourceFile, src)
}

TGuide.can.onDelete = ➮{
	L ∆ loadList()
	L.splice(⚫list.sid, 1)
	⚫list.items.splice(⚫list.sid, 1)
	⌥ (⚫list.sid >= L ↥) ⚫list.sid--
	saveList(L)
	$⦿
}

TGuide.can.onEnter = ➮{
	⚫close()
	❶ ⚫list.items[⚫list.sid]
	⌥ (①) signal('guide', 'select', ① path)
}

room.listen('edit begin file', ➮ {
	L ∆ loadList(), found = ⦾
	i ⬌ L {
		∇ t = Lⁱ.path
		⌥ (a ≟ t) found = ⦿
	}
	⌥ (!found) {
		L ⬋ ({path:a})
		saveList(L)
	}
})

TGuide.can.editSource = ➮ {
	⌥ (sourceFile)
		viewFile(desk, sourceFile, TFileEdit)
//		⚫panel.parent.viewFileName(TFileEdit, sourceFile)
	$ ⦿
}

//TGuide.can.itemSelect = ➮ (item) {
//	⚫close()
//	⚫panel.parent.viewFileName(TFileEdit, ⚫sourceFile)
//}

TGuide.can.altUp = ➮ {
	⌥ (⚫list.startSid ≠ ⚫list.sid) {
		⚫onEnter()
		$⦿
	}
}

TGuide.can.onKey = ➮ {
	⌥ (a.key == keycode.LEFT_CONTROL || a.key == keycode.RIGHT_CONTROL) {
		⚫altDown = ⦿
	}
	⌥ (a.key == keycode.LEFT_ALT) {
		⌥ (a.down) ⚫altDown = ⦿
		⎇ {
			⌥ (⚫altDown) ⚫altDown = ⦾
			⎇ ⌥ (⚫altUp()) $ ⦿
		}
	}
	R ∆ dnaof(⚪, a)
	⌥ (a.physical && a.down) {
		s ∆ '->' + a.key + ', "' + a.char + '"'
		ロ s
		⚫title = s
		R=⦿
	}
	$R
}

∇ desk

showGuide = ➮(norton, curFile) {
	∇ guide = TGuide.create(norton)
	guide.curFile = curFile
	L ∆ guide.list.items
	i ⬌ L {
		⌥ (Lⁱ.path ≟ curFile) guide.list.sid = i
	}
	guide.list.startSid = guide.list.sid
	⌥ (guide.list.items ↥ > 0)
		desk.showModal(guide, (desk.w >> 1) - (guide.w >> 1), 3)
}

room.listen('desktop created', ➮ {
	//если будет много десктопов, desktop switched
	desk = a
})


//room.reply('guide open', ➮ {
//	ロ 'Opening guide'
//	showGuide(desk)
//})
