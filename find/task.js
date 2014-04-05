function taskFindFile() {
	if (this.state == 'cancel') {
		this.state = 'canceled'
		this.chain.tick()
		return
	}
	this.chain.onFile(this.name)
	this.state = 'done'
	this.chain.tick()
}

function taskFindDir() {
	if (this.state == 'cancel') {
		this.state = 'canceled'
		this.chain.tick()
		return
	}
	if (this.state == 'active') {
		this.state = 'done'
		var processDir = this.chain.onDir(this.name)
		if (processDir) {
			try {
				var list = fs.readdirSync(this.name)
				for (var i = 0; i < list.length; i++) {
					this.chain.tasks.push({
						task: taskFindItem, chain: this.chain, name: this.name + '/' + list[i]
					})
				}
			} catch (e) { 'пропуск' }
		}
		this.chain.tick()
	}
}

function taskFindItem() {
	if (this.state == 'cancel') {
		this.state = 'canceled'
		this.chain.tick()
		return
	}
	try {
		var stat = fs.lstatSync(this.name)
		if (stat.isFile() == true) {
			this.task = taskFindFile.bind(this)
		} else if (stat.isDirectory() == true) {
			this.task = taskFindDir.bind(this)
		} else this.state = 'done' // пропуск других inode
	} catch (e) { this.state = 'done' }
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
	var s = fs.realpathSync(hand.startDir)
	this.chain.tasks.push({ task: taskFindItem, chain: this.chain, name: s })
	this.chain.tick()
}



