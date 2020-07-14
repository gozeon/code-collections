import Player from 'xgplayer';
import './.xgplayer/skin/index.js'


let player = new Player({
	id: 'mse',
	url: '//s1.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4',
	poster: '//s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
	// 内联模式
	playsinline: true,
	// 播放器是否处于全屏状态
	// fullscreen: true,
	// 播放器画中画是否开启
	pip: true,
	// 网页样式全屏
	cssFullscreen: true,
	// 设置/返回 自动播放属性
	// autoplay: true
	// 流式布局
	// fluid: true
	// 初始化显示视频首帧
	videoInit: true,
	// 截图
	screenShot: true,
	// 进度条特殊点标记
	progressDot: [{ time: 10 }, { time: 22 }, { time: 56 }],
	rotate: {   //视频旋转按钮配置项
		innerRotate: true, //只旋转内部video
		clockwise: false // 旋转方向是否为顺时针
	}
});


player.on('timeupdate', function (e) {
	console.log('timeupdate')
	// 用这个打点比较正确
	console.log(e.logParams.played)
})

// 没必要
// 需要config配置 rotate
player.on('requestCssFullscreen', function (e) {
	player.rotate(true, true, 1)
})

// 没必要
// 需要config配置 rotate
player.on('exitCssFullscreen', function (e) {
	player.rotate(false, true, 1)
})

player.on('ended', function (e) {
	console.log('ended', e)
})
