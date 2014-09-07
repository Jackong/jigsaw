/**
 * Created by daisy on 14-8-31.
 */

var NUM = 3;

var PlayLayer = cc.Layer.extend({
    RESTART: 1,
    SHARE: 2,
    scale: 1,
    img: null,
    fragments: [],
    isOver: false,
    ctor: function () {
        this._super();
    },
    init: function () {
        this._super();
        this.scale = 1;
        this.img = null;
        this.fragments = [];
        this.isOver = false;

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
        this.scale = (320 / NUM) / width;
        cc.log('size: ' + this.scale + ',' + width + ',' + height);

        for (var idx = 0; idx < NUM; idx++) {
            this.fragments.push([]);
            for (var jdx = 0; jdx < NUM; jdx++) {
                var fragment = this.clip(idx, jdx, width, height, this.scale);
                cc.eventManager.addListener(this.listener(), fragment);
                this.addChild(fragment);
                this.fragments[idx].push(fragment);
            }
        }
        this.upset();
    },
    clip: function (idx, jdx, width, height, scale) {

        var x = idx * width;
        var y = jdx * height;

        var posX = (idx + 0.5) * width  * scale;
        var posY = (this.centerPos().y + height *  (NUM - jdx - 2)) * scale;

        cc.log('clip: ' + idx + ',' + jdx + '(' + x + ',' + y + '):(' + posX + ',' + posY + ')');

        var fragment = new Fragment(this.img, cc.rect(x, y, width, height));
        fragment.setScale(scale);
        fragment.setOriginIdx(idx, jdx);
        fragment.setIndex(idx, jdx);
        fragment.setPos(posX, posY);
        fragment.setPosition(cc.p(posX, posY));

        return fragment;
    },
    upset: function () {
        for (var idx = 0; idx < NUM; idx++) {
            for (var jdx = 0; jdx < NUM; jdx++) {
                var fragment1 = this.fragments[this.random()][jdx];
                var fragment2 = this.fragments[idx][this.random()];
                this.crush(fragment1, fragment2);
                fragment1.homing();
            }
        }
    },
    random: function () {
        return parseInt(Math.random() * (NUM - 1));
    },
    centerPos: function () {
        var winSize = cc.director.getWinSize();
        return cc.p(winSize.width / 2, winSize.height / 2);
    },
    listener: function () {
        return cc.EventListener.create({
            currentLayer: this,
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.toTouchBegan,
            onTouchMoved: this.toTouchMoved,
            onTouchEnded: this.toTouchEnded
        });
    },
    toTouchBegan: function (touch, event) {        //实现 onTouchBegan 事件回调函数
        if (this.currentLayer.isOver) {
            return false;
        }
        var target = event.getCurrentTarget();    // 获取事件所绑定的 target
        if (!target.containPos(touch)) {        // 点击范围判断检测
            return false;
        }
        target.setLocalZOrder(100);
        target.opacity = 180;
        return true;
    },
    toTouchMoved: function (touch, event) {            // 触摸移动时触发
        // 移动当前按钮精灵的坐标位置
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        if (delta.x === 0 && delta.y === 0) {
            return;
        }
        target.x += delta.x;
        target.y += delta.y;
        var self = this.currentLayer;
        for (var idx = -1; idx <= 1; idx++) {
            for (var jdx = -1; jdx <= 1; jdx++) {
                if (idx === 0 && jdx === 0) {
                    continue;
                }
                var x = idx + target.idx.x;
                var y = jdx + target.idx.y;
                if (x < 0 || y < 0 || x >= NUM || y >= NUM) {
                    continue;
                }
                var fragment = self.fragments[x][y];
                if (!fragment.containPos(touch)) {
                    continue;
                }
                self.crush(target, fragment);
            }
        }
    },
    crush: function (target, fragment) {
        if (fragment === target) {
            return false;
        }
        fragment.crush(target);
        this.fragments[fragment.idx.x][fragment.idx.y] = fragment;
        this.fragments[target.idx.x][target.idx.y] = target;
        return true;
    },
    toTouchEnded: function (touch, event) {            // 点击事件结束处理
        var target = event.getCurrentTarget();
        cc.log('sprite ' + target.x + ',' + target.y + ' onTouchesEnded.. ');
        target.homing();
        target.setOpacity(255);
        target.setLocalZOrder(99);
        if (this.currentLayer.isAllCorrect()) {
            this.currentLayer.isOver = true;
            this.currentLayer.gameOver();
        }
    },
    isAllCorrect: function () {
        for (var idx = 0; idx < NUM; idx++) {
            for (var jdx = 0; jdx < NUM; jdx++) {
                if (!this.fragments[idx][jdx].isCorrect()) {
                    return false;
                }
            }
        }
        return true;
    },
    restart: function () {
        this.upset();
        this.isOver = false;
        this.removeChildByTag(this.RESTART, true);
        this.removeChildByTag(this.SHARE, true);
    },
    gameOver: function () {
        var menuItemRestart = cc.MenuItemSprite.create(
            cc.Sprite.create(res.img.restart), // normal state image
            cc.Sprite.create(res.img.restart), //select state image
            this.restart, this);
        var btMenu = cc.Menu.create(menuItemRestart);
        btMenu.setPosition(this.centerPos());
        this.addChild(btMenu, 101, this.RESTART);
    }
});

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new PlayLayer();
        layer.init();
        this.addChild(layer);
    }
});