//画笔
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var socket = io();

function handler(e){
    ctx.beginPath();
    ctx.arc(e.pageX,e.pageY,3,0,Math.PI*2,true);
    ctx.fillStyle = "red";
    ctx.fill();

    //发送
    socket.emit('paint',{
        "x" : e.pageX,
        "y" : e.pageY,
        "color" : "red"
    });
};
canvas.onmousedown = function(){
    canvas.addEventListener("mousemove", handler, true); 
}

canvas.onmouseup = function(){
    canvas.removeEventListener("mousemove", handler, true);
}

//接收
socket.on("paint",function(msg){
    ctx.beginPath();
    ctx.arc(msg.x,msg.y,3,0,Math.PI*2,true);
    ctx.fillStyle = msg.color;
    ctx.fill();
    // console.log(msg);
});