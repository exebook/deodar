maskMatch = function(path, mask) {
	mask = mask.replace(/\./g, '\\.')
	mask = mask.replace(/\?/g, '.')
	mask = mask.replace(/\*/g, '.+?')
	var r = new RegExp('^'+mask+'$', '')
	return path.match(r) != null
}

maskNewName = function(path, mask) {
log('-->', '<'+path+'>', '['+mask+']')
	if (path == '') return
	var x = 0, R = ''
	for (var m = 0; m < mask.length; m++) {
		var ch = mask[m], q = path[x], z = mask[m + 1]
		if (ch != '.' && ch != '*' && ch != '?') {
			if (q && q != '.') x++
			R += ch
		} else if (ch == '?') {
			if (q && q != '.') R += q, x++
		} else if (ch == '*' && m == mask.length - 1) {
			while (x < path.length) R += path[x++]
		} else if (ch == '*') {
			if (z == '.') {
				for (var i = path.length - 1; i >= 0; i--) if (path[i] == '.') break
				if (i < 0) {
					R += path.substr(x, path.length) + '.'
					i = path.length
				} else R += path.substr(x, i - x + 1)
				x = i + 1, m++
			} else if (z == '?') {
				R += path.substr(x, path.length), m++, x = path.length
			} else {
				for (var i = path.length - 1; i >= 0; i--) if (path[i] == z) break
				if (i < 0) R += path.substr(x, path.length) + z, x = path.length, m++
				else R += path.substr(x, i - x), x = i + 1
			}
		} else if (ch == '.') {
			while (x < path.length) if (path[x++] == '.') break
			R += '.'
		}
	}
	while (R[R.length - 1] == '.') R = R.substr(0, R.length - 1)
	return R
}

