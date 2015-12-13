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
        Phaser.Sprite.call(this, game, x, y-game.height, 'person');
        this.anchor.set(0.5);
        this.animations.add('walk', [0,1,2,3,4], 10);

        // Enable physics.
        game.physics.enable(this);
        
        this.queueNewPlayer = true;
        
        // Initial stats.
        this.health = 100;
        this.satiation = 100;
        this.hydration = 100;
        this.affection = 100;
        this.hygiene = 100;
        
        this.moveSpeed = 80;
        this.targetLocation = {
            x: this.x,
            y: this.y
        };
        
        this.growth = {
            rate: Phaser.Timer.SECOND*15,
            amount: 1.5
        };
        game.time.events.loop(this.growth.rate, this.grow, this);
        
        this.satiationReduction = {
            rate: Phaser.Timer.SECOND*15,
            amount: 5
        };
        game.time.events.loop(this.satiationReduction.rate, this.reduceSatiation, this);
        
        this.hydrationReduction = {
            rate: Phaser.Timer.SECOND*10,
            amount: 8
        };
        game.time.events.loop(this.hydrationReduction.rate, this.reduceHydration, this);
        
        this.affectionReduction = {
            rate: Phaser.Timer.SECOND*20,
            amount: 10
        };
        game.time.events.loop(this.affectionReduction.rate, this.reduceAffection, this);
        
        this.hygieneReduction = {
            rate: Phaser.Timer.SECOND*30,
            amount: 20
        };
        game.time.events.loop(this.hygieneReduction.rate, this.reduceHygiene, this);
        
        
        // Signals
        this.events.onLeaveNest = new Phaser.Signal();
        this.events.onDeath = new Phaser.Signal();
        
    }

    Person.prototype = Object.create(Phaser.Sprite.prototype);
    Person.prototype.constructor = Person;

    Person.prototype.update = function () {
        
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        
        if (this.queueNewPlayer) {
            if (!this.inCamera) {
                this.enterNewPerson();
            }
        }
        
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
        
        this.startCameraFollow();
        
        // Decide to rest 99% of the time.
        var restChance = this.game.rnd.integerInRange(0, 100);
        if (restChance <= 99) return;
        
        // We decided to pick a new random target.
        this.targetLocation.x = this.game.rnd.integerInRange(game.width, game.world.width - game.width);
        this.targetLocation.y = this.game.rnd.integerInRange(game.height, game.world.height - game.height);
        
    };
    
    Person.prototype.resetAll = function (amount) {
        // Reset scale.
        this.scale.x = 1;
        this.scale.y = 1;
        
        // Position new person and move them into the camera.
        this.x = Math.round(game.camera.x + (game.camera.width / 2));
        this.y = game.camera.y - this.height;
        this.targetLocation.x = this.x;
        this.targetLocation.y = Math.round(this.y + (this.height * 2) + (game.camera.height / 2));
        
        // Reset stats.
        this.health = 100;
        this.satiation = 100;
        this.hydration = 100;
        this.affection = 100;
        this.hygiene = 100;
    };
    
    Person.prototype.damage = function (amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            
            // Die.
            this.die();
        }
    };
    
    Person.prototype.heal = function (amount) {
        this.health += amount;
        if (this.health > 100) {
            this.health = 100;
        }
    };
    
    Person.prototype.die = function () {
        this.stopCameraFollow();
        this.queueNewPlayer = true;
        
        // Notify game of the death!
        this.events.onDeath.dispatch();
        
        this.resetAll();
    };
    
    Person.prototype.grow = function () {
        // Don't grow if life sucks.
        if (this.satiation < 80 ||
            this.hydration < 80 ||
            this.affection < 80 ||
            this.hygiene < 80) return;
        
        // TODO: Win.
        if (this.scale.x >= 4) {
            this.leaveTheNest();
            return;
        }
        
        // Grow if we made it this far.
        this.scale.x *= this.growth.amount;
        this.scale.y *= this.growth.amount;
    };
    
    Person.prototype.startCameraFollow = function () {
        game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);
    };
    
    Person.prototype.stopCameraFollow = function () {
        game.camera.unfollow();
    };
    
    Person.prototype.leaveTheNest = function () {
        if (!this.queueNewPlayer) {
            this.stopCameraFollow();
            this.queueNewPlayer = true;
            // We decided to pick a new random target.
            this.targetLocation.x = game.camera.x - this.width;
            this.targetLocation.y = this.y;
            
            // Notify game of another successful human adult leaving the nest!
            this.events.onLeaveNest.dispatch();
        }
    };
    
    Person.prototype.enterNewPerson = function () {
        this.queueNewPlayer = false;
        this.resetAll();
    };
    
    Person.prototype.reduceSatiation = function () {
        this.satiation -= this.satiationReduction.amount;
        if (this.satiation <= 0) {
            this.satiation = 0;
            
            // Damage the person.
            this.damage(this.satiationReduction.amount);
        }
    };
    
    Person.prototype.reduceHydration = function () {
        this.hydration -= this.hydrationReduction.amount;
        if (this.hydration <= 0) {
            this.hydration = 0;
            
            // Damage the person.
            this.damage(this.hydrationReduction.amount);
        }
    };
    
    Person.prototype.reduceAffection = function () {
        this.affection -= this.affectionReduction.amount;
        if (this.affection <= 0) {
            this.affection = 0;
            
            // Damage the person.
            this.damage(this.affectionReduction.amount);
        }
    };
    
    Person.prototype.reduceHygiene = function () {
        this.hygiene -= this.hygieneReduction.amount;
        if (this.hygiene <= 0) {
            this.hygiene = 0;
            
            // Damage the person.
            this.damage(this.hygieneReduction.amount);
        }
    };
    
    Person.prototype.capStats = function () {
        if (this.health > 100) this.health = 100;
        if (this.satiation > 100) this.satiation = 100;
        if (this.hydration > 100) this.hydration = 100;
        if (this.affection > 100) this.affection = 100;
        if (this.hygiene > 100) this.hygiene = 100;
        
        if (this.health <= 0) {
            this.health = 0;
        }
        if (this.satiation <= 0) {
            this.satiation = 0;
        }
        if (this.hydration <= 0) {
            this.hydration = 0;
        }
        if (this.affection <= 0) {
            this.affection = 0;
        }
        if (this.hygiene <= 0) {
            this.hygiene = 0;
        }
    };
    
    Person.prototype.give = function (gift) {
        switch (gift) {
            case 'protein powder':
                this.satiation += 10;
                this.hydration -= 8;
                break;
            case 'protein paste':
                this.satiation += 10;
                this.hydration += 3;
                break;
            case 'meat':
                this.satiation += 20;
                break;
            case 'water':
                this.hydration += 20;
                this.hygiene += 5;
                break;
            case 'coffee':
                this.hydration += 3;
                this.satiation += 3;
                this.affection -= 6;
                this.hygiene += 16;
                break;
            case 'green shake':
                this.hydration += 20;
                this.satiation += 20;
                break;
            case 'kisses':
                this.affection += 15;
                break;
            case 'adult kisses':
                this.affection += 30;
                this.hygiene -= 30;
                break;
            case 'sponge bath':
                this.affection += 10;
                this.hygiene += 50;
                break;
            default:
                break;
        }
        
        this.capStats();
        if (this.health > 100) this.health = 100;
        if (this.satiation > 100) this.satiation = 100;
        if (this.hydration > 100) this.hydration = 100;
        if (this.affection > 100) this.affection = 100;
        if (this.hygiene > 100) this.hygiene = 100;
    };

    return Person;

});