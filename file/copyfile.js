var copyBufferSize = 1024*1024, buffersToYield = 10

// --- copy emulation to test progress bar ---
function taskCopyFileEmulate() {
	if (this.state == 'cancel') {
		this.state = 'canceled'
		this.chain.tick()
		return
	} else if (this.state == 'active') {
		if (this.progress == undefined) {
			this.progress = 0
			this.chain.progress.file.pos = 0
			this.chain.progress.file.max = 5
			this.ifile = this.idir +'/'+ this.iname, this.ofile = this.odir
		}
		this.progress++
		this.chain.progress.file.pos = this.progress
		if (this.progress == 5) {
			this.state = 'done'
		}
		this.chain.tick()
		return
	}
	log('error: unknown state'), this.chain.cancel()
}
// --- copy emulation to test progress bar ---

function cancelMe(me) {
	if (me.fin && me.fin >= 0) fs.closeSync(me.fin)
	if (me.fout && me.fout >= 0) {
		fs.closeSync(me.fout)
		fs.unlinkSync(me.ofile)
	}
	me.state = 'canceled'
	me.chain.tick()
	return false
}

function initCopy(me) {
	me.ifile = me.idir +'/'+ me.iname
	me.ofile = me.odir +'/'+ me.oname
	me.progress = 0
	me.buf = new Buffer(copyBufferSize)
	me.fpos = 0
	try {
		var stat = fs.statSync(me.ifile)
		me.fin = fs.openSync(me.ifile, 'r')
		me.fsize = stat.size
	} catch (e) { return cancelMe(me) }
	try { me.fout = fs.openSync(me.ofile, 'w') } 
	catch (e) { return cancelMe(me) }
	me.yield = 0
	me.chain.progress.file.pos = 0
	me.chain.progress.file.max = me.fsize
	me.chain.progress.filename.title = me.iname
	return true
}

taskDelFile = function() {
	var me = this
	if (me.state == 'active') {
		try { fs.unlinkSync(me.ifile) } catch (e) { log('что то с удалением') }
		me.state = 'done'
	} else { me.state = 'canceled', log('taskDelFile странно себя ведёт') }
	me.chain.tick()
}

taskCopyFile = function() {
	var me = this
	if (me.state == 'cancel') { return cancelMe(me) } 
	else if (me.state == 'active') {
		if (me.fsize == undefined) if (initCopy(me) == false) return
		nextRead()
		return
	}
	log('copy error: unknown state')
	return cancelMe(me) // should not reach here
	
	function nextRead() {
		fs.read(me.fin, me.buf, 0, copyBufferSize, me.fpos, readDone)
	}
	function readDone(err, bytesRead, buf) {
		if (err) return cancelMe(me)
		fs.write(me.fout, buf, 0, bytesRead, me.fpos, writeDone)
	}
	function writeDone(err, written, buf) {
		if (err) return cancelMe(me)
		me.fpos += written
		me.chain.progress.file.pos = me.fpos
		if (me.fpos == me.fsize) {
			me.state = 'done'
			fs.closeSync(me.fin)
			fs.closeSync(me.fout)
			if (me.op == 'move') {
				me.state = 'active'
				me.task = taskDelFile
			}
			me.chain.tick()
			return
		}
		me.yield++
		if (me.yield == buffersToYield) {
			me.yield = 0
			me.chain.tick()
			return
		}
		nextRead()
	}
}

