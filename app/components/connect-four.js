/*
This .js file is the main body of the coding for the Connect
Four game and will first import Ember, the framework for the entire app
*/
import Ember from 'ember';

export default Ember.Component.extend({
  /*this variable is used to define when the game is running. It will always
  begin at "false" and change to true upon starting the game function*/
  playing: false,
  /*The winner and draw variables will be set to undefined and false at this
  point, with the ability to change at each turn in the game where a check will
  be made to see if there is a win or draw scenario*/
  winner: undefined,
  draw: false,
  /*this "init: function" element looks up the sounds used throughout the game
  in the jsSound library*/
  init: function(){
    this._super(...arguments);
    createjs.Sound.registerSound("assets/sounds/click.wav", "place-marker");
    createjs.Sound.registerSound("assets/sounds/falling.mp3", "falling");
  },
  /*This section of the code creates the board by creating a new jsShape and
  assigning it the name 'stage'*/
  didInsertElement: function() {
    var stage = new createjs.Stage(this.$('#stage')[0]);
    var board = new createjs.Shape();
    var graphics = board.graphics;
    /*Colour is added and rectangles drawn in order for the user to see the
    board that it will be played upon*/
    graphics.beginFill('#393f4d');
    //First the outer edge lines of the board
    /*The first coordinate is the starting x coordinate, the second is the
    starting y coordinate, the third is the ending x coordinate and the fourth
    is the ending y coordinate, so in the case of the first rectangle drawn,
    it will begin at the top left hand corner of the stage (0, 0) and finish at
    (350, 4), creating a rectangle that will be 350 wide and 4 thick, a good
    line for the game border. This process is repeated to make a grid structure*/
    graphics.drawRect(0, 0, 350, 4);
    graphics.drawRect(350, 0, 4, 300);
    graphics.drawRect(0, 0, 4, 300);
    graphics.drawRect(0, 300, 350, 4);

    //Horizontal lines
    graphics.drawRect(50, 0, 4, 300);
    graphics.drawRect(100, 0, 4, 300);
    graphics.drawRect(150, 0, 4, 300);
    graphics.drawRect(200, 0, 4, 300);
    graphics.drawRect(250, 0, 4, 300);
    graphics.drawRect(300, 0, 4, 300);

    //Vertical lines
    graphics.drawRect(0, 50, 350, 4);
    graphics.drawRect(0, 100, 350, 4);
    graphics.drawRect(0, 150, 350, 4);
    graphics.drawRect(0, 200, 350, 4);
    graphics.drawRect(0, 250, 350, 4);

    /*These two set the distance that the board sits away from the top corner of
    the stage purely for aesthetic reasons. This means the board will be 10
    across on the x axis and 20 down on the y axis to create a good border from
    the other elements in the game frame, such as the header and the start button*/
    board.x = 10;
    board.y = 20;
    //this sets the initial alpha of the board to zero (invisible) and will be
    //utilised later for an animation
    board.alpha = 0;
    this.set('board', board);
    //this adds the board element to the stage
    stage.addChild(board);
    //this variable holds the two markers for the two players
    var markers = {
      'a': [],
      'b': []
    }
    /*This for loop sets the initial marker count (0), a marker limit (21) and
    allows for the count to go up from 0 to 21. Due to the board having 42 spaces
    each player will only require 21 markers. This will stop the game adding
    additional markers following the conclusion of the game*/
    for(var a = 0; a < 21; a++) {
      /*This creates the shape of the marker 'a' and adds it to the variable
      created above. It fills it with a colour and adjusts the size to 19, which
      is the perfect size for the grid created above. It then sets the initial
      visibility to 'false' so that the markers cannot be seen until used by the
      player*/
      var aMarker = new createjs.Shape();
      graphics = aMarker.graphics;
      graphics.beginFill('#feda6a');
      graphics.drawCircle(0, 0, 19);
      aMarker.visible = false;
      stage.addChild(aMarker);
      markers.a.push(aMarker);
      /*The above process is repeated for the second player but with a different
      colour*/
      var bMarker = new createjs.Shape();
      graphics = bMarker.graphics;
      graphics.beginFill('#393f4d');
      graphics.drawCircle(0, 0, 19);
      bMarker.visible = false;
      stage.addChild(bMarker);
      markers.b.push(bMarker);
    }
    /*This line allows the animations and sounds to initialise upon starting a
    game*/
    createjs.Ticker.addEventListener("tick", stage);

    this.set('markers', markers);
    this.set('stage', stage);
    //stage.addChild(board);
  },

  /*Initalises the click events for player use*/
  click: function(ev) {
    /*If statement utilised in order to only allow the player to place markers
    if the playing variable is set to playing and if there is no winner*/
    if(this.get('playing') && !this.get('winner')) {
      /*Nested if statement allows placement of the markers. The offsetX and
      offsetY take into account the earlier placement of the board against the
      stage of the game, meaning that the player can only click within the boundaries
      of the board*/
      if(ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >= 10 && ev.offsetY >= 20 && ev.offsetX < 360 && ev.offsetY < 320) {
        /*these variables place the markers by taking into account the offsetX
        and offsetY and dividing 50 in order to place the marker within the centre
        of the clicked grid space*/
        var x = Math.floor((ev.offsetX - 10) / 50);
        var y = Math.floor((ev.offsetY - 20) / 50);
        var state = this.get('state');

        /*This variable then sets the y coordinate of the placed marker to 5,
        making it go to the bottom of the clicked column, whilst the x remains
        the same in order to stay in the correct column*/
        var y = 5;
        var state = this.get('state');
        /*This while statement checks the column for previously placed markers
        and minuses one from the y coordinate if there is a marker in the space,
        meaning the placed marker for this turn will sit on top of previously
        placed markers*/
        while(state[x][y] == 'a' || state[x][y] == 'b'){
          y = y - 1;
        }
        /*This if statement controls the move. It won't allow the player to place
        a marker if the y coordinate is full at 0 (i.e. the top row of the grid)*/
        if(y >= 0) {
          /*This checks who the current player is*/
          var player = this.get('player');
          state[x][y] = player;
          /*A sound is played upon placing the marker*/
          createjs.Sound.play("place-marker");
          var player = this.get('player');
          /*This checks the current move count and the marker set to the current
          player then sets that marker's visibility to true so it can be seen*/
          var move_count = this.get('moves')[player];
          var marker = this.get('markers')[player][move_count];
          marker.visible = true;
          /*This sets the marker in the correct place on the grid using the offsetY
          and offsetX*/
          marker.x = 38 + x * 50;
          marker.y = 48 + y * 50;
          /*This then adds one to the player's move_count so that they can't
          exceed the previously set 21 moves*/
          this.get('moves')[player] = move_count + 1;
          /*This if statement then changes the player*/
          if(player == 'a'){
            this.set('player', 'b')
          } else {
            this.set('player', 'a');
          }
          /*The stage is updated*/
          this.get('stage').update();
          /*And there is a check to see if there is a winner*/
          this.check_winner();
        }
      }
    }
  },
  /*This function is used to check if there is a winner and will be called at the
  end of every move*/
  check_winner: function() {
    /*This nested array holds all of the possible patterns for winning at
    Connect Four*/
    var fours = [
      /*All possible horizontal victories starting at the top left hand corner*/
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[1, 0], [2, 0], [3, 0], [4, 0]],
      [[2, 0], [3, 0], [4, 0], [5, 0]],
      [[3, 0], [4, 0], [5, 0], [6, 0]],

      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[1, 1], [2, 1], [3, 1], [4, 1]],
      [[2, 1], [3, 1], [4, 1], [5, 1]],
      [[3, 1], [4, 1], [5, 1], [6, 1]],

      [[0, 2], [1, 2], [2, 2], [3, 2]],
      [[1, 2], [2, 2], [3, 2], [4, 2]],
      [[2, 2], [3, 2], [4, 2], [5, 2]],
      [[3, 2], [4, 2], [5, 2], [6, 2]],

      [[0, 3], [1, 3], [2, 3], [3, 3]],
      [[1, 3], [2, 3], [3, 3], [4, 3]],
      [[2, 3], [3, 3], [4, 3], [5, 3]],
      [[3, 3], [4, 3], [5, 3], [6, 3]],

      [[0, 4], [1, 4], [2, 4], [3, 4]],
      [[1, 4], [2, 4], [3, 4], [4, 4]],
      [[2, 4], [3, 4], [4, 4], [5, 4]],
      [[3, 4], [4, 4], [5, 4], [6, 4]],

      [[0, 5], [1, 5], [2, 5], [3, 5]],
      [[1, 5], [2, 5], [3, 5], [4, 5]],
      [[2, 5], [3, 5], [4, 5], [5, 5]],
      [[3, 5], [4, 5], [5, 5], [6, 5]],

      /*All possible vertical victory positions starting at the top left hand
      corner*/
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 1], [0, 2], [0, 3], [0, 4]],
      [[0, 2], [0, 3], [0, 4], [0, 5]],

      [[1, 0], [1, 1], [1, 2], [1, 3]],
      [[1, 1], [1, 2], [1, 3], [1, 4]],
      [[1, 2], [1, 3], [1, 4], [1, 5]],

      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[2, 1], [2, 2], [2, 3], [2, 4]],
      [[2, 2], [2, 3], [2, 4], [2, 5]],

      [[3, 0], [3, 1], [3, 2], [3, 3]],
      [[3, 1], [3, 2], [3, 3], [3, 4]],
      [[3, 2], [3, 3], [3, 4], [3, 5]],

      [[4, 0], [4, 1], [4, 2], [4, 3]],
      [[4, 1], [4, 2], [4, 3], [4, 4]],
      [[4, 2], [4, 3], [4, 4], [4, 5]],

      [[5, 0], [5, 1], [5, 2], [5, 3]],
      [[5, 1], [5, 2], [5, 3], [5, 4]],
      [[5, 2], [5, 3], [5, 4], [5, 5]],

      [[6, 0], [6, 1], [6, 2], [6, 3]],
      [[6, 1], [6, 2], [6, 3], [6, 4]],
      [[6, 2], [6, 3], [6, 4], [6, 5]],

      /*All possible victories for diagonals heading up to the right*/
      [[0,3], [1,2], [2,1], [3,0]],
      [[0,4], [1,3], [2,2], [3,1]],
      [[1,3], [2,2], [3,1], [4,0]],
      [[0,5], [1,4], [2,3], [3,2]],
      [[1,4], [2,3], [3,2], [4,1]],
      [[2,3], [3,2], [4,1], [5,0]],
      [[1,5], [2,4], [3,3], [4,2]],
      [[2,4], [3,3], [4,2], [5,1]],
      [[3,3], [4,2], [5,1], [6,0]],
      [[2,5], [3,4], [4,3], [5,2]],
      [[3,4], [4,3], [5,2], [6,1]],
      [[3,5], [4,4], [5,3], [6,2]],
      /*All possible victories for diagonals heading down to the right*/
      [[0,2], [1,3], [2,4], [3,5]],
      [[0,1], [1,2], [2,3], [3,4]],
      [[1,2], [2,3], [3,4], [4,5]],
      [[0,0], [1,1], [2,2], [3,3]],
      [[1,1], [2,2], [3,3], [4,4]],
      [[2,2], [3,3], [4,4], [5,5]],
      [[1,0], [2,1], [3,2], [4,3]],
      [[2,1], [3,2], [4,3], [5,4]],
      [[3,2], [4,3], [5,4], [6,5]],
      [[2,0], [3,1], [4,2], [5,3]],
      [[3,1], [4,2], [5,3], [6,4]],
      [[3,0], [4,1], [5,2], [6,3]],

    ];

    var state = this.get('state');
    /*This for loop checks over the coordinates of the placed markers in order
    to find a match against the coordinates listed in the win scenario nested
    arrays above.*/
    for(var fidx = 0; fidx < fours.length; fidx++) {
      var four = fours[fidx];
      var winner = state[four[0][0]][four[0][1]];

      if(winner) {
        for(var idx = 1; idx < four.length; idx++) {

          if(winner != state[four[idx][0]][four[idx][1]]){
            winner = undefined;

          }
        }
        /*If the above for loop finds a winner then it changes the winner variable
        to winner from undefined. This if statement then checks that variable and
        if it is set to winner then initialises an alert message to notify that
        there is a winner and off the chance to play again*/
        if(winner){
          this.set('winner', winner);
          alert("Winner! Play again?");
          createjs.Sound.play("falling");
          location.reload();
        }
      }
    }
    /*This if statement checks the scenario for a tied game and allows the game
    to continue if no win or tie has been found*/
    if(!this.get('winner')) {
      var tie = true;
      for(var x = 0; x <= 6; x++) {
        for(var y = 0; y <= 5; y++) {
          if(!state[x][y]){
            tie = false;

          }
        }
      }
      this.set('tie', tie);
    }
  },

  actions: {
    /*this function iniatialises the start of the game, which will be called on
    the press of the start button*/
    start: function() {
      /*the board is retrieved, which is set to invisible*/
      var board = this.get('board');
      board.alpha = 0;
      /*an animation is created to fade the board in to visibility*/
      createjs.Tween.get(board).to({alpha: 1}, 1000);
      /*the playing variable is set to true whilst the winner and draw are still
      undefined and false*/
      this.set('playing', true);
      this.set('winner', undefined);
      this.set('draw', false);
      /*this sets the grid to undefined, meaning it will be empty of all markers*/
      this.set('state', [
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined]]);
      /*the move list for each player is set to 0*/
      this.set('moves', {'a': 0, 'b': 0});
      /*this sets the player to move first*/
      this.set('player', 'b');
      /*at the stage is updated again*/
      this.get('stage').update();
    },
    /*this function is to refresh the page if the player decides to play again
    or click the main menu button*/
    main: function() {
      location.reload();
    }
  },

});
