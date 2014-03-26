function noCopyIntoSelf(idir, odir) {
}

taskCopyDir = function() {
	var me = this
	// проверим самосебяние
	var recur = false, ridir, rodir
	ridir = fs.realpathSync(me.idir +'/'+ me.iname)
	try {
		rodir = fs.realpathSync(me.odir +'/'+ me.oname)
	} catch (e) {
		rodir = fs.realpathSync(me.odir)
	}
	recur = ((rodir + '/').indexOf(ridir + '/') == 0)

	var idir = me.idir +'/'+ me.iname
	var odir = me.odir +'/'+ me.oname
	if (recur) {
		log('стопка (каталог) не пишется сама в себя')
		me.state = 'canceled'
		me.chain.tick()
		return
	}

me.state = 'canceled'
me.chain.tick()
return
	
		if (!fs.existsSync(odir)) {
		try {
			fs.mkdirSync(odir)
		} catch (e) {
			log('не создаётся ёмкость куда')
			me.state = 'canceled'
			me.chain.tick()
			return
		}
	}
	if (me.state == 'cancel') {
		me.state = 'canceled'
	} else if (me.state == 'active') {
		var list = fs.readdirSync(idir)
		for (var i = 0; i < list.length; i++) {
			me.chain.tasks.push({
				task: taskCopyItem, chain: me.chain, iname: list[i], oname: list[i], 
				op: me.op, idir: idir, odir: odir
			})
		}
		me.chain.progress.total.max = me.chain.tasks.length
		if (list.length > 0) {
			me.chain.tasks[me.chain.tasks.length - 1].id = me.id
			me.id = undefined
		}
		me.state = 'done'
	}
	me.chain.tick()
	return
}
