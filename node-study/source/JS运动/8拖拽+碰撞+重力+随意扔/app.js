window.onload=function(){
		var oDiv = document.getElementById('box');
//拖拽 开始
		var lastX = 0;
		var lastY = 0;

		oDiv.onmousedown = function(e){
			var e = e || window.event;
			var disX = e.clientX-oDiv.offsetLeft;
			var disY = e.clientY-oDiv.offsetTop;

			document.onmousemove = function(e){
				var e = e || window.event;
				var l = e.clientX-disX;
				var t = e.clientY-disY;

				oDiv.style.left = l+'px';
				oDiv.style.top = t+'px';

				//获取速度和方向
				iSpeedX = l-lastX;
				iSpeedY = t-lastY;

				lastX = l;
				lastY = t;
				////
				
				// document.title='x:'+iSpeedX+',y:'+iSpeedY;
			};
			document.onmouseup=function(){
				document.onmousemove=null;
				document.onmouseup=null;
				startMove(oDiv);
			}
			clearInterval(timer);
		}
//拖拽 结束
	}
// 运动
	var timer = null;
	// var iSpeedX=0;
	// var iSpeedY=0;

	function startMove(obj)
	{
		clearInterval(timer);
		timer=setInterval(function (){
			iSpeedY+=3; // 这就是重力
			
			var l=obj.offsetLeft+iSpeedX;
			var t=obj.offsetTop+iSpeedY;
			
			if(t>=document.documentElement.clientHeight-obj.offsetHeight)
			{
				iSpeedY*=-0.8; //越来越小
				iSpeedX*=0.8;	//越来越小
				t=document.documentElement.clientHeight-obj.offsetHeight;
			}
			else if(t<=0)
			{
				iSpeedY*=-1;
				iSpeedX*=0.8;
				t=0;
			}
			
			if(l>=document.documentElement.clientWidth-obj.offsetWidth)
			{
				iSpeedX*=-0.8;
				l=document.documentElement.clientWidth-obj.offsetWidth;
			}
			else if(l<=0)
			{
				iSpeedX*=-0.8;
				l=0;
			}
			// Math.abs()取绝对值
			if(Math.abs(iSpeedX)<1)
			{
				iSpeedX=0;
			}
			
			if(Math.abs(iSpeedY)<1)
			{
				iSpeedY=0;
			}
			//没有速度的时候 和 高度等于屏幕高度-盒子高度的时候  停止计时器
			if (iSpeedX==0 && iSpeedY==0 && t==document.documentElement.clientHeight-obj.offsetHeight){ 
				clearInterval(timer);
			}else{
				obj.style.left=l+'px';
				obj.style.top=t+'px';
			}


		}, 30);
	}