$().extend('drag',function(){

	var i = 0;

	for(i=0;i<this.elements.length;i++)
	{
		Drag(this.elements[i]);
	}

//---------------------------拖拽框架开始---------------------------
	//拖拽 ---- 无范围限制
	function Drag(obj)
	{
		obj.onmousedown = function(e)
		{
			var e = e || event;
			var disX = e.clientX - obj.offsetLeft;
			var disY = e.clientY - obj.offsetTop;

			document.onmousemove = function(e)
			{
				var e = e || event;

				obj.style.left = e.clientX - disX + 'px';
				obj.style.top = e.clientY - disY + 'px';
			};

			document.onmouseup = function()
			{
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}
	}

//---------------------------拖拽框架结束---------------------------
});