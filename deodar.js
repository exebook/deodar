//        Начальный файл Рабочей Среды "Деодар"
/*
Срочно
	няшные меню+статус бар
	инфо панель
	номера строк в редакторе (на пустых строках?)
	детальный список
	таб дополняет если что то набрано в инпуте
	control-tab для правки между файлами с весами
	сравнение списков
	control-\ не обновляет метку
	*.* *. в переименовке и копировании
	выделение файлов по маске
	home-end в панели работают в строке вводе если набран текст
	память правки, память перемещений, сохранение их, выбор цветов через окно
	как сделать файл исполняемым?
	control-Z для запущеных из input
	после выхода из редактора пропадает выделение файлов
	page-up  в поиске

Подумать
	останавливать ли поиск при запуске редактора
	нужен свой или взятый от системы поиск файлов в путях чтобы запуск
	програмы 'x' в текущей папке знал что запускать /bin/x или ./x (npm search pathfind?)

Ашипки
	правка: показывать // цвет заметок на второй строке свернутых строк
	возврат строчки: разделять добавление и стирание
	после переменования одного файла его надо выделить
	после копирования обновить панель назначения

Идеи
	альт-колесо ходить по меткам
	как бы запоминать sudo
	замораживать курсор при долгой неактивности
	отображать состояние точки на ободке
	если нет в шрифте нужного знака проверить и установить запасной в момент загрузки шрифта
	собрать сводку использования клавиш в правщике
	в правщике при поиск-замена показывать список функций и выбирать одну из них, можно править свою 
	разделить TFileList от TDirList, использовать TFileList в поиске

перестройка
	x11clip основной цикл перенести в пакет	
	

Сделано
	*продолжает удивлять при удалении слова в конце строки
	вклеить в строку ввода многострочный текст
	control-del в правке если удалил только пробелы и табы должен 
		продолжить на след. строке
	зависла (пропала полоска ввода) после запуска gedit через bash+&+bg
	enter  в начале строки косит отступ
	tab в начале строки в правке глючит
	ой а readdir та 32 битный
	sync в конце
	таб в квике
	поиск в файлах
	глобальную горячую клавишу прекратить текущий (зависший) процесс
	скрол в терминале
	квик
	перенос файлов - renameSync? пытаться переменовать а не копировать+стирать
	* сохранить да/нет
	запуск програм в бакграунде(опера например)
	клипборд
	создать файл
	поиск в редакторе
	настройки в файле (запоминание положения)
	проверить control-R в панеле
*/

deodarVersion = {
	label: 'Исходная',
	sub: 'описана установка',
	time: 'Начало 2014',
	abstract: 'Выбрано направление развития, соединены опорные технологии (Xlib, freetype, OpenGL, GLX, Xinput, Xcursor, Node.js, x11clip), созданы основные части, панели, редактор, работа с деревом.',
	people: ['Яков Нивин'],
}

spawn = require('child_process').spawn
//actor==panel cursor->actor
fs = require('fs');
TODO = false
log = console.log
require('./dnaof')
glxwin = require('./glxwin/glxwin.js')
execSync = glxwin.native_sh
require('./lexer')
require('./intervision')
require('./panel')
require('./editfile')
require('./makedir')
require('./file/delfile')
require('./norton')
require('./console')
require('./file/chain')
require('./file/copyfile')
require('./file/copydir')
require('./file/copier')
require('./find/find')
var x11clip = require('./x11clip')

try {
	var dir = expandPath('~/.deodar')
	if (fs.existsSync(dir) == false) fs.mkdirSync(dir)
} catch (e) { log('Не удаётся создать каталог настроек ' + dir, e) }
require('./drivemenu')

clipboardSet = x11clip.copy

clipboardGet = function(callback) {
	x11clip.pasteCallback = callback
	'inter hint clipboardSet'
	x11clip.paste()
}
x11clip.start()
x11clip.mainLoop()

var enterRule = [ 
 { ext: 'asm', tty: 'fasm' },
 { ext: 'coffee', tty: 'coffee' },
 { ext: 'js', tty: 'node' },
 { ext: 'atr', tty: 'atari800' },
 { ext: 'jpg', spawn: 'xdg-open' },
 { ext: 'avi', spawn: 'xdg-open' },
 { ext: 'wmv', spawn: 'xdg-open' },
 { ext: 'mov', spawn: 'xdg-open' },
 { ext: 'mkv', spawn: 'xdg-open' },
 { ext: 'mp3', spawn: 'xdg-open' },
 { ext: 'ogg', spawn: 'xdg-open' },
 { ext: 'png', spawn: 'xdg-open' }
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
	dnaof(this, fontPath, 18, TController, 110, 33)
	DESK = this.desktop
}

var knownGoodFonts = [
	'DejaVuSansMono.ttf',
	'DejaVuSansMono-Oblique.ttf',
	'LiberationMono-Italic.ttf',
	'LiberationMono-BoldItalic.ttf',
	'LiberationMono-Bold.ttf',
	'LiberationMono-Regular.ttf',
	'FreeMono.ttf',
	'FreeMonoBold.ttf',
	'UbuntuMono-R.ttf',
	'UbuntuMono-B.ttf',
	'UbuntuMono-BI.ttf',
	'UbuntuMono-RI.ttf'
]
var favouriteFont = 'FreeMono.ttf', fontPath

function taskFont() {
	var me = this
	require('child_process').exec('fc-list', function(a, b, c) {
		var L = b.split('\n'), R = []
		for (var i = 0; i < L.length; i++) {
			if (L[i].toLowerCase().indexOf('mono') >= 0) {
				var s = L[i].split(':')[0]
				for (var f = 0; f < knownGoodFonts.length; f++) {
					if (s.indexOf(knownGoodFonts[f]) >= 0)
					if (R.indexOf(s) < 0) R.push(s)
					if (s.indexOf(favouriteFont) >= 0) fontPath = s
				}
			}
		}
		if (!fontPath) fontPath = R[0]
		me.state = 'done'
		me.chain.tick()
	})
}

function taskDeodarCreate() {
	var A = TDeodar.create()
	A.show()
	A.desktop.main.output.colorLog('   *  ^2Рабочая среда ^0"^5Деодар^0", '
	+ 'лицензия: ^1Unlicense^0, автор: Яков Нивин  *')
	with (deodarVersion) A.desktop.main.output.colorLog(
		'   *  ^3' + label + '^0, ^4' + sub + '^0, ^5' + time)
	glxwin.mainLoop()
	this.state = 'done'
	this.chain.tick()
}

var mainChain = TChain.create()
mainChain.tasks.push({task:taskFont, chain:mainChain})
mainChain.tasks.push({task:taskDeodarCreate, chain:mainChain})
mainChain.tick()


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
-- http/ftp server from selected dir

Плюсы использования "православного" коммандера:

-- мгновнное время отклика составляющее микросекунды для большинства задач
-- возможность перемещаться по диску со скоростью намного недоступной в виджетовых файл-менеджерах
-- возможность не пользоваться мышью
--
*/

