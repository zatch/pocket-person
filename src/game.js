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
        },

        preload: function() {
            this.game.load.atlas('person', 'assets/person.png', 'assets/person.json');
            this.game.load.image('frame', 'assets/frame.png');
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