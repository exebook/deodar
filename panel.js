SortModes = [
	{char: 'n', title:'Имя', func:function(L) { return L.sort(function(a, b) { if (a.dir != b.dir) return b.dir - a.dir; else return a.name.localeCompare(b.name) }) }},
	{char: 'x', title:'Расширение', func:function(L) {
		return L.sort(function(a, b) {
			var aext = a.name.split('.'), bext = b.name.split('.')
			if (aext.length > 1) aext = aext.pop(); else aext = ''
			if (bext.length > 1) bext = bext.pop(); else bext = ''
			if (a.dir != b.dir) return b.dir - a.dir; else {
				if (aext == bext) {
					return  a.name.localeCompare(b.name)
				} else return aext.localeCompare(bext)
			}
		})
	}},
	{char: 's', title:'Размер', func:function(L){
		return L.sort(function(a, b) { if (a.dir != b.dir) return b.dir - a.dir; else return b.size - a.size })
	}},
	{char: 'u', title:'Никак', func:function(L){ return L }},
	{char: 't', title:'Время', func:function(L){}},
]

function loadDir(path, sort, dots) {
	var L = glxwin.native_readdir(path)
	if (L == undefined) L = [{name: 'error', hint: true}]
	if (!dots) L = L.filter(function(s){ if (s.name.charAt(0) == '.') return false; return true  })
	if (sort != undefined)
		L = sort.func(L)
	return L
}

TFileList = kindof(TList)

TFileList.can.init = function() {
	dnaof(this)
	this.pal = getColor.filelist
	this.name = 'TFileList'
	this.path = '~'
	this.showDotfiles = false
	this.detail = {}
	this.mode = 'detail' //'brief'
	this.react(0, keycode.ENTER, this.onEnter, { })
	this.react(100, keycode['\\'], this.goToRoot)
	this.react(100, keycode.F3, this.setSortMode, { arg:'name' })
	this.react(100, keycode.F4, this.setSortMode, { arg:'ext' })
	this.react(100, keycode.F6, this.setSortMode, { arg:'size' })
	this.react(100, keycode['.'], this.showDots, { })
	this.react(100, keycode.PAGE_UP, this.goUpLevel, { })
	this.react(100, keycode.PAGE_DOWN, this.goDownLevel, { })
	this.react(0, keycode.NUM_PLUS, this.maskSelectionAdd)
	this.react(0, keycode.NUM_MINUS, this.maskSelectionRemove)
	this.react(100, keycode['s'], this.maskSelectionAdd)
	this.react(100, keycode['d'], this.maskSelectionRemove)
}

TFileList.can.goToRoot = function() {
	var path = '/'
	if (this.parent.root != undefined) path = this.parent.root.path
	this.load(path)
	return true
}


theme = {
	viewer: 'syntaxCyan',
	editor: 'syntaxCyan',
	syntaxCyan: {},
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
		]
		
	}
}

TFileList.can.fileHilite = function(item) {
	var F, B
	var s = item.name
	var hilite = theme.fileList.hilite
	if (item.dir != true) {
		for (var i = 0; i < hilite.length; i++) {
			var h = hilite[i]
			var ok = false
			for (var j = 0; j < h.ext.length; j++) {
				var n = s.indexOf(h.ext[j])
				if (n >= 0 && n == s.length - h.ext[j].length) {
					if (h.text != undefined) F = h.text
					if (h.back != undefined) B = h.back
					ok = true; break
				}
			}
			if (ok) break
		}
	}
	return [F, B]
}

TFileList.can.hilitePrint = function(x, y, w, item, F, B, itemSelected) {
	var C = this.fileHilite(item)
	if (C[0]) F = C[0]; if (C[1]) B = C[1]
	if (itemSelected) F = theme.fileList.textSelected
	var text = item.name.substr(0, w)
	this.print(x, y, text, F, B)
	if (item.name.length > text.length) {
		var a = text.charAt(text.length - 1), b = text.charAt(text.length - 2)
		if (a == ' ') a = '_'; if (b == ' ') b = '_'
		var b1= blend(F, 4, B), b2 = blend(F, 8, B)
//		log(b1.toString(16), b2.toString(16))
		this.print(x + w - 1, y, a, b1, B),
		this.print(x + w - 2, y, b, b2, B)
	}
}

