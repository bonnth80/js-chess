console.log("jschess.js: connected")

// ply: an action by a single player wherein they make a play
// move: a set two plies, wherein each player makes their play

var chessController = {
   pieceList: [],
   settings: {
      whitePieceColor: "#EAE5CA",
      blackPieceColor: "#400",
      whiteSquareColor: "#9898CC",
      blackSquareColor: "#824848"
   },
   move: 0,
   ply: 0
}

var threatList = {
   black: [],
   white: []
}

var pieces = {
   Pawn: {
      type: "Pawn",
      color: "black",
      coordinates: [0,1],
      moveTwoAtPly: -1,
      getLegalMoves: function(pieceList = []) {
         var list = [];
         var posX = this.coordinates[0];
         var posY = this.coordinates[1];
         var encroacherFound = false;
         var dEncroacherFound = false;
         var firstMove = ((this.color == "black" && this.coordinates[1] == 1)
                        || (this.color == "white" && this.coordinates[1] == 6));
         var pCoords;
         var pColor;

         if (this.color == "black") {
            // check for straight move encroachers
            for (var i = 0; i < pieceList.length; i++) {
               pCoords = pieceList[i].coordinates;
               if (compareArrays(pCoords, [posX, posY + 1]))
                  encroacherFound = true;

               if (compareArrays(pCoords, [posX, posY + 2]))
                  dEncroacherFound = true;
            }

            if (!encroacherFound){
               list.push([posX, 2]);
               if (firstMove && !dEncroacherFound)
                  list.push([posX, 3]);
            }

            // check for diagonal captures
            for (var i = 0; i < pieceList.length; i++) {
               pCoords = pieceList[i].coordinates;
               pColor = pieceList[i].color;

               if (pColor == "white") {
                  if (compareArrays(pCoords, [posX - 1, posY + 1]))
                     list.push([posX - 1, posY + 1]);
                  if (compareArrays(pCoords, [posX +1, posY +1]))
                     list.push([posX + 1, posY + 1]);

                  // check en passant
                  if (posY == 4
                     && pieceList[i].type == "Pawn"
                     && pieceList[i].moveTwoAtPly == chessController.ply - 1) {
                        if (pCoords[1] == posX - 1)
                           list.push([posX - 1, posY + 1]);
                        if (pCoords[1] == posX + 1)
                           list.push([posX + 1, posY + 1]);
                     }
               }
            }
         }
         else { // pawn is white
            // check for straight move encroachers
            for (var i = 0; i < pieceList.length; i++) {
               pCoords = pieceList[i].coordinates;
               if (compareArrays(pCoords, [posX, posY - 1]))
                  encroacherFound = true;

               if (compareArrays(pCoords, [posX, posY - 2]))
                  dEncroacherFound = true;
            }

            if (!encroacherFound){
               list.push([posX, 5]);
               if (firstMove && !dEncroacherFound)
                  list.push([posX, 4]);
            }

            // check for diagonal captures
            for (var i = 0; i < pieceList.length; i++) {
               pColor = pieceList[i].color;
               pCoords = pieceList[i].coordinates;
               if (pieceList[i].color == "black") {
                  if (compareArrays(pCoords, [posX - 1, posY - 1]))
                     list.push([posX - 1, posY - 1]);
                  if (compareArrays(pCoords, [posX + 1, posY - 1]))
                     list.push([posX + 1, posY - 1]);

                  // check en passant
                  if (posY == 4
                     && pieceList[i].type == "Pawn"
                     && pieceList[i].moveTwoAtPlay == chessController.ply - 1) {
                        if (pieceList[i].coordinates[1] == posX - 1)
                           list.push([posX - 1, posY - 1]);
                        if (pieceList[i].coordinates[1] == posX + 1)
                           list.push([posX + 1, posY - 1]);
                     }
               }
            }
         }

         return list;
      }
   },
   Rook: {
      type: "Rook",
      color: "black",
      coordinates: [0,0],
      hasMoved: false,
      getLegalMoves: function (pieceList = []) {
         var posX = this.coordinates[0];
         var posY = this.coordinates[1];
         var validList = [];
         var foundEncroacher = false;
         var list = [];

         // trim pieces that match this row and column
         for (var i = 0; i < pieceList.length; i++) {
            if (pieceList[i].coordinates[0] == posX
               || pieceList[i].coordinates[1] == posY)
            validList.push(pieceList[i]);
         }

         // check left squares and add squares
         for (var i = posX - 1; i >= 0; i--) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[1] == posY) {
                  if (validList[j].coordinates[0] == i) {
                     if (validList[j].color != this.color)
                        list.push([i,posY]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }

            if (foundEncroacher)
               break;
            else            
               list.push([i,posY]);
         }

         // check right square and add squares
         foundEncroacher = false;
         for (var i = posX + 1; i < 8; i++) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[1] == posY) {
                  if (validList[j].coordinates[0] == i) {
                     if (validList[j].color != this.color)
                        list.push([i,posY]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }

            if (foundEncroacher)
               break;
            else               
               list.push([i,posY]);
         }

         // check upper column and add add squares
         foundEncroacher = false;
         for (var i = posY - 1; i >= 0; i--) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[0] == posX) {
                  if (validList[j].coordinates[1] == i) {
                     if (validList[j].color != this.color)
                        list.push([posX,i]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }

            if (foundEncroacher)
               break;
            else
               list.push([posX,i]);
         }

         // check lower column and add add squares
         foundEncroacher = false;
         for (var i = posY + 1; i < 8; i++) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[0] == posX) {
                  if (validList[j].coordinates[1] == i) {
                     if (validList[j].color != this.color)
                        list.push([posX,i]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }
            if (foundEncroacher)
               break;
            else               
               list.push([posX,i]);
         }

         return list;
      }
   },   
   Knight: {
      type: "Knight",
      color: "black",
      coordinates: [0,0],
      timesMoved: 0,
      getLegalMoves: function (pieceList = []) {
         var posX = this.coordinates[0];
         var posY = this.coordinates[1];

         var list = [
            [posX + 1, posY - 2],   // NNE
            [posX + 2, posY - 1],   // EEN
            [posX + 2, posY + 1],   // EES
            [posX + 1, posY + 2],   // SSE
            [posX - 1, posY + 2],   // SSW
            [posX - 2, posY + 1],   // WWS
            [posX - 2, posY - 1],   // WWN
            [posX - 1, posY - 2]    // NNW
         ];

         var unencroachedList = [];

         // check for out-of-bounds and remove from list
         for (var i = list.length - 1; i >= 0; i--) {
            if (  list[i][0] < 0
               || list[i][0] > 7
               || list[i][1] < 0
               || list[i][1] > 7) {
                  list.splice(i,1);
               }
         }

         // check for encroachers and remove from list
         for (var i = list.length - 1; i >= 0; i--) {
            for (var j = 0; j < pieceList.length; j++) {
               if (pieceList[j].color == this.color
                  && compareArrays(pieceList[j].coordinates, list[i]))
                  list.splice(i,1);
            }
         }

         return list;
      }
   },
   Bishop: {
      type: "Bishop",
      color: "black",
      coordinates: [0,0],
      timesMoved: 0,
      getLegalMoves: function(pieceList = []) {
         var pCoords;
         var foundEncroacher = false;
         var list = [];
         // trim pieceList to valid pieces
         var validList = [];

         for (var i = 0; i < pieceList.length; i++) {
            pCoords = pieceList[i].coordinates;
            if (isDiag(pCoords, this.coordinates))
               validList.push(pieceList[i]);
         }

         // check nw slope
         for (var sq = [this.coordinates[0] - 1, this.coordinates[1] - 1];
               sq[0] >= 0 && sq[1] >= 0;
               sq = addCoords(sq,[-1,-1])) {
            
            for (var j = 0; j < validList.length; j++) {
               pCoords = validList[j].coordinates;
               if (compareArrays(sq,pCoords)) {
                  if (validList[j].color != this.color)
                     list.push(sq);
                  foundEncroacher = true;
                  break;
               }
            }

            if (foundEncroacher)
               break;
            else            
               list.push(sq);
         }

         // check ne slope
         foundEncroacher = false;
         for (var sq = [this.coordinates[0] + 1, this.coordinates[1] - 1];
               sq[0] < 8 && sq[1] >= 0;
               sq = addCoords(sq,[1, -1])) {
            
            for (var j = 0; j < validList.length; j++) {
               pCoords = validList[j].coordinates;
               if (compareArrays(sq,pCoords)) {
                  if (validList[j].color != this.color)
                     list.push(sq);
                  foundEncroacher = true;
                  break;
               }
            }

            if (foundEncroacher)
               break;
            else            
               list.push(sq);
         }

         // check se slope
         foundEncroacher = false;
         for (var sq = [this.coordinates[0] + 1, this.coordinates[1] + 1];
               sq[0] < 8 && sq[1] < 8;
               sq = addCoords(sq,[1, 1])) {
            
            for (var j = 0; j < validList.length; j++) {
               pCoords = validList[j].coordinates;
               if (compareArrays(sq,pCoords)) {
                  if (validList[j].color != this.color)
                     list.push(sq);
                  foundEncroacher = true;
                  break;
               }
            }

            if (foundEncroacher)
               break;
            else            
               list.push(sq);
         }

         // check sw slope
         foundEncroacher = false;
         for (var sq = [this.coordinates[0] - 1, this.coordinates[1] + 1];
               sq[0] >= 0 && sq[1] < 8;
               sq = addCoords(sq,[-1, 1])) {
            
            for (var j = 0; j < validList.length; j++) {
               pCoords = validList[j].coordinates;
               if (compareArrays(sq,pCoords)) {
                  if (validList[j].color != this.color)
                     list.push(sq);
                  foundEncroacher = true;
                  break;
               }
            }

            if (foundEncroacher)
               break;
            else            
               list.push(sq);
         }

         return list;

      }
   },
   Queen: {
      type: "Queen",
      color: "black",
      coordinates: [0,0],
      timesMoved: 0,
      getLegalMoves: function(pieceList = []) {
         var posX = this.coordinates[0];
         var posY = this.coordinates[1];
         var validList = [];
         var foundEncroacher = false;
         var list = [];

         // trim pieces to valid
         for (var i = 0; i < pieceList.length; i++) {
            pCoords = pieceList[i].coordinates;
            if (isDiag(pCoords, this.coordinates))
               validList.push(pieceList[i]);
         }

         for (var i = 0; i < pieceList.length; i++) {
            if (pieceList[i].coordinates[0] == posX
               || pieceList[i].coordinates[1] == posY)
            validList.push(pieceList[i]);
         }

         // Diagonal
         // check nw slope
         for (var sq = [this.coordinates[0] - 1, this.coordinates[1] - 1];
            sq[0] >= 0 && sq[1] >= 0;
            sq = addCoords(sq,[-1,-1])) {
         
         for (var j = 0; j < validList.length; j++) {
            pCoords = validList[j].coordinates;
            if (compareArrays(sq,pCoords)) {
               if (validList[j].color != this.color)
                  list.push(sq);
               foundEncroacher = true;
               break;
            }
         }

         if (foundEncroacher)
            break;
         else            
            list.push(sq);
      }

      // check ne slope
      foundEncroacher = false;
      for (var sq = [this.coordinates[0] + 1, this.coordinates[1] - 1];
            sq[0] < 8 && sq[1] >= 0;
            sq = addCoords(sq,[1, -1])) {
         
         for (var j = 0; j < validList.length; j++) {
            pCoords = validList[j].coordinates;
            if (compareArrays(sq,pCoords)) {
               if (validList[j].color != this.color)
                  list.push(sq);
               foundEncroacher = true;
               break;
            }
         }

         if (foundEncroacher)
            break;
         else            
            list.push(sq);
      }

      // check se slope
      foundEncroacher = false;
      for (var sq = [this.coordinates[0] + 1, this.coordinates[1] + 1];
            sq[0] < 8 && sq[1] < 8;
            sq = addCoords(sq,[1, 1])) {
         
         for (var j = 0; j < validList.length; j++) {
            pCoords = validList[j].coordinates;
            if (compareArrays(sq,pCoords)) {
               if (validList[j].color != this.color)
                  list.push(sq);
               foundEncroacher = true;
               break;
            }
         }

         if (foundEncroacher)
            break;
         else            
            list.push(sq);
      }

      // check sw slope
      foundEncroacher = false;
      for (var sq = [this.coordinates[0] - 1, this.coordinates[1] + 1];
            sq[0] >= 0 && sq[1] < 8;
            sq = addCoords(sq,[-1, 1])) {
         
         for (var j = 0; j < validList.length; j++) {
            pCoords = validList[j].coordinates;
            if (compareArrays(sq,pCoords)) {
               if (validList[j].color != this.color)
                  list.push(sq);
               foundEncroacher = true;
               break;
            }
         }

         if (foundEncroacher)
            break;
         else            
            list.push(sq);
      }

      // Lateral
      // check left squares
         for (var i = posX - 1; i >= 0; i--) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[1] == posY) {
                  if (validList[j].coordinates[0] == i) {
                     if (validList[j].color != this.color)
                        list.push([i,posY]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }

            if (foundEncroacher)
               break;
            else            
               list.push([i,posY]);
         }

         // check right squarse and add squares
         foundEncroacher = false;
         for (var i = posX + 1; i < 8; i++) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[1] == posY) {
                  if (validList[j].coordinates[0] == i) {
                     if (validList[j].color != this.color)
                        list.push([i,posY]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }

            if (foundEncroacher)
               break;
            else               
               list.push([i,posY]);
         }

         // check upper column and add add squares
         foundEncroacher = false;
         for (var i = posY - 1; i >= 0; i--) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[0] == posX) {
                  if (validList[j].coordinates[1] == i) {
                     if (validList[j].color != this.color)
                        list.push([posX,i]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }

            if (foundEncroacher)
               break;
            else
               list.push([posX,i]);
         }

         // check lower column and add add squares
         foundEncroacher = false;
         for (var i = posY + 1; i < 8; i++) {
            for (var j = 0; j < validList.length; j++) {
               if (validList[j].coordinates[0] == posX) {
                  if (validList[j].coordinates[1] == i) {
                     if (validList[j].color != this.color)
                        list.push([posX,i]);
                     foundEncroacher = true;
                     break;
                  }
               }
            }
            if (foundEncroacher)
               break;
            else               
               list.push([posX,i]);
         }

         return list;
      }
   },
   King: {
      type: "King",
      color: "black",
      coordinates: [0,4],
      hasCastled: false,
      getLegalMoves: function (pieceList = []) {
         var posX = this.coordinates[0];
         var posY = this.coordinates[1];
         var pCoords;
         var validList = [];
         var foundEncroacher = false;
         var list = [];         
         var neighborhood = [
            [posX - 1, posY - 1],
            [posX - 1, posY    ],
            [posX - 1, posY + 1],
            [posX    , posY - 1],
            [posX    , posY    ],
            [posX    , posY + 1],
            [posX + 1, posY - 1],
            [posX + 1, posY    ],
            [posX + 1, posY + 1]
         ]

         // trim down valid piece list
         for (var i = 0; i < pieceList.length; i++) {
            pCoords = pieceList[i].coordinates;
            if (pCoords[1] == posY
               || ( Math.abs(pCoords[0] - posX) < 2 
                  && Math.abs(pCoords[1] - posY) < 2
                  )
               )
               validList.push(pieceList[i]);
         }

         // check one square move area
         for (var i = 0; i < neighborhood.length; i++) {

            // check if own pieces block
            for (var j = 0; j < validList.length; j++) {               
               pCoords = validList[j].coordinates;
               if (compareArrays(pCoords,neighborhood[i])
                  && validList[j].color == this.color)
                     foundEncroacher = true;
            }

            // check if would put black king in check
            if (this.color == "black") {
               for (var j = 0; j < threatList.white.length; j++) {
                  pCoords = threatList.white[j];
                  if (compareArrays(pCoords, neighborhood[i]))
                     foundEncroacher = true;
               }
            }

            // check if would put white king in check
            if (this.color == "white") {
               for (var j = 0; j < threatList.black.length; j++) {
                  pCoords = threatList.white[j];
                  if (compareArrays(pCoords, neighborhood[i]))
                     foundEncroacher = true;
               }
            }

            if (!foundEncroacher){
               list.push(neighborhood[i]);
               foundEncroacher = false;
            }
         }

         // castle check
         var noCastleableRook = true;
         var pathThreatened = true;
         var pathEncroached = true;
         if (!this.hasCastled) {
            // check for queen-side castle
            // black castle
            if (this.color == "black") {
               for (var i = 0; i < validList.length; i++) {
                  // find a rook and check if it has moved or castled already
                  if (validList[i].type == "Rook"
                  && validList[i].color == this.color
                  && validList[i].hasMoved == false
                  && compareArrays(validList[i].coordinates, [0,0])) {
                     noCastleableRook = false;
                     break;
                  }
               }

               // check if any squares between are under threat
               for (var j = 0; j < threatList.white.length; j++) {
                  pCoords = threatList.white[j];
                  if (compareArrays(pCoords,[0,0])
                     || compareArrays(pCoords,[1,0])
                     || compareArrays(pCoords,[2,0])
                     || compareArrays(pCoords,[3,0])
                     || compareArrays(pCoords,[4,0]))
                        break;
                  
                  pathThreatened = false;
               }

               // check if any squares between are already occupied
               for (var k = 0; k < validList.length; k++) {
                  pCoords = validList[k].coordinates;
                  if (compareArrays(pCoords,[1,0])
                     || compareArrays(pCoords,[2,0])
                     || compareArrays(pCoords,[3,0]))
                        break;

                  pathEncroached = false;
               }

               // if all tests pass, add queen side castle for black
               if (!noCastleableRook && !pathThreatened && !pathEncroached) {
                  list.push([0,1]);
               }
            }
            
            noCastleableRook = true;
            pathThreatened = true;
            pathEncroached = true;
            // white castle
            if (this.color == "white") {
               for (var i = 0; i < validList.length; i++) {
                  // find a rook and check if it has moved or castled already
                  if (validList[i].type == "Rook"
                  && validList[i].color == this.color
                  && validList[i].hasMoved == false
                  && compareArrays(validList[i].coordinates, [0,7])) {
                     noCastleableRook = false;
                     break;
                  }
               }

               // check if any squares between are under threat
               for (var j = 0; j < threatList.black.length; j++) {
                  pCoords = threatList.black[j];
                  if (compareArrays(pCoords,[0,7])
                     || compareArrays(pCoords,[1,7])
                     || compareArrays(pCoords,[2,7])
                     || compareArrays(pCoords,[3,7])
                     || compareArrays(pCoords,[4,7]))
                        break;
                  
                  pathThreatened = false;
               }

               // check if any squares between are already occupied
               for (var k = 0; k < validList.length; k++) {
                  pCoords = validList[k].coordinates;
                  if (compareArrays(pCoords,[1,7])
                     || compareArrays(pCoords,[2,7])
                     || compareArrays(pCoords,[3,7]))
                        break;

                  pathEncroached = false;
               }

               // if all tests pass, add queen side castle for black
               if (!noCastleableRook && !pathThreatened && !pathEncroached) {
                  list.push([7,1]);
               }
            }
            // check for king-side castle
            // black castle
            if (this.color == "black") {
               for (var i = 0; i < validList.length; i++) {
                  // find a rook and check if it has moved or castled already
                  if (validList[i].type == "Rook"
                  && validList[i].color == this.color
                  && validList[i].hasMoved == false
                  && compareArrays(validList[i].coordinates, [7,0])) {
                     noCastleableRook = false;
                     break;
                  }
               }

               // check if any squares between are under threat
               for (var j = 0; j < threatList.white.length; j++) {
                  pCoords = threatList.white[j];
                  if (compareArrays(pCoords,[4,0])
                     || compareArrays(pCoords,[5,0])
                     || compareArrays(pCoords,[6,0])
                     || compareArrays(pCoords,[7,0]))
                        break;
                  
                  pathThreatened = false;
               }

               // check if any squares between are already occupied
               for (var k = 0; k < validList.length; k++) {
                  pCoords = validList[k].coordinates;
                  if (compareArrays(pCoords,[5,0])
                     || compareArrays(pCoords,[6,0]))
                        break;

                  pathEncroached = false;
               }

               // if all tests pass, add queen side castle for black
               if (!noCastleableRook && !pathThreatened && !pathEncroached) {
                  list.push([0,1]);
               }
            }
            
            noCastleableRook = true;
            pathThreatened = true;
            pathEncroached = true;
            // white castle
            if (this.color == "white") {
               for (var i = 0; i < validList.length; i++) {
                  // find a rook and check if it has moved or castled already
                  if (validList[i].type == "Rook"
                  && validList[i].color == this.color
                  && validList[i].hasMoved == false
                  && compareArrays(validList[i].coordinates, [0,7])) {
                     noCastleableRook = false;
                     break;
                  }
               }

               // check if any squares between are under threat
               for (var j = 0; j < threatList.black.length; j++) {
                  pCoords = threatList.black[j];
                  if (compareArrays(pCoords,[4,7])
                     || compareArrays(pCoords,[5,7])
                     || compareArrays(pCoords,[6,7])
                     || compareArrays(pCoords,[7,7]))
                        break;
                  
                  pathThreatened = false;
               }

               // check if any squares between are already occupied
               for (var k = 0; k < validList.length; k++) {
                  pCoords = validList[k].coordinates;
                  if (compareArrays(pCoords,[5,7])
                     || compareArrays(pCoords,[7,7]))
                        break;

                  pathEncroached = false;
               }

               // if all tests pass, add queen side castle for black
               if (!noCastleableRook && !pathThreatened && !pathEncroached) {
                  list.push([7,1]);
               }
            }
         }

         // check for king-side castle
         if (!this.hasCastled) {
            // black castle
            if (this.color == "black") {
               for (var i = 0; i < validList.length; i++) {
                  // find a rook and check if it has moved or castled already
                  if (validList[i].type == "Rook"
                  && validList[i].color == this.color
                  && validList[i].hasMoved == false) {
                     // check if any squares between are under threat
                     for (var j = 0; j < threatList.white.length; j++) {
                        pCoords = threatList.white[j];
                        if (!compareArrays(pCoords,[0,0])
                           && !compareArrays(pCoords,[0,1])
                           && !compareArrays(pCoords,[0,2])
                           && !compareArrays(pCoords,[0,4]))
                           list.push([0,1]);
                     }
                  }
               }
            }
            // white castle
            if (this.color == "white") {
               for (var i = 0; i < validList.length; i++) {
                  // find a rook and check if it has moved or castled already
                  if (validList[i].type == "Rook"
                  && validList[i].color == this.color
                  && validList[i].hasMoved == false) {
                     // check if any squares between are under threat
                     for (var j = 0; j < threatList.black.length; j++) {
                        pCoords = threatList.black[j];
                        if (!compareArrays(pCoords,[0,0])
                           && !compareArrays(pCoords,[0,1])
                           && !compareArrays(pCoords,[0,2])
                           && !compareArrays(pCoords,[0,4]))
                           list.push([7,1]);
                     }
                  }
               }
            }
         }

      }
   }
}

