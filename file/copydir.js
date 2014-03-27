taskDelDir = function() {
	var me = this
	var idir = me.idir +'/'+ me.iname
	try { fs.rmdirSync(idir) } catch (e) { log('каталог не хочет удаляться'), log(e) }
	me.state = 'done'
	me.chain.tick()
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
//			me.chain.tasks.push({ task: taskDelDir, chain: me.chain, op: me.op, idir: idir })
		me.chain.progress.total.max += list.length
		if (list.length > 0) {
			me.chain.tasks[me.chain.tasks.length - 1].id = me.id
			me.id = undefined
		}
		if (me.op == 'move') { me.state = 'pending', me.task = taskDelDir }
		else me.state = 'done'
	}
	me.chain.tick()
	return
}
