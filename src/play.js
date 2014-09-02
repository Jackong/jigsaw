/**
 * Created by daisy on 14-8-31.
 */

var NUM = 3;

var PlayLayer = cc.Layer.extend({
    img: null,
    fragments: [],
    ctor: function () {
        this._super();

        var board = cc.Sprite.create(res.img.board);
        board.setPosition(this.centerPos());
        this.addChild(board);

        this.setup(res.img.dog);
    },
    setup: function (img) {
        this.img = img;
        var sprite = cc.Sprite.create(this.img);

        var width = sprite.width / NUM;
        var height = sprite.height / NUM;
        cc.log('size: ' + width + ',' + height);

        for (var idx = 0; idx < NUM; idx++) {
            this.fragments.push([]);
            for (var jdx = 0; jdx < NUM; jdx++) {
                var fragment = this.clip(idx, jdx, width, height);
                cc.eventManager.addListener(this.listener(), fragment);
                this.addChild(fragment);
                this.fragments[idx].push(fragment);
            }
        }
    },
    clip: function (idx, jdx, width, height) {

        var x = idx * width;
        var y = jdx * height;

        var centerPos =  this.centerPos();
        var posX = (idx + 0.5) * width;
        var posY = centerPos.y + height *  (NUM - jdx);

        cc.log('clip: ' + idx + ',' + jdx + '(' + x + ',' + y + '):(' + posX + ',' + posY + ')');

        var fragment = new Fragment(this.img, cc.rect(x, y, width, height));
        fragment.setDimension(idx, jdx);
        fragment.origin = {px: idx, py: jdx};
        fragment.layer = this;
        fragment.setPosition(cc.p(posX, posY));

        return fragment;
    },
    centerPos: function () {
        var winSize = cc.director.getWinSize();
        return cc.p(winSize.width / 2, winSize.height / 2);
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
    toTouchBegan: function (touch, event) {        //实现 onTouchBegan 事件回调函数
        var target = event.getCurrentTarget();    // 获取事件所绑定的 target
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {        // 点击范围判断检测
            cc.log('sprite began... x = ' + locationInNode.x + ', y = ' + locationInNode.y);
            target.opacity = 180;
            return true;
        }
        return false;
    },
    toTouchMoved: function (touch, event) {            // 触摸移动时触发
        // 移动当前按钮精灵的坐标位置
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        if (delta.x === 0 && delta.y === 0) {
            return;
        }
        if (target.isMoving) {
            return;
        }
        target.isMoving = true;
        cc.log('touch move:' + delta.x + ',' + delta.y);
        var px = target.px;
        var py = target.py;
        if (Math.abs(delta.x) >= Math.abs(delta.y)) {
            if (delta.x < 0) {
                px--;
            } else {
                px++;
            }
        } else {
            if (delta.y < 0) {
                py++;
            } else {
                py--;
            }
        }
        cc.log('touch move:' + px + ',' + py);
        target.deltaPos = {x: px, y: py};
    },
    toTouchEnded: function (touch, event) {            // 点击事件结束处理
        var target = event.getCurrentTarget();
        cc.log('sprite ' + target.x + ',' + target.y + ' onTouchesEnded.. ');
        target.setOpacity(255);
        target.setLocalZOrder(100);

        var px = target.deltaPos.x;
        var py = target.deltaPos.y;
        if (target.deltaPos === null || px < 0 || px >= NUM || py < 0 || py >= NUM) {
            target.isMoving = false;
            return;
        }

        var fragment = target.layer.fragments[px][py];
        target.layer.swap(fragment, target);
        target.isMoving = false;
    },
    swap: function (fragment1, fragment2) {
        cc.log('target move to' + fragment2.x + ',' + fragment2.y);
        cc.log('fragment move to' + fragment1.x + ',' + fragment1.y);
        var action1 = cc.moveTo(0.3, cc.p(fragment2.x, fragment2.y));
        var action2 = cc.moveTo(0.3, cc.p(fragment1.x, fragment1.y));

        fragment1.runAction(cc.Sequence.create(action1));
        fragment2.runAction(cc.Sequence.create(action2));
        var tmpX = fragment1.px;
        var tmpY = fragment1.py;
        fragment1.setDimension(fragment2.px, fragment2.py);
        fragment2.setDimension(tmpX, tmpY);
        this.fragments[fragment1.px][fragment1.py] = fragment1;
        this.fragments[tmpX][tmpY] = fragment2;
    }
});

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});