var pStrings = {
   whitePieces: {
      Pawn: "<span style=\"color: " + chessController.settings.whitePieceColor
         + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
      Rook: "<span style=\"color: " + chessController.settings.whitePieceColor
         + "\"><i class=\"fas fa-chess-rook\"></i></span>",
      Knight: "<span style=\"color: " + chessController.settings.whitePieceColor
         + "\"><i class=\"fas fa-chess-knight\"></i></span>",
      Bishop: "<span style=\"color: " + chessController.settings.whitePieceColor
         + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
      Queen: "<span style=\"color: " + chessController.settings.whitePieceColor
         + "\"><i class=\"fas fa-chess-queen\"></i></span>",
      King: "<span style=\"color: " + chessController.settings.whitePieceColor
         + "\"><i class=\"fas fa-chess-king\"></i></span>"
   },
   blackPieces: {
      Pawn: "<span style=\"color: " + chessController.settings.blackPieceColor
         + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
      Rook: "<span style=\"color: " + chessController.settings.blackPieceColor
         + "\"><i class=\"fas fa-chess-rook\"></i></span>",
      Knight: "<span style=\"color: " + chessController.settings.blackPieceColor
         + "\"><i class=\"fas fa-chess-knight\"></i></span>",
      Bishop: "<span style=\"color: " + chessController.settings.blackPieceColor
         + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
      Queen: "<span style=\"color: " + chessController.settings.blackPieceColor
         + "\"><i class=\"fas fa-chess-queen\"></i></span>",
      King: "<span style=\"color: " + chessController.settings.blackPieceColor
         + "\"><i class=\"fas fa-chess-king\"></i</span>"
   },
   updateSettings: function() {
      this.whitePieces = {
         Pawn: "<span style=\"color: "
            + chessController.settings.whitePieceColor
            + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
         Rook: "<span style=\"color: "
            + chessController.settings.whitePieceColor
            + "\"><i class=\"fas fa-chess-rook\"></i></span>",
         Knight: "<span style=\"color: "
            + chessController.settings.whitePieceColor
            + "\"><i class=\"fas fa-chess-knight\"></i></span>",
         Bishop: "<span style=\"color: "
            + chessController.settings.whitePieceColor
            + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
         Queen: "<span style=\"color: "
            + chessController.settings.whitePieceColor
            + "\"><i class=\"fas fa-chess-queen\"></i></span>",
         King: "<span style=\"color: "
            + chessController.settings.whitePieceColor
            + "\"><i class=\"fas fa-chess-king\"></i</span>"
      };

      this.blackPieces = {
         Pawn: "<span style=\"color: "
            + chessController.settings.blackPieceColor
            + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
         Rook: "<span style=\"color: "
            + chessController.settings.blackPieceColor
            + "\"><i class=\"fas fa-chess-rook\"></i></span>",
         Knight: "<span style=\"color: "
            + chessController.settings.blackPieceColor
            + "\"><i class=\"fas fa-chess-knight\"></i></span>",
         Bishop: "<span style=\"color: "
            + chessController.settings.blackPieceColor
            + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
         Queen: "<span style=\"color: "
            + chessController.settings.blackPieceColor
            + "\"><i class=\"fas fa-chess-queen\"></i></span>",
         King: "<span style=\"color: "
            + chessController.settings.blackPieceColor
            + "\"><i class=\"fas fa-chess-king\"></i</span>"
      };
   }
}