TFileList.can.drawItem = function(A) {
	var F = theme.fileList.text, B = theme.fileList.back
	if (A.focused) B = theme.fileList.focused
	this.rect(A.x, A.y, A.w, 1, ' ', undefined, B)
	if (A.item.dir && A.item.name != '..') F = theme.fileList.dir
	if (A.item.hint) {
		F = theme.fileList.textHint, B = theme.fileList.backHint
		if (A.focused) F = theme.fileList.textHintFocused, B = theme.fileList.backHintFocused
		var text = A.item.name.substr(0, this.w)
		this.print(
			Math.floor(this.w / 2) - Math.ceil(A.item.name.length / 2),
			Math.floor(this.h / 2)-1, text, F, B)
		return false
	}
	if (A.item.flags != undefined && !A.item.dir && A.item.flags.indexOf('x') >= 0) F = theme.fileList.textExec
	this.hilitePrint(A.x, A.y, A.w, A.item, F, B, A.selected)
	return true
}

TFileList.can.goUpLevel = function () {
	this.sid = 0
	if (this.path == '/') return true
	return this.onEnter()
}

TFileList.can.goDownLevel = function () {
	if (this.items[this.sid].dir) {
		return this.onEnter()
	}
}

TFileList.can.onEnter = function () {
	if (this.items[this.sid].hint) return
	if (this.items[this.sid].dir) {
		var p = this.items[this.sid].name
		if (p == '..') {
			var s = this.path.split('/')
			this.path = s.slice(0, -1).join('/')
			if (this.path == '') this.path = '/'
			var old = s[s.length - 1]
		} else {
			if (this.path == '/') this.path = ''
			this.path += '/' + p
		}
		this.load(this.path)
		this.parent.parent.updateInputLabel()
		if (old != undefined) {
			for (var i = 0; i < this.items.length; i++) if (this.items[i].name == old) { this.sid = i; break }
		}
		this.repaint()
		return true
	} else {
		this.parent.parent.onItemEnter(this, this.items[this.sid])
//		if (this.items[this.sid].flags.indexOf('x') >= 0) { this.parent.parent.execute(this.items[this.sid].name);
//		}
	}
	return false
}

TFileList.can.setSortMode = function(mode) {
	if (mode == 'name') {
		this.sortMode = SortModes[0]
	} else if (mode == 'ext') {
		this.sortMode = SortModes[1]
	} else if (mode == 'size') {
		this.sortMode = SortModes[2]
	}
	this.reload()
	return true
	//TODO:show sort mode
}

TFileList.can.showDots = function() {
	this.showDotfiles = !this.showDotfiles
	this.reload()
	return true
}

TFileList.can.onMouse = function(hand) {
	if (hand.down && hand.button == 10) return this.onEnter()
	return dnaof(this, hand)
}

TFileList.can.load = function(path) {
	this.selectNone()
	this.selChanged()
	this.path = path
	this.items = loadDir(this.path, this.sortMode, this.showDotfiles)
	this.sid = 0
	this.d = 0
	this.parent.onLoad()
	return true
//		if (new_sid == undefined) this.sid = 0; else sid = new_sid
}

TFileList.can.reload = function() {
	var s = this.items[this.sid].name, d = this.d
	this.load(this.path)
	this.sid = 0
	for (var i = 0; i < this.items.length; i++) 
		if (this.items[i].name == s) { this.sid = i; this.onItem(i); this.d = d; break }
	this.onItem(0);
	this.scrollIntoView()
}

TFileList.can.onItem = function() {
	this.detail.info = this.items[this.sid]
}

TFileList.can.selChanged = function() {
	if (this.selection.length == 0) delete this.detail.sel
	else {
		var x = 0
		for (var i = 0; i < this.selection.length; i++) {
			var n = this.selection[i]
			if (typeof this.items[n].size == 'number') x += this.items[n].size
		}
		var s = readableSize(x, ' байтов')// склонения?
		this.detail.sel = s + ' в ' + this.selection.length + ' ' + numDeclension('в', 'м', this.selection.length, 'файл')
	}
}

TFileDetail = kindof(TView)
TFileDetail.can.init = function() {
	dnaof(this)
	this.info = {}//{ text: "..", size: undefined }
	this.name = 'TFileDetail'
	this.sel = undefined
	this.pal = getColor.filelist
}
//	$.bg = 0x0f0


