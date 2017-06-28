var iSpeedX=6;  // x轴速度
var iSpeedY=8;  // y轴速度

function startMove(obj)
{
	setInterval(function (){
		var l=obj.offsetLeft+iSpeedX;
		var t=obj.offsetTop+iSpeedY;
		
		if(t>=document.documentElement.clientHeight-obj.offsetHeight)  // 到了底部
		{
			iSpeedY*=-1;   //  y轴方向
			t=document.documentElement.clientHeight-obj.offsetHeight; //强制相等，防止滚动条
		}
		else if(t<=0)    // 到了顶部
		{
			iSpeedY*=-1;   
			t=0;
		}
		
		if(l>=document.documentElement.clientWidth-obj.offsetWidth)  // 到了最右端
		{
			iSpeedX*=-1;   //  x轴方向
			l=document.documentElement.clientWidth-obj.offsetWidth;//强制相等，防止滚动条
		}
		else if(l<=0)  // 到了最左端
		{
			iSpeedX*=-1;
			l=0;
		}
		
		obj.style.left=l+'px';
		obj.style.top=t+'px';
	}, 30);
}