/**
 * Created by daisy on 14-8-29.
 */

var NUM = 4;
var PlayLayer = cc.Layer.extend({
    sprite:null,
    fragments: [],
    stopCount: 0,
    ctor: function () {
        this._super();
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);

        var board = cc.Sprite.create(res.img.board);
        board.setPosition(centerPos);
        this.addChild(board);

        this.clip(res.img.dog);
    },
    listener: function () {
        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.toTouchBegan,
            onTouchMoved: this.toTouchMoved,
            onTouchEnded: this.toTouchEnded
        });
    },
    shuffle: function(array){ //v1.0
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    clip: function (img) {
        var winSize = cc.director.getWinSize();
        this.sprite = cc.Sprite.create(img);
        var width = this.sprite.width / NUM;
        var height = this.sprite.height / NUM;
        for (var idx = 0; idx < NUM; idx++) {
            var x = width * idx;
            for (var jdx = 0; jdx < NUM;  jdx++) {
                var y = height * jdx;
                var fragment = new Fragment(img, cc.rect(x, y, width, height));
                fragment.setScale(0.5);
                cc.eventManager.addListener(this.listener(), fragment);
                fragment.setPosition(cc.p(-fragment.width/2, winSize.height - fragment.height / 2));
                fragment.ox = idx;
                fragment.oy = jdx;
                fragment.layer = this;
                this.fragments.push(fragment);
                this.addChild(fragment);
            }
        }
        this.shuffle(this.fragments);
        this.queueUp(0);
    },
    queueUp: function (idx) {
        var self = this;
        var fragment = this.fragments[idx % (this.fragments.length)];
        var time = 0;
        if (!fragment.isStopped) {
            var winSize = cc.director.getWinSize();
            fragment.setPosition(cc.p(-fragment.width/2, winSize.height - fragment.height / 2));
            var actionTo = cc.moveTo(5, cc.p(winSize.width + fragment.width / 2, winSize.height - fragment.height / 2));
            fragment.runAction(cc.Sequence.create(actionTo));
            time = 1000;
        } else if ((++this.stopCount)%this.fragments.length < 3) {
            time = 1000;
        }
        setTimeout(function () {
            self.queueUp(idx+1);
        }, time);
    },
    toTouchBegan: function (touch, event) {        //实现 onTouchBegan 事件回调函数
        var target = event.getCurrentTarget();    // 获取事件所绑定的 target

        // 获取当前点击点所在相对按钮的位置坐标
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {        // 点击范围判断检测
            cc.log('sprite ' + target.ox + ',' + target.oy + ' began... x = ' + locationInNode.x + ', y = ' + locationInNode.y);
            target.opacity = 180;
            return true;
        }
        return false;
    },
    toTouchMoved: function (touch, event) {            // 触摸移动时触发

        // 移动当前按钮精灵的坐标位置
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;

        target.isStopped = true;
        target.stopAllActions();
    },
    toTouchEnded: function (touch, event) {            // 点击事件结束处理
        var target = event.getCurrentTarget();
        cc.log('sprite ' + target.ox + ',' + target.oy + ' onTouchesEnded.. ');
        target.setOpacity(255);
        target.setLocalZOrder(100);
        target.layer.checkBorder(target);
    },
    checkBorder: function (target) {
        var borderX = target.width / 15;
        var borderY = target.height / 15;

        for(var idx = 0; idx < target.layer.fragments.length; idx++) {
            var fragment = target.layer.fragments[idx];
            var deltaOX = fragment.ox - target.ox;
            var deltaOY = fragment.oy - target.oy;
            if (Math.abs(deltaOX) + Math.abs(deltaOY) !== 1) {
                continue;
            }

            var deltaX = Math.abs(fragment.x - target.x);
            var deltaY = Math.abs(fragment.y - target.y);

            var posX = fragment.x;
            var posY = fragment.y;
            if (deltaOX == 0) {
                if (deltaX > borderX || deltaY > (borderY + target.height)) {
                    continue;
                }
                posY += (deltaOY < 0 ? -target.height : target.height)/2;
            } else {
                if (deltaY > borderY || deltaX > (borderX + target.width)) {
                    continue;
                }
                posX += (deltaOX < 0 ? target.width : -target.width)/2;
            }

            target.x = posX;
            target.y = posY;
        }
    }
});

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});