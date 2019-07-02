// Rant:
// I'll be honest with you, the fact that I have to do this is silly.
// I can't think of any situation where [] === [] could be misinterpreted.
// It would make sense in C++ since arrays are pointer, but in JS
// I'm astounded that this is a thing, since I'm here fixing it with
// 7 lines of very simply code.
// suck it ECMA
function compArrStrict(x = [], y = []) {
   if (x.length == y.length) {
      for (var i = 0; i < x.length; i++) {
         if (x[i] !== y[i])
            return false;
      }
      return true;
   }
   return false;
}