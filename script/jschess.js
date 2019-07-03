console.log("jschess.js: connected")

// ply: an by a single player wherein they make a play
// move: a set two plies, wherein each player makes their play

var chessController = {
   squares: [
      [         
         {coordinates: "A8", piece: "Rook", color: "black"},
         {coordinates: "A7", piece: "Pawn", color: "black"},
         {coordinates: "A6", piece: "", color: ""},
         {coordinates: "A5", piece: "", color: ""},
         {coordinates: "A4", piece: "", color: ""},
         {coordinates: "A3", piece: "", color: ""},
         {coordinates: "A2", piece: "Pawn", color: "white"},
         {coordinates: "A1", piece: "Rook", color: "white"},
      ],
      [         
         {coordinates: "B8", piece: "Knight", color: "black"},
         {coordinates: "B7", piece: "Pawn", color: "black"},
         {coordinates: "B6", piece: "", color: ""},
         {coordinates: "B5", piece: "", color: ""},
         {coordinates: "B4", piece: "", color: ""},
         {coordinates: "B3", piece: "", color: ""},
         {coordinates: "B2", piece: "Pawn", color: "white"},
         {coordinates: "B1", piece: "Knight", color: "white"},
      ],
      [         
         {coordinates: "C8", piece: "Bishop", color: "black"},
         {coordinates: "C7", piece: "Pawn", color: "black"},
         {coordinates: "C6", piece: "", color: ""},
         {coordinates: "C5", piece: "", color: ""},
         {coordinates: "C4", piece: "", color: ""},
         {coordinates: "C3", piece: "", color: ""},
         {coordinates: "C2", piece: "Pawn", color: "white"},
         {coordinates: "C1", piece: "Bishop", color: "white"},
      ],
      [         
         {coordinates: "D8", piece: "Queen", color: "black"},
         {coordinates: "D7", piece: "Pawn", color: "black"},
         {coordinates: "D6", piece: "", color: ""},
         {coordinates: "D5", piece: "", color: ""},
         {coordinates: "D4", piece: "", color: ""},
         {coordinates: "D3", piece: "", color: ""},
         {coordinates: "D2", piece: "Pawn", color: "white"},
         {coordinates: "D1", piece: "Queen", color: "white"},
      ],
      [         
         {coordinates: "E8", piece: "King", color: "black"},
         {coordinates: "E7", piece: "Pawn", color: "black"},
         {coordinates: "E6", piece: "", color: ""},
         {coordinates: "E5", piece: "", color: ""},
         {coordinates: "E4", piece: "", color: ""},
         {coordinates: "E3", piece: "", color: ""},
         {coordinates: "E2", piece: "Pawn", color: "white"},
         {coordinates: "E1", piece: "King", color: "white"},
      ],
      [         
         {coordinates: "F8", piece: "Bishop", color: "black"},
         {coordinates: "F7", piece: "Pawn", color: "black"},
         {coordinates: "F6", piece: "", color: ""},
         {coordinates: "F5", piece: "", color: ""},
         {coordinates: "F4", piece: "", color: ""},
         {coordinates: "F3", piece: "", color: ""},
         {coordinates: "F2", piece: "Pawn", color: "white"},
         {coordinates: "F1", piece: "Bishop", color: "white"},
      ],
      [         
         {coordinates: "G8", piece: "Knight", color: "black"},
         {coordinates: "G7", piece: "Pawn", color: "black"},
         {coordinates: "G6", piece: "", color: ""},
         {coordinates: "G5", piece: "", color: ""},
         {coordinates: "G4", piece: "", color: ""},
         {coordinates: "G3", piece: "", color: ""},
         {coordinates: "G2", piece: "Pawn", color: "white"},
         {coordinates: "G1", piece: "Knight", color: "white"},
      ],
      [         
         {coordinates: "H8", piece: "Rook", color: "black"},
         {coordinates: "H7", piece: "Pawn", color: "black"},
         {coordinates: "H6", piece: "", color: ""},
         {coordinates: "H5", piece: "", color: ""},
         {coordinates: "H4", piece: "", color: ""},
         {coordinates: "H3", piece: "", color: ""},
         {coordinates: "H2", piece: "Pawn", color: "white"},
         {coordinates: "H1", piece: "Rook", color: "white"},
      ],
   ],
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
               if (compArrStrict(pCoords, [posX, posY + 1]))
                  encroacherFound = true;

               if (compArrStrict(pCoords, [posX, posY + 2]))
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
                  if (compArrStrict(pCoords, [posX - 1, posY + 1]))
                     list.push([posX - 1, posY + 1]);
                  if (compArrStrict(pCoords, [posX +1, posY +1]))
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
               if (compArrStrict(pCoords, [posX, posY - 1]))
                  encroacherFound = true;

               if (compareArrStrict(pCoords, [posX, posY - 2]))
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
                  if (compareArrStrict(pCoords, [posX - 1, posY - 1]))
                     list.push([posX - 1, posY - 1]);
                  if (compareArrStrict(pCoords, [posX + 1, posY - 1]))
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
      timesMoved: 0,
      hasCastled: false,
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
                  if (validList[j].coordinatesp[0] == i) {
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
                  if (validList[j].coordinatesp[0] == i) {
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
                  if (validList[j].coordinatesp[1] == i) {
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
                  if (validList[j].coordinatesp[1] == i) {
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
               || list[i][1] > 0
               || list[i][1] > 7) {
                  list.splice(i,1);
               }
         }

         // check for encroachers and remove from list
         for (var i = list.length - 1; i >= 0; i--) {
            for (var j = 0; j < pieceList.length; j++) {
               if (pieceList[j].color == this.color
                  && compArrStrict(pieceList[j].coordinates, list[i]))
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
               if (compArrStrict(sq,pCoords)) {
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
               if (compArrStrict(sq,pCoords)) {
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
               if (compArrStrict(sq,pCoords)) {
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
               if (compArrStrict(sq,pCoords)) {
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
            if (compArrStrict(sq,pCoords)) {
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
            if (compArrStrict(sq,pCoords)) {
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
            if (compArrStrict(sq,pCoords)) {
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
            if (compArrStrict(sq,pCoords)) {
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
                  if (validList[j].coordinatesp[0] == i) {
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
                  if (validList[j].coordinatesp[0] == i) {
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
                  if (validList[j].coordinatesp[1] == i) {
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
                  if (validList[j].coordinatesp[1] == i) {
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
   }
}

// setup inital board layout
chessController.pieceList[0] = {};
Object.assign(chessController.pieceList[0], pieces.Rook);
chessController.pieceList[1] = {};

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
   updateSettings: (x = this) => {
      pStrings.whitePieces = {
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

      pStrings.blackPieces = {
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

function updateBoardPieces (layout = chessController.squares) {
   layout.forEach((files)=>{
      files.forEach((ranks)=>{         
         addPiece(ranks.coordinates, ranks.piece, ranks.color);
      })
   });
}

function addPiece(sqCoords, piece, color) {
   // sqCoords is strings like:
   //    "A8"
   // or object reference like:
   //    coords.A8
   // ------------------------
   // piece is string like "Pawn","King","Rook", etc
   // ------------------------
   // color is string "black" or "white" (not color value, but play side)

   pStrings.updateSettings();
   var squareString = "r" + sqCoords[1] + "-file" + sqCoords[0];   
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

refreshBoard();

var foo = [];
foo[0] = {};
Object.assign(foo[0], pieces.Rook);
foo[0].color = "white";
foo[0].coordinates = [5,3];

var bar = {};
Object.assign(bar, pieces.Queen);
bar.coordinates = [4,4];


