define([
    'phaser'
], function (Phaser) { 
    'use strict';

    var game, frame;
    var lcvMeters;

    function HUD (_game) {

        game = _game;

        Phaser.Group.call(this, game);
        
        // Fix to camera.
        this.x = 0;
        this.y = 0;
        this.fixedToCamera = true;
        
        // Add frame.
        frame = new Phaser.Sprite(game, 0, 0, 'frame');
        this.add(frame);
        
        // Add meters.
        this.meters = [
            this.createMeter(10, game.height-60, 'health', 'health'),
            this.createMeter(10, game.height-50, 'satiation', 'satiation'),
            this.createMeter(10, game.height-40, 'hydration', 'hydration'),
            this.createMeter(10, game.height-30, 'affection', 'affection'),
            this.createMeter(10, game.height-20, 'hygiene', 'hygiene')
        ];

    }

    HUD.prototype = Object.create(Phaser.Group.prototype);
    HUD.prototype.constructor = HUD;

    HUD.prototype.update = function () {
        for (lcvMeters = 0; lcvMeters < this.meters.length; lcvMeters++) {
            this.updateMeter(this.meters[lcvMeters]);
        }
    };
    
    HUD.prototype.createMeter = function (x, y, property, label) {
        var meter = new Phaser.Group(game);
        meter.x = x;
        meter.y = y;
        meter.property = property;
        
        var meterLabelStyle = { font: "10px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" };
        
        meter.add(new Phaser.Text(game, 0, 0, label, meterLabelStyle));
        
        meter.add(new Phaser.Sprite(game, 60, 2, 'meter'));
        meter.fill = meter.add(new Phaser.Sprite(game, 62, 4, 'meter-fill'));
        
        this.add(meter);
        
        return meter;
    };
    
    HUD.prototype.updateMeter = function (meter) {
        meter.fill.width = game.person[meter.property];
    };

    return HUD;
});