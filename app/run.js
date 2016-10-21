var loginWindow;
let createLoginWindow = function () {
    return chrome.app.window.create('login.html', {
        'id': 'LoginWindow',
        'innerBounds': {
            'width': 300,
            'height': 400
        },
        'frame': 'none',
        'resizable': false
    }, function (createdWindow) {
        loginWindow = createdWindow;
    });
};
let createMainWindow = function (redirectUrl) {
    chrome.app.window.create('index.html', {
        'id': 'MainWindow',
        'innerBounds': {
            'height': 480,
            'width': 660,
            'minHeight': 480,
            'minWidth': 660,
        },
        'frame': 'none',
    }, createdWindow => {
        createdWindow.contentWindow['redirectUrl'] = redirectUrl;
    });
};
chrome.app.runtime.onLaunched.addListener(function () {
    let currentWindow = chrome.app.window.get('MainWindow');
    if (currentWindow) {
        currentWindow.show();
    }
    else {
        createLoginWindow();
    }
    // createMainWindow();
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.command == 'OPEN_MAIN') {
        console.log(message.data);
        if (!message.data) {
            return;
        }
        if (loginWindow) {
            loginWindow.close();
        }
        createMainWindow(message.data);
    }
});
