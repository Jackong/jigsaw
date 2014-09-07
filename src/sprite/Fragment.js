/**
 * Created by daisy on 14-8-28.
 */
var Fragment = cc.Sprite.extend({
    oidx: null,
    idx: null,
    pos: null,
    layer: null,
    ctor: function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
    },
    setOriginIdx: function (x, y) {
        this.oidx = {x: x, y: y};
    },
    setIndex: function (x, y) {
        this.idx = {x: x, y: y};
    },
    setPos: function (x, y) {
        this.pos = {x: x, y: y};
    },
    containPos: function (touch) {
        var locationInNode = this.convertToNodeSpace(touch.getLocation());
        var s = this.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        return cc.rectContainsPoint(rect, locationInNode);
    },
    crush: function (fragment) {
        var pos = fragment.pos;
        fragment.pos = {x: this.pos.x, y: this.pos.y};
        this.pos = {x: pos.x, y: pos.y};
        this.x = pos.x;
        this.y = pos.y;

        var idx = fragment.idx;
        fragment.idx = {x: this.idx.x, y: this.idx.y};
        this.idx = {x: idx.x, y: idx.y};
    },
    homing: function () {
        this.x = this.pos.x;
        this.y = this.pos.y;
    },
    isCorrect: function () {
        return this.idx.x === this.oidx.x  && this.idx.y === this.oidx.y;
    }
});