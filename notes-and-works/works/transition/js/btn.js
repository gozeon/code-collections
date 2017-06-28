$(document).ready(function(){
     $("#bt").on("click",function(){
         if($("#view").hasClass("active")){ 
             btn_view();
             $("#view").removeClass("active");
         }
         else{
             $("#view").css("background-color","orange");
             $("#view").addClass("active");
         }
          
     }) 
});