var coords = {
   A1: "A1", A2: "A2", A3: "A3", A4: "A4",
   A5: "A5", A6: "A6", A7: "A7", A8: "A8",

   B1: "B1", B2: "B2", B3: "B3", B4: "B4",
   B5: "B5", B6: "B6", B7: "B7", B8: "B8",
   
   C1: "C1", C2: "C2", C3: "C3", C4: "C4",
   C5: "C5", C6: "C6", C7: "C7", C8: "C8",
   
   D1: "D1", D2: "D2", D3: "D3", D4: "D4",
   D5: "D5", D6: "D6", D7: "D7", D8: "D8",
   
   E1: "E1", E2: "E2", E3: "E3", E4: "E4",
   E5: "E5", E6: "E6", E7: "E7", E8: "E8",
   
   F1: "F1", F2: "F2", F3: "F3", F4: "F4",
   F5: "F5", F6: "F6", F7: "F7", F8: "F8",
   
   G1: "G1", G2: "G2", G3: "G3", G4: "G4",
   G5: "G5", G6: "G6", G7: "G7", G8: "G8",
   
   H1: "H1", H2: "H2", H3: "H3", H4: "H4",
   H5: "H5", H6: "H6", H7: "H7", H8: "H8"
}

function updateBoardPieces (layout = chessController.pieceList) {
   layout.forEach((el)=>{
      renderPiece(el.coordinates, el.type, el.color);
   });
}

