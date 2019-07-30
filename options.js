function askUserConfirmation() {
    navigator.webkitGetUserMedia({ video: true }, function() {
        console.log('ok');
    }, function(e) {
        console.log('webcam not ok');
    });
}

document.addEventListener('DOMContentLoaded', askUserConfirmation);