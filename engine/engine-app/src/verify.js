import Token from './token';
import Api from './api';
import MiniStorage from './storage';

(function () {
  if (!Token.getToken()) {
    $('div#login').css('display', 'flex');
  }

  // $('#username').val('jiangwei');
  // $('#password').val('FbcQZj6nedc2k3S');

  $('#loginBtn').click(function () {
    if ($('#username').val() && $('#password').val()) {
      Api.login($('#username').val(), $('#password').val())
        .then(data => {
          MiniStorage.setItem('name', data['displayName']);
          Token.setToken(data['token']);

          location.reload();
        })
        .catch(err => {
          checkError();
        })
    } else {
      checkError();
    }
  })
  function checkError() {
    $('#username').css("border", "1px solid red");
    $('#password').css("border", "1px solid red");
    $('div#loginMsg').text('用户名或密码有错误')
      .css('color', 'red')
      .css('border', '0')
      .css('font-size', '14px')
      .css('margin', '5px 0');
  }
}
)()