function renderPiece(sqCoords, piece, color) {
   // sqCoords is strings like:
   //    "A8"
   // or object reference like:
   //    coords.A8
   // or array coordinates like:
   //    [4,2]
   // ------------------------
   // piece is string like "Pawn","King","Rook", etc
   // ------------------------
   // color is string "black" or "white" (not color value, but play side)

   pStrings.updateSettings();

   var squareString = "";
   if (Array.isArray(sqCoords))
      squareString = coordsToDomId(sqCoords);
   else
      squareString = "r" + sqCoords[1] + "-file" + sqCoords[0];

   var square = document.getElementById(squareString);

   if (color.toLowerCase() == "white") {
      switch (piece) {
         case "Pawn":
            square.innerHTML = pStrings.whitePieces.Pawn;
            break;
         case "Rook":
            square.innerHTML = pStrings.whitePieces.Rook;
            break;
         case "Knight":
            square.innerHTML = pStrings.whitePieces.Knight;
            break;
         case "Bishop":
            square.innerHTML = pStrings.whitePieces.Bishop;
            break;
         case "King":
            square.innerHTML = pStrings.whitePieces.King;
            break;
         case "Queen":
            square.innerHTML = pStrings.whitePieces.Queen;
            break;
         default:
            square.innerHTML = "ERR";
      }
   } else if (color.toLowerCase() == "black") {
      switch (piece) {
         case "Pawn":
            square.innerHTML = pStrings.blackPieces.Pawn;
            break;
         case "Rook":
            square.innerHTML = pStrings.blackPieces.Rook;
            break;
         case "Knight":
            square.innerHTML = pStrings.blackPieces.Knight;
            break;
         case "Bishop":
            square.innerHTML = pStrings.blackPieces.Bishop;
            break;
         case "King":
            square.innerHTML = pStrings.blackPieces.King;
            break;
         case "Queen":
            square.innerHTML = pStrings.blackPieces.Queen;
            break;
         default:
            square.innerHTML = "ERR";
      }
   } else {
      square.innerHTML = "";
   }

   square.style.color = "#F00";
}

