TPleaseWait = kindof(TWindow)
TPleaseWait.can.init = function(startDir) {
	dnaof(this)
	this.working = false
	this.startDir = startDir
	this.search = TSearch.create()
	this.search.chain.onFile = this.onFile.bind(this)
	this.search.chain.onDir = this.onDir.bind(this)
	this.search.chain.onFinish = this.onFinish.bind(this)
	this.name = 'TFindWindow'
	this.input = TInput.create('edit.js')
	this.results = TResults.create()
	this.add(this.input)
	this.add(this.results)
	this.actor = this.input
	this.react(0, keycode.ESCAPE, this.cancelClose)
	this.react(0, keycode.ENTER, this.pressEnter)
	this.react(0, keycode.UP, this.results.moveCursor.bind(this.results), {arg:'up'})
	this.react(0, keycode.DOWN, this.results.moveCursor.bind(this.results), {arg:'down'})
	this.react(0, keycode.F4, this.startEdit)
	this.bottomTitle = 'Для поиска в содержимом файлов начните запрос со знака \' или " '
	this.history = []
}

TPleaseWait.can.size = function(w, h) {
	dnaof(this, w, h)
	this.input.size(w - 2, 1)
	this.input.pos(1, h - 2)
	this.results.size(w - 2, h - 3)
	this.results.pos(1, 1)
}

TPleaseWait.can.onDir = function(dir) {
	this.scanned++
	this.repaint()
}

TPleaseWait.can.onFile = function(file) {
	var q = this.query, match = false
	this.scanned++
	var name = file.split('/').pop()
	if (this.contents) {
		try { var size = fs.lstatSync(file).size } catch (e) { return }
		if (size < 100 * 1024) var s = fs.readFileSync(file).toString()
		if (s) match = s.indexOf(q) >= 0
	} else if (name.indexOf(q) >= 0) {
		match = true
	}
	this.repaint()
}

TPleaseWait.can.onFinish = function() {
	this.bottomTitle = 'Поиск завершён, F4 правка файла'
	this.working = false
	this.repaint()
}

TPleaseWait.can.title = function() {
	if (this.working) return 'Найдено: ' + this.matched + ' в ' + this.scanned + ' просмотреных'
	return 'Поиск файлов'
}

TPleaseWait.can.startSearch = function() {
	this.results.clearItems()
	this.scanned = 0
	this.matched = 0
	this.contents = false
	this.working = true
	if (this.search.chain) this.search.chain.cancel()
	this.query = this.input.getText()
	if (this.query[0] == '"' || this.query[0] == "'") {
		this.contents = true
		this.query = this.query.substr(1, this.query.length)
	}
	this.input.setText('')
	this.history.push(this.query)
	this.search.start({startDir: this.startDir})
	return true
}

TPleaseWait.can.cancelClose = function() {
	if (this.working) {
		if (this.search.chain) this.search.chain.cancel()
		this.working = false
		return true
	}
	this.close()
	return true
}

TNorton.can.userFindModal = function() {
	var panel = this.left
	if (this.actor == this.right) panel = this.right
	if (this.find == undefined)
		this.find = TPleaseWait.create(panel.list.path)
	else this.find.startDir = panel.list.path
	this.find.panel = panel
	this.find.pos(5, 3)
	this.find.size(this.w - 10, this.h - 6)
	this.getDesktop().showModal(this.find)
}

