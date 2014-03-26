var Terminal = require('./terminal.js');
// terminal отсюда:
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
	this.pal = getColor.console
	//[].concat(this.pal)
	//this.pal[1] = 0
	this.size(1, 1)
	this.terminal = new Terminal(1, 1, '');
	this.terminal.buffer.setMode('crlf',true);
//	var O = this.terminal.writer
//	for (var i in O) log(i, typeof O[i])
	this.defaultTitle = 'terminal'
	this.title = this.defaultTitle
	this.scrollBuf = []
	this.scrollMax = 4096
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
	this.term = pty.spawn(cmd, args, { 
		name: 'xterm-color', cols: wh.w, rows: wh.h, cwd: cwd, env: process.env });
	this.term.on('error', function(a) {})
	this.term.on('close', function(a) {})
	this.terminal.buffer.on('lineremove', this.saveScrollLine.bind(this))
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

TConsole.can.saveScrollLine = function(line) {
	var S = this.terminal.buffer._buffer.str
	var A = this.terminal.buffer._buffer.attr
//	log(S[line])
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

TConsole.can.onMouse = function(hand) {
	if (this.working() == false) {
		this.parent.actor = this.fileman.input
		return
	}
	return dnaof(this, hand)
}

TConsole.can.draw = function(state) {
	dnaof(this, state)
	var S = this.terminal.buffer._buffer.str
	var A = this.terminal.buffer._buffer.attr
	for (var y = 0; y < this.terminal.buffer.height; y++) {
		if (y >= this.h - 0) break
		if (S[y] == undefined) continue
		var s = S[y], a = A[y]
		var F = concolor[7], B = concolor[16], f = 7, b = 0
		for (var x = 0; x < this.terminal.buffer.width; x++) {
			if (x >= s.length) break;
			var ch = s.charAt(x)
			if (a != undefined) {
				if (a[x] != undefined) {
					if (a[x].fg != null) f = A[y][x].fg
					if (a[x].bg != null) B = concolor[A[y][x].bg]; else B = concolor[16]
					var bold = (a[x].bold == true)
					if (bold) F = concolor[f + 8]; else
					F = concolor[f]
				}
			}
			this.set(x, y, ch, F, B)
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

/*
Terminal.prototype.keyDown = function(ev) {
  var self = this
    , key;

  switch (ev.keyCode) {
    // backspace
    case 8:
      if (ev.shiftKey) {
        key = '\x08'; // ^H
        break;
      }
      key = '\x7f'; // ^?
      break;
    // tab
    case 9:
      if (ev.shiftKey) {
        key = '\x1b[Z';
        break;
      }
      key = '\t';
      break;
    // return/enter
    case 13:
      key = '\r';
      break;
    // escape
    case 27:
      key = '\x1b';
      break;
    // left-arrow
    case 37:
      if (this.applicationCursor) {
        key = '\x1bOD'; // SS3 as ^[O for 7-bit
        //key = '\x8fD'; // SS3 as 0x8f for 8-bit
        break;
      }
      key = '\x1b[D';
      break;
    // right-arrow
    case 39:
      if (this.applicationCursor) {
        key = '\x1bOC';
        break;
      }
      key = '\x1b[C';
      break;
    // up-arrow
    case 38:
      if (this.applicationCursor) {
        key = '\x1bOA';
        break;
      }
      if (ev.ctrlKey) {
        this.scrollDisp(-1);
        return cancel(ev);
      } else {
        key = '\x1b[A';
      }
      break;
    // down-arrow
    case 40:
      if (this.applicationCursor) {
        key = '\x1bOB';
        break;
      }
      if (ev.ctrlKey) {
        this.scrollDisp(1);
        return cancel(ev);
      } else {
        key = '\x1b[B';
      }
      break;
    // delete
    case 46:
      key = '\x1b[3~';
      break;
    // insert
    case 45:
      key = '\x1b[2~';
      break;
    // home
    case 36:
      if (this.applicationKeypad) {
        key = '\x1bOH';
        break;
      }
      key = '\x1bOH';
      break;
    // end
    case 35:
      if (this.applicationKeypad) {
        key = '\x1bOF';
        break;
      }
      key = '\x1bOF';
      break;
    // page up
    case 33:
      if (ev.shiftKey) {
        this.scrollDisp(-(this.rows - 1));
        return cancel(ev);
      } else {
        key = '\x1b[5~';
      }
      break;
    // page down
    case 34:
      if (ev.shiftKey) {
        this.scrollDisp(this.rows - 1);
        return cancel(ev);
      } else {
        key = '\x1b[6~';
      }
      break;
    // F1
    case 112:
      key = '\x1bOP';
      break;
    // F2
    case 113:
      key = '\x1bOQ';
      break;
    // F3
    case 114:
      key = '\x1bOR';
      break;
    // F4
    case 115:
      key = '\x1bOS';
      break;
    // F5
    case 116:
      key = '\x1b[15~';
      break;
    // F6
    case 117:
      key = '\x1b[17~';
      break;
    // F7
    case 118:
      key = '\x1b[18~';
      break;
    // F8
    case 119:
      key = '\x1b[19~';
      break;
    // F9
    case 120:
      key = '\x1b[20~';
      break;
    // F10
    case 121:
      key = '\x1b[21~';
      break;
    // F11
    case 122:
      key = '\x1b[23~';
      break;
    // F12
    case 123:
      key = '\x1b[24~';
      break;
    default:
      // a-z and space
      if (ev.ctrlKey) {
        if (ev.keyCode >= 65 && ev.keyCode <= 90) {
          // Ctrl-A
          if (this.screenKeys) {
            if (!this.prefixMode && !this.selectMode && ev.keyCode === 65) {
              this.enterPrefix();
              return cancel(ev);
            }
          }
          // Ctrl-V
          if (this.prefixMode && ev.keyCode === 86) {
            this.leavePrefix();
            return;
          }
          // Ctrl-C
          if ((this.prefixMode || this.selectMode) && ev.keyCode === 67) {
            if (this.visualMode) {
              setTimeout(function() {
                self.leaveVisual();
              }, 1);
            }
            return;
          }
          key = String.fromCharCode(ev.keyCode - 64);
        } else if (ev.keyCode === 32) {
          // NUL
          key = String.fromCharCode(0);
        } else if (ev.keyCode >= 51 && ev.keyCode <= 55) {
          // escape, file sep, group sep, record sep, unit sep
          key = String.fromCharCode(ev.keyCode - 51 + 27);
        } else if (ev.keyCode === 56) {
          // delete
          key = String.fromCharCode(127);
        } else if (ev.keyCode === 219) {
          // ^[ - escape
          key = String.fromCharCode(27);
        } else if (ev.keyCode === 221) {
          // ^] - group sep
          key = String.fromCharCode(29);
        }
      } else if ((!this.isMac && ev.altKey) || (this.isMac && ev.metaKey)) {
        if (ev.keyCode >= 65 && ev.keyCode <= 90) {
          key = '\x1b' + String.fromCharCode(ev.keyCode + 32);
        } else if (ev.keyCode === 192) {
          key = '\x1b`';
        } else if (ev.keyCode >= 48 && ev.keyCode <= 57) {
          key = '\x1b' + (ev.keyCode - 48);
        }
      }
      break;
  }

  if (!key) return true;

  if (this.prefixMode) {
    this.leavePrefix();
    return cancel(ev);
  }

  if (this.selectMode) {
    this.keySelect(ev, key);
    return cancel(ev);
  }

  this.emit('keydown', ev);
  this.emit('key', key, ev);

  this.showCursor();
  this.handler(key);

  return cancel(ev);
};


*/
