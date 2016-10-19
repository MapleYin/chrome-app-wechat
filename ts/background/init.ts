window['System'].config({
	'packages': {
		'app': {
			'format': 'register',
			'defaultExtension': 'js'
		}
	},
	'meta':{
		'*':{
			'scriptLoad': true
		}
	}
});

window['System'].import('/app/background/main').then(null, console.error.bind(console));