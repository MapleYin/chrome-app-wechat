var loginWindow:chrome.app.window.AppWindow;
var mainWindow:chrome.app.window.AppWindow;

let createLoginWindow = function(){
	return chrome.app.window.create('login.html', {
	    'id': 'LoginWindow',
	    'innerBounds': {
	        'width': 300,
	        'height': 400
	    },
	    'frame' : 'none',
	    'resizable' : false
	},function(createdWindow:chrome.app.window.AppWindow){
		loginWindow = createdWindow;
	});
};

let createMainWindow = function(redirectUrl:string){
	chrome.app.window.create('index.html', {
	    'id': 'MainWindow',
	    'innerBounds': {
	    	'height' : 480,
	    	'width' : 660,
	        'minHeight': 480,
	        'minWidth': 660,
	    },
	    'frame' : 'none',
	},createdWindow=>{
		mainWindow = createdWindow;
		createdWindow.contentWindow['redirectUrl'] = redirectUrl;
	});
};

chrome.app.runtime.onLaunched.addListener(function() {
	let currentWindow = chrome.app.window.get('MainWindow');
	if(currentWindow) {
		currentWindow.show();
	}else{
		createLoginWindow();
	}
});

chrome.runtime.onMessage.addListener(function(message:any, sender:chrome.runtime.MessageSender,sendResponse:(response:any)=>void){
	switch (message.command) {
		case 'OPEN_MAIN':
			if(!message.data) {
				return ;
			}
			if(loginWindow) {
				loginWindow.close();
			}
			createMainWindow(message.data);
			break;
		case 'OPEN_LOGIN':
			if(mainWindow) {
				mainWindow.close();
			}
			createLoginWindow();
			break;
		default:
			// code...
			break;
	}
});