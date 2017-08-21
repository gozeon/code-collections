(function () {
  const mapElement = document.createElement('div');
  mapElement.id = 'map';
  document.body.appendChild(mapElement);
})()
const $ = require('jquery');
window.$ = $;
import './style';
require('../src/engine-api/index.ts');
$(`<script
type="text/javascript"
src="${__API__}/${window.location.href.split('/').slice(-1)[0]}.js">
</script>`).appendTo($('body'));
