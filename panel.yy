SortModes = [
	{char: 'n', title:'Имя', func:➮(L) { $ L❄(➮(a, b) { ⌥ (a.dir ≠ b.dir) $ b.dir - a.dir ⦙ ⎇ $ a.name.localeCompare(b.name) }) }},
	{char: 'x', title:'Расширение', func:➮(L) {
		$ L❄(➮(a, b) {
			∇ aext = a.name⌶('.'), bext = b.name⌶('.')
			⌥ (aext ↥ > 1) aext = aext.pop() ⦙ ⎇ aext = ''
			⌥ (bext ↥ > 1) bext = bext.pop() ⦙ ⎇ bext = ''
			⌥ (a.dir ≠ b.dir) $ b.dir - a.dir ⦙ ⎇ {
				⌥ (aext ≟ bext) {
					$  a.name.localeCompare(b.name)
				} ⎇ $ aext.localeCompare(bext)
			}
		})
	}},
	{char: 's', title:'Размер', func:➮(L){
		$ L❄(➮(a, b) { ⌥ (a.dir ≠ b.dir) $ b.dir - a.dir ⦙ ⎇ $ b.size - a.size })
	}},
	{char: 'u', title:'Никак', func:➮(L){ $ L }},
	{char: 't', title:'Время', func:➮(L){}},
]

➮ loadDir path sort dots {
	∇ L = glxwin.native_readdir(path)
	⌥ (L ≟ ∅) L = [{name: 'error', hint: ⦿}]
	⌥ (!dots) L = Lꔬ(➮(s){ ⌥ (s.name△(0) ≟ '.') $ ⦾ ⦙ $ ⦿  })
	⌥ (sort ≠ ∅)
		L = sort.func(L)
	$ L
}

TFileList = kindof(TList)

TFileList.can.init = ➮{
	dnaof(⚪)
	⚫pal = getColor.filelist
	⚫name = 'TFileList'
	⚫path = '~'
	⚫showDotfiles = ⦾
	⚫detail = {}
	⚫mode = 'detail' //'brief'
	⚫columns = 2
	⚫react(0, keycode.ENTER, ⚫onEnter, { })
	⚫react(100, keycode['\\'], ⚫goToRoot)
	⚫react(100, keycode.F3, ⚫setSortMode, { arg:'name' })
	⚫react(100, keycode.F4, ⚫setSortMode, { arg:'ext' })
	⚫react(100, keycode.F6, ⚫setSortMode, { arg:'size' })
	⚫react(100, keycode['.'], ⚫showDots, { })
	⚫react(100, keycode.PAGE_UP, ⚫goUpLevel, { })
	⚫react(100, keycode.PAGE_DOWN, ⚫goDownLevel, { })
	⚫react(0, keycode.NUM_PLUS, ⚫maskSelectionAdd)
	⚫react(0, keycode.NUM_MINUS, ⚫maskSelectionRemove)
	⚫react(100, keycode['s'], ⚫maskSelectionAdd)
	⚫react(100, keycode['d'], ⚫maskSelectionRemove)
}

TFileList.can.goToRoot = ➮{
	∇ path = '/'
	⌥ (⚫parent.root ≠ ∅) path = ⚫parent.root.path
	⚫load(path)
	$ ⦿
}


theme = {
	viewer: 'syntaxCyan',
	editor: 'syntaxWhite',
//	syntaxCyan: {},
	fileList: {
		text: 0xff0,
		back: 0x700, 
		dir: 0xfff,
		textHint: 0x88f,
		backHint: 0x00f,
		textHintFocused: 0,
		backHintFocused: 0,
		focused: 0x880,
		textExec: 0x0f0,
		textSelected: 0x0ff,
		hilite: [
			{ name: 'c', ext: ['.cpp','.c','.h'], text: 0xb1c },
			{ name: 'js', ext: ['.js'], text: 0xf3e },
			{ name: 'yy', ext: ['.yy'], text: 0x18c },
			{ name: 'asm', ext: ['.asm',, '.inc'], text: 0x80f },
		]
		
	}
}

