function checkConfig() {
	var file = expandPath('~/.deodar/driveMenu.js')
	
	if (fs.existsSync(file) == false) {
		log('must create')
		try {
				var templateDriveMenu = [
				'var list = [',
				"{ key:keycode['`'], title:'^~ (HOME)', path:'~', onSelect: function(){",
				"	this.list.showDotfiles = true",
				"}},",
				"{ key:'m', title:'/^media', path:'/media/ya' },",
				"{ key:'/', title:'корень (^/)', path:'/' },",
				"{ key:'e', title:'конфиги (/^etc)', path:'/etc' },",
				"]",
				"list // return last expression"
				]
				fs.writeFileSync(file, templateDriveMenu.join('\n'))
		} catch (e) { log('no js create', e) }
	}
}

checkConfig()
	
TDriveMenu = kindof(TDialog)
TDriveMenu.can.init = function(panel) {
	dnaof(this, 40, 1)
	this.panel = panel
	this.title = 'Скачок'
	this.list = TDriveList.create()
	this.list.columns = 1
	var list = [
		{ key:49, title:'~ (HOME)', path:'~' }, { key:58, title:'/media', path:'/media' }
	]
	this.sourceFile = undefined
	if (fs.existsSync(expandPath('~/.deodar/driveMenu.js'))) {
		var js = expandPath('~/.deodar/driveMenu.js')
		list = eval(fs.readFileSync(js).toString())
		this.sourceFile = js
	}
	var me = this
	var width = 0
	for (var i = 0; i < list.length; i++) {
		var t = list[i].title
		if (t.length > width) width = t.length
	}
	width += 2
	for (var i = 0; i < list.length; i++) {
		this.list.items.push(list[i])
		if (typeof list[i].key == 'number') code = list[i].key
		if (typeof list[i].key == 'string') code = keycode[list[i].key.charAt(0)]
		this.react(0, code, this.pathSelect, { arg: list[i] })
	}
	this.list.pal = this.pal
	this.add(this.list, width, list.length)
	this.addRow()
	this.size(width + this.border * 3 * 2 + 4, this.addY + 2)
	this.bottomTitle = 'Esc-отмена,F4-правка'
	this.react(0, keycode.ESCAPE, this.close)
	this.react(0, keycode.ENTER, this.onEnter)
	this.react(0, keycode.F4, this.editSource)
}

TDriveMenu.can.editSource = function () {
	if (this.sourceFile)
		this.panel.parent.viewFileName(TFileEdit, this.sourceFile)
	return true
}

TDriveMenu.can.pathSelect = function (item) {
	this.close()
	if (typeof item.onSelect == 'function') item.onSelect.apply(this.panel)
	var path = item.path
	var other = this.panel.parent.getOpposite(this.panel)
	if (other != undefined) {
		var o = other.list.path
		if (o.indexOf(path) == 0) {
			path = o
		}
	}
	this.panel.list.path = expandPath(path)
	delete this.panel.root
	if (item.root == true) this.panel.root = item
	this.panel.list.reload()
	this.panel.parent.updateInputLabel()
}

TDriveMenu.can.onEnter = function() {
	this.pathSelect(this.list.items[this.list.sid])
}

showDriveMenu = function(Desktop, panel) {
	var menu = TDriveMenu.create(panel)
	Desktop.showModal(menu, panel.x + (panel.w >> 1) - (menu.w >> 1), 3)
}



