var iSpeed=0;

function startMove(obj)
{
	setInterval(function (){
		iSpeed+=(300-obj.offsetLeft)/5; ///300是终点
		iSpeed*=0.7;
		
		obj.style.left=obj.offsetLeft+iSpeed+'px';
	}, 30);
}