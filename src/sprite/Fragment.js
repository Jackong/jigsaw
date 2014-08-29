/**
 * Created by daisy on 14-8-28.
 */
var Fragment = cc.Sprite.extend({
    ox: null,
    oy: null,
    isStopped: false,
    listener: null,
    ctor: function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
        this.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.toTouchBegan,
            onTouchMoved: this.toTouchMoved,
            onTouchEnded: this.toTouchEnded
        });
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
    }
});