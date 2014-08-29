/**
 * Created by daisy on 14-8-28.
 */
var Fragment = cc.Sprite.extend({
    ox: null,
    oy: null,
    isStopped: false,
    layer: null,
    ctor: function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
    }
});