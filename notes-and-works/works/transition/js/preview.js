
// var cbx1=0,cby1=0,cbx2=0,cby2=0,outputTime=0;
//获取range取值
var time,x1,x2,y1,y2;
var arr = new Array();
var cbezier,newTime;

function getTime() {
    time = document.getElementById("time").value;
//    alert(time);
}
function getx1() {
    x1 = document.getElementById("x1").value;
//    alert(x1);
}
function gety1() {
    y1 = document.getElementById("y1").value;
//    alert(y1);
}
function getx2() {
    x2 = document.getElementById("x2").value;
//   alert(x2);
}
function gety2() {
    y2 = document.getElementById("y2").value;
//    alert(y2);
}
/////////////////////////////////////////////
function get() {
    getTime();
    getx1();
    getx2();
    gety1();
    gety2();
    
     arr[0] = x1;
     arr[1] = y1;
     arr[2] = x2;
     arr[3] = y2;
     
     cbezier = "cubic-bezier("+arr+")";
     newTime = time+"s";
     
     
     
     
     t=setTimeout('get()',500);
     
     
}
/*
function preview() {

    getTime();
    getx1();
    getx2();
    gety1();
    gety2();
 //  alert(time+","+x1+","+y1+","+x2+","+y2);
     arr[0] = x1;
     arr[1] = y1;
     arr[2] = x2;
     arr[3] = y2;
  //   alert(arr);
     cbezier = "cubic-bezier("+arr+")";
//    alert(cbezier);
   
    newTime = time+"s";
 //  alert(newTime);

  get();
//  alert(newTime);
//  alert(cbezier);
t=setTimeout('preview()',500);
}
*/

/*
var aaa = document.getElementById('bt');
aaa.addEventListener("click",btn_view,false);
*/
//////////////////////////////////////////////////
function addClass(obj, cls){
    var obj_class = obj.className,//获取 class 内容.
    blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
    obj.className = added;//替换原来的 class.
}
 
function removeClass(obj, cls){
    var obj_class = ' '+obj.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc        bcd' -> ' abc        bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc        bcd ' -> ' abc bcd '
    removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}
 
function hasClass(obj, cls){
    var obj_class = obj.className,//获取 class 内容.
    obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}
//////////////////////////////////////////////////
function moveRight() {
    get();
    var a = "translateX(520px)";
    var d = "translateX(0px)";
    var e = "mymove";
    
    var all= "all";

       document.getElementById("view").style.transform = a ;
       document.getElementById("view").style.transitionProperty=all;
       document.getElementById("view").style.transitionDuration = newTime;
       document.getElementById("view").style.transitionTimingFunction=cbezier;     
}
function moveLeft() {
    get();
    var a = "translateX(520px)";
    var d = "translateX(0px)";
    var e = "mymove";
    
    var all= "all";

       document.getElementById("view").style.transform = d ;
       document.getElementById("view").style.transitionProperty=all;
       document.getElementById("view").style.transitionDuration = newTime;
       document.getElementById("view").style.transitionTimingFunction=cbezier;     
}
function btn_view() {
    if(hasClass(document.getElementById("view"), "test")){
         moveLeft();
        removeClass(document.getElementById("view"), "test");
    }else{
        moveRight();
        addClass(document.getElementById("view"), "test");
    }
    
}

    
//  document.getElementById("view").style.transform = a ;
 // document.getElementById("view").style.transitionProperty=all;
 // document.getElementById("view").style.transitionDuration = newTime;/*
 // document.getElementById(view).style.WebkitTransitionDuration=newTime;
//  document.getElementById(view).style.MozTransitionDuration=newTime;
////  document.getElementById(view).style.OTransitionDuration=newTime; */
  
 // document.getElementById("view").style.transitionTimingFunction=cbezier;/*
 // document.getElementById(view).style.WebkitTransitionTimingFunction=cbezier;
///  document.getElementById(view).style.MozTransitionTimingFunction=cbezier;
//  document.getElementById(view).style.OTransitionTimingFunction=cbezier;*/
  //alert();
 // var b = document.getElementById("view").style.left.value;
/*
       document.getElementById("view").style.animationName = e ;
//     document.getElementById("view").style.transitionProperty=all;
       document.getElementById("view").style.animationDuration = newTime;
       document.getElementById("view").style.animationTimingFunction=cbezier;
*/
/*
       document.getElementById("view").style.transform = d ;
       document.getElementById("view").style.transitionProperty=all;
       document.getElementById("view").style.transitionDuration = newTime;
       document.getElementById("view").style.transitionTimingFunction=cbezier;
*/
 ///////////////////////////////////////

 /*
 /*
 if (c==0) {
       document.getElementById("view").style.transform = a ;
       document.getElementById("view").style.transitionProperty=all;
       document.getElementById("view").style.transitionDuration = newTime;
       document.getElementById("view").style.transitionTimingFunction=cbezier;
 }
 {
       document.getElementById("view").style.transform = a ;
       document.getElementById("view").style.transitionProperty=all;
       document.getElementById("view").style.transitionDuration = newTime;
       document.getElementById("view").style.transitionTimingFunction=cbezier;
     
 }
 */



//输出按钮

function btn_output() {
    get();
    
    var star = "div{"
    var end = "}";
    
    var content1 = "transition: all "+" "+ newTime+" "+cbezier +";";
    var content2 = "-webkit-transition: all "+" "+newTime+" "+cbezier+";";
    var content3 = "-moz-transition: all "+" "+newTime+" "+cbezier+";";
    var content4 = "-o-transition: all "+" "+newTime+" "+cbezier+";";
    
    var result = star + content1 + content2 + content3 + content4 + end;
   // alert(result);
    var output = prompt("生成代码",result);
}