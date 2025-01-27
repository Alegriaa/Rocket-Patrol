let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],  // order is important 
};

let game = new Phaser.Game(config);

// reserve some keyboard variables

let keyF, keyLEFT, keyRIGHT;

// define game settings

game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}