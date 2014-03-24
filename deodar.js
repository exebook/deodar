/*
	Срочно
	
	создать файл
	перенос файлов
	поиск в редакторе
	поиск в файлах
	клипборд
	инфо панель
	квик
	номера строк в редакторе (на пустых строках?)
	настройки в файле
	детальный список
	скрол в терминале
	запуск програм в бакграунде(опера например)
	сохранить да/нет
*/


spawn = require('child_process').spawn
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
require('./editfile')
require('./makedir')
require('./filedel')
require('./fileman')
require('./console')
require('./file/copyfile')
require('./file/copydir')
require('./file/copier')

var enterRule = [ { ext: 'coffee', tty: 'coffee' } ,{ ext: 'js', tty: 'node' }, { ext: 'atr', tty: 'atari800' }
, { ext: 'jpg', spawn: 'xdg-open'}
, { ext: 'avi', spawn: 'xdg-open'}
, { ext: 'wmv', spawn: 'xdg-open'}
, { ext: 'mov', spawn: 'xdg-open'}
, { ext: 'mkv', spawn: 'xdg-open'}
, { ext: 'mp3', spawn: 'xdg-open'}
, { ext: 'ogg', spawn: 'xdg-open'}
, { ext: 'png', spawn: 'xdg-open'}
 ]

applyEnterRules = function(s) {
	for (var i = 0; i < enterRule.length; i++) {
		var e = enterRule[i]
		var x = '.' + e.ext
		var j = s.indexOf(x)
		if (j >= 0 && j == s.length - x.length) {
			if (e.tty) return { tty: e.tty, name: s }
			if (e.spawn) return { spawn: e.spawn, name: s }
			return { name: s }
		}
	}
}

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
//	this.add(this.main)
//	this.main.size(30, 20)
//	this.main.pos(0, 0)
//	this.main.viewer.text.L = fs.readFileSync(f).toString().split('\n')
//	this.main.viewer.multiLine = false
////	this.main.viewer.setText('abc')
//	this.main.viewer.para = 0
//	this.main.viewer.sym = 3
//	this.main.viewer.sel.start(0, 3)
//	this.main.viewer.sel.end(0, 0)
//	this.main.viewer.targetX = 2

	this.main = TNorton.create(W, H)
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
	dnaof(this, TController, 110, 33)//0, 0, 800, 600)
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
-- возможность сортировать так чтобы отредактированые файлы были сверху для удобства програмиста
-- reload после команд не обновляет размеры файлов

Плюсы использования "православного" коммандера:

-- мгновнное время отклика составляющее микросекунды для большинства задач
-- возможность перемещаться по диску со скоростью намного недоступной в виджетовых файл-менеджерах
-- возможность не пользоваться мышью
--
*/

