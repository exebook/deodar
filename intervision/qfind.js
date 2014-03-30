TList.can.onAltChar = function (K) {
	var q = TQuickFind.create(K.char, this)
	var G = this.getGlobal()
	var D = this.getDesktop()
	D.showModal(q, G.x + 10, D.h - 3)
	this.showFocused = true
}

TQuickFind = kindof(TWindow)
TQuickFind.can.init = function(char, list) {
	dnaof(this)
	this.name = 'TQuickFind'
	this.list = list
	this.pal = getColor.window
	this.size(30, 3)
	this.error = false
	this.bottomTitle = 'Escape: отмена'
	this.input = TInput.create('^' + char)
	this.input.sel.clear()
	this.input.text.onChange = this.onChange.bind(this)
	this.input.size(this.w - 2, 1)
	this.input.pos(1, 1)
	this.onChange()
	this.add(this.input)
	this.react(0, keycode.ESCAPE, this.close)
	this.altIsDown = true
	with (keycode) this.closeKeys = [UP, DOWN, LEFT, RIGHT], this.transKeys = [TAB, ENTER]
}

TQuickFind.can.close = function() {
	this.list.showFocused = false
	dnaof(this)
}

TQuickFind.can.title = function() {
	if (this.error) return 'Ошибка regex'
	return 'Поиск (RegEx)'
}

TQuickFind.can.onChange = function() {
	try {
		var R = new RegExp(this.input.getText(), "")
		var it = this.list.items
		for (var i = 0; i < it.length; i++) {
			if (R.test(it[i].name) || R.test(it[i].name.toLowerCase())) {
				this.list.sid = i
				this.list.onItem(i)
				this.list.scrollIntoView()
				this.list.repaint()
				break
			}
		}
		this.error = false
	} catch (e) {
		this.error = true
	}
}

TQuickFind.can.onKey = function(hand) {
	if (this.altIsDown) {
		if (hand.mod.alt != true) this.altIsDown = false
		hand.mod.alt = false
	}
	if (hand.down && this.closeKeys.indexOf(hand.key) >= 0) {
		this.close()
		return
	}
	if (hand.down && (hand.char == undefined 
	|| this.transKeys.indexOf(hand.key) >= 0) && !hand.mod.shift) {
		this.close()
		this.getDesktop().onKey(hand)
		return false
	}
	return dnaof(this, hand)
}

