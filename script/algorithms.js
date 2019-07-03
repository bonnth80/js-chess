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

   var gcd = euclidGCD(x,y);

   return [x/gcd, y/gcd];
}

function euclidGCD(x,y) {
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
      return euclidGCD(y, x % y);
}

function coordsToDomId(coords = [0,0]) {
   var fileList = ["A","B","C","D","E","F","G","H"]
   var rankList = ["8","7","6","5","4","3","2","1"];
   //r8-fileA
   return "r" + rankList[coords[1]] + "-file" + fileList[coords[0]];
}