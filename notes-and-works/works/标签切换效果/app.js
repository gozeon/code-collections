function $(id) {
	return typeof id=="string"?document.getElementById(id):id;
}
window.onload = function(){
	var titleName = $("tab-title").getElementsByTagName("li");       //数组
	var tabContent = $("tab-content").getElementsByTagName("div");   //数组
	// alert(titleName.length+","+tabContent.length);
	if (titleName.length != tabContent.length) {
		return;    //一定相同，否则返回
	}
	for(var i = 0;i<titleName.length;i++){
		titleName[i].id=i;  //添加id
		titleName[i].onmouseover=function(){
			for(var j=0;j<titleName.length;j++){
				titleName[j].className="";  //去掉其他高亮效果
				tabContent[j].style.display="none";  
			}
			this.className="select";  //添加高亮效果
			tabContent[this.id].style.display="block";
		}
	}
}