TFileList.can.fileHilite = ➮(item) {
	∇ F, B
	∇ s = item.name
	∇ hilite = theme.fileList.hilite
	⌥ (item.dir ≠ ⦿) {
		i ⬌ hilite {
			∇ h = hiliteⁱ
			∇ ok = ⦾
			j ⬌ h.ext {
				∇ n = s≀(h.extʲ)
				⌥ (n >= 0 && n ≟ s ↥ - h.extʲ ↥) {
					⌥ (h.text ≠ ∅) F = h.text
					⌥ (h.back ≠ ∅) B = h.back
					ok = ⦿ ⦙ @
				}
			}
			⌥ (ok) @
		}
	}
	$ [F, B]
}

TFileList.can.hilitePrint = ➮(x, y, w, item, F, B, itemSelected) {
	∇ C = ⚫fileHilite(item)
	⌥ (C⁰) F = C⁰ ⦙ ⌥ (C¹) B = C¹
	⌥ (itemSelected) F = theme.fileList.textSelected
	∇ text = item.name⩪(0, w)
	⚫print(x, y, text, F, B)
	⌥ (item.name ↥ > text ↥) {
		∇ a = text△(text ↥ - 1), b = text△(text ↥ - 2)
		⌥ (a ≟ ' ') a = '_' ⦙ ⌥ (b ≟ ' ') b = '_'
		∇ b1= blend(F, 4, B), b2 = blend(F, 8, B)
//		log(b1.toString(16), b2.toString(16))
		⚫print(x + w - 1, y, a, b1, B),
		⚫print(x + w - 2, y, b, b2, B)
	}
}

TFileList.can.drawItem = ➮(A) {
	∇ F = theme.fileList.text, B = theme.fileList.back
	⌥ (A.focused) B = theme.fileList.focused
	⚫rect(A.x, A.y, A.w, 1, ' ', ∅, B)
	⌥ (A.item.dir && A.item.name ≠ '..') F = theme.fileList.dir
	⌥ (A.item.hint) {
		F = theme.fileList.textHint, B = theme.fileList.backHint
		⌥ (A.focused) F = theme.fileList.textHintFocused, B = theme.fileList.backHintFocused
//		var text = A.item.name.substr(0, this.w)
		∇ text = A.item.name⩪(0, ⚫w)
		this.print(
			Math.floor(this.w / 2) - Math.ceil(A.item.name.length / 2),
			Math.floor(this.h / 2) - 1, text, F, B)
//		⚫print(
//			⍽(⚫w / 2) - Math.ceil(A.item.name ↥ / 2),
//			⍽(⚫h / 2)-1, text, F, B)
		$ ⦾
	}
	⌥ (A.item.flags ≠ ∅ && !A.item.dir && A.item.flags≀('x') >= 0) F = theme.fileList.textExec
	⚫hilitePrint(A.x, A.y, A.w, A.item, F, B, A.selected)
	$ ⦿
}

TFileList.can.goUpLevel = ➮ {
	⚫sid = 0
	⌥ (⚫path ≟ '/') $ ⦿
	$ ⚫onEnter()
}

TFileList.can.goDownLevel = ➮ {
	⌥ (⚫items[⚫sid].dir) {
		$ ⚫onEnter()
	}
}

TFileList.can.onEnter = ➮ {
	⌥ (⚫items[⚫sid].hint) $
	⌥ (⚫items[⚫sid].dir) {
		∇ p = ⚫items[⚫sid].name
		⌥ (p ≟ '..') {
			∇ s = ⚫path⌶('/')
			⚫path = s⋃(0, -1)⫴('/')
			⌥ (⚫path ≟ '') ⚫path = '/'
			∇ old = s[s ↥ - 1]
		} ⎇ {
			⌥ (⚫path ≟ '/') ⚫path = ''
			⚫path += '/' + p
		}
		⚫load(⚫path)
		⚫parent.parent.updateInputLabel()
		⌥ (old ≠ ∅) {
			i ⬌ this.items ⌥ (⚫itemsⁱ.name ≟ old) { ⚫sid = i ⦙ @ }
		}
		⚫repaint()
		$ ⦿
	} ⎇ {
		⚫parent.parent.onItemEnter(⚪, ⚫items[⚫sid])
//		if (this.items[this.sid].flags.indexOf('x') >= 0) { this.parent.parent.execute(this.items[this.sid].name);
//		}
	}
	$ ⦾
}

