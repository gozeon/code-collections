// 固定屏幕宽度+图片摆放个数
window.onload = function () {
	 // body...
	imgLocation("container","box");
	//json字符串
	var imgDate = {
		"data":[
			{"src":"1.jpg"},
			{"src":"2.jpg"},
			{"src":"3.jpg"},
			{"src":"4.jpg"},
			{"src":"5.jpg"},
			{"src":"6.jpg"},
			{"src":"7.jpg"},
			{"src":"8.jpg"},
			{"src":"9.jpg"},
		]
	}
	window.onscroll = function(){  //监听滚动条
		if(chechFlag()){
			//加载数据，正常情况下，通过服务器传输数据
			//自定义json字符串
			//
			//appendChild添加节点，父节点添加自己点
			//达到以下效果
/*				<div class="box">
					<div class="box_img">
						<img src="Image/7.jpg" alt="">
					</div>
				</div>*/

			var cparent = document.getElementById("container");
			for(var i = 0;i<imgDate.data.length;i++){
				var ccontent = document.createElement("div");
				ccontent.className = "box";
				cparent.appendChild(ccontent);

				var boximg = document.createElement("div");
				boximg.className = "box_img";
				ccontent.appendChild(boximg);

				var img = document.createElement("img");
				img.src = "image/"+imgDate.data[i].src;
				boximg.appendChild(img);
			}
			imgLocation("container","box"); //再次调用布局及确定位置
		}
	}
}

//
function chechFlag(){
	//获取最后一张图片的距离顶部的高度
	var cparent = document.getElementById("container");
	var ccontent = getChildElement(cparent,"box");

	//最后一张图片的高度
	var lastContentHeight = ccontent[ccontent.length-1].offsetTop;
	// console.log(lastContentHeight);

	// 滚动条滑动高度
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //浏览器兼容
	// console.log(scrollTop);

	//页面高度
	var pageHeight = document.documentElement.clientHeight || document.body.clientHeight; //浏览器兼容

	// console.log(lastContentHeight+":"+scrollTop+":"+pageHeight);
	// 加载数据判断条件：lastContentHeight<scrollTop+pageHeight
	if (lastContentHeight<(scrollTop+pageHeight)) {
		return true;
	}
}

function imgLocation(parent,content) {
	//将parent下所有的content全部取出
	//也就是将计算id为container下属性为box的div的个数

	var cparent = document.getElementById(parent);
	var ccontent = getChildElement(cparent,content);
/*	console.log(ccontent);   //打印一下，控制台可以看到
	console.log(ccontent.length);  //打印个数*/
	var imgWidth = ccontent[0].offsetWidth; //获取图片宽度
	var num = Math.floor(document.documentElement.clientWidth / imgWidth);
	// document.documentElement.clientWidth / imgWidth  //屏幕宽度 / 图片宽度 = 个数
	// Math.floor 将小数转换为整数   也可以用parseInt()
	cparent.style.cssText = "width:"+imgWidth*num+"px;margin: 0 auto;";
	// cparent.style.cssText设置id为container的div的样式

	var BoxHeightArr = [];  //承载盒子高度
	for(var i = 0;i<ccontent.length;i++){
		if (i<num) {  //获取第一排的高度，num就是第一排图片的个数
			BoxHeightArr[i] = ccontent[i].offsetHeight; //获取第一排的高度
			// console.log(BoxHeightArr[i]); //打印出来
		}
/*		//获取的是所有的高度，多了
		BoxHeightArr[i] = ccontent[i].offsetHeight;
		console.log(BoxHeightArr[i]); //打印出来*/
		else { //第二排---泛指
			var minheight = Math.min.apply(null,BoxHeightArr); //获取第一排的高度最小值，null为固定，后面传入数组
			var minIndex = getminheightLocation(BoxHeightArr,minheight);//获取第一排的高度最小值的位置
			// console.log(minheight);
			ccontent[i].style.position = "absolute";
			ccontent[i].style.top = minheight+"px";
			ccontent[i].style.left = ccontent[minIndex].offsetLeft+"px" ;//获取最小高度左面大小
			BoxHeightArr[minIndex] = BoxHeightArr[minIndex]+ccontent[i].offsetHeight;
			//改变数组里面的大小，将最小高度照片的高度+下面摆放的图片的高度=新数组，然后再循环判断出谁最小
		}
	}
}

//获取最小高度的位置
function getminheightLocation(BoxHeightArr,minheight){
	for( var i in BoxHeightArr){
		if(BoxHeightArr[i] == minheight){
			return i;
		}
	}
}

//得到每一个控件的方法
function getChildElement (parent,content) {
	var contentArr =  []; //用于存储控件
	var allcontent = parent.getElementsByTagName("*");  //"*" 匹配所有
	for (var i = 0; i < allcontent.length; i++) {       //for 用来存储,if 用过来判断是否为box
		if(allcontent[i].className==content){
			contentArr.push(allcontent[i]);             //向数组末尾追加
		}
	}
	return contentArr;
}
		
