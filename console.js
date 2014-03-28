var Terminal = require('./terminal.js');
// git clone https://github.com/c3ks/terminal.js

require('./concolor.js')
var concolor = consoleColors;
var pty = require('pty.js');

function cvt(s) {
	var f = Math.round
	var r = f(parseInt(s.substr(1, 2), 16)/16)
	var g = f(parseInt(s.substr(3, 2), 16)/16)
	var b = f(parseInt(s.substr(5, 2), 16)/16)
	var x = (b << 8) + (g << 4) + r
	return x
}

for (var i = 0; i < concolor.length; i++) {
	concolor[i] = cvt(concolor[i])
}
concolor[7] = getColor.console[0]
concolor[16] = getColor.console[1]

THolder = kindof(TGroup)
THolder.can.draw = function(state) {
	TView.can.draw.apply(this, state)
	dnaof(this, state)
}

TConsole = kindof(TView)

TConsole.can.init = function() {
	dnaof(this)
	this.termsize = function() {
		//if (this instanceof TWindow) return {w: this.w - 2, h: this.h - 2}
		//else 
		return {w:this.w, h:this.h}
	}
	var me = this
	this.pal = getColor.console
	//[].concat(this.pal)
	//this.pal[1] = 0
	this.size(1, 1)
	this.terminal = new Terminal(1, 1, '');
	this.terminal.buffer.setMode('crlf',true);
	this.terminal.buffer.on('lineremove', function(lineno) {
		me.saveScrollLine(lineno)
	})
	this.sel = TSelection.create()
//	var O = this.terminal.writer
//	for (var i in O) log(i, typeof O[i])
	this.defaultTitle = 'terminal'
	this.title = this.defaultTitle
	this.scrollBuf = []
	this.scrollMax = 4096
	this.scrollDelta = 0
	this.react(0, keycode.UP, this.specialKey, { arg: 'up' })
	this.react(0, keycode.DOWN, this.specialKey, { arg: 'down' })
	this.react(0, keycode.LEFT, this.specialKey, { arg: 'left' })
	this.react(0, keycode.RIGHT, this.specialKey, { arg: 'right' })
//	this.react(100, keycode.LEFT, this.specialKey, { arg: '^left' })
//	this.react(100, keycode.RIGHT, this.specialKey, { arg: '^right' })
	this.react(0, keycode.INSERT, this.specialKey, { arg: 'insert' })
	this.react(0, keycode.DELETE, this.specialKey, { arg: 'delete' })
	this.react(0, keycode.HOME, this.specialKey, { arg: 'home' })
	this.react(0, keycode.END, this.specialKey, { arg: 'end' })
	this.react(0, keycode.PAGE_UP, this.specialKey, { arg: 'pageup' })
	this.react(0, keycode.PAGE_DOWN, this.specialKey, { arg: 'pagedown' })
	this.react(0, keycode.F1, this.specialKey, { arg: 'f1' })
	this.react(0, keycode.F2, this.specialKey, { arg: 'f2' })
	this.react(0, keycode.F3, this.specialKey, { arg: 'f3' })
	this.react(0, keycode.F4, this.specialKey, { arg: 'f4' })
	this.react(0, keycode.F5, this.specialKey, { arg: 'f5' })
	this.react(0, keycode.F6, this.specialKey, { arg: 'f6' })
	this.react(0, keycode.F7, this.specialKey, { arg: 'f7' })
	this.react(0, keycode.F8, this.specialKey, { arg: 'f8' })
	this.react(0, keycode.F9, this.specialKey, { arg: 'f9' })
	this.react(0, keycode.F10, this.specialKey, { arg: 'f10' })
	this.react(0, keycode.F11, this.specialKey, { arg: 'f11' })
	this.react(0, keycode.F12, this.specialKey, { arg: 'f12' })
	this.react(1, keycode.INSERT, this.commandPaste)
	
//	this.react(1, keycode.PAGE_UP, this.scrollHistory, { arg: 'up' })
//	this.react(1, keycode.PAGE_DOWN, this.scrollHistory, { arg: 'down' })
}

TConsole.can.commandPaste = function() {
	if (typeof clipboardGet == 'undefined') return true
	var me = this
	function on(text) {
		me.term.write(text)
		me.repaint()
	}
	clipboardGet(on)
	return true
}

TConsole.can.log = function() {
	var s = Array.prototype.slice.apply(arguments)
	s = s.join(' ')
//	s = '\u001b[01;32m' + cwd + '\u001b[01;34m' +s+'\u001b[00m'
	this.terminal.writer.write(s + '\n')
	this.repaint()
}

