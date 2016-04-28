var Game = function(game) {};

Game.prototype = {

  preload: function () {
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;


  },
  velocity: -300,
  gravity: 1000,
  jumpHeight: 500,
  fps: 15,
  create: function () {
    this.stage.disableVisibilityChange = false;

      console.log("Game is running!");

    if (game.device.desktop === false) {
      // set the scaling mode to SHOW_ALL to show all the game
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      // set a minimum and maximum size for the game
      // here the minimum is half the game size
      // and the maximum is the original game size
      game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);

    }

    background = game.add.tileSprite(0, 0, game.width, game.height, 'background');

    // center the game horizontally and vertically
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = game.add.sprite(33.6, 50, 'hero');

    var walk = this.player.animations.add('walk');
    this.player.animations.play('walk', this.fps, true);

    this.score = 0;
    this.labelScore = game.add.text(20, 20, '0', {font: "30px Arial", fill: 'white'});

    //Iphone Flip buttons
    buttonJump = this.game.add.button(50,600, 'jump-button', this.jump, this, 2, 1, 0);
    buttonFlip = this.game.add.button(1150,600, 'flip-button', this.flip, this, 2, 1, 0);

    game.physics.arcade.enable(this.player);

    this.player.body.gravity.y = this.gravity;
    this.player.anchor.setTo(0.5, 0.5);

    //Desktop Flip Control
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    spaceKey.onDown.add(this.jump, this);
    downKey.onDown.add(this.flip, this);

    this.game.world.width = 50000;

    this.ground = this.add.tileSprite(0, this.game.height- 375, this.game.world.width, 50, 'ground');
    this.game.world.bringToTop(this.ground);

    this.game.physics.arcade.enable(this.ground);

    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;

    this.timer = game.time.events.loop(100, this.addBoxes, this);

    this.boxes = game.add.group();
    this.coins = game.add.group();
    this.increaseTimer = game.time.events.loop(15000, this.increaseVelocity, this);



  },
  gameOver: function(){
        // When the paus button is pressed, we pause the game
      console.log(window.localStorage.getItem("scoresObj"));
      if (window.localStorage.getItem("scoresObj")){
          var scores = JSON.parse(window.localStorage.getItem("scoresObj"));
          console.log(scores);
          var length = Object.keys(scores);
          var gameNum = +length + 1;
          var score = this.score;
          scores[gameNum] = score;

          window.localStorage.setItem("scoresObj", JSON.stringify(scores));
          console.log(JSON.parse(window.localStorage.getItem("scoresObj")));
      } else {
          window.localStorage.setItem("scoresObj", JSON.stringify({1: this.score}));
      }

      var data = JSON.stringify({
           "name": "Danny Robinson",
           "score": this.score
         });

         var xhr = new XMLHttpRequest();
         xhr.withCredentials = true;

         xhr.addEventListener("readystatechange", function () {
           if (this.readyState === 4) {
             console.log(this.responseText);
           }
         });

         xhr.open("POST", "https://pirate-runner.herokuapp.com/score");
         xhr.setRequestHeader("content-type", "application/json");
         xhr.setRequestHeader("cache-control", "no-cache");

         xhr.send(data);

         game.state.start('GameOver');

  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground, null, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.game.physics.arcade.overlap(this.player, this.boxes, this.playerHit, null, this);

  },
  playerHit: function() {
   game.time.events.remove(this.timer);
   this.boxes.forEach(function(box) {
     box.body.velocity.x = 0;
   }, this);
   this.gameOver();
  },
  jump: function() {
    var animation = game.add.tween(this.player);

    animation.to({angle: this.player.angle + 360}, 300);

    if (this.player.body.touching.down) {
      this.player.body.velocity.y = -(this.jumpHeight);
      animation.start();
    } else if ( this.player.body.touching.up) {
      this.player.body.velocity.y = this.jumpHeight;
      animation.start();
    }
  },
  flip: function() {
    var animation;
    if ( this.player.body.touching.down ){
      this.player.x = 50;
      this.player.y = 450;
      this.player.scale.y = -1;
      this.player.body.gravity.y = -(this.gravity);
    } else if ( this.player.body.touching.up ){
      this.player.x = 50;
      this.player.y = 350;
      this.player.scale.y = 1;
      this.player.body.gravity.y = this.gravity;
    }
  },
  addBox: function(x, y, velocity) {
    var box = game.add.sprite(x, y, 'box');

    this.boxes.add(box);

    game.physics.arcade.enable(box);

    box.body.velocity.x = this.velocity;

    box.checkWorldBounds = true;
    box.outOfBoundsKill = true;
  },
  incrementer: 0,
  increaseVelocity: function() {
    this.velocity -= 100;
    this.gravity += 400;
    this.jumpHeight += 50;
    this.fps += 2;
  },
  heights: [480, 325, 425, 260],
  addBoxes: function() {
    this.incrementer++;
    var rand = Math.floor(Math.random() * 10);
    if ( rand > 7 && this.incrementer > 5){
      this.incrementer = 0;
      var randHeight = Math.floor(Math.random() * 4);
      this.addBox(1334, this.game.height-this.heights[randHeight], this.velocity);
      if (rand > 8 ){
         switch (this.heights[randHeight]){
           case 260:
             this.addCoin(1334, this.game.height-this.heights[randHeight] - 55, this.velocity);
           break;
           case 325:
             this.addCoin(1334, this.game.height-this.heights[randHeight] + 75, this.velocity);
           break;
           case 425:
             this.addCoin(1334, this.game.height-this.heights[randHeight] - 75, this.velocity);
           break;
           case 480:
             this.addCoin(1334, this.game.height-this.heights[randHeight] + 55, this.velocity);
           break;
         }
       }
       //End Add Coint Functionality
    }
  },
  addCoin: function(x, y, velocity){
     var coin = game.add.sprite(x, y, 'coin');
     coin.height = 50;
     coin.width = 50;
     this.coins.add(coin);
     game.physics.arcade.enable(coin);
     coin.body.velocity.x = this.velocity;
     coin.checkWorldBounds = true;
     coin.outOfBoundsKill = true;
   },
   collectCoin: function(){
     //Below is the function to destroy the coin.
     this.coins.getFirstAlive().destroy();
     this.score += 1;
     this.labelScore.text = this.score;
   },
};
