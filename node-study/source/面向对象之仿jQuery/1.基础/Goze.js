//------------------------------------------------------myAddEvent()------------------------------------------------------
function myAddEvent(obj,sEv,fn)
{
	if(obj.attachEvent)
	{
		obj.attachEvent('on'+sEv,function(){
			fn.call(obj);                          // 解决IE 下的this ，call(this,参数1，参数2) apply(this,[参数1，参数2])
		});
	}
	else
	{
		obj.addEventListener(sEv,fn,false);
	}
}

//------------------------------------------------------getByClass()------------------------------------------------------
function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	var re=new RegExp('\\b'+sClass+'\\b', 'i'); // \b 是断词符号
	var i=0;
	
	for(i=0;i<aEle.length;i++)
	{
		if(re.test(aEle[i].className))
		{
			aResult.push(aEle[i]);
		}
	}
	
	return aResult;
}
//------------------------------------------------------getStyle()------------------------------------------------------
function getStyle(obj,attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj,false)[attr];
	}
}

//------------------------------------------------------Goze()------------------------------------------------------
function Goze(vArg)   // v 变体变量，表示各种类型
{
	//用来存储选中的元素
	this.elements=[];

	switch(typeof vArg)
	{
		case 'function':
			myAddEvent(window,'load',vArg);
			break;
		case 'string':
			switch(vArg.charAt(0))
			{
				case '#':   //ID
					var obj = document.getElementById(vArg.substring(1)); //substring 提取字符串
					
					this.elements.push(obj);
					break;
				case '.':   //class
					this.elements = getByClass(document,vArg.substring(1));
					break;
				default:    //tagName
					this.elements = document.getElementsByTagName(vArg);
			}
			break;
		case 'object':
			this.elements.push(vArg);
	}
}

//---------------------------查找 ||  位置---------------------------
//------------------------------------------------------eq()------------------------------------------------------
Goze.prototype.eq = function(n)
{
	return $(this.elements[n]);
}

//------------------------------------------------------find()------------------------------------------------------
//将arr2的元素，保存到arr1
//arr1为数组，arr2可以是元素集合，也可以是数组
function appendArr(arr1,arr2)
{
	var i = 0;
	for(i=0;i<arr2.length;i++)
	{
		arr1.push(arr2[i]);
	}
}
Goze.prototype.find = function(str)
{
	var i = 0;
	var aResult=[];

	for(i=0;i<this.elements.length;i++)
	{
		switch(str.charAt(0))
		{
			case '.':   // class
				var aEle = getByClass(this.elements[i],str.substring(1));

				aResult = aResult.concat(aEle);  //concat() 方法用于连接两个或多个数组
				break;
			default :  // 标签
				var aEle = this.elements[i].getElementsByTagName(str); //此时 aELe为元素集合，不能用数组的方法(concat()方法)

				appendArr(aResult,aEle);
		}
	}

	var newGoze = $();

	newGoze.elements=aResult;
	return newGoze;
};
//------------------------------------------------------index()------------------------------------------------------
function getIndex(obj)
{
	var aBrother = obj.parentNode.children;
	var i = 0;

	for(i=0;i<aBrother.length;i++)
	{
		if(aBrother[i] == obj)
		{
			return i;
		}
	}
}
Goze.prototype.index = function()
{
	return getIndex(this.elements[0]);
}

//---------------------------事件---------------------------
//------------------------------------------------------click()------------------------------------------------------
Goze.prototype.click = function (fn)
{
	var i = 0;

	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i],'click',fn);
	}
};
//------------------------------------------------------hover()------------------------------------------------------
Goze.prototype.hover = function (fnOver,fnOut)
{
	var i = 0;
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i],'mouseover',fnOver);
		myAddEvent(this.elements[i],'mouseout',fnOut);
	}
};

//---------------------------CSS样式---------------------------
//------------------------------------------------------show()------------------------------------------------------
Goze.prototype.show = function ()
{
	var i = 0;

	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='block';
	}
};
//------------------------------------------------------hide()------------------------------------------------------
Goze.prototype.hide = function ()
{
	var i = 0;

	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='none';
	}
};
//------------------------------------------------------css()------------------------------------------------------
Goze.prototype.css = function(attr,value)
{
	if(arguments.length == 2)    //设置样式
	{
		var i = 0;
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i].style[attr] = value;
		}
	}
	else   //获取样式
	{
		return getStyle(this.elements[0],attr);
	}
};
//------------------------------------------------------attr()------------------------------------------------------
Goze.prototype.attr = function(attr,value)
{
	if(arguments.length == 2)    //设置属性
	{
		var i = 0;
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i][attr] = value;
		}
	}
	else   //获取属性
	{
		return this.elements[0][attr];
	}
};

//---------------------------其它---------------------------
//------------------------------------------------------toggle()------------------------------------------------------
Goze.prototype.toggle = function() //没有参数限制，无线循环
{
	var i = 0;
	var _arguments = arguments;

	for(i=0;i<this.elements.length;i++)
	{
		addToggle(this.elements[i]);
	}

	function addToggle(obj) {   //使每次运行toggle，都有自己的count
		var count = 0;

		myAddEvent(obj,'click',function(){
			_arguments[count%_arguments.length].call(obj);
			count++;
		});
	}
}

//---------------------------$的由来---------------------------
function $(vArg)
{
	return new Goze(vArg);
}