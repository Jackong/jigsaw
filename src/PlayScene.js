/**
 * Created by daisy on 14-8-29.
 */

var PlayLayer = cc.Layer.extend({
    sprite:null,
    fragments: [],
    stopCount: 0,
    NUM: 4,
    ctor: function () {
        this._super();
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);

        var board = cc.Sprite.create(res.img.board);
        board.setPosition(centerPos);
        this.addChild(board);

        this.clip(res.img.dog);
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
                fragment.ox = (x +  width / 2) / 2;
                fragment.oy = (winSize.height - y - height / 2) / 2;
                cc.eventManager.addListener(fragment.listener, fragment);
                fragment.setPosition(cc.p(-fragment.width/2, winSize.height - fragment.height / 2));
                this.fragments.push(fragment);
                this.addChild(fragment);
            }
        }
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
    }
});

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});