window.onload = function() {
	var nav = document.getElementById("left-nav");
	var rightad = document.getElementById("right-ad");
	window.onscroll = function(){
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		// document.title=scrollTop;
		lefnav();
		rightnav();
	}

	function lefnav(){
		if(scrollTop>78){
				nav.style.position="fixed";
				nav.style.top="0px";
		 	}else {
				nav.style.position="static";
		}
	}
	function rightnav(){
		if(scrollTop>1570){
			// console.log(scrollTop);
			rightad.style.position="fixed";
			rightad.style.bottom="-80px";
		}
		else {
			rightad.style.position="static";
		}
	}
}