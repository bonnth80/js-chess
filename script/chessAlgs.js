function compareArrays(x = [], y = []) {
   if (x.length == y.length) {
      for (var i = 0; i < x.length; i++) {
         if (x[i] !== y[i])
            return false;
      }
      return true;
   }
   return false;
}

// slope
function isDiag(a = [0,0], b = [0,0]) {
   var xDist = a[0] - b[0];
   var yDist = a[1] - b[1];
   return (
      (xDist === yDist)
   || (xDist === -yDist)
   );
}

function addCoords(a = [0,0], b = [0,0]) {
   return [a[0] + b[0], a[1] + b[1]];
}

function getVector2d(a = [0,0], b = [0,0]) {
   var xDist = a[0] - b[0];
   var yDist = a[1] - b[1];

   return simplify2d(xDist, yDist);
}

function simplify2d (x,y) {
   if (x == 0 || y == 0)
      return [x,y];

   var gcd = GCD(x,y);

   return [x/gcd, y/gcd];
}

function GCD(x,y) {
   x = Math.abs(x);
   y = Math.abs(y);

   if (x < y) {
      var temp = x;
      x = y;
      y = temp;
   }

   if (y == 0)
      return x;
   else
      return GCD(y, x % y);
}

function coordsToDomId(coords = [0,0]) {
   var fileList = ["A","B","C","D","E","F","G","H"]
   var rankList = ["8","7","6","5","4","3","2","1"];
   //r8-fileA
   return "r" + rankList[coords[1]] + "-file" + fileList[coords[0]];
}

function coordsToSquare(coords = [0,0]) {
   var fileList = ["A","B","C","D","E","F","G","H"]
   var rankList = ["8","7","6","5","4","3","2","1"];

   return fileList[coords[1]] + rankList[coords[0]];
}

function squareToCoords (square) {
   if (typeof(square) != "string") {
      console.warn("algorithms.js: squareToCoords() parameter is not a string\n"
                  + "\t aborting operation with null value");
      return null;
   }

   square = square.toUpperCase()

   if (square.length > 2) {
      console.warn("algorithms.js: squareToCoords() parameter is incorrect"
                  + "length\n\taborting operation with null value");
      return null;
   }

   if (square[0] < "A"
      || square[0] > "H"
      || square[1] < "1"
      || square[1] > "8") {
      console.warn("algorithms.js: squareToCoords() parameter out of "
      + "range\n\taborting operation with null value");

      return null;
   }

   var fileList = {
      "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7
   }

   var rankList = {
      "1": 7, "2": 6, "3": 5, "4": 4, "5": 3, "6": 2, "7": 1, "8": 0
   }

   return [fileList[square[0]], rankList[square[1]]];
}

function getSquareColor(coords) {
   if (Array.isArray(coords)) {
      var sqVal = coords[0] * 8 + coords[1];

      if (sqVal % 2)
         return "white";
      else
         return "black";
   }
   else if (typeof(coords) == "string") {
      if (/A|C|E|G/.test(coords[0]) && /1|3|5|7/.test(coords[1])
      || /B|D|F|H/.test(coords[0]) && /2|4|6|8/.test(coords[1])) {
         return "black"
      }
      else if (/A|C|E|G/.test(coords[0]) && /2|4|6|8/.test(coords[1])
      || /B|D|F|H/.test(coords[0]) && /1|3|5|7/.test(coords[1])) {
         return "white"
      }
   }
}

function findCoords(list, coords) {
   var found = false;
   for (var i = 0; i < list.length; i++) {
      if (compareArrays(list[i], coords))
         found = true;
   }

   return found;
}

function isCoordsOOB(coords) {
   if (typeof(coords) == "string")
      coords = squareToCoords(coords);

   return (coords[0] < 0 
         || coords[0] > 7
         || coords[1] < 0
         || coords[1] > 7);
}