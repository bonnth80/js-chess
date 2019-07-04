var domSquares = document.getElementsByClassName("square");
var db = document.getElementById("debugSquare");

var UIController = {
   cartCoords: true,
   activeSquare: null
}

// When square is clicked:
//    if a previous square is selected
//       if the previous is this turn's color
//          if square is part of legal moves
//             move active square's piece to new square
//             unselect/deactivate current active square
//             set turn to opposite color (handled in move)
//             increment ply (handled in move)
//             set move to ply / 2 (handled in move)
//          if square is empty and not part of legal moves
//             unselect/deactivate current active square
//             set previous to null
//          if square is another piece
//             select new square
//             if new square has piece of this turn's color
//                show legal moves
//       if the previous piece is opposite of this turn's color
//             if square is empty
//                unselect/deactivate current active square
//             if square is another piece
//                select new square
//                if new square has piece of this turn's color
//                   show legal moves
//    if no previous square selected
//       if square is another piece
//          select new square
//          if new square has piece of this turn's color
//             show legal moves
//       if square is empty
//          then there was nothing selected and you clicked on nothing
//          so do nothing, this selection not included

for (var i = 0; i < domSquares.length; i++) {   
   domSquares[i].addEventListener("click", function () {
      // When square is clicked
      var nCoords = squareToCoords(this.getAttribute("squareID"));
      var nPiece = c.getPieceInSquare(nCoords);
      var nColor = (nPiece) ? nPiece.color : null;
      
      if(UIController.activeSquare) {
         var aSquare = UIController.activeSquare;
         var aCoords = aSquare.getAttribute("squareID");
         var aPiece = c.getPieceInSquare(aCoords);
         var aColor = (aPiece) ? aPiece.color : null;
      } else {
         var aSquare = null;
         var aCoords = null;
         var aPiece = null;
         var aColor = null;
      }
      
      // if a previous piece is selected
      if (aSquare) {         
         // if the previous is this turn's color
         if (aColor == c.chessController.turnColor) {
            var legalMoves = aPiece.getLegalMoves();

            // if the square is part of legal moves
            if (findCoords(legalMoves,nCoords)){
               c.makeMove(aCoords,nCoords);
               c.deactivateSquare(this);
               c.refreshBoard();
            } 
            // if square is empty and not part of legal moves
            else if (nPiece == null){
               c.deactivateSquare(this);
               UIController.activeSquare = null;
               c.refreshBoard();
            }
            // if square is another piece
            else {
               c.activateSquare(this,aSquare);
               // if new square has a piece of this turn's color
               if (nColor == c.chessController.turnColor) {
                  var lMoves = nPiece.getLegalMoves();
                  c.refreshBoard();
                  c.highLightSquares(lMoves);
               }
            }
         }
         // if the previous piece is opposite of this turn's color
         else {
            if (nPiece == null) {
               c.deactivateSquare(aSquare);
            }
            else {
               c.activateSquare(this);
               if (nColor == c.chessController.turnColor) {
                  c.refreshBoard();
                  c.highLightSquares(nPiece.getLegalMoves());
               }
            }
         }      
      }
      // if no previous square selected
      else if (aSquare == null) {
         c.activateSquare(this);
         if (nPiece.color = c.chessController.turnColor) {
            c.highLightSquares(nPiece.getLegalMoves());
         }
      }
      UIController.activeSquare = this;
      

   });
}

btnToggleCoords.addEventListener("click", ()=>{
   var cartLabels = document.getElementsByClassName("cartLabel");
   var anLabels = document.getElementsByClassName("anLabel");
   if (UIController.cartCoords) {
      UIController.cartCoords = false;

      for (var i = 0; i < cartLabels.length; i++) {
         cartLabels[i].style.display = "none";
      }

      for (var i = 0; i < anLabels.length; i++) {
         anLabels[i].style.display = "initial";
      }
   }
   else {
      UIController.cartCoords = true;

      for (var i = 0; i < cartLabels.length; i++) {
         cartLabels[i].style.display = "initial";
      }

      for (var i = 0; i < anLabels.length; i++) {
         anLabels[i].style.display = "none";
      }
   }
})