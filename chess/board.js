// Copyright 2004-present Facebook. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

var Board = (function() {
    var dirty = true;

    var board = [];
    var border = 64;
    var delta = 0;
    var width = 0;
    var height = 0;

    var state = [];
    var tomove = 0;
    var move = false;

    function init() {
      dirty = true;
      width = JSGlobal.winsize[0] - border;
      height = JSGlobal.winsize[1] - border;

      delta = width < height ? parseInt(width/8) : parseInt(height/8);
      var black = false;
      for (var i=0;i<8;i++) {
        for (var j=0;j<8;j++) {
          var left = parseInt(width*0.5 - 4*delta + i*delta)+border*0.5;
          var top = parseInt(height*0.5 - 4*delta + j*delta)+border*0.5;
          var color = black ? "#000" : "#aaa";
          var highlight = black ? "#006" : "#88f";
          var piece = board[i+j*8] ? board[i+j*8].piece : null;
          black = !black;
          board[i+j*8] = {top:top,left:left,color:color,highlight:highlight,bright:false, piece:piece,delta:delta, i:i, j:j};
        }
        black = !black;
      }
    }

    function tick() {
      if (!dirty)
        return;

      var worldel = document.getElementById('gamebackground');
      worldel.innerHTML = "";
      for (var i=0;i<8;i++) {
        for (var j=0;j<8;j++) {
          var square = board[i+j*8];
          var color = square.bright ? square.highlight : square.color;
          worldel.innerHTML += '<div style="position:absolute;left:'+square.left+'px;top:'+square.top+'px;width:'+delta+'px;height:'+delta+'px;background:'+color+';"></div>'
        }
      }
      dirty = false;
    }

    function nearestSquare(x,y) {
      var offboard = false;
      var bx = parseInt((x - width*0.5 + 4*delta - border*0.5)/delta);
      if (bx < 0) {
        bx = 0;
        offboard = true;
      } else if (bx > 7) {
        bx = 7;
        offboard = true;
      }
      var by = parseInt((y - height*0.5 + 4*delta - border*0.5)/delta);
      if (by < 0) {
        by = 0;
        offboard = true;
      } else if (by > 7) {
        by = 7;
        offboard = true;
      }
      return [bx, by];
    }

    function getSquare(x,y) {
      return board[x+8*y];
    }

    function setPiece(x,y,piece) {
      board[x+8*y].piece = piece;
    }

    function allDark() {
      for (var i=0;i<8;i++) {
        for (var j=0;j<8;j++) {
          board[i+8*j].bright = false;
        }
      }
      setDirty();
    }

    function setDirty() {
      dirty = true;
    }

    function toMove() {
      return tomove;
    }

    function makeMove(os,ns,piece) {
      piece.move = ++move;
      state.push({piece:piece.type, from: [os.i,os.j], to: [ns.i,ns.j], capture: ns.piece ? true : false});
      tomove = !tomove;
    }

    function getStateHTML() {
      var markup = tomove ? "Black's Move<br />" : "White's Move<br />";
      var gamemove = 1;
      for (var i=0;i<state.length;i += 2) {
        var s = state[i];
        markup += gamemove + ": " + PieceNames[s.piece] + " (" + FileNames[s.from[0]] + RankNames[s.from[1]] + (s.capture ? "x" : "-") + FileNames[s.to[0]] + RankNames[s.to[1]] + ") ";
        if (i + 1 < state.length) {
          s = state[i+1];
          markup += PieceNames[s.piece] + " (" + FileNames[s.from[0]] + RankNames[s.from[1]] + (s.capture ? "x" : "-") + FileNames[s.to[0]] + RankNames[s.to[1]] + ")<br />";
        } else {
          markup += "...<br />";
        }
        gamemove++;
      }
      return markup;
    }

    var Board = {};
    Board.init = init;
    Board.tick = tick;
    Board.board = board;
    Board.nearestSquare = nearestSquare;
    Board.setPiece = setPiece;
    Board.getSquare = getSquare;
    Board.setDirty = setDirty;
    Board.allDark = allDark;
    Board.toMove = toMove;
    Board.makeMove = makeMove;
    Board.getStateHTML = getStateHTML;
    return Board;
  })();
