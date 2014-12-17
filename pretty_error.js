Error.prepareStackTrace = function(s, t)
{
	var fs = require('fs')
	var W = 70 // width of output 'window'
	var frame = ''; while (frame.length < W + 4) frame += '-' // make frame line
	R = []
	for (var i = t.length - 1; i >= 0; i--) { // t v8 is list of calls
		var fn = t[i].getFileName()
		if (fn == 'module.js') continue // this is useless for us anyway
		if (fn == 'node.js') continue
		var q =  (i+1) +') at ' + fn +':'+ t[i].getLineNumber() + ':' + t[i].getColumnNumber() 	+ ', ' 
		var f = t[i].getFunctionName()
		if (f == null) q += '(main program body)'
		else q += 'function ' + f + '()'
		R.push(q)
	}
	R.push(frame)
	var L0 = t[0].getLineNumber()-1, L = L0, L1 = L + 3 // prepare display of source code
	if (L < 0) L = 0
	var file = fs.readFileSync(fn) // we need to load from disc, no way to source get from v8
	if (file.length > 0) {
		var TXT = file.toString().replace(/\r/g, '').split('\n')
		for (var l = L; l < L1; l++) {
			TXT[l] = TXT[l].replace(/\t/g, '   ')
			R.push(l + ' ' + TXT[l])
			if (l == L0) { // line that has error
				var tab = ''; while (tab.length < t[0].getColumnNumber()+2+l.toString().length) tab += ' '
				s = s.toString().replace(new RegExp('ReferenceError: ', 'g'), '')
				R.push(tab + '^ ' + s) // s - is error message provided by v8
			}
		}
	}
	R.unshift(frame), R.push(frame)
	var L = []
	for (var i = 0; i < R.length; i++) {  // break lines that are wider than our window
		if (R[i][0] != '-' && R[i].length > W) L.push(R[i].slice(0, W)), L.push('  ' + R[i].slice(W))
		else L.push(R[i])
	}
	W += 9
	for (var i = 0; i < L.length; i++) { // draw lieft and right of window frame
		if (L[i][0] != '-') L[i] = '  ' + L[i]
		L[i] = '    |' + L[i]
		while (L[i].length < W) L[i] += ' '
		L[i] += '|'
	}
	return L.join('\n');
}