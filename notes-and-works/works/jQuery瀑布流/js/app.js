$(document).ready(function(){  //固定格式，加载文档
  $(window).on("load",function() {  //监听window的load事件
    imgLocation();
    var dataImg = {    //模拟数据
      "data":[
        {"src":"1.jpg"},
        {"src":"2.jpg"},
        {"src":"3.jpg"},
        {"src":"4.jpg"},
        {"src":"5.jpg"},
        {"src":"6.jpg"}
      ]
    }
  window.onscroll = function(){
    if(scrollside){
      $.each(dataImg.data,function(index,value){
        var box = $("<div>").addClass("box").appendTo($("#container"));
        var content = $("<div>").addClass("content").appendTo(box);
        // console.log("./image/"+$(value).attr("src"));
        $("<img>").attr("src","./image/"+$(value).attr("src")).appendTo(content);
      });
      imgLocation();
    }
  }
  });
});

//滚动加载
function scrollside(){
  var box = $(".box");  
  var lastboxHeight = box.last().get(0).offsetTop+Math.floor(box.last().height()/2);//最后一张图片的一半到顶部的距离
  var documentHeight = $(document).height();  //当前容器的高度
  var scrollHeight = $(window).scrollTop();     //鼠标滚动高度
  return (lastboxHeight<scrollHeight+documentHeight)?ture:false;
}

//位置摆放
function imgLocation() {
  var box = $(".box");  
  var boxWidth = box.eq(0).width(); //通过eq（0）获取宽度，宽度一样
  var num = Math.floor($(window).width()/boxWidth); //设备宽度 / 图片宽度 = 个数
  var boxArr=[];  //存储高度，求最小值
  box.each(function (index,value) { //index存储位置，value存储对象  遍历each()
    // console.log(index+"--"+value);
    var boxHeight = box.eq(index).height(); //获取高度
    if(index<num){
      boxArr[index] = boxHeight; //第一排的每个盒子高度
      // console.log(boxHeight);
    }else{ //开始摆放
      var minboxHeight = Math.min.apply(null,boxArr);  //获取第一排最小高度
      // console.log(minboxHeight);
      var minboxIndex = $.inArray(minboxHeight,boxArr); //获取最小位置 inArray(最小值，对象)
      // console.log(minboxIndex);
      // console.log(value);  //value为div
      $(value).css({  //获取jquery对象
        "position":"absolute",
        "top":minboxHeight, //最小图片高度
        "left":box.eq(minboxIndex).position().left //最小图片位置的左侧距离
      });
      boxArr[minboxIndex]+=box.eq(index).height(); //重新计算高度。最小高度 + 摆放图片高度 = 新高度
    }
  })
}
