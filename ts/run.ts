var loginWindow:chrome.app.window.AppWindow;

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

let createMainWindow = function(){
	chrome.app.window.create('index.html', {
	    'id': 'MainWindow',
	    'innerBounds': {
	    	'height' : 480,
	    	'width' : 660,
	        'minHeight': 480,
	        'minWidth': 660,
	    },
	    'frame' : 'none',
	});
};

chrome.app.runtime.onLaunched.addListener(function() {
    createLoginWindow();
    // createMainWindow();
});

chrome.runtime.onMessage.addListener(function(message:any, sender:chrome.runtime.MessageSender,sendResponse:(response:any)=>void){

	if(message.command == 'OPEN_MAIN') {
		console.log(message.data);
		if(!message.data) {
			return ;
		}
		chrome.storage.sync.set({
			redirectUrl : message.data
		},function(){
			console.log(chrome.runtime.lastError);
			if(loginWindow) {
				loginWindow.close();
			}
			createMainWindow();
		});
	}
});

