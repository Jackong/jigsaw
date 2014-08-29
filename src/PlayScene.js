/**
 * Created by daisy on 14-8-29.
 */

var PlayLayer = cc.Layer.extend({
    sprite:null,
    fragments: [],
    NUM: 4,
    listener: null,
    ctor: function () {
        this._super();
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);

        var board = cc.Sprite.create(res.img.board);
        board.setPosition(centerPos);
        this.addChild(board);

        this.init();
        this.clip(res.img.dog);
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
        target.stopAllActions();

        if (Math.abs(target.x - target.ox) < 30 && Math.abs(target.y - target.oy) < 30) {
            target.x = target.ox;
            target.y = target.oy;
        }
    },
    toTouchEnded: function (touch, event) {            // 点击事件结束处理
        var target = event.getCurrentTarget();
        cc.log('sprite ' + target.ox + ',' + target.oy + ' onTouchesEnded.. ');
        target.setOpacity(255);
        target.setZOrder(100);
    },
    init: function () {
        this.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.toTouchBegan,
            onTouchMoved: this.toTouchMoved,
            onTouchEnded: this.toTouchEnded
        });
    },
    clip: function (img) {
        var winSize = cc.director.getWinSize();
        this.sprite = cc.Sprite.create(img);
        var width = this.sprite.width / this.NUM;
        var height = this.sprite.height / this.NUM;
        for (var idx = 0; idx < this.NUM; idx++) {
            var x = width * idx;
            for (var jdx = 0; jdx < this.NUM;  jdx++) {
                var y = height * jdx;
                var fragment = new Fragment(img, cc.rect(x, y, width, height));
                fragment.setScale(0.5);
                fragment.ox = x +  width / 2;
                fragment.oy = winSize.height - y - height / 2;
                cc.eventManager.addListener(this.listener.clone(), fragment);
                fragment.setPosition(cc.p(-fragment.width/2, winSize.height - fragment.height / 2));
                this.fragments.push(fragment);
                this.addChild(fragment);
            }
        }
        this.queueUp(0);
    },
    queueUp: function (idx) {
        var self = this;
        var fragment = this.fragments[idx % (this.NUM * this.NUM)];
        var winSize = cc.director.getWinSize();
        fragment.setPosition(cc.p(-fragment.width/2, winSize.height - fragment.height / 2));
        var actionTo = cc.moveTo(5, cc.p(winSize.width + fragment.width / 2, winSize.height - fragment.height / 2));
        fragment.runAction(cc.Sequence.create(actionTo));
        setTimeout(function () {
            self.queueUp(idx+1);
        }, 1000);
    }
});

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});