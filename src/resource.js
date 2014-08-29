var res = {
    img : {
        board: 'res/board.jpg',
        start: 'res/start.png',
        dog: 'res/dog.jpg'
    }
};

var g_resources = [];
function pushRsc(resource) {
    for (var i in resource) {
        if (resource[i] instanceof Object) {
            pushRsc(resource[i]);
            continue;
        }
        g_resources.push(resource[i]);
    }
}

pushRsc(res);