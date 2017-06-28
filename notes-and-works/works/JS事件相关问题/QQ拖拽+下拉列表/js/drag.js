//获取父元素id为parent，子元素class为clsName的元素
function getByClass(clsName,parent){  //parent父元素id，可传可不传，不传默认为document
  var oParent=parent?document.getElementById(parent):document,  //如果有父元素，就传id，没有传document
      eles=[],
      elements=oParent.getElementsByTagName('*'); //获取所有元素

  for(var i=0,l=elements.length;i<l;i++){  //进行遍历
    if(elements[i].className==clsName){    //可用正则
      eles.push(elements[i]);
    }
  }
  return eles;
}

window.onload=drag;

function drag(){
   var oTitle=getByClass('login_logo_webqq','loginPanel')[0]; //getByClass返回数组，选择第一个
   // 拖曳
   oTitle.onmousedown=fnDown;  //onmousedown按下任何鼠标按钮时触发事件
   // 关闭
   var oClose=document.getElementById('ui_boxyClose');
   oClose.onclick=function(){
   	  document.getElementById('loginPanel').style.display='none'; //隐藏起来 为关闭
   }
   // 切换状态
   var loginState=document.getElementById('loginState'),
       stateList=document.getElementById('loginStatePanel'),
       lis=stateList.getElementsByTagName('li'),
       stateTxt=document.getElementById('login2qq_state_txt'),
       loginStateShow=document.getElementById('loginStateShow');

   loginState.onclick=function(e){
   	 e = e || window.event;
     if(e.stopPropagation){       //阻止事件冒泡
          e.stopPropagation();    //点击事件会冒泡到document，是列表隐藏
     }else{
          e.cancelBubble=true;
     }
   	 stateList.style.display='block';  //显示下拉列表
   }

   // 鼠标滑过、离开和点击状态列表时
   for(var i=0,l=lis.length;i<l;i++){   //遍历list
      lis[i].onmouseover=function(){    //鼠标滑过时，改变背景颜色为灰色
      	this.style.background='#567';
      }
      lis[i].onmouseout=function(){     //鼠标离开时，改变背景颜色为白色
      	this.style.background='#FFF';
      }
      lis[i].onclick=function(e){
      	e = e || window.event;    
      	if(e.stopPropagation){   //阻止事件冒泡，含兼容
          e.stopPropagation();   //li点击事件会冒泡div(loginState),使列表显示
      	}else{
          e.cancelBubble=true;
      	}
      	var id=this.id;  //li便签中，鼠标选择的id
      	stateList.style.display='none';  //隐藏面板
        stateTxt.innerHTML=getByClass('stateSelect_text',id)[0].innerHTML;  //将class为stateSelect_text的内容取出，并显示
        loginStateShow.className='';  //先清空，并设置class，将id设置为class(同名)
        loginStateShow.className='login-state-show '+id; //空格不能省略
      }
   }
   document.onclick=function(){
   	  stateList.style.display='none';  //点击document时，下拉列表也要隐藏掉
   }
}

function fnDown(event){
  event = event || window.event;
  var oDrag=document.getElementById('loginPanel'),
      // 光标按下时光标和面板之间的距离 
      disX=event.clientX-oDrag.offsetLeft,  // clientX和clientY表示光标的坐标，
      disY=event.clientY-oDrag.offsetTop;   // offsetLeft面板左侧宽度
  // 移动
  document.onmousemove=function(event){  //onmousemove鼠标移动触发事件
  	event = event || window.event;
    // document.title=event.clientX+','+event.clientY;    //将得到的坐标传入title显示
  	fnMove(event,disX,disY);
  }
  // 释放鼠标
  document.onmouseup=function(){  // onmouseup松开鼠标事件
  	document.onmousemove=null;
  	document.onmouseup=null;
  }
}

function fnMove(e,posX,posY){
  var oDrag=document.getElementById('loginPanel'),
      l=e.clientX-posX,  // l为面板新位置的左侧距离
      t=e.clientY-posY,  // t为面板新位置的顶部距离
      winW=document.documentElement.clientWidth || document.body.clientWidth,
      winH=document.documentElement.clientHeight || document.body.clientHeight,
      //确定窗口范围
      maxW=winW-oDrag.offsetWidth-10,  //css样式里 right为-10px
      maxH=winH-oDrag.offsetHeight;
      // document.title=l+','+t;    
  if(l<0){ //左侧边界
    l=0;
  }else if(l>maxW){ //右侧边界
    l=maxW;
  }
  if(t<0){ //上边界
    t=10;  //css样式里 top为-10px
  }else if(t>maxH){  //下边界
    t=maxH;
  }
  oDrag.style.left=l+'px';
  oDrag.style.top=t+'px';
}