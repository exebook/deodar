// цепочка задач, задачи кладутся в ряд tasks в виде записей
// каждая запись должна иметь .task и реагировать на .state
// через this.chain задача может общаться с окнами
// функция task должна реагировать на 'cancel'
// если надо запустить подзадачу, она кладётся в конец tasks
// а задача родитель помечается указом state = 'pending'
// когда все задачи созданые после ней завершатся, она будет снова запущена

TChain = kindof(TObject)
TChain.can.init = function() {
	dnaof(this)
	this.tasks = []
	this.pos = 0
}
var x = 0
TChain.can.next = function() {
	if (this.paused) return
	this.onPaint()
	if (this.pos == this.tasks.length) {
		for (var i = this.tasks.length - 1; i >= 0; i--) {
			if (this.tasks[i].state == 'pending') { this.tasks[i].state = 'active', this.pos = i; break }
		}
	}
	if (this.pos == this.tasks.length) {
		this.onFinish()
		return
	}
	var T = this.tasks[this.pos]
	if (T.state == undefined) {
		T.state = 'active'
		T.chain = this
		T.task = T.task.bind(T)
	}
	
	if (T.state == 'done') {
		this.onTask(T)
		this.tasks.splice(this.pos, 1)
		this.tick()
	} else if (T.state == 'canceled') {
		this.pos++
		this.onTask(T)
		this.tick()
	} else if (T.state == 'active') {
		T.task()
	} else if (T.state == 'pending') {
		this.pos++
		this.tick()
	} else if (T.state == 'cancel') {
		T.task()
	}
}


TChain.can.pause = function(){
	this.paused = true
}


TChain.can.resume = function(){
	this.paused = false
	this.tick()
}

TChain.can.cancel = function() {
	this.tasks.splice(this.pos + 1, this.tasks.length - this.pos - 1)
	var T = this.tasks[this.pos]
	if (T) {
		if (T.state == 'active') T.state = 'cancel'
		else {
			this.tasks.splice(this.pos, 1)
		}
	}
	this.tasks = []
	this.pos = 0
}

TChain.can.tick = function() {
	setImmediate(this.next.bind(this))
//	setTimeout(this.next.bind(this), 100)
}

