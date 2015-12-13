define([
    'phaser'
], function (Phaser) { 
    'use strict';

    // Shortcuts
    var game, self;

    function Person (_game, x, y) {

        game = _game;
        self = this;

        // Initialize sprite
        Phaser.Sprite.call(this, game, x, y, 'person');
        this.anchor.set(0.5);
        this.animations.add('walk', [0,1,2,3,4], 10);

        // Enable physics.
        game.physics.enable(this);
     
        // Initial stats.
        this.health = this.maxHealth = 1;
        this.hunger = 1;
        this.thirst = 1;
        this.affection = 1;
        this.adrenaline = 1;
        
        this.moveSpeed = 40;
        this.targetLocation = {
            x: this.x,
            y: this.y
        };

        // Signals
        this.events.onHeal = new Phaser.Signal();
        this.events.onDamage = new Phaser.Signal();
        this.events.onDeath = new Phaser.Signal();
        
    }

    Person.prototype = Object.create(Phaser.Sprite.prototype);
    Person.prototype.constructor = Person;

    Person.prototype.update = function () {
        
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        
        this.decideNextTarget();
        this.moveToTarget(this.targetLocation);
        
        
        // Call up!
        Phaser.Sprite.prototype.update.call(this);
    };
    
    Person.prototype.moveToTarget = function (target) {
        // Don't try moving if we're already there.
        if (Math.abs(this.x-target.x) < this.moveSpeed &&
            Math.abs(this.y-target.y) < this.moveSpeed) return;
        
        // We decided to move.
        game.physics.arcade.moveToXY(this, target.x, target.y, this.moveSpeed);
        this.animations.play('walk');
    },
    
    Person.prototype.decideNextTarget = function () {
        // Don't get distracted until we reach our target location.
        if (Math.abs(this.x-this.targetLocation.x) > this.moveSpeed ||
            Math.abs(this.y-this.targetLocation.y) > this.moveSpeed) return;
        
        // Decide to rest 99% of the time.
        var restChance = this.game.rnd.integerInRange(0, 100);
        if (restChance <= 99) return;
        console.log(restChance);
        
        // We decided to pick a new random target.
        this.targetLocation.x = this.game.rnd.integerInRange(game.width, game.world.width - game.width);
        this.targetLocation.y = this.game.rnd.integerInRange(game.height, game.world.height - game.height);
        
    };

    return Person;

});