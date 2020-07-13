import Player from 'xgplayer'

let s_poster = function () {
  let player = this
  let root = player.root
  let util = Player.util
  if (!player.config.poster) {
    return
  }
  let poster = util.createDom('xg-poster', '', {}, 'xgplayer-poster')
  poster.style.backgroundImage = `url(${player.config.poster})`
  root.appendChild(poster)
}

Player.use('s_poster', s_poster)
