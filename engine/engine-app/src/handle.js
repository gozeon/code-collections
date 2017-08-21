(function () {
  document.querySelector('#handle1').onmousedown = function (e) {
    var e = e || event;
    var leftWidth = document.querySelector('#left').offsetWidth;
    var middleWidth = document.querySelector('#middle').offsetWidth;
    var rightWidth = document.querySelector('#right').offsetWidth;

    document.onmousemove = function (ev) {
      var ev = ev || event;
      var dif = ev.clientX - e.clientX;
      // if (left.offsetWidth <= 300 && dif < 0) {
      //   return;
      // }
      document.querySelector('#left').style.width = leftWidth + dif + 'px';
      document.querySelector('#middle').style.width = middleWidth - dif / 2 + 'px';
      document.querySelector('#right').style.width = rightWidth - dif / 2 + 'px';
    }
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    }
    return false;
  }
  document.querySelector('#handle2').onmousedown = function (e) {
    var e = e || event;
    var leftWidth = document.querySelector('#left').offsetWidth;
    var middleWidth = document.querySelector('#middle').offsetWidth;
    var rightWidth = document.querySelector('#right').offsetWidth;
    document.onmousemove = function (ev) {
      var ev = ev || event;
      var dif = ev.clientX - e.clientX;

      // if (right.offsetWidth <= 300 && dif > 0) {
      //   return;
      // }

      document.querySelector('#left').style.width = leftWidth + dif / 2 + 'px';
      document.querySelector('#middle').style.width = middleWidth + dif / 2 + 'px';
      document.querySelector('#right').style.width = rightWidth - dif + 'px';
    }
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    }
    return false;
  }
  // document.querySelector('#handle3').onmousedown = function (e) {
  //   var e = e || event;
  //   var topHeight = document.querySelector('#top').offsetHeight;
  //   var bottomHeight = document.querySelector('#map').offsetHeight;
  //   document.onmousemove = function (ev) {
  //     var ev = ev || event;
  //     var dif = ev.clientY - e.clientY;
  //     document.querySelector('#top').style.height = topHeight + dif + 'px';
  //     document.querySelector('#map').style.height = bottomHeight - dif + 'px';

  //   }
  //   document.onmouseup = function () {
  //     document.onmousemove = null;
  //     document.onmouseup = null;
  //   }
  //   return false;
  // }
})()