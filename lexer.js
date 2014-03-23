
function initKeywords() {

	keywordSource = ["$UNUSED$",
	"break export return case for switch comment function continue if typeof import var delete in do label while else new with abstract implements protected boolean instanceOf public byte int short char interface static double long synchronized native throws final  transient float package goto private catch enum throw class extends try const finally debugger super alert isFinite personalbar Anchor isNan Plugin Area java print JavaArray prompt Array JavaClass prototype assign JavaObject Radio blur JavaPackage ref Boolean RegExp Button Link releaseEvents  location Reset caller Location resizeBy captureEvents locationbar resizeTo Checkbox Math routeEvent clearInterval menubar scroll clearTimeout MimeType scrollbars close moveBy scrollBy closed moveTo scrollTo confirm name Select constructor Date navigate setInterval defaultStatus navigator setTimeout document Navigator status Document netscape statusbar Element Number stop escape Object String eval onBlur Submit FileUpload onError sun find onFocus taint focus onLoad Text Form onUnload Textarea Frame open toolbar Frames opener top Function Option toString getClass outerHeight unescape Hidden OuterWidth untaint history Packages unwatch History pageXoffset valueOf home pageYoffset watch Image parent window parseFloat Window InnerHeight parseInt InnerWidth Password",

	"$ dnaof create kindof me can", 

	"console log process fs",

	"TConsole TBeginCopyDialog TController var TDeodar TInputAndPanels TFileList TFileDetail TFilePanel TControl TButton TLabel TInput TDialog TOkCancel TMessageBox TGLXVision TEdit TLabeledEdit TTextView TModalTextView TGroup TDesktop TObject TKeyInput TList TKeyCode THelp TDriveList TDriveMenu TView TWindow",

	"init true false null arguments length callee NaN self Infinity void this  default undefined"]
	var keywords = {}
	for (var i = 0; i < keywordSource.length; i++) {
		var list = keywordSource[i].split(' ')
		for (var a = 0; a < list.length; a++) {
			keywords[list[a]] = i
		}
	}
	return keywords
}

keywords = initKeywords()

colorizeString = function(text) {
	var sym = '\'`~!@#$%^&*()-+={[}]:;"?/>.<,\\|', num = '1234567890', spc = ' \n\r\t'
	var COLOR = [], state = 'norm', C
	var cnorm = 0, csym = 1, cnum = 2, cstr = 3, cid = 4, ckey = 5
	s = text.split('')
	function scanStr(Q) {
		COLOR.push(cstr)
		while (true) {
			COLOR.push(cstr)
			if (++i == s.length || (s[i] == Q && esq != true)) break
			var esq = (s[i] == '\\')
		}
	}
	for (var i = 0; i < s.length; i++) {
		var c = s[i]
		if (c == '"') { scanStr('"'); continue
		} else if (c == "'") { scanStr("'"); continue
		} else if (sym.indexOf(c) >=0) { C = csym; state = 'sym' 
		} else if (spc.indexOf(c) >= 0) { C = cnorm; state = 'norm'
		} else if (num.indexOf(c) >= 0) { if (state == 'id') C = cid; else C = cnum, state = 'num'
		} else { C = cid, state = 'id' }
		COLOR.push(C)
	}
	// теперь ключевые слова
	for (var i = 0; i < COLOR.length + 1; i++) {
		c = COLOR[i]
		if (c == cid && a == undefined) a = i
		if (c != cid && a != undefined) {
			var k = text.substr(a, i - a)
			var keyw = keywords[k]
			if (keyw != undefined) for (;a<i;a++) COLOR[a] = ckey + keyw
			var a = undefined
		}
	}
	return COLOR
}


return
var s = 'TView.can.onSomething = function(_id, id1, x, y) { return "abc" + \'x\\\'z\' + 123}'
console.log(s, '\n' + colorizeString(s).join(''))

process.exit()