TFileDetail.can.draw = function(state) {
	dnaof(this, state)
	this.rect(0, 0, this.w, 1, graphChar['─'], this.pal[0] | 0x8000) ;
	if (this.filelist.column_x != undefined) for (var i = 1; i < this.filelist.column_x.length; i++)
		this.print(this.filelist.column_x[i], 0, graphChar['┴'], this.pal[0] | 0x8000)
	var x = Math.floor(this.filelist.w / 2)
	if (this.sel != undefined) {
		this.rect(x - (this.sel.length >> 1) - 1, 0, this.sel.length + 2, 1, ' ', this.pal[3], 0x880)
		this.print(x - (this.sel.length >> 1), 0, this.sel)
	}
	function zz(s) { s=s+''; while (s.length < 2)s='0'+s; return s }

	x = this.w
	if (this.info.mode != undefined) s = ' '+(this.info.mode).toString(8).substr(), x -= (s.length),
		this.print(x, 1, s, 0x773, this.bg)
	if (this.info.mtime != undefined) {
		s = ''
		s += zz(this.info.mtime[3]) // hour
		s += ':'
		s += zz(this.info.mtime[4]) // minute
		x -= s.length
		this.print(x, 1, s, 0x4a6, this.bg)
		s = ''
		s += zz(this.info.mtime[1]) // month
		s += '.'
		s += zz(this.info.mtime[2]) // day
		x -= (s.length + 1)
		this.print(x, 1, s, 0x284, this.bg)
	}
	if (this.info.size != undefined) {
//			x += 1
		var s = readableSize(this.info.size)
		x -= (s.length + 2)
		this.print(x, 1, s, 0xaef, this.bg)
	}

	if (this.info.name != undefined) {
		s = compressFileName(this.info.name, x-1)
		this.print(0, 1, s, this.fg, this.bg)
	}
}

TFileDetail.can.onMouse = function(hand) {
	if (hand.down && hand.button == 0) this.parent.actor = this.filelist
}

TFilePanel = kindof(TWindow)

TFilePanel.can.init = function() {
	dnaof(this)
	this.list = TFileList.create()
	this.list.sortMode = SortModes[1]
	this.detail = TFileDetail.create()

	this.add(this.detail)
	this.add(this.list)
	this.list.h -= 2
	this.name = 'TFilePanel'
	this.detail.filelist = this.list
	this.list.detail = this.detail
	this.pal = getColor.window
	this.list.pos(1, 1)
}

TFilePanel.can.onMouse = function(hand) {
	var a = this.actor
	var ret = dnaof(this, hand)
	if (this.actor == undefined) {
		if  (hand.down && hand.button == 0) {
			this.actor = this.list
			return a == undefined // мож просто true?
		}
	}
	return ret
}

TFilePanel.can.size = function(w, h) {
	dnaof(this, w, h)
//	this.size(w, h)
	this.list.size(w-2, h-4)
	this.detail.size(w-2, 2)
	this.detail.x = this.list.x, this.detail.y = this.list.y + this.list.h
}

TFilePanel.can.titleFit = function(s, w) {
	return pathCompress(s, w)
}

TFilePanel.can.draw = function(state) {
	dnaof(this, state)
	this.detail.draw(state) // detail must be drawn after the list to show column bottoms
	this.detail.render(this)
}

TFilePanel.can.onLoad = function() {
	if (this.root == undefined) {
		this.title = this.list.path;
		if (this.list.path != '/') this.list.items.unshift(
			{name:'..', dir:true, size:0})
	} else {
		if (this.list.path != '/' && this.list.path != this.root.path)
			this.list.items.unshift({name:'..', dir:true, size:0})
		var s = this.list.path
		var j = s.indexOf(this.root.path)
		if (j >= 0) s = s.substr(j + this.root.path.length, s.length)
		this.title = this.root.title.replace(/\^/g, '') + s
	}
	var size = 0, it = this.list.items
	for (var i = 0; i < it.length; i++) 
		if (typeof it[i].size == 'number') size += it[i].size
	var count = it.length
	if (count > 0 && this.path != '/') count --
	if (count == 0) this.bottomTitle = 'пустая папка'; else
	this.bottomTitle = readableSize(size, ' байтов', 'склонения') + ' в ' + count +' '+ numDeclension('в', 'м', count, 'файл')
}

