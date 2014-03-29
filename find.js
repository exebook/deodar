function taskFindFile() {
	if (this.state == 'cancel') {
		this.state = 'canceled'
		return
	}
	this.chain.onFile(this.name)
	this.state = 'done'
	this.chain.tick()
}

function taskFindDir() {
	if (this.state == 'cancel') {
		this.state = 'canceled'
		return
	}
	if (this.state == 'active') {
		this.state = 'done'
		this.chain.onDir(this.name)
		var list = fs.readdirSync(this.name)
		for (var i = 0; i < list.length; i++) {
			this.chain.tasks.push({
				task: taskFindItem, chain: this.chain, name: this.name + '/' + list[i]
			})
		}
		this.chain.tick()
	}
}

function taskFindItem() {
	if (this.state == 'cancel') {
		this.state = 'canceled'
		return
	}
	try {
		var stat = fs.statSync(this.name)
		if (stat.isFile() == true) {
			this.task = taskFindFile.bind(this)
		} else if (stat.isDirectory() == true) {
			this.task = taskFindDir.bind(this)
		} else log('what is this:', this.name), this.state = 'canceled' // unknown inode
	} catch (e) { this.state = 'canceled' }
	this.chain.tick()
}


TSearch = kindof(TObject)
TSearch.can.init = function(hand) {
	var c = TChain.create()
	c.onPaint = function() {  }
	c.onTask = function() {  }
	c.onFinish = function() {  }
	c.search = this
	this.chain = c
}

TSearch.can.start = function(hand) {
	this.hand = hand
	this.chain.tasks.push({ task: taskFindItem, chain: this.chain, name: hand.startDir })
	this.chain.tick()
}


TResults = kindof(TList)
TResults.can.init = function() {
	dnaof(this)
	this.name = 'TResults'
	this.columns = 1
	this.showFocused = true
	this.sid = 0
//	this.react(0, keycode.ENTER, this.onEnter
}

TFindWindow = kindof(TWindow)
TFindWindow.can.init = function(startDir) {
	dnaof(this)
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
	this.react(0, keycode.ESCAPE, this.close)
	this.react(0, keycode.ENTER, this.startSearch)
	this.react(0, keycode.UP, this.results.moveCursor.bind(this.results), {arg:'up'})
	this.react(0, keycode.DOWN, this.results.moveCursor.bind(this.results), {arg:'down'})
	this.bottom_title = 'для поиска в содержимом файлов начните запрос с кавычек \' или " '
	this.history = []
}

TFindWindow.can.size = function(w, h) {
	dnaof(this, w, h)
	this.input.size(w - 2, 1)
	this.input.pos(1, h - 2)
	this.results.size(w - 2, h - 3)
	this.results.pos(1, 1)
}

TFindWindow.can.onDir = function(file) {
	this.scanned++
}

TFindWindow.can.onFile = function(file) {
	var q = this.query, match = false
	this.scanned++
	var name = file.split('/').pop()
	if (this.contents) {
		try { var size = fs.statSync(file).size } catch (e) { return }
		if (size < 100 * 1024) var s = fs.readFileSync(file).toString()
		if (s) match = s.indexOf(q) >= 0
	} else if (name.indexOf(q) >= 0) {
		match = true
	}
	if (match) {
		this.matched++
		if (file.length > this.w - 1)
			file = file.substr(this.startDir.length + 1, file.length)
		this.results.items.push({ name: pathCompress(file, this.results.w - 1) })
		this.results.sid = this.results.items.length - 1
		this.results.scrollIntoView()
		this.repaint()
	}
}

TFindWindow.can.onFinish = function() {
	this.repaint()
}

TFindWindow.can.title = function() {
	if (this.matched) return 'Найдено: ' + this.matched + ' в ' + this.scanned + ' просмотреных'
	return 'Поиск файлов'
}

TFindWindow.can.startSearch = function() {
	this.results.clearItems()
	this.scanned = 0
	this.matched = 0
	this.contents = false
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

TNorton.can.userFindModal = function() {
	if (this.find == undefined)
		this.find = TFindWindow.create(this.actor.list.path)
	this.find.pos(5, 3)
	this.find.size(this.w - 10, this.h - 6)
	this.getDesktop().showModal(this.find)
}

