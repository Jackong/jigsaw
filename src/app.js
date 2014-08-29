
var MenuLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);

        var board = cc.Sprite.create(res.img.board);
        board.setPosition(centerPos);
        this.addChild(board);

        var menuItemPlay= cc.MenuItemSprite.create(
            cc.Sprite.create(res.img.start), // normal state image
            cc.Sprite.create(res.img.start), //select state image
            this.onPlay, this);
        var btMenu = cc.Menu.create(menuItemPlay);
        btMenu.setPosition(centerPos);
        this.addChild(btMenu);


        var label = cc.LabelTTF.create("开始", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this.onPlay, this);

        var txMenu = cc.Menu.create(menuItem);
        txMenu.x = 0;
        txMenu.y = 0;
        menuItem.x = centerPos.x;
        menuItem.y = centerPos.y - 50;
        this.addChild(txMenu);
    },
    onPlay: function () {
        cc.director.runScene(new PlayScene());
    }
});


var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

