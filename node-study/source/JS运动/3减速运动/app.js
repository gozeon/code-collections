var iSpeed=20;

function startMove(obj)
{
	
	setInterval(function (){
		iSpeed--;
		
		obj.style.left=obj.offsetLeft+iSpeed+'px';
	}, 30);
}