TConsole.can.colorLog = function() {
	var s = Array.prototype.slice.apply(arguments)
	s += '^0'
	for (var i = 0; i < 8; i++) {
		var x = new RegExp('\\^' + i, 'g')
		s = s.replace(x, '\u001b[01;3' + i + 'm')
	}
//	s = s.replace(/\^0/g, '\u001b[00m')
	this.terminal.writer.write(s + '\n')
}

TConsole.can.errorLog = function() {
	var s = Array.prototype.slice.apply(arguments)
	this.colorLog('^1' + s)
}

TConsole.can.respawn = function(cmd, args, cwd, callback) {
	if (this.working()) return false
	var me = this
	var wh = me.termsize()
	var s = '\u001b[01;32m' + cwd + '\u001b[00m>\u001b[01;34m' + cmd + '\u001b[00m'
	this.terminal.writer.write(s + '\n')

	if (cmd.indexOf('ls') == 0) cmd = cmd.replace(/^ls\b/, 'ls --color')
	args = []
	args.unshift(cmd)
	args.unshift('-c')
	cmd = 'bash'
//	args = cmd.split(' ')
//	cmd = args.shift()
	if (cwd == undefined) cwd = process.env.HOME
//	process.chdir(cwd)
	this.lastCmd = cmd
	this.term = pty.spawn(cmd, args, { 
		name: 'xterm-color', cols: wh.w, rows: wh.h, cwd: cwd, env: process.env });
	this.term.on('error', function(a) {})
	this.term.on('close', function(a) {})
	this.term.on('data', function(Data) {
		me.terminal.writer.write(Data)
		me.title = me.term.process
		me.repaint()
	});
	this.term.on('exit', function(Data) {
//		me.fitSize()
		me.title = me.defaultTitle
		me.repaint()
		if (callback != undefined) callback()
	});
}

TConsole.can.kill = function() {
	try {
		process.kill(this.term.pid, 'SIGKILL')
		this.errorLog('\n\n\n\nПопытка прервать процесс:', this.term.pid, this.lastCmd, 'и все его подпроцессы')
	} catch (e) {
		log(e)
	}
}

TConsole.can.working = function() {
	if (this.term == undefined) return false
	return this.term.readable || this.term.writable;
}

TConsole.can.specialKey = function(cmd) {
	var key
	if (cmd == 'up') {
		key = '\x1b[A'
		key = '\x1bOA'
	} else if (cmd == 'down') {
		key = '\x1b[B'
		key = '\x1bOB'
	} else if (cmd == 'left') {
        key = '\x1bOD'; //appcursor SS3 as ^[O for 7-bit
        //key = '\x8fD'; // appcursor SS3 as 0x8f for 8-bit
//      key = '\x1b[D'
	} else if (cmd == 'right') {
        key = '\x1bOC' // appcursor
//      key = '\x1b[C'
	} else if (cmd == 'delete') { key = '\x1b[3~' 
	} else if (cmd == 'insert') { key = '\x1b[2~'
	} else if (cmd == 'home') {
	 // key = '\x1bOH'//if keypad
      key = '\x1bOH'
	} else if (cmd == 'end') {
      key = '\x1bOF'// if keypad
      key = '\x1bOF'
	} else if (cmd == 'pageup') { key = '\x1b[5~'
	} else if (cmd == 'pagedown') { key = '\x1b[6~'
	} else if (cmd == 'f1') { key = '\x1bOP'
	} else if (cmd == 'f2') { key = '\x1bOQ'
	} else if (cmd == 'f3') { key = '\x1bOR'
	} else if (cmd == 'f4') { key = '\x1bOS'
	} else if (cmd == 'f5') { key = '\x1b[15~'
	} else if (cmd == 'f6') { key = '\x1b[17~'
	} else if (cmd == 'f7') { key = '\x1b[18~'
	} else if (cmd == 'f8') { key = '\x1b[19~'
	} else if (cmd == 'f9') { key = '\x1b[20~'
	} else if (cmd == 'f10') { key = '\x1b[21~'
	} else if (cmd == 'f11') { key = '\x1b[23~'
	} else if (cmd == 'f12') { key = '\x1b[24~'
	}

	this.term.write(key)      
	this.getDesktop().display.caretReset()
	return true
}

TConsole.can.onKey = function(k) {
	if (dnaof(this, k)) return;
	if (k.char != undefined) {
		this.term.write(k.char)
		this.repaint()
		this.getDesktop().display.caretReset()
		return
	}
}

