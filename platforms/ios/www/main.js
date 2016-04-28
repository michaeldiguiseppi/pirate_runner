// Global Variables
var
  game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'game'),
  Main = function () {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer;




Main.prototype = {

  preload: function () {
    game.load.image('stars',    'assets/images/stars.jpg');
    game.load.image('loading',  'assets/images/loading.png');
    game.load.image('brand',    'assets/images/logo.png');
    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/Splash.js');
    game.load.image('ground', 'assets/gray.png');
    game.load.image('box', 'assets/RTS_Crate.png');
    game.load.image('coin', 'assets/coin_01.png');
    game.load.spritesheet('hero', 'assets/Run.png', 33.6, 50, 8);
    game.load.image('jump-button', 'assets/jump-Button.png');
    game.load.image('flip-button', 'assets/flip-Button.png');
    game.load.image('background', 'assets/pirate.jpg');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');
