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
      whitePieceColor: "#DDF",
      blackPieceColor: "#400",
      whiteSquareColor: "#AAD",
      blackSquareColor: "#744"
   },
   move: 0,
   turn: 0
}

var pieces = {
   Rook: {
      type: "Rook",
      color: "black",
      coordinates: [0,0],
      timesMoved: 0,
      hasCastled: false,
      getLegalMoves: (pieceList)=>{
         var posX = this.coordinates[0];
         var posY = this.coordinates[1];

         var list = [];

         // check row and add cells
         for (var x = 0; x < 8; x++) {
            if (x != posX) {
               pieceList.forEach((element)=>{
                  if (element.coordinates == [x,posY]) {
                     if (element.color == this.color) {
                        break;
                     }
                     else {
                        list.push([x,posY]);
                        break;
                     }                  
                  }
                  else {
                     list.push([x,posY]);
                  }
               })
            }            
         }

         // check column and add cells
         for (var y = 0; y < 8; y++) {
            if (y != posY) {
               pieceList.forEach((element)=>{
                  if (element.coordinates == [posX, y]) {
                     if (element.color == this.color) {
                        break;
                     }
                     else {
                        list.push([posX, y]);
                        break;
                     }                  
                  }
                  else {
                     list.push([posX, y]);
                  }
               })
            }            
         }

         return list;
      }
   },   
   Knight: {
      type: "Knight",
      color: "black",
      coordinates: [0,0],
      timesMoved: 0,
      getLegalMoves: function (pieceList) {
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

         // check for out-of-bounds and remove from list
         for (var i = 0; i < list.length; i++) {
            if (  list[i][0] < 0
               || list[i][0] > 7
               || list[i][1] < 0
               || list[i][1] > 7) {
                  list.splice(i-- - 1, 1);
               }
         }

         // check for encroachers and remove from list
         for (var i = 0; i < pieceList.length; i++) {
            for (var j = 0; j < list.length; j++) {
               if (pieceList[i].coordinates == list[j]) {
                  list[j].push(99); // sentinel mark for removal
               }
            }
         }

         for (var i = 0; i < list.length; i++) {
            if (list[i].length == 3){
               list.splice( i-- - 1, 1);
            }
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
      Pawn: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
      Rook: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-rook\"></i></span>",
      Knight: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-knight\"></i></span>",
      Bishop: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
      Queen: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-queen\"></i></span>",
      King: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-king\"></i></span>"
   },
   blackPieces: {
      Pawn: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
      Rook: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-rook\"></i></span>",
      Knight: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-knight\"></i></span>",
      Bishop: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
      Queen: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-queen\"></i></span>",
      King: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-king\"></i</span>"
   },
   updateSettings: (x = this) => {
      pStrings.whitePieces = {
         Pawn: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
         Rook: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-rook\"></i></span>",
         Knight: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-knight\"></i></span>",
         Bishop: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
         Queen: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-queen\"></i></span>",
         King: "<span style=\"color: " + chessController.settings.whitePieceColor + "\"><i class=\"fas fa-chess-king\"></i</span>"
      };

      pStrings.blackPieces = {
         Pawn: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-pawn\"></i></span>",
         Rook: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-rook\"></i></span>",
         Knight: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-knight\"></i></span>",
         Bishop: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-bishop\"></i></span>",
         Queen: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-queen\"></i></span>",
         King: "<span style=\"color: " + chessController.settings.blackPieceColor + "\"><i class=\"fas fa-chess-king\"></i</span>"
      };
   }
}

var coords = {
   A1: "A1",
   A2: "A2",
   A3: "A3",
   A4: "A4",
   A5: "A5",
   A6: "A6",
   A7: "A7",
   A8: "A8",

   B1: "B1",
   B2: "B2",
   B3: "B3",
   B4: "B4",
   B5: "B5",
   B6: "B6",
   B7: "B7",
   B8: "B8",
   
   C1: "C1",
   C2: "C2",
   C3: "C3",
   C4: "C4",
   C5: "C5",
   C6: "C6",
   C7: "C7",
   C8: "C8",
   
   D1: "D1",
   D2: "D2",
   D3: "D3",
   D4: "D4",
   D5: "D5",
   D6: "D6",
   D7: "D7",
   D8: "D8",
   
   E1: "E1",
   E2: "E2",
   E3: "E3",
   E4: "E4",
   E5: "E5",
   E6: "E6",
   E7: "E7",
   E8: "E8",
   
   F1: "F1",
   F2: "F2",
   F3: "F3",
   F4: "F4",
   F5: "F5",
   F6: "F6",
   F7: "F7",
   F8: "F8",
   
   G1: "G1",
   G2: "G2",
   G3: "G3",
   G4: "G4",
   G5: "G5",
   G6: "G6",
   G7: "G7",
   G8: "G8",
   
   H1: "H1",
   H2: "H2",
   H3: "H3",
   H4: "H4",
   H5: "H5",
   H6: "H6",
   H7: "H7",
   H8: "H8"
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
   var darkSquares = document.querySelectorAll(".boardWholeRow:nth-of-type(odd) .square:nth-of-type(even), .boardWholeRow:nth-of-type(even) .square:nth-of-type(odd)");
   var lightSquares = document.querySelectorAll(".boardWholeRow:nth-of-type(odd) .square:nth-of-type(odd), .boardWholeRow:nth-of-type(even) .square:nth-of-type(even)");

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

refreshBoard();