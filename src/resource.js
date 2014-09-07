var res = {
    img : {
        board: 'res/board.jpg',
        start: 'res/start.png',
        restart: 'res/restart.png',
        share: 'res/share.png',
        dog: 'res/dog.jpg'// 'http://www.corsproxy.com/f.hiphotos.baidu.com/image/w%3D310/sign=30ed162f38f33a879e6d061bf65d1018/9a504fc2d56285350009473e92ef76c6a6ef63c0.jpg'
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