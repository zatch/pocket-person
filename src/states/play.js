define([
    'phaser',
    'person'

], function (Phaser, Person) { 
    'use strict';
    
    // Shortcuts
    var game, keyboard, person, background, junk;

    // Default starting properties/state of the game world. These properties
    // can be overridden by passing a data object to the Play state.
    var initialState,
        defaultInitialState = {
            person: {
                health: null,
                hunger: null,
                thirst: null,
                affection: null,
                adrenaline: null
            }
        };

    return {
        // Intro
        init: function (data) {

            // Shortcut variables.
            game = this.game;

            // Generate initial game world state data.
            initialState = Phaser.Utils.extend(true, {}, defaultInitialState, data);

        },
        
        // Main
        create: function () {

            var self = this;
            
            // World set-up
            this.game.world.setBounds(0, 0, 1400, 1400);
            background = this.add.tileSprite(0,0,game.world.width,game.world.height,'background');
            this.generateJunk();
            
            // Player set-up
            person = new Person(game, game.world.width/2, game.world.height/2);
            person.events.onHeal.add(this.onPersonHeal);
            person.events.onDamage.add(this.onPersonDamage);
            person.events.onDeath.add(this.onPersonDeath);

            game.add.existing(person); // Add person to game.
            game.person = person; // Make person accessible via game object.

            // Apply prior person state (if it exists).
            person.health       = initialState.person.health ? initialState.person.health : person.health;
            person.hunger       = initialState.person.hunger ? initialState.person.hunger : person.hunger;
            person.thirst       = initialState.person.thirst ? initialState.person.thirst : person.thirst;
            person.affection    = initialState.person.affection ? initialState.person.affection : person.affection;
            person.adrenaline   = initialState.person.adrenaline ? initialState.person.adrenaline : person.adrenaline;

            // Keyboard input set-up
            keyboard = game.input.keyboard.createCursorKeys();
            keyboard.buttons = {
                option: game.input.keyboard.addKey(Phaser.Keyboard.COMMA),
                select: game.input.keyboard.addKey(Phaser.Keyboard.PERIOD)
            };
            
            keyboard.buttons.option.onDown.add(this.onOptionPressed, this);
            keyboard.buttons.select.onDown.add(this.onSelectPressed, this);
            
            game.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.onToggleFullscreen, this);
            
            // Physics engine set-up
            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            // Camera
            game.camera.follow(person, Phaser.Camera.FOLLOW_PLATFORMER);
            game.scale.startFullScreen();
        },

        render: function () {
            
        },

        update: function () {
            
        },

        shutdown: function () {
            // This prevents occasional momentary "flashes" during state transitions.
            //game.camera.unfollow();
        },
        
        generateJunk: function () {
            junk = game.add.group();
            
            var numBananas = this.game.rnd.integerInRange(10, 20);
            var banana;
            for (var i = 0; i < numBananas; i++) {
                // Add sprite within an area excluding the beginning and ending of
                // the game world, so items won't suddenly appear or disappear
                // when wrapping.
                var x = this.game.rnd.integerInRange(game.width, game.world.width - game.width);
                var y = this.game.rnd.integerInRange(game.height, game.world.height - game.height);
                banana = junk.create(x, y, 'banana');
            }
        },
        
        onOptionPressed: function () {
            console.log('option');
        },
        
        onSelectPressed: function () {
            console.log('select');
        },
        
        onToggleFullscreen: function () {
            if(game.scale.isFullScreen) {
                game.scale.stopFullScreen();
            } else {
                game.scale.startFullScreen();
            }
        },

        onPersonDamage: function (person, amount) {
            console.log('health: ', person.health);
        },

        onPersonHeal: function (person, amount) {
            console.log('health: ', person.health);
        },

        onPersonDeath: function (person) {
            console.log('death');
        }
    };
});