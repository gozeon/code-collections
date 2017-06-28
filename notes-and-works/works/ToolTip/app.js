//优化代码，不考虑浏览器兼容
var className = "tooltip-box";   //方便维护

//获取id
var getDocID = function (id) {
  return document.getElementById(id);
}

//获取div
var parentdiv = getDocID("div");

//判断是否存在
function showTooltip(obj,id,html,width,height) {
  if (getDocID(id)==null) {//没有就创建一个
    var tooltipBox;
    tooltipBox = document.createElement("div");
    tooltipBox.className = className;
    tooltipBox.id = id;
    tooltipBox.innerHTML = html;

    obj.appendChild(tooltipBox);

    //设置一下大小
    tooltipBox.style.width = width?width+"px":"auto";
    tooltipBox.style.height = height?height+"px":"auto";

    //将内容不影响其它内容
    tooltipBox.style.position = "absolute";
    tooltipBox.style.display = "block";

    var left = obj.offsetLeft;
    var top = obj.offsetTop+20;  //20为字体大小，否则会覆盖文字

    tooltipBox.style.left = left+"px";
    tooltipBox.style.top = top+"px";

    obj.onmouseout = function () {   //监听鼠标移出，将隐藏
      setTimeout(function () {        //延时效果
        getDocID(id).style.display="none";
      },100);
    }
  }else {
    getDocID(id).style.display = "block";
  }
}

//根据事件冒泡 ---- 事件冒泡到父元素 div，将div添加监听就好了
parentdiv.addEventListener("mouseover",function (e) {
  var target = e.target;  //不考虑ie
  if(target.className == "tooltip"){
    var _html;
    var _id;
    var _width;
    switch (target.id) {
      case "weibo":
        _id = "wb";
        _html = "这是微博";
        _width = 90;
        break;
      case "weixin":
        _id = "wx";
        _html = "这是微信";
        _width = 90;
        break;
      case "logo":
        _id = "lg";
        _html = "<img src='1.jpg'>";
        _width = 352;
        break;
      case "helloworld":
        _id = "hw";
        _html = "<iframe src='http://www.github.com/Gozeon' width='500' height='300'></iframe>";
        _width = 500;
        break;
    }
    showTooltip(target,_id,_html,_width);
  }
});

// //传统代码
// var className = "tooltip-box";   //方便维护
// function showTooltip(obj,id,html,width,height) {
//   if (document.getElementById(id)==null) {  //判断是否存在
//     var tooltipBox;
//     tooltipBox = document.createElement("div");
//     tooltipBox.className = className;
//     tooltipBox.id = id;
//     tooltipBox.innerHTML = html;
//
//     obj.appendChild(tooltipBox);   //没有就创建一个
//
//     //设置一下大小
//     tooltipBox.style.width = width?width+"px":"auto";
//     tooltipBox.style.height = height?height+"px":"auto";
//
//     //将内容不影响其它内容
//     tooltipBox.style.position = "absolute";
//     tooltipBox.style.display = "block";
//
//     var left = obj.offsetLeft;
//     var top = obj.offsetTop+20;  //20为字体大小，否则会覆盖文字
//
//     tooltipBox.style.left = left+"px";
//     tooltipBox.style.top = top+"px";
//
//     obj.onmouseout = function () {   //监听鼠标移出，将隐藏
//       setTimeout(function () {        //延时效果
//         document.getElementById(id).style.display="none";
//       },300);
//     }
//   }else {
//     document.getElementById(id).style.display = "block";
//   }
// }
//
// //监听鼠标悬浮事件
// var wb = document.getElementById("weibo");
// var wx = document.getElementById("weixin");
// var lg = document.getElementById("logo");
// var hw = document.getElementById("helloworld");
//
// wb.onmousemove= function () {
//   showTooltip(this,"wb","这是微博",50);
// }
// wx.onmousemove= function () {
//   showTooltip(this,"wx","这是微信",50);
// }
// lg.onmousemove= function () {
//   showTooltip(this,"lg","<img src='1.jpg'>",352);
// }
// hw.onmousemove= function () {
//   var geek = "<iframe src='http://www.github.com/Gozeon' width='500' height='300'></iframe>";
//   showTooltip(this,"hw",geek,500);
// }