// render board color
function updateBoardSquares (settings = chessController.settings) {
   var darkSquares = document.querySelectorAll(
         ".boardWholeRow:nth-of-type(odd) .square:nth-of-type(even),"
         + ".boardWholeRow:nth-of-type(even) .square:nth-of-type(odd)"
      );
   var lightSquares = document.querySelectorAll(
         ".boardWholeRow:nth-of-type(odd) .square:nth-of-type(odd),"
         + ".boardWholeRow:nth-of-type(even) .square:nth-of-type(even)"
      );

   for (var i = 0; i < darkSquares.length; i++)
      darkSquares[i].style.backgroundColor = settings.blackSquareColor;

   for (var i = 0; i < lightSquares.length; i++)
      lightSquares[i].style.backgroundColor = settings.whiteSquareColor;
}

function refreshBoard (
   whiteSquares = chessController.settings.whiteSquareColor,
   blackSquares = chessController.settings.blackSquareColor,
   whitePieces = chessController.settings.whitePieceColor,
   blackPieces = chessController.settings.blackPieceColor
   ) {
      chessController.settings.whiteSquareColor = whiteSquares;
      chessController.settings.blackSquareColor = blackSquares;
      chessController.settings.whitePieceColor = whitePieces;
      chessController.settings.blackPieceColor = blackPieces;

      updateBoardPieces();
      updateBoardSquares();
   }

