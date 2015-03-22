➮ checkConfig {
	∇ file = expandPath('~/.deodar/driveMenu.js')
	
	⌥ (fs.existsSync(file) ≟ ⦾) {
		try {
				∇ templateDriveMenu = [
				'var list = [',
				"{ key:keycode['`'], title:'^~ (HOME)', path:'~', onSelect: function(){",
				"	this.list.showDotfiles = true",
				"}},",
				"{ key:'m', title:'/^media', path:'/media/ya' },",
				"{ key:'/', title:'корень (^/)', path:'/' },",
				"{ key:'e', title:'конфиги (/^etc)', path:'/etc' },",
				"{ key:keycode.TAB, title:'^^^TAB Тут-же', path:function() { ",
				"	return this.parent.getOpposite(this).list.path",
				"}},",
				"]",
				"list // return last expression"
				]
				fs.writeFileSync(file, templateDriveMenu⫴('\n'))
		} catch (e) { log('no js create', e) }
	}
}

checkConfig()
	
TDriveMenu = kindof(TDialog)
TDriveMenu.can.init = ➮(panel) {
	dnaof(⚪, 40, 1)
	∇ me = ⚪
	⚫panel = panel
	⚫title = 'Скачок'
	⚫list = TDriveList.create()
	⚫list.columns = 1
	∇ list = [
		{ key:49, title:'~ (HOME)', path:'~' }, { key:58, title:'/media', path:'/media' }
	]
	⚫sourceFile = ∅
	⌥ (fs.existsSync(expandPath('~/.deodar/driveMenu.js'))) {
		∇ js = expandPath('~/.deodar/driveMenu.js')
		try {
			∇ src = fs.readFileSync(js)≂
			list = eval(src)
		} catch (e) {
			messageBox(panel.getDesktop(), 'Ошибка загрузки "скачка": '+e, ➮{ 
				⌥ (js)
					panel.parent.viewFileName(TFileEdit, js)
				log('ok') 
			})
			$
		}
		⚫sourceFile = js
	}
	∇ width ⊜
	i ⬌ list {
		∇ t = listⁱ.title
		⌥ (t ↥ > width) width = t ↥
	}
	width += 2
	i ⬌ list {
		⚫list.items ⬊(listⁱ)
		⌥ (⬤ listⁱ.key ≟ 'number') code = listⁱ.key
		⌥ (⬤ listⁱ.key ≟ 'string') code = keycode[listⁱ.key△(0)]
		⚫react(0, code, ⚫pathSelect, { arg: listⁱ })
	}
	⚫list.pal = ⚫pal
	⚫add(⚫list, width, list ↥)
	⚫addRow()
	⚫size(width + ⚫border * 3 * 2 + 4, ⚫addY + 2)
	⚫bottomTitle = 'Esc:отмена,F4:правка'
	⚫react(0, keycode.ESCAPE, ⚫close)
	⚫react(0, keycode.ENTER, ⚫onEnter)
	⚫react(0, keycode.F4, ⚫editSource)
}

TDriveMenu.can.editSource = ➮ {
	⌥ (⚫sourceFile)
		⚫panel.parent.viewFileName(TFileEdit, ⚫sourceFile)
	$ ⦿
}

TDriveMenu.can.pathSelect = ➮ (item) {
	⚫close()
	⌥ (⬤ item.onSelect ≟ 'function') item.onSelect.apply(⚫panel)
	∇ path
	⌥ (⬤ item.path ≟ 'function') path = item.path.apply(⚫panel)
	⎇ path = item.path
	⌥ (item.root) {
		∇ other = ⚫panel.parent.getOpposite(⚫panel)
		⌥ (other ≠ ∅) {
			∇ o = other.list.path
			⌥ (o≀(path) ≟ 0) {
				path = o
			}
		}
	}
	⚫panel.list.path = expandPath(path)
	⏀ ⚫panel.root
	⌥ (item.root ≟ ⦿) ⚫panel.root = item
	⚫panel.list.reload()
	⚫panel.parent.updateInputLabel()
}

TDriveMenu.can.onEnter = ➮{
	⚫pathSelect(⚫list.items[⚫list.sid])
}

showDriveMenu = ➮(Desktop, panel) {
	∇ menu = TDriveMenu.create(panel)
	⌥ (menu.sourceFile ≟ ∅) $
	Desktop.showModal(menu, panel.x + (panel.w >> 1) - (menu.w >> 1), 3)
}



