(function () {
    'use strict';

    requirejs.config({
        baseUrl: "src/",
        
        paths: {
            phaser: 'lib/phaser/build/phaser.min'
        },

        shim: {
            'phaser': {
                exports: 'Phaser'
            }
        }
    });
 
    require(['phaser', 'game'], function (Phaser, Game) {
        var game = new Game();
        game.start();
    });
}());