function activateSquare (square) {

}

function highLightSquares(squareList = [], color = "#AA0") {
   squareList.forEach((element)=>{
      var docSquare = document.getElementById(coordsToDomId(element));
      docSquare.style.backgroundColor = color;
   });
}

function addPiece(coords = [4,4], type = "Pawn", color = "white") {
   // start adding new piece
   var newPiece = {};

   switch (type) {
      case "Pawn":
         Object.assign(newPiece, pieces.Pawn);
         break;
      case "King":
         Object.assign(newPiece, pieces.King);
         break;
      case "Rook":
         Object.assign(newPiece, pieces.Rook);
         break;
      case "Knight":
         Object.assign(newPiece, pieces.Knight);
         break;
      case "Bishop":
         Object.assign(newPiece, pieces.Bishop);
         break;
      case "Queen":
         Object.assign(newPiece, pieces.Queen);
         break;
      default:
         console.warn("jschess.js: addpiece() cannot find type specified\n"
                     + "\taborting procedure")
         return null;
   }
   
   if (Array.isArray(coords)) {
      newPiece.coords = coords;
   }
   else if (typeof(coords) == "string") {
      coords = squareToCoords(coords);
      newPiece.coordinates = coords;
   }
   else {
      console.warn("jschess.js: addpiece cannot parse coordinates value\n"
                  + "\tabortign operation");
      return null;
   }

   newPiece.color = color;
   
   // remove any piece already occupying square
   removePiece(coords);

   chessController.pieceList.push(newPiece);

   updateBoardPieces(chessController.piece);
}

function removePiece(coords) {
   var pCoords = [];
   for (var i = 0; i < chessController.pieceList.length; i++) {
      pCoords = chessController.pieceList[i].coordinates;
      if (compareArrays(pCoords,coords)) {
         var removedPiece = {}
         Object.assign(removedPiece, chessController.pieceList[i]);
         chessController.pieceList.splice(i,1);
         return removedPiece;
      }
   }

   return null;
}

// var foo = [];
// foo[0] = {};
// Object.assign(foo[0], pieces.Rook);
// foo[0].color = "white";
// foo[0].coordinates = [5,3];

// var bar = {};
// Object.assign(bar, pieces.Queen);
// bar.coordinates = [4,4];