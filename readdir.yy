function dateAsArr(d) {
	R = [d.getYear()+1900, d.getMonth()+1, d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]
	$ R
}

function getFlags (pp) {
	var p = '----------' ⌶ ''
	if ((pp & 0400) != 0) p[0] = 'r'
	if ((pp & 0200) != 0) p[1] = 'w'
	if ((pp & 0100) != 0) p[2] = 'x'
	if ((pp & 0040) != 0) p[3] = 'r'
	if ((pp & 0020) != 0) p[4] = 'w'
	if ((pp & 0010) != 0) p[5] = 'x'
	if ((pp & 0004) != 0) p[6] = 'r'
	if ((pp & 0002) != 0) p[7] = 'w'
	if ((pp & 0001) != 0) p[8] = 'x'
	$ p ⫴ ''
}

➮ listNotIgnoredFiles dir {
	cfg ∆['.git/']
	⌥ fs.existsSync(dir+'/.gitignore') { cfg = cfg ꗚ (⛁(dir+'/.gitignore')≂ ⌶'\n')}
	⌥ fs.existsSync(dir+'/.npmignore') { cfg = cfg ꗚ (⛁(dir+'/.npmignore')≂ ⌶'\n')}
	
	pat ∆ []
	
	i ► cfg {
		⌥ i ≟ '' {♻}
		⌥ i ≀ '/' >= 0 { 
			⌥ iꕉ ≟ '/' { i += '*' }
			i = i ⋃ (0, i↥ - 2)
		}
		i = repl(i, '*', '.*')
		pat ⬊ (⟡ RegExp('^'+i+'$'))
	}
	
	A = fs.readdirSync(dir)	
	
	➮ ignore {
		i ► pat  ⌥ a.match(i) { $ ⦿ }
	}
	A = A ꔬ (➮{
		$ (!ignore(a))
	})
	$ A
}

//A ∆ listNotIgnoredFiles('.')
//i ► A  ロ i

readDir = function readDir(path, gitignore) {
	if	 (path[path.length-1] == ':') path += '\\\\' // windows
	try {
		var L
		if (gitignore) L = listNotIgnoredFiles(path)
		else L = fs.readdirSync(path)
	} catch (e) {
		return [{name:e.code, hint:true}]
	}
//	fs.writeFileSync('dump', '**'+path+'**\n'+JSON.stringify(L))
	var R = []
	for (var i = 0; i < L.length; i++) {
		try {
			stat = fs.statSync(path + '/' + L[i])
		} catch (e) {
			R.push({
				name: L[i],
				size: -1,
				mode: 0,
				flags: '----------',
				dir: false,
				ctime: 0,
				atime: 0,
				mtime: 0,
			})
			continue
		}
		R.push({
			name: L[i],
			size: stat.size,
			mode: stat.mode,
			flags: getFlags(stat.mode),
			dir: stat.isDirectory(),
			ctime: dateAsArr(stat.ctime),
			atime: dateAsArr(stat.atime),
			mtime: dateAsArr(stat.mtime),
		})
	}
	$ R
}
