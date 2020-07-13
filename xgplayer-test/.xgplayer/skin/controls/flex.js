import Player from 'xgplayer'

let s_flex = function () {
  let player = this
  let root = player.root
  let util = Player.util
  let playceholder = util.createDom('xg-placeholder', '', {}, 'xgplayer-placeholder')
  player.controls.appendChild(playceholder)
}

Player.use('s_flex', s_flex)
