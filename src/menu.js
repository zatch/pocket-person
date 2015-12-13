define([
    'phaser'
], function (Phaser) { 
    'use strict';

    var game, gump, gumpSelection;

    function Menu (_game) {

        game = _game;

        Phaser.Group.call(this, game);
        
        // Fix to camera.
        this.x = 460;
        this.y = game.height - 120;
        this.fixedToCamera = true;
        
        gump = new Phaser.Sprite(game, 460, game.height - 114, 'menu');
        this.add(gump);
        
        // Add selection.
        gumpSelection = new Phaser.Sprite(game, gump.x+2, gump.y+4, 'menu-selection');
        this.add(gumpSelection);
        
        this.gumpOptionStyle = { font: "14px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };
        this.gumpOptions = [
            this.add(new Phaser.Text(game, gump.x+10, gump.y+4, 'null', this.gumpOptionStyle)),
            this.add(new Phaser.Text(game, gump.x+10, gump.y+4+18, 'null', this.gumpOptionStyle)),
            this.add(new Phaser.Text(game, gump.x+10, gump.y+4+36, 'null', this.gumpOptionStyle)),
            this.add(new Phaser.Text(game, gump.x+10, gump.y+4+54, 'null', this.gumpOptionStyle))
        ];
        
        
        /*this.optionTree = {
            feed: ['protien powder', 'protien paste', 'meat', 'back'],
            hydrate: ['water', 'coffee', 'green shake', 'back'],
            love: ['kisses', 'adult kisses', 'injection', 'back'],
            cancel: 'cancel'
        };*/
        this.optionTree = [
            {
                label: 'feed',
                options: [
                    {label: 'protein powder'},
                    {label: 'protein paste'},
                    {label: 'meat'},
                    {label: 'back'}
                ]
            },
            {
                label: 'hydrate',
                options: [
                    {label: 'water'},
                    {label: 'coffee'},
                    {label: 'green shake'},
                    {label: 'back'}
                ]
            },
            {
                label: 'love',
                options: [
                    {label: 'kisses'},
                    {label: 'adult kisses'},
                    {label: 'sponge bath'},
                    {label: 'back'}
                ]
            },
            {label: 'cancel'}
        ];
        this.options = this.optionTree;
        this.selected = 0;
        this.location = undefined;
        
        this.hide();

    }

    Menu.prototype = Object.create(Phaser.Group.prototype);
    Menu.prototype.constructor = Menu;

    Menu.prototype.update = function () {
        gumpSelection.y = gump.y + 4 + (this.selected * 18);
    };

    Menu.prototype.show = function () {
        this.location = undefined;
        this.populate();
        
        this.visible = true;
    };

    Menu.prototype.hide = function () {
        this.visible = false;
    };

    Menu.prototype.confirm = function () {
        var selection = this.options[this.selected].label;
        switch (selection) {
            case 'cancel':
                this.hide();
                break;
            case 'back':
                this.location = undefined;
                this.populate();
                break;
            default:
                if (this.options[this.selected].options) {
                    this.location = this.selected;
                    this.populate();
                }
                else {
                    game.person.give(selection);
                    this.hide();
                }
                break;
        }
    };

    Menu.prototype.select = function () {
        this.selected++;
        if (this.selected > 3) this.selected = 0;
    };
    
    Menu.prototype.populate = function () {
        // Use the regular menu options if there's a person.
        if (game.person) {
            this.options = this.optionTree;
            if(typeof this.location !== "undefined") {
                this.options = this.options[this.location].options;
            }
        }
        // Give the player an option to create a new person.
        else {
            this.options = [{label: 'new person'}];
        }
        
        for (var lcv = 0; lcv < this.options.length; lcv++) {
            this.gumpOptions[lcv].setText(this.options[lcv].label);
        }
        
        this.selected = 0;
    };
    

    return Menu;
});