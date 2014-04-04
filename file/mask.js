/*
a.b, *.* = true
a.b, *.b = true
a.b, a.* = true
*/

regExpEscape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function maskMatch(path, mask) {
	mask = mask.replace('.', '\\.')
	mask = mask.replace('*', '.+?')
	var r = new RegExp(mask, '')
	return path.match(r)
}

function maskConvert(path, mask) {
	mask = mask.split('*')
	log(mask)
	var R = [], x = 0
	for (var i = 0; i < mask.length; i++) {
		var j = path.indexOf(mask[i], x)
		log(j)
		if (j < 0) R.push([ x, undefined ])
		R.push([ j, i ])
		x = j + mask[i].length
	}
	log(R)
}

//log(maskConvert('ab.b', 'a*.x'))
