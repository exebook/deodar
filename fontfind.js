/*
	Чтобы работать Деодару нужен файл со шрифтом, здесь ряд функций пытаются найти его
	1) пробуется "fc-list"
	2) если ничего (на некоторых дистрибах fc-list не выдаёт пути к шрифтам), то пробуется "fc-list -v"
	3) если опять ничего пробуется более железный вариант "find /usr/share | grep ttf"
*/

var knownGoodFonts = [ // можно пометить предпочитаемый фонт звёздочкой, например '*consola.ttf'
	'*DejaVuSansMono.ttf',
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
	'UbuntuMono-RI.ttf',
	'Inconsolata.otf',
	'DroidSansMono.ttf',
	'Share-TechMono.ttf',
	'Share-TechMono.otf',
	'fixedU1.ttf',
	'fixed7.ttf',
	'consolai.ttf',
	'consola.ttf',
	'consolab.ttf',
	'consolaz.ttf',
	'Inconsolata.otf',
], fontPattern = ['mono', 'consol', 'fix']
var favouriteFont = '', fontPath

for (var t = 0; t < knownGoodFonts.length; t++) 
	if (knownGoodFonts[t].indexOf('*') == 0) {
		var s = knownGoodFonts[t]; s = s.substr(1, s.length)
		favouriteFont = s
		knownGoodFonts[t] = s
	}

function parseFontFindData(L) {
	var R = [], found
	if (fs.existsSync(L[0]) == false) return
	for (var i = 0; i < L.length; i++) if (L[i]) {
		var match = false
		for (var j = 0; j < fontPattern.length; j++) {
			if (L[i].toLowerCase().indexOf(fontPattern[j]) >= 0) { match = true; break }
		}
		if (match) {
			var s = L[i]
			for (var f = 0; f < knownGoodFonts.length; f++) {
				if (s.indexOf(knownGoodFonts[f]) >= 0)
				if (R.indexOf(s) < 0) R.push(s)
				if (s.indexOf(favouriteFont) >= 0) found = s
			}
		}
	}
	if (found) return found
	return R[0]
}

function taskFontFind() {
	var me = this
	require('child_process').exec('find /usr/share/fonts | grep \\.ttf', function(err, data) {
		foundFont = parseFontFindData(data.split('\n'))
		me.chain.fontPath = foundFont
		me.state = 'done'
		me.chain.tick()
	})
}

function taskFontSelect2() {
	var me = this
	require('child_process').exec('fc-list -v | grep "file:"', function(err, data) {
		data = data.split('\n')
		for (var i = 0; i < data.length; i++) data[i] = data[i].split('"')[1]
		var foundFont = parseFontFindData(data)
		if (foundFont) {
			me.chain.fontPath = foundFont
			me.state = 'done'
		} else me.task = taskFontFind
		me.chain.tick()
	})
}

function taskFontSelect() {
	var me = this
	require('child_process').exec('fc-list', function(err, data) {
		data = data.split('\n')
		for (var i = 0; i < data.length; i++) data[i] = data[i].split(':')[0]
		var foundFont = parseFontFindData(data)
		if (foundFont) {
			me.chain.fontPath = foundFont
			me.state = 'done'
		} else me.task = taskFontSelect2
		me.chain.tick()
	})
}

exports.taskFontSelect = taskFontSelect

