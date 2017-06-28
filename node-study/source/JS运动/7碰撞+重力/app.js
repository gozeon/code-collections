var iSpeedX=60;
var iSpeedY=0;

function startMove(obj)
{
	setInterval(function (){
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
		
		obj.style.left=l+'px';
		obj.style.top=t+'px';
	}, 30);
}