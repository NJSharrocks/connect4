import Ember from 'ember';

export default Ember.Component.extend({
  playing: false,
  winner: undefined,
  draw: false,

  didInsertElement: function() {
    var stage = new createjs.Stage(this.$('#stage')[0]);
    var board = new createjs.Shape();
    var graphics = board.graphics;
    graphics.beginFill('#393f4d');
    graphics.drawRect(0, 0, 350, 4);
    graphics.drawRect(350, 0, 4, 300);
    graphics.drawRect(0, 0, 4, 300);
    graphics.drawRect(0, 300, 350, 4);

    graphics.drawRect(50, 0, 4, 300);
    graphics.drawRect(100, 0, 4, 300);
    graphics.drawRect(150, 0, 4, 300);
    graphics.drawRect(200, 0, 4, 300);
    graphics.drawRect(250, 0, 4, 300);
    graphics.drawRect(300, 0, 4, 300);

    graphics.drawRect(0, 50, 350, 4);
    graphics.drawRect(0, 100, 350, 4);
    graphics.drawRect(0, 150, 350, 4);
    graphics.drawRect(0, 200, 350, 4);
    graphics.drawRect(0, 250, 350, 4);

    board.x = 10;
    board.y = 20;
    this.set('board', board);
    stage.addChild(board);
    var markers = {
      'a': [],
      'b': []
    }
    for(var a = 0; a < 21; a++) {
      var aMarker = new createjs.Shape();
      graphics = aMarker.graphics;
      graphics.beginFill('#feda6a');
      graphics.drawCircle(0, 0, 19);
      aMarker.visible = false;
      stage.addChild(aMarker);
      markers.a.push(aMarker);

      var bMarker = new createjs.Shape();
      graphics = bMarker.graphics;
      graphics.beginFill('#393f4d');
      graphics.drawCircle(0, 0, 19);
      bMarker.visible = false;
      stage.addChild(bMarker);
      markers.b.push(bMarker);
    }
    //stage.update();

    this.set('markers', markers);
    this.set('stage', stage);
    stage.addChild(board);
  },


  click: function(ev) {
    if(this.get('playing') && !this.get('winner')) {
      if(ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >= 10 && ev.offsetY >= 20 && ev.offsetX < 360 && ev.offsetY < 320) {
        var x = Math.floor((ev.offsetX - 10) / 50);
        var y = Math.floor((ev.offsetY - 20) / 50);
        var state = this.get('state');

        var y = 5;
        var state = this.get('state');

        while(state[x][y] == 'a' || state[x][y] == 'b'){
          y = y - 1;
        }

        if(y >= 0) {
          var player = this.get('player');
          state[x][y] = player;

          var move_count = this.get('moves')[player];
          var marker = this.get('markers')[player][move_count];
          marker.visible = true;
          marker.x = 38 + x * 50;
          marker.y = 48 + y * 50;

          this.get('moves')[player] = move_count + 1;
          if(player == 'a'){
            this.set('player', 'b')
          } else {
            this.set('player', 'a');
          }
          this.get('stage').update();
        }

        this.check_winner();
      }
    }
  },

  check_winner: function() {
    var fours = [
      //horiz
      [[0, 5], [1, 5], [2, 5], [3, 5]],
      [[1, 5], [2, 5], [3, 5], [4, 5]],
      [[2, 5], [3, 5], [4, 5], [5, 5]],
      [[3, 5], [4, 5], [5, 5], [6, 5]],

      [[0, 4], [1, 4], [2, 4], [3, 4]],
      [[1, 4], [2, 4], [3, 4], [4, 4]],
      [[2, 4], [3, 4], [4, 4], [5, 4]],
      [[3, 4], [4, 4], [5, 4], [6, 4]],

      [[0, 3], [1, 3], [2, 3], [3, 3]],
      [[1, 3], [2, 3], [3, 3], [4, 3]],
      [[2, 3], [3, 3], [4, 3], [5, 3]],
      [[3, 3], [4, 3], [5, 3], [6, 3]],

      [[0, 2], [1, 2], [2, 2], [3, 2]],
      [[1, 2], [2, 2], [3, 2], [4, 2]],
      [[2, 2], [3, 2], [4, 2], [5, 2]],
      [[3, 2], [4, 2], [5, 2], [6, 2]],

      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[1, 1], [2, 1], [3, 1], [4, 1]],
      [[2, 1], [3, 1], [4, 1], [5, 1]],
      [[3, 1], [4, 1], [5, 1], [6, 1]],

      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[1, 0], [2, 0], [3, 0], [4, 0]],
      [[2, 0], [3, 0], [4, 0], [5, 0]],
      [[3, 0], [4, 0], [5, 0], [6, 0]],

      //verts
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

      //diags
      [[0,3], [1,2], [2,1], [3,0]],
      [[0,4], [1,3], [2,2], [3,1]],
      [[1,4], [2,3], [3,2], [4,1]],
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
      [[3,0], [4,1], [5,2], [6,3]],
      [[2,0], [3,1], [4,2], [5,3]],
      [[3,1], [4,2], [5,3], [6,4]],
      [[1,0], [2,1], [3,2], [4,3]],
      [[2,1], [3,2], [4,3], [5,4]],
      [[3,2], [4,3], [5,4], [6,5]],
      [[0,0], [1,1], [2,2], [3,3]],
      [[1,1], [2,2], [3,3], [4,4]],
      [[2,2], [3,3], [4,4], [5,5]],
      [[0,1], [1,2], [2,3], [3,4]],
      [[1,2], [2,3], [3,4], [4,5]],
      [[0,2], [1,3], [2,4], [3,5]],
    ];

    var state = this.get('state');

    for(var fidx = 0; fidx < fours.length; fidx++) {
      var four = fours[fidx];
      var winner = state[four[0][0]][four[0][1]];

      if(winner) {
        for(var idx = 1; idx < four.length; idx++) {

          if(winner != state[four[idx][0]][four[idx][1]]){
            winner = undefined;

          }
        }
        if(winner){
          this.set('winner', winner);
          alert("Winner! Play again?");
          location.reload();
        }
      }
    }
    if(!this.get('winner')) {
      var tie = true;
      for(var x = 0; x <= 6; x++) {
        for(var y = 0; y <= 5; y++) {
          if(!state[x][y]){
            tie = false;
            break;
          }
        }
      }
      this.set('tie', tie);
    }
  },

  actions: {
    start: function() {
      this.set('playing', true);
      this.set('winner', undefined);
      this.set('draw', false);
      this.set('state', [
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined]]);
      this.set('moves', {'a': 0, 'b': 0});
      this.set('player', 'b');
      this.get('stage').update();
    },
    main: function() {
      location.reload();
    }
  },

});
