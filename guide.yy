/*
	TODO
	⚫ gotofolder
	⚫ remove key, duplicate key
*/
RECENT_ENTRIES ∆ 8

TGuideList = kindof(TList)
TGuideList.can.init = ➮ {
	dnaof(⚪)
	// Должно работать при зажатом ALT
	❶ keycode
	⚫react(10, ①UP, ⚫moveCursor, { arg:'up', role:['move'] })
	⚫react(10, ①DOWN, ⚫moveCursor, { arg:'down', role:['move'] })
	⚫react(10, ①LEFT, ⚫moveCursor, { arg:'left', role:['move'] })
	⚫react(10, ①RIGHT, ⚫moveCursor, { arg:'right', role:['move'] })
	⚫react(10, ①HOME, ⚫moveCursor, { arg:'home', role:['move'] })
	⚫react(10, ①END, ⚫moveCursor, { arg:'end', role:['move'] })
	⚫react(10, ①PAGE_UP, ⚫moveCursor, { arg:'pageup', role:['move'] })
	⚫react(10, ①PAGE_DOWN, ⚫moveCursor, { arg:'pagedown', role:['move'] })
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
	⌥ (s↥ > X.w) s = s⩪(0, X.w)
	⚫rect(X.x, X.y, X.w, 1, ∅, ∅, B)
	x ∆ 0
	❶ X.item.key
	⌥ (①) ⚫print(x, X.y, ①, F, B)
	x += 2
	⚫print(x, X.y, s, F, B)
	i ⬌ lights
		⚫set(lightsⁱ + x, X.y, t[lightsⁱ+1],
			⚫pal⁶, ⚫pal³)
	$ ⦿
}

➮ removeOlderAndSort L {
	R ∆ []
	c ∆ 0
	l ⬌ L {
		❶ Lˡ
		⌥ (①key) ♻
		⌥ (++c > RECENT_ENTRIES) ♻
		R ⬊ ①
	}
	l ⬌ L { ❶ Lˡ ⦙ ⌥ (①key) R ⬊ ① }
	$ R
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
	L = removeOlderAndSort(L)
//	L = L❄ (➮ { $ a.key ≟ ∅ })
	$L
}

➮ saveList L {
	∇ src = fs.readFileSync(sourceFile)≂
	src = src.split('[')⁰ + '\n'
		+ ꗌ(L,0,'  ')
		+ '\n' + src.split(']')¹
	src = src.replace(/\n\n/g, '\n')//откуда берутся?
	fs.writeFileSync(sourceFile, src)
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
	listH ∆ L↥, maxH = norton.h - (⚫border * 3 * 2 + 4)
	⌥ (listH > maxH) listH = maxH
	⚫add(⚫list, width, listH)
	⚫addRow()
	⚫size(width + ⚫border * 3 * 2 + 4, ⚫addY + 2)
	⚫bottomTitle = 'F5:задать,Tab:ветка'
	❶ keycode
	⚫react(0, ①ESCAPE, ⚫close)
	⚫react(10, ①ESCAPE, ⚫close)
	⚫react(0, ①ENTER, ⚫onEnter)
	⚫react(0, ①DELETE, ⚫onDelete)
	⚫react(10, ①DELETE, ⚫onDelete)
	⚫react(0, ①F4, ⚫editSource)
	⚫react(0, ①F5, ⚫assignKey)
	⚫react(0, ①TAB, ⚫gotoFolder)
}

TGuide.can.gotoFolder = ➮ {
	⌥ (⚫norton && ⚫norton.actor) {
		s ∆ ⚫norton.actor.name
		⌥ (s ≟ 'Right' || s ≟ 'Left') {
			❶ ⚫norton.actor // panel
			❷ ⚫list.items[⚫list.sid].path
			② = ②substr(0, ②lastIndexOf('/'))
			① list.path = expandPath(②)
			⏀ ① root
			① list.reload()
			① parent.updateInputLabel()
		}
	}
	⚫close()
}

TGuide.can.assignKey = ➮ {
	me ∆ ⚪
	L ∆ ⚫list
	makeKeyChoose(⚫getDesktop(), ➮ {
		∇ ch
		⌥ (a) ch = a.char
		L.items[L.sid].key = ch
		me.L[L.sid].key = ch
		saveList(me.L)
	})
}

TGuide.can.onDelete = ➮{
	L ∆ loadList()
	L.splice(⚫list.sid, 1)
	⚫list.items⨄(⚫list.sid, 1)
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
	⌥ (a.physical && a.down && a.char) {
		L ∆ ⚫list.items
		i ⬌ L ⌥ (Lⁱ.key ≟ a.char) {
			⚫list.sid = i
			⚫list.scrollIntoView()
			⚫choosenItem = i
			$⦿
		}
		⏀ ⚫choosenItem
		R=⦿
	}
	⌥ (a.physical && !a.down && ⚫choosenItem ≠ ∅) {
		i ∆ ⚫choosenItem
		⏀ ⚫choosenItem
		⚫onEnter()
	}
	$R
}

∇ desk

showGuide = ➮(norton, curFile) {
	∇ guide = TGuide.create(norton)
	guide.norton = norton
	guide.curFile = curFile
	L ∆ guide.list.items
	i ⬌ L {
		⌥ (Lⁱ.path ≟ curFile) guide.list.sid = i
		guide.list.scrollIntoView()
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
	