TConsole.can.scrollHistory = function(arg) {
	if (arg == 'home') this.scrollDelta = 0
	if (arg == 'up') this.scrollDelta += this.h >> 1
	if (arg == 'down') this.scrollDelta -= this.h >> 1
	if (this.scrollDelta < 0) this.scrollDelta = 0
	if (this.scrollDelta > this.scrollBuf.length - 1 - this.h) 
		this.scrollDelta = this.scrollBuf.length - 1 - this.h
	this.repaint()
	return true
}

TConsole.can.saveScrollLine = function(line) {
	var S = this.terminal.buffer._buffer.str
	var A = this.terminal.buffer._buffer.attr
	this.scrollBuf.push({ str: S[line] + '', attr: [].concat(A[line]) })
	while (this.scrollBuf.length > this.scrollMax) this.scrollBuf.splice(0, 1)
}

TConsole.can.getLine = function(line) {
	if (line >= 0) return {
		str: this.terminal.buffer._buffer.str[line],
		attr: this.terminal.buffer._buffer.attr[line]
	}
	var Y = this.scrollBuf.length + line
	return this.scrollBuf[Y - 1]
}

TConsole.can.draw = function(state) {
	dnaof(this, state)
	var S = this.terminal.buffer._buffer.str
	var A = this.terminal.buffer._buffer.attr
	var sel = this.sel.get(), s, a
	for (var Y = 0; Y < this.terminal.buffer.height; Y++) {
		if (Y >= this.h - 0) break
		var y = Y - this.scrollDelta, L = this.getLine(Y - this.scrollDelta)
		s = L.str, a = L.attr
		if (s == undefined) continue
		var F, B, f = 7, b = 0
		B = concolor[16]
		F = concolor[7]
		for (var x = 0; x < this.terminal.buffer.width; x++) {
			if (x >= s.length) break;
			var ch = s.charAt(x)
			if (a != undefined) {
				if (a[x] != undefined) {
					if (a[x].fg != null) f = a[x].fg
					if (a[x].bg != null) B = concolor[a[x].bg]; else B = concolor[16]
					var bold = (a[x].bold == true)
					if (bold) F = concolor[f + 8]; else
					F = concolor[f]
				}
			}
			var fc = F, bc = B
			if (sel) {
				if (Y >= sel.a.y && Y <= sel.b.y) {
					if (sel.a.y != sel.b.y || (x >= sel.a.x && x <= sel.b.x)) 
						bc = concolor[7], fc = concolor[0]
				}
			}
			this.set(x, Y, ch, fc, bc)
		}
	}
	if (state.focused)  with(this.terminal.buffer.cursor) this.caret = { x: x, y: y }
}

TConsole.can.fitSize = function() {
	var w = this.w, h = this.h
	try {
		if (this.terminal != undefined) {
			this.terminal.buffer.resize(w, h)
			this.terminal.buffer.setCursor(0, h-2)
		}
	} catch (e) { log('Console buffer resize failure:', e) }
	if (this.term != undefined && this.working()) {
		try { this.term.resize(w, h) } catch (e) {
			log(e)
		}
	}
}

TConsole.can.size = function(w, h) {
	dnaof(this, w, h)
	this.fitSize()
}

TConsole.can.copyTextBlock = function(B) {
	var txt = []
	for (var Y = B.a.y; Y <= B.b.y; Y++) {
		var s = this.getLine(Y - this.scrollDelta).str
		if (B.a.y == B.b.y) s = s.substr(B.a.x, B.b.x - B.a.x + 1)
		txt.push(s)
	}
	clipboardSet(txt.join('\n'))
}

TConsole.can.onCursor = function(hand) {
	this.sel.end(hand.y, hand.x)
	return true
}

TConsole.can.onMouse = function(hand) {
	if (hand.button == 3) {
		this.scrollHistory(hand.down ? 'down' : 'up')
	}
	if ((hand.button == 0 || hand.button == 3) && this.working() == false) {
		this.parent.actor = this.fileman.input
		return
	}
	if (hand.down && hand.button == 1) {
		this.sel.start(hand.y, hand.x)
		return true
	}
	if (hand.down == false && hand.button == 1) {
		if (!this.sel.clean()) this.copyTextBlock(this.sel.get())
		this.sel.clear()
		if (this.working() == false) 
			this.parent.actor = this.fileman.input
		return true
	}
	return true
}
