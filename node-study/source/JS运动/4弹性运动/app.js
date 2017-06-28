// 版本1
/*var iSpeed=0;

function startMove(obj)
{
	setInterval(function (){
		if(obj.offsetLeft<300) // 300 是中心
		{
			iSpeed++;
		}
		else
		{
			iSpeed--;
		}
		
		obj.style.left=obj.offsetLeft+iSpeed+'px';
	}, 30);
}*/
//版本2
/*var iSpeed=0;

function startMove(obj)
{
	setInterval(function (){
		if(obj.offsetLeft<300) // 300 是中心
		{
			iSpeed+=(300-obj.offsetLeft)/50;
		}
		else
		{
			iSpeed-=(obj.offsetLeft-300)/50;
		}
		
		obj.style.left=obj.offsetLeft+iSpeed+'px';
	}, 30);
}*/
//版本3
/*var iSpeed=0;

function startMove(obj)
{	
	setInterval(function (){
		if(obj.offsetLeft<300)  // 300 是中心
		{
			iSpeed+=(300-obj.offsetLeft)/50;
		}
		else
		{
			iSpeed+=(300-obj.offsetLeft)/50;
		}
		
		obj.style.left=obj.offsetLeft+iSpeed+'px';
	}, 30);
}*/
// 优化
var iSpeed=0;

function startMove(obj) // 300 是中心
{
	setInterval(function (){
		iSpeed+=(300-obj.offsetLeft)/20;
		
		obj.style.left=obj.offsetLeft+iSpeed+'px';
	}, 30);
}