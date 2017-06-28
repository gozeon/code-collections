
// 拖拽 限制范围
function LimitDrag(id)
{
	//构造函数伪装		调用父级的构造函数——为了继承属性
	Drag.call(this, id);  
}
/////////////////////////////////////////////////////////////
//原型链		通过原型来继承父级的方法

//方法1：使用此语句会影响父类
//LimitDrag.prototype=Drag.prototype;  

//方法2：for -in  不会影响父类
for(var i in Drag.prototype)
{
	LimitDrag.prototype[i]=Drag.prototype[i];
}
/////////////////////////////////////////////////////////////

// 重写父类 fnMove方法，将其覆盖
LimitDrag.prototype.fnMove=function (ev)
{
	var oEvent=ev||event;
	var l=oEvent.clientX-this.disX;
	var t=oEvent.clientY-this.disY;
	
	if(l<0)
	{
		l=0;
	}
	else if(l>document.documentElement.clientWidth-this.oDiv.offsetWidth)
	{
		l=document.documentElement.clientWidth-this.oDiv.offsetWidth;
	}
	
	if(t<0)
	{
		t=0;
	}
	else if(t>document.documentElement.clientHeight-this.oDiv.offsetHeight)
	{
		t=document.documentElement.clientHeight-this.oDiv.offsetHeight;
	}
	
	this.oDiv.style.left=l+'px';
	this.oDiv.style.top=t+'px';
};