TFileList.can.setSortMode = ➮(mode) {
	⌥ (mode ≟ 'name') {
		⚫sortMode = SortModes⁰
	} ⥹ (mode ≟ 'ext') {
		⚫sortMode = SortModes¹
	} ⥹ (mode ≟ 'size') {
		⚫sortMode = SortModes²
	}
	⚫reload()
	$ ⦿
	//TODO:show sort mode
}

TFileList.can.showDots = ➮{
	⚫showDotfiles = !⚫showDotfiles
	⚫reload()
	$ ⦿
}

TFileList.can.onMouse = ➮(hand) {
	⌥ (hand.down && hand.button ≟ 10) $ ⚫onEnter()
	$ dnaof(⚪, hand)
}

TFileList.can.load = ➮(path) {
	⚫selectNone()
	⚫selChanged()
	⚫path = path
	⚫items = loadDir(⚫path, ⚫sortMode, ⚫showDotfiles)
	⚫sid = 0
	⚫d = 0
	⚫parent.onLoad()
	$ ⦿
//		if (new_sid == undefined) this.sid = 0; else sid = new_sid
}

TFileList.can.reload = ➮{
	∇ s = ⚫items[⚫sid].name, d = ⚫d
	⚫load(⚫path)
	⚫sid = 0
	i ⬌ this.items 
		⌥ (⚫itemsⁱ.name ≟ s) { ⚫sid = i ⦙ ⚫onItem(i) ⦙ ⚫d = d ⦙ @ }
	⚫onItem(0) ⦙
	⚫scrollIntoView()
}

TFileList.can.onItem = ➮{
	⚫detail.info = ⚫items[⚫sid]
}

TFileList.can.selChanged = ➮{
	⌥ (⚫selection ↥ ≟ 0) ⏀ ⚫detail.sel
	⎇ {
		∇ x = 0
		i ⬌ this.selection {
			∇ n = ⚫selectionⁱ
			⌥ (⬤ ⚫itemsⁿ.size ≟ 'number') x += ⚫itemsⁿ.size
		}
		∇ s = readableSize(x, ' байтов')// склонения?
		⚫detail.sel = s + ' в ' + ⚫selection ↥ + ' ' + numDeclension('в', 'м', ⚫selection ↥, 'файл')
	}
}

TFileDetail = kindof(TView)
TFileDetail.can.init = ➮{
	dnaof(⚪)
	⚫info = {}//{ text: "..", size: undefined }
	⚫name = 'TFileDetail'
	⚫sel = ∅
	⚫pal = getColor.filelist
}

TFileDetail.can.draw = ➮(state) {
	dnaof(⚪, state)
	⚫rect(0, 0, ⚫w, 1, graphChar['─'], ⚫pal⁰ | 0x8000,  ⚫pal¹)  ⦙
	⌥ (⚫filelist.column_x ≠ ∅) ⧗ (∇ i = 1 ⦙ i < ⚫filelist.column_x ↥ ⦙ i++)
		⚫set(⚫filelist.column_xⁱ, 0, graphChar['┴'], ⚫pal⁰ | 0x8000, ⚫pal¹)
	∇ x = ⍽(⚫filelist.w / 2)
	⌥ (⚫sel ≠ ∅) {
		⚫rect(x - (⚫sel ↥ >> 1) - 1, 0, ⚫sel ↥ + 2, 1, ' ', ⚫pal³, 0x880)
		⚫print(x - (⚫sel ↥ >> 1), 0, ⚫sel)
	}
	➮ zz s { s=s+'' ⦙ ⧖ (s ↥ < 2)s='0'+s ⦙ $ s }

	x = ⚫w
	⌥ (⚫info.mode ≠ ∅) s = ' '+(⚫info.mode).toString(8)⩪(), x -= (s ↥),
		⚫print(x, 1, s, 0x773, ⚫pal¹)
	⌥ (⚫info.mtime ≠ ∅) {
		s = ''
		s += zz(⚫info.mtime³) // hour
		s += ':'
		s += zz(⚫info.mtime⁴) // minute
		x -= s ↥
		⚫print(x, 1, s, 0x4a6, ⚫pal¹)
		s = ''
		s += zz(⚫info.mtime¹) // month
		s += '.'
		s += zz(⚫info.mtime²) // day
		x -= (s ↥ + 1)
		⚫print(x, 1, s, 0x284, ⚫pal¹)
	}
	⌥ (⚫info.size ≠ ∅) {
//			x += 1
		∇ s = readableSize(⚫info.size)
		x -= (s ↥ + 2)
		⚫print(x, 1, s, 0xaef, ⚫pal¹)
	}

	⌥ (⚫info.name ≠ ∅) {
		s = compressFileName(⚫info.name, x-1)
		⚫print(0, 1, s, ⚫pal⁰, ⚫pal¹)
	}
}

