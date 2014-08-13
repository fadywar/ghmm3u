var vm = require('vm');
var xmlhttprequest = require("./xmlhttprequest");

exports.getContext = function(href) {
	var dom = {
		createElement: function (a) { return dom },
		createTextNode: function(a, b) { return dom },
		appendChild: function (a) {},
		style: {
			display: null,
		},
		data: null,
	};

	var document = {
		location: {
			href: href,
		},
		cookie: '',
		body: dom,
	};

	for (var attr in dom)
		document[attr] = dom[attr];

	var astb = {
		DefaultKeys: function(a) {},
		WithChannels: function(a) {},
		SetMouseState: function(a) {},
		SetKeyFunction: function(a, b) {},
		GetSystemModel: function() { return "Ax4x"; },
		GetSystemSubmodel: function() { return "A140"; },
		GetConfig: function(a) {},
		GetMacAddress: function(a) {},
		ErrorString: function(a) { console.log(a); },
	};

	return vm.createContext({
		window: {
			navigator: {
				userAgent: 'Opera',
			},
			console: console,
			location: href,
			addEventListener: function(a, b, c) {},
			setTimeout: function(a, b) {},
			setInterval: function(a, b) {},
			clearTimeout: function(a) {},
			ASTB: astb,
		},
		document: document,
		XMLHttpRequest: xmlhttprequest.XMLHttpRequest,
		clearTimeout: function(a) {},
		ASTB: astb,
		VideoDisplay: {
			SetChromaKey: function(a) {},
			SetAlphaLevel: function(a) {},
			RetainMouseState: function(a) {},
			RetainAlphaLevel: function(a) {},
			
		},
		Browser: {
			SetToolbarState: function(a) {},
			FrameLoadResetsState: function(a) {},
		},
		AVMedia: {
		}
	});
};