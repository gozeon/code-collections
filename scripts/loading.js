var twitlTimer = (function() {
  var p =["\\", "|", "/", "-"];
  var x = 0;
  return setInterval(function() {
    process.stdout.write("\r" + p[x++]);
    x &= 3;
  }, 250);
})()
