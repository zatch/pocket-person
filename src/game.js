define([
    'phaser',
    'states/play'
], function (Phaser, Play) { 
    'use strict';

    function Game() {    
        console.log('Making the Game');    
    }
    
    Game.prototype = {
        constructor: Game,

        start: function() {
            this.game = new Phaser.Game(600, 400, Phaser.AUTO, '', { 
                preload: this.preload, 
                create: this.create,
                init: this.init
            });

        },

        init: function () {
            this.game.stage.smoothed = false;
            
            // When in full-screen mode, take up as much of the screen as 
            // possible while maintaining game proportions.
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        },

        preload: function() {
            this.game.load.atlas('person', 'assets/person.png', 'assets/person.json');
            this.game.load.atlas('start-button', 'assets/start-button.png', 'assets/start-button.json');
            this.game.load.atlas('select-button', 'assets/select-button.png', 'assets/select-button.json');
            this.game.load.image('menu', 'assets/menu.png');
            this.game.load.image('menu-selection', 'assets/menu-selection.png');
            this.game.load.image('frame', 'assets/frame.png');
            this.game.load.image('meter', 'assets/meter.png');
            this.game.load.image('meter-fill', 'assets/meter-fill.png');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('banana', 'assets/banana.png');
            
            // Can be used for anything that doesn't need a sprite sheet.
            // Workaround for issue: https://github.com/photonstorm/phaser/issues/2173
            this.game.load.image('blank', 'assets/blank.png');
        },
        
        create: function() {
            this.game.state.add('Play', Play);
            this.game.state.start('Play');
        }
    };
    
    return Game;
});