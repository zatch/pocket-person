define([
    'phaser',
    'person',
    'hud',
    'menu'
], function (Phaser, Person, HUD, Menu) { 
    'use strict';
    
    // Shortcuts
    var game, keyboard, start, select, person, background, hud, menu, junk;

    // Default starting properties/state of the game world. These properties
    // can be overridden by passing a data object to the Play state.
    var initialState,
        defaultInitialState = {
            person: {
                health: null,
                hunger: null,
                thirst: null,
                affection: null,
                hygiene: null
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
            
            // World set-up
            this.game.world.setBounds(0, 0, 1400, 1400);
            background = this.add.tileSprite(0,0,game.world.width,game.world.height,'background');
            this.generateJunk(['banana', 'apple', 'orange']);
            
            // Player set-up
            person = new Person(game, game.world.width/2, game.world.height/2);
            person.events.onLeaveNest.add(this.onPersonLeaveNest);
            person.events.onDeath.add(this.onPersonDeath);

            game.add.existing(person); // Add person to game.
            game.person = person; // Make person accessible via game object.

            // Apply prior person state (if it exists).
            person.health       = initialState.person.health ? initialState.person.health : person.health;
            person.satiation    = initialState.person.satiation ? initialState.person.satiation : person.satiation;
            person.hydration    = initialState.person.hydration ? initialState.person.hydration : person.hydration;
            person.affection    = initialState.person.affection ? initialState.person.affection : person.affection;
            person.hygiene      = initialState.person.hygiene ? initialState.person.hygiene : person.hygiene;

            
            // Add HUD.
            game.personsGrown = 0;
            game.personsDead = 0;
            hud = new HUD(game);
            game.add.existing(hud);
            
            // Add Menu.
            menu = new Menu(game);
            game.add.existing(menu);
            
            // On-screen buttons.
            start = game.add.button(460, game.height - 30, 'start-button', this.onStartPressed, this, 1, 0, 2);
            start.fixedToCamera = true;
            select = game.add.button(524, game.height - 30, 'select-button', this.onSelectPressed, this, 1, 0, 2);
            select.fixedToCamera = true;
        
            // Keyboard input set-up
            keyboard = game.input.keyboard.createCursorKeys();
            keyboard.buttons = {
                start: game.input.keyboard.addKey(Phaser.Keyboard.COMMA),
                select: game.input.keyboard.addKey(Phaser.Keyboard.PERIOD)
            };
            
            keyboard.buttons.start.onDown.add(this.onStartPressed, this);
            keyboard.buttons.select.onDown.add(this.onSelectPressed, this);
            
            game.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.onToggleFullscreen, this);
            
            // Physics engine set-up
            game.physics.startSystem(Phaser.Physics.ARCADE);
        },
        
        generateJunk: function (keysArray) {
            junk = game.add.group();
            
            var numJunk = this.game.rnd.integerInRange(25, 35);
            var x, y, junkKey;
            for (var i = 0; i < numJunk; i++) {
                x = this.game.rnd.integerInRange(0, game.world.width);
                y = this.game.rnd.integerInRange(0, game.world.height);
                junkKey = this.game.rnd.integerInRange(0, keysArray.length-1);
                junk.create(x, y, keysArray[junkKey]);
            }
        },
        
        onStartPressed: function () {
            if (!menu.visible) {
                menu.show();
            }
            else {
                menu.confirm();
            }
        },
        
        onSelectPressed: function () {
            if (menu.visible) {
                menu.select();
            }
        },
        
        onToggleFullscreen: function () {
            if(game.scale.isFullScreen) {
                game.scale.stopFullScreen();
            } else {
                game.scale.startFullScreen();
            }
        },

        onPersonLeaveNest: function () {
            game.personsGrown++;
        },

        onPersonDeath: function () {
            game.personsDead++;
            var newlyDead = junk.create(person.x-person.width/2, person.y, 'dead-person');
            newlyDead.scale.x = person.scale.x;
            newlyDead.scale.y = person.scale.y;
        }
    };
});