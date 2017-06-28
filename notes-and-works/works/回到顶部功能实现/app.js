window.onload=function(){
	var topbtn=document.getElementById("btn");
	var timer=null;
	var pagelookheight = document.documentElement.clientHeight;

	window.onscroll = function(){
		var backtop = document.body.scrollTop;
		if(backtop>=pagelookheight){    //超过了一个屏幕的距离
			topbtn.style.display="block";
		}else{
			topbtn.style.display="none";
		}
	}

	topbtn.onclick=function(){
		// var backtop=document.body.scrollTop;
		// document.body.scrollTop -= 100;   //点击一次，滚动条向上走100
		timer = setInterval(function(){
			var backtop = document.body.scrollTop;
			var speedtop = backtop/5;    //设置返回速度越来越慢
			document.body.scrollTop = backtop-speedtop;
			if(backtop==0){
				clearInterval(timer);  //为0时，不再返回效果
			}
		}, 30);
	}
}