var data=['Phone5','Ipad','三星笔记本','佳能相机','惠普打印机','谢谢参与','50元充值卡','1000元超市购物券'],
    timer=null,  //存储定时器
    flag=0;

window.onload=function(){
    var play=document.getElementById('play'),  //两个按钮
        stop=document.getElementById('stop');

    // 开始抽奖
    play.onclick=playFun;
    stop.onclick=stopFun;

   // 键盘事件
   document.onkeyup=function(event){  //onkeyup 按下按键之后
      event = event || window.event;
    //   console.log(event.keyCode);  //输出键码
      if(event.keyCode==13){   // 13--回车键
         if(flag==0){    //flag ： 0-没按过  ：1-按过   可设为boolean值
           playFun();
           flag=1;
         }else{
           stopFun();
           flag=0;
         }
      }
   }
}

function playFun(){
	var title=document.getElementById('title');
	var play=document.getElementById('play');
	clearInterval(timer);  //清除上个定时器，否则连击按钮，会叠加计时器
	timer=setInterval(function(){   //setInterval（函数，毫秒数） 定时器
	   var random=Math.floor(Math.random()*data.length); // Math.random() 获取0-1的浮点数 * 数组大小 然后取整
    //    console.log(random);
	   title.innerHTML=data[random];  //title传入数组data的值
	},50);
    play.style.background='#999';   //不能用this，原因是按钮事件，this指向document
}

function stopFun(){
	clearInterval(timer);
	var play=document.getElementById('play'); //修改开始按钮
	play.style.background='#036';   //不能用this，原因是按钮事件，this指向document
}