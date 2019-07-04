var c = chessGame();

// setup initial chess board

// rank 8
c.addPiece("A8", "Rook", "black");
c.addPiece("B8", "Knight", "black");
c.addPiece("C8", "Bishop", "black");
c.addPiece("D8", "Queen", "black");
c.addPiece("E8", "King", "black");
c.addPiece("F8", "Bishop", "black");
c.addPiece("G8", "Knight", "black");
c.addPiece("H8", "Rook", "black");

// rank 7
c.addPiece("A7", "Pawn", "black");
c.addPiece("B7", "Pawn", "black");
c.addPiece("C7", "Pawn", "black");
c.addPiece("D7", "Pawn", "black");
c.addPiece("E7", "Pawn", "black");
c.addPiece("F7", "Pawn", "black");
c.addPiece("G7", "Pawn", "black");
c.addPiece("H7", "Pawn", "black");

// rank 2
c.addPiece("A2", "Pawn", "white");
c.addPiece("B2", "Pawn", "white");
c.addPiece("C2", "Pawn", "white");
c.addPiece("D2", "Pawn", "white");
c.addPiece("E2", "Pawn", "white");
c.addPiece("F2", "Pawn", "white");
c.addPiece("G2", "Pawn", "white");
c.addPiece("H2", "Pawn", "white");

// rank 1
c.addPiece("A1", "Rook", "white");
c.addPiece("B1", "Knight", "white");
c.addPiece("C1", "Bishop", "white");
c.addPiece("D1", "Queen", "white");
c.addPiece("E1", "King", "white");
c.addPiece("F1", "Bishop", "white");
c.addPiece("G1", "Knight", "white");
c.addPiece("H1", "Rook", "white");

c.updateBoardPieces();
c.refreshBoard();