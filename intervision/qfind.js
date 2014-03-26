TList.can.onAltChar = function (K) {
	var q = TQuickFind.create(K.char)
	var G = this.getGlobal()
	var D = this.getDesktop()
	D.showModal(q, G.x + 10, D.h - 3)//G.y + this.h - 3)
	this.showFocused = true
}

TQuickFind = kindof(TWindow)
TQuickFind.can.init = function(char) {
	dnaof(this)
	this.text = '^' + char
	this.pal = getColor.window
	this.size(30, 3)
	this.title = 'Поиск (RegEx)'
	this.bottom_title = 'Escape: отмена'
	var v = TInput.create('')
	v.text.onChange = function() {
		log('pika')
	}.bind(this)
	v.size(this.w - 2, 1)
	v.pos(1, 1)
	this.add(v)
	this.react(0, keycode.ESCAPE, this.close)
}

TQuickFind.can.endDropKey = function() {
	this.getDesktop().hideModal()
}

TQuickFind.can.onKey1 = function(K) {
	if (dnaof(this, K)) return
	if (K.mod.control || K.mod.alt) return
	this.text += char
//	this.onchange()
//	repaint()
}

/*q.onKey = function(K) { with (this) {
	if (((key >= 110 && key <= 118) || (key >= 67 && key <= 76) 
	|| [9, 36].indexOf(key) >= 0) && down) {
		this.getDesktop().hideModal(q)
		if (key == 36) this.link.list.onEnter()
		if ((key >= 110 && key <= 118) || (key >= 67 && key <= 76))
			this.link.onKey(key, down)
		repaint()
	} else if (key == 22 && down) {
		if (key_modifiers[0] == true) text = '';
		else text = text.substr(0, text.length - 1)
		onchange()
		repaint()
	}
}}

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
		q.onKey = function(key, down, physical) { with (this) {
			if (((key >= 110 && key <= 118) || (key >= 67 && key <= 76) 
			|| [9, 36].indexOf(key) >= 0) && down) {
				var Desktop = this.parent
				Desktop.hideModal(q)
				if (key == 36) this.link.list.onEnter()
				if ((key >= 110 && key <= 118) || (key >= 67 && key <= 76))
					this.link.onKey(key, down)
				repaint()
			} else if (key == 22 && down) {
				if (key_modifiers[0] == true) text = '';
				else text = text.substr(0, text.length - 1)
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

		q.onchange()
	}


*/
