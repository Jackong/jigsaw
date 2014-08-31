/**
 * Created by daisy on 14-8-28.
 */
var Fragment = cc.Sprite.extend({
    px: null,
    py: null,
    origin: {px: null, py: null},
    layer: null,
    deltaPos: null,
    isMoving: false,
    ctor: function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
    },
    setDimension: function (px, py) {
        this.px = px;
        this.py = py;
    }
});