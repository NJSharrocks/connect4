/* This .js file is the main body of the coding for the Connect
Four game and will first import Ember, the framework for the entire app */
import Ember from 'ember';

/*The deepClone function saves the state of the game and is called in the
minimax function, which holds all possible moves when it creates the game
tree*/
function deepClone(state) {

  var new_state = [];
  for(var idx1 = 0; idx1 < state.length; idx1++) {
    new_state.push(state[idx1].slice(0));
  }
  return new_state;
}

/*The check_game_winner function is called later by check_winner when a player
makes their turn. It will circle over the patterns below in order to see if
there is a corresponding pattern within the confines of the playing board, which
will be defined by the state of the grid cells - i.e. if they have changed from
their original 'undefined' state to one being filled with either an 'x' marker
or an 'o' marker*/
function check_game_winner(state) {

  var patterns = [

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

    /*This for loop checks over the coordinates of the placed markers in order
    to find a match against the coordinates listed in the win scenario nested
    arrays above. If there is a pattern match then the check_winner scenario ends
    the game by notifying the players of the winner. If there is no match then
    the loop stops and begins again on the next move.*/

    for(var pidx = 0; pidx < patterns.length; pidx++) {
      var pattern = patterns[pidx];
      var winner = state[pattern[0][0]][pattern[0][1]];
      if(winner) {
        for(var idx = 1; idx < pattern.length; idx++) {
          if(winner != state[pattern[idx][0]][pattern[idx][1]]) {
            winner = undefined;
            break;
          }
        }
        if(winner) {
          return winner;
        }
      }
    }
    
    /*The following for loop checks for the tied game scenario by cycling through
    each cell on the game board grid and checking the status. If one is undefined,
    i.e. empty, then it allows the game to continue. If all cells are full and the
    check_winner hasn't notified of a winner then it will call up the drawn game
    end scenario*/
    var draw = true;
    for(var x = 0; x <= 2; x++) {
      for(var y = 0; y <= 2; y++) {
        if(!state[x][y]) {
          return undefined;
        }
      }
    }
    return '';
}


export default Ember.Component.extend({

  /*The playing variable changes upon initialising the game through the "vs. Computer"
  button and will begin the game process*/
  playing: false,
  /*The winner variable controls when the game is over. The check_winner function
  will change this to true if there is a winner and end the game, notifying the
  players of the winner*/
  winner : undefined,
  /*The draw variable will only change if the draw for loop above finds that all
  grid cells are full but there hasn't been a winner. This will end the game and
  notify the players of a draw*/
  draw: false,

  init: function(){
    /*This initialises the jsSound library to insert sounds into the game, for
    when a marker is placed and for when the game is reset*/
    this._super(...arguments);
    createjs.Sound.registerSound("assets/click.wav", "place-marker");
    createjs.Sound.registerSound("assets/falling.mp3", "falling");
    /*The following line is part of the refactoring process to allow the computer
    player component to work.*/
    var component = this;
  },

  /*This function allows the insertion of elements such as the board graphics
  into the canvas*/
  didInsertElement: function(){

    /*This variable holds and assigns the stage element of the board, which will
    allow the creation of a the grid boundary*/
    var stage = new createjs.Stage(this.$('#stage')[0]);

    /*This is the variable that the board shape will be assigned to*/
    var board = new createjs.Shape();
    var graphics = board.graphics;

    /*The canvas is filled with a dark grey colour*/
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

    /*This sets the initial alpha of the board to zero (invisible) and will be
    utilised later for an animation*/
    board.alpha = 0;
    this.set('board', board);

    /*This adds the board element to the stage previously set up*/
    stage.addChild(board);

    /*This variable holds the two markers for the two players*/
    var markers ={
      'x': [],
      'o': []
    }
    /*This for loop sets the initial marker count (0), a marker limit (21) and
    allows for the count to go up from 0 to 21. Due to the board having 42 spaces
    each player will only require 21 markers. This will stop the game adding
    additional markers following the conclusion of the game*/
    for(var x = 0; x < 21; x++) {

      /*This creates the shape of the marker 'o' and adds it to the variable
      created above. It fills it with a colour and adjusts the size to 19, which
      is the perfect size for the grid created above. It then sets the initial
      visibility to 'false' so that the markers cannot be seen until used by the
      player*/
      var oMarker = new createjs.Shape();
      graphics = oMarker.graphics;
      graphics.beginFill('#feda6a');
      graphics.drawCircle(0, 0, 19);
      oMarker.visible = false;
      stage.addChild(oMarker);
      markers.o.push(oMarker);

      /*The above process is repeated for the 'x' marker*/
      var xMarker = new createjs.Shape();
      graphics = xMarker.graphics;
      graphics.beginFill('#393f4d');
      graphics.drawCircle(0, 0, 19);
      xMarker.visible = false;
      stage.addChild(xMarker);
      markers.x.push(xMarker);
    }

    /*These twp lines assign the markers and stage components names to be called
    upon later*/
    this.set('markers', markers);
    this.set('stage', stage);

    /*This line allows the animations and sounds to initalise upon starting a game*/
    createjs.Ticker.addEventListener("tick", stage);
  },

  /*The click function handles all events during the process of the game where the
  user can click the mouse*/
  click: function(ev) {
    var component = this;

    /*The variables are checked to see if the game is currently in the playing
    state and that there isn't currently a winner*/
    if(component.get('playing') && !component.get('winner')) {

      /*The nested if statement then makes sure the click is within the boundaries
      of the board. The offsetX and offsetY are to take into account the borders of
      the game that were set up previously with the minimum distance taking into account
      the margin that was created and the max distance being the edges of the board to the
      right and bottom */
      if(ev.offsetX >= 10 && ev.offsetY >= 20 && ev.offsetX < 360 && ev.offsetY < 320) {

        /*These variables begin to set the x and y coordinates of the placed
        marker. 10 is taken from the offsetX to take into account the margin
        before it is then divided by 50 to place the marker in the middle of the
        grid cell.
        The y is set to 5 in order to sink the placed marker to the bottom of the
        grid.*/
        var x = Math.floor((ev.offsetX - 10) / 50);
        var y = 5;

        /*The state must be called upon in order to check whether there is a marker
        in the selected grid square. The while loop then ensures that the marker
        can only be placed in the square if it doesn't have an 'x' or 'o' in it -
        i.e. it's undefined. If it does have an 'x' or 'o' in the space then 1 will
        be taken away from the y. This will ensure the marker moves up the grid until
        a free space is found*/
        var state = component.get('state');
        while (state[x][y] == 'x' || state[x][y] == 'o'){
          y = y - 1;
        }

        /*The if statement controls the move, making sure the player cannot place
        their marker if the y is full*/
        if (y >= 0){

          /*This plays a sound from the SoundJS library upon placing a marker*/
          createjs.Sound.play("place-marker");

          /*This ensures the player is currently 'x' and therefore the click
          is registered meaning player markers cannot be placed when it's the
          computer move*/
          state[x][y] = 'x';

          /*The move_count variable is created to store the moves to ensure that
          the moves can't exceed the maximum amount of turns for the game*/
          var move_count = component.get('moves')['x'];
          var marker = component.get('markers')['x'][move_count];

          /*The marker visibility is turned to true so the move can be seen*/
          marker.visible = true;

          /*The placement of the marker is set, taking into account the dimensions
          of the board and the offsetX and offsetY*/
          marker.x = 38 + x * 50;
          marker.y = 48 + y * 50;

          /*There is a check to see if there is a winner*/
          component.check_winner();

          /*The stage is updated with the new marker*/
          component.get('stage').update();

          /*The move_count variable is increased by one*/
          component.get('moves')['x'] = move_count + 1;

          /*The setTimeout function ensures a slight gap in time between the
          human player and the computer player making a move. This is an aesthetic
          choice to make the game seem more like a real game, to simulate the computer
          'thinking'*/
          setTimeout(function(){

            /*This if statement ensures there is no winner and no draw before
            moving on to the computer player move*/
            if(!component.get('winner') && !component.get('draw')){

              /*A sound is played upon the computer making a move*/
              createjs.Sound.play("place-marker");

              /*The computer_move is called upon and sets the move as the 'o' player*/
              var move = component.computer_move(state);
              state[move.x][move.y] = 'o';

              /*The 'o' marker and move_count are then called*/
              marker = component.get('markers')['o'][move_count];
              move_count = component.get('moves')['o'][move_count];

              /*The marker is set to true visibility so it can be seen and the
              x and y coordinates are set with the offsetX and offsetY taken
              into account*/
              marker.visible = true;
              marker.x = 38 + move.x * 50;
              marker.y = 48 + move.y * 50;

              /*1 is added to the move_count for the computer player*/
              component.get('moves')['o'] = move_count + 1;

              /*The stage is updated again and there is a check to see if there
              is a winner*/
              component.get('stage').update();
              component.check_winner();
            }
          /*The 500 is the setting for the timeout between user and computer moves*/
        }, 500);
        }
      }
    }
  },

  /*The check_winner function changes the draw and winner variables if the board
  is full without a matching pattern or if a matching pattern is found respectively.*/
  check_winner: function() {

    /*The current state and the check_game_winner elements are called in*/
    var state = this.get('state');
    var winner = check_game_winner(state);

    /*This nested if statement asks if a pattern match has been found. If it
    has then the winner is set. If not then it asks if there is still space left
    on the board. If there isn't then the draw is set. If neither of these occur
    then the game is allowed to continue*/
    if(winner !== undefined) {
      if(winner === '') {
        this.set('draw', true);
      } else {
        this.set('winner', winner);
      }
    }
  },

  /*The computer_move function controls the computer turn after the player has
  made a move*/
  computer_move:function(state){
    function minimax(state, limit, player) {

      /*The minimax function finds any empty square that could be a potential
      move by assigning the y and x axies to idx1 and idx2 and making sure the
      move is in the boundaries of the grid and then checking for 'undefined'.*/
      var moves = []
      if(limit > 0) {
        for (var idx2 = 5; idx2 >= 0; idx2--){
          for(var idx1 = 0; idx1 <= 6; idx1++){
            if(state[idx1][idx2] === undefined) {

              /*The move is then set to the deepClone so the move can be analysed*/
              var move = {
                x: idx1,
                y: idx2,
                state: deepClone(state),
                score: 0
              };

              /*The state is then passed back and a score is assigned depending
              on the move strength. If the computer can win the game in this move
              then the score is set to 1000...*/
              move.state[idx1][idx2] = player;
              if(limit === 1 || check_game_winner(move.state) !== undefined) {
                if(check_game_winner(move.state) !== undefined) {
                  var winner = check_game_winner(move.state);
                  if(winner === 'o') {
                    move.score = 1000;

                  /*...or it's set to -1000 if the player user can win on the next
                  turn. This creates a somewhat realistic AI, whilst also making
                  the computer beatable.*/
                  } else if(winner === 'x') {
                    move.score = -1000;
                  }
                }

              /*If neither the computer or the user can win in the next turn then
              an AI score is set determined on what can be done after the next user
              move is made.*/
              } else {
                move.moves = minimax(move.state, limit - 1, player == 'x' ? 'o' : 'x');
                var score = undefined;
                for(var idx3 = 0; idx3 < move.moves.length; idx3++) {
                  if(score === undefined) {
                    score = move.moves[idx3].score;
                  } else if(player === 'x') {
                    score = Math.max(score, move.moves[idx3].score);
                  } else if(player === 'o') {
                    score = Math.min(score, move.moves[idx3].score);
                  }
                }
                move.score = score;
              }

              /*The move is then set and sent to ensure the computer_move is completed
              and a marker is placed*/
              moves.push(move);
            }
          }
        }
      }
      return moves;
    }

    /*These variables are set in order to define whether the move has been made
    and the max_score of the move to set the computer AI - whether it is going to
    attack or defend a position depending on whether it can win or lose the game*/
    var moves = minimax(state, 2, 'o');
    var max_score = undefined;
    var move = undefined;

    /*The move is found by cycling over the free spaces in the grid. The score
    for each possible move is calculated and the highest sets the coordinates for
    the move*/
    for(var idx = 0; idx < moves.length; idx++) {
      if(max_score === undefined || moves[idx].score > max_score) {
        max_score = moves[idx].score;
        move = {
          x: moves[idx].x,
          y: moves[idx].y
        }
      }
    }
    return move;
  },


  actions: {
    /*This main function is used by the 'Main Menu' button within the game for
    the user to go back to the main menu*/
    main: function() {
      location.reload();
    },

    /*This start function initialises the game*/
    start: function() {

      /*The board is retrieved but the alpha is set to 0 to make it invisible
      at the beginning*/
      var board = this.get('board');
      board.alpha = 0;

      /*An animation is created to fade the board in slowly*/
      createjs.Tween.get(board).to({alpha: 1}, 1000)

      /*The playing variable is set and all markers are removed from the board
      through an animation that makes them fall off the bottom of the board*/
      if(this.get('playing')){
        var markers = this.get('markers');
        for(var idx = 0; idx < 21; idx++){
          createjs.Tween.get(markers.x[idx]).to({y: 600}, 500);
          createjs.Tween.get(markers.o[idx]).to({y: 600}, 500);
        }

        /*A sound is played as the counters fall*/
        createjs.Sound.play("falling");

        /*The board fades into view*/
        createjs.Tween.get(board).wait(500).to({alpha: 1}, 1000)
      }else{
        createjs.Tween.get(board).to({alpha: 1}, 1000)
      }

      /*The playing variable is set to true, the winner and draw variables are
      set to undefined and all of the board coordinates are set to undefined*/
      this.set('playing', true);
      this.set('winner', undefined);
      this.set('draw', undefined);
      this.set('state', [
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined]
      ]);

      /*This ensures that player moves are set to 0 to start the game and
      sets the starting player as 'x'*/
      this.set('moves', {'x': 0, 'o': 0});
      this.set('player', 'x');

      /*This makes sure that all the markers are set to invisible to start
      the game*/
      var call_markers = this.get('markers');
      for(var idx4 = 0; idx4 < 42; idx4++) {
        call_markers.x[idx].visible = false;
        call_markers.o[idx].visible = false;
      }
    }
  }
});
