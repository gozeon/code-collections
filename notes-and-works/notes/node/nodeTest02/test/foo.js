/**
 * Created by Goze on 2016/9/7.
 */
var msg = '你好';
var info = '呵呵';

function showInfo()
{
    console.log(this);
}
//exports进行暴露出去 向外暴露(函数 和 变量)
exports.msg = msg;
exports.info = info;
exports.showInfo = showInfo;
