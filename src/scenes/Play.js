class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png',
            { frameWidth: 64, frameHeight: 32, starFrame: 0, endFrame: 9 });
    }

    create() {
        // first thing you add in create will be the last thing rendered 
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFACADE).setOrigin(0, 0);

        // green UI background

        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);
        this.add.text(20, 20, "Rocket Patrol Play");
        // 0,0 is upper left 

        // add spaceship
        this.ship01 = new Spaceship(this, game.config.width + 100, 160, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 223, 225, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width + 60, 270, 'spaceship', 0, 10).setOrigin(0, 0);

        // add rocket (p1)
        // constructor(scene, x, y, texture, frame)
        this.p1Rocket = new Rocket(this, game.config.width / 2, 431, 'rocket')
            .setScale(0.5, 0.5);

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({ // used to access Phaser's animation manager.
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0, end: 9, first: 0
            }),
            frameRate: 30
        });

        // score 
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100

        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, '(F)ire to Restart or <- for Menu',
                scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        },
            null, this);
    }

    update() {

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }


        // scroll satrfield every frame
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) { // this locks player input

            this.p1Rocket.update(); // updating rocket

            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }


    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;

        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0; // hiding the ship, every sprite object has an alpha setting 
        // creating explosion sprite at ship's position

        let boom = this.add.sprite(ship.x, ship.y, 'explosion');
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { // callback after animation completes
            ship.reset();   // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion'); // one-off sound instead of instance 

    }



}