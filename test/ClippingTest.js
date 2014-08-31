/**
 * Created by daisy on 14-8-29.
 */

var TAG_STENCILNODE = 100;
var TAG_CLIPPERNODE = 101;
var TAG_CONTENTNODE = 102;

var stencil = null;
var ClippingTestLayer = cc.Layer.extend({
    ctor: function() {
        this._super(cc.color(0,0,0,255), cc.color(98,99,117,255));
        this.setup();
    },
    setup:function () {
        var winSize = cc.director.getWinSize();

        stencil = this.stencil();
        stencil.tag = TAG_STENCILNODE;

        var clipper = this.clipper();
        clipper.tag = TAG_CLIPPERNODE;
        clipper.anchorX = 0.5;
        clipper.anchorY = 0.5;
        clipper.x = winSize.width / 2 - 50;
        clipper.y = winSize.height / 2 - 50;
        clipper.width = 50;
        clipper.height = 50;
        clipper.stencil = stencil;

        this.addChild(clipper);

        var content = this.content();
        content.x = 50;
        content.y = 50;
        clipper.addChild(content);
        clipper.layer = this;
        cc.eventManager.addListener(this.listener(), clipper);
    },
    stencil:function () {
        var node = this.shape();
        return node;
    },

    content:function () {
        var node = this.grossini();
        return node;
    },

    shape:function () {
        var shape = new cc.DrawNode();
        var green = cc.color(0, 255, 0, 255);
        shape.drawRect(cc.p(0, 0), cc.p(100, 50),  green, 0, green);
        shape.drawRect(cc.p(50, 50), cc.p(100, 100),  green, 0, green);
        return shape;
    },

    grossini:function () {
        var grossini = new cc.Sprite(res.img.dog);
        grossini.setScale(0.5);
        return grossini;
    },

    clipper:function () {
        return new cc.ClippingNode();
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
        target.opacity = 180;
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        if (locationInNode.y < 0 || locationInNode.x < 0 || locationInNode.x > 100 || locationInNode.y > 100) {
            return false;
        }
        return  ((locationInNode.x > 50) || (locationInNode.x < 50 && locationInNode.y < 50));
    },
    toTouchMoved: function (touch, event) {            // 触摸移动时触发

        // 移动当前按钮精灵的坐标位置
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
    },
    toTouchEnded: function (touch, event) {            // 点击事件结束处理
        var target = event.getCurrentTarget();
        cc.log('sprite ' + target.x + ',' + target.y + ' onTouchesEnded.. ');
        target.setOpacity(255);
        target.setLocalZOrder(100);
        var layer = target.layer;
        layer.removeChild(target);
        layer.setup();
    }
});

var ClippingTestScene = cc.Scene.extend({
   onEnter: function () {
       this._super();
       var layer = new ClippingTestLayer();
       this.addChild(layer);
   }
});