require('./lexer')
//actor==panel cursor->actor
fs = require('fs');

TODO = false
log = console.log

require('dnaof')

glxwin = require('./glxwin/glxwin.js')
//var w = TGLXWin.create(undefined, '/usr/share/fonts/truetype/ttf-dejavu/DejaVuSansMono.ttf')
//for (var i = 0; i < 2000; i++)
// console.log(glxwin.clipGet())
//return
require('./intervision')
require('./panel')
require('./fileman')
require('./console')
require('./copier')

TController = kindof(TDesktop)

TController.can.init = function(W, H) {
	dnaof(this)
/*	this.main = TList.create()
	for (var i = 100; i < 320; i++) this.main.items.push(i + '')
	for (var i = 0; i < this.main.items.length; i++) this.main.items[i] = {name: this.main.items[i]}
	this.main.size(30, 20)
	this.main.pos(0, 0)
	this.add(this.main)
	*/
/*	this.main = TFileList.create()
	this.main.size(30, 20)
	this.main.pos(0, 0)
	this.add(this.main)
	this.main.load('/')*/

//	var f = '/v/deodar/intervision/tool.js'
////	f = 'lexer.js'
//	this.main = TModalTextView.create(this, f, TEdit, getColor.editor)
//	this.main.size(30, 20)
//	this.main.pos(0, 0)
//	this.add(this.main)
//	this.main.viewer.text.L = fs.readFileSync(f).toString().split('\n')
//	this.main.viewer.para = 2
//	this.main.viewer.sym = 3
//	this.main.viewer.sel.start(0, 3)
//	this.main.viewer.sel.end(2, 3)
//	this.main.viewer.targetX = 2
//
	

	this.main = TInputAndPanels.create(W, H)
	this.main.name = 'Деодар'
	this.main.pos(0, 0)
	this.add(this.main)
}

TController.can.size = function(w, h) {
	dnaof(this, w, h)
	this.main.size(w, h)
}

TController.can.onMouse = function(hand) {
	return dnaof(this, hand)
}

var TDeodar = kindof(TGLXVision)

TDeodar.can.init = function() {
	dnaof(this, TController, 80, 24)//0, 0, 800, 600)
	DESK = this.desktop
}

var A = TDeodar.create()
A.show()
//startCopyFile(A.desktop)
glxwin.mainLoop()

/* TODO:
-- groupers (like folding with files in cur dir, and also open subdirs as folds)
-- input line advanced
-- f3 f4
-- cntrl+o
-- select
-- f6
-- f7 f8
-- alt-f1 alt-f2 (f1-f2 = menu is drive menu!!)
-- mouse
-- colorize whole panel on hint and show message in a middle
-- control-down alphabet next (with 5 minimum)
-- control-A select all (files)
-- ctl-e expand input line to editor
-- blink cursor
-- async load of file list
-- search in files (Alt+F7)
-- compare dirs
-- sort by length of name! 'a bb ccc dddd' etc
-- track file system changes
-- quick search: match and no-match must look different
-- alt-f2 должно открывать ту же папку если тот же "диск"
-- Contorl-L инфа в противоположной панели
-- Control Left, Control Right вместо Alt-F1, Alt-F2
-- copy/rename to *.ext or name.* should work!
-- safer move: do not del() if copy() failed
-- копируя файлы сокращать длинные названия как в муз-плеере
-- copy .. not working
-- reload must not clear selection
-- archives
-- column +-: keep a focused item in a screen center
-- set date/time dialog
-- gl-clocks на всё окно при бездействии
-- засекать нтфс-фат разделы и подключать к меню
-- дву кнопки внизу между панелями (на рамках) с содержимым клипобордов
-- control-\ from subst
-- colorize input line and output command

Плюсы использования православного коммандера:

-- мгновнное время отклика составляющее микросекунды для большинства задач
-- возможность перемещаться по диску со скоростью намного недоступной в виджетовых файл-менеджерах
-- возможность не пользоваться мышью
--
*/