TFileDetail.can.onMouse = ➮(hand) {
	⌥ (hand.down && hand.button ≟ 0) ⚫parent.actor = ⚫filelist
}

TFilePanel = kindof(TWindow)

TFilePanel.can.init = ➮{
	dnaof(⚪)
	⚫list = TFileList.create()
	⚫list.sortMode = SortModes¹
	⚫detail = TFileDetail.create()

	⚫add(⚫detail)
	⚫add(⚫list)
	⚫list.h -= 2
	⚫name = 'TFilePanel'
	⚫detail.filelist = ⚫list
	⚫list.detail = ⚫detail
	⚫pal = getColor.window
	⚫list.pos(1, 1)
}

TFilePanel.can.onMouse = ➮(hand) {
	∇ a = ⚫actor
	∇ ret = dnaof(⚪, hand)
	⌥ (⚫actor ≟ ∅) {
		⌥  (hand.down && hand.button ≟ 0) {
			⚫actor = ⚫list
			$ a ≟ ∅ // мож просто true?
		}
	}
	$ ret
}

TFilePanel.can.size = ➮(w, h) {
	dnaof(⚪, w, h)
//	this.size(w, h)
	⚫list.size(w-2, h-4)
	⚫detail.size(w-2, 2)
	⚫detail.x = ⚫list.x, ⚫detail.y = ⚫list.y + ⚫list.h
}

TFilePanel.can.titleFit = ➮(s, w) {
	$ pathCompress(s, w)
}

TFilePanel.can.draw = ➮(state) {
	dnaof(⚪, state)
	⚫drawChild(⚫detail, state) // detail must be drawn after the list to show column bottoms
	⚫detail.render(⚪)
}

TFilePanel.can.onLoad = ➮{
	⌥ (⚫root ≟ ∅) {
		⚫title = ⚫list.path ⦙
		⌥ (⚫list.path ≠ '/') ⚫list.items ⬋(
			{name:'..', dir:⦿, size:0})
	} ⎇ {
		⌥ (⚫list.path ≠ '/' && ⚫list.path ≠ ⚫root.path)
			⚫list.items ⬋({name:'..', dir:⦿, size:0})
		∇ s = ⚫list.path
		∇ j = s≀(⚫root.path)
		⌥ (j >= 0) s = s⩪(j + ⚫root.path ↥, s ↥)
		⚫title = ⚫root.title.replace(/\^/g, '') + s
	}
	∇ size = 0, it = ⚫list.items
	i ⬌ it 
		⌥ (⬤ itⁱ.size ≟ 'number') size += itⁱ.size
	∇ count = it ↥
	⌥ (count > 0 && ⚫path ≠ '/') count --
	⌥ (count ≟ 0) ⚫bottomTitle = 'пустая папка' ⦙ ⎇
	⚫bottomTitle = readableSize(size, ' байтов', 'склонения') + ' в ' + count +' '+ numDeclension('в', 'м', count, 'файл')
}

