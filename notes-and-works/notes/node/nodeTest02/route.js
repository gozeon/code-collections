/**
 * Created by Goze on 2016/9/7.
 */
exports.showIndex = showIndex;
exports.showStudent = showStudent;
exports.show404 = show404;

function showIndex(req,res)
{
    res.writeHead(200,{'Content-Type':'text/html;charset=UTF8'});
    res.end('这是Index界面');
}
function  showStudent(req,res)
{
    var id = req.url.substr(9);
    res.writeHead(200,{'Content-Type':'text/html;charset=UTF8'});
    res.end('这是学生id'+id);
}
function show404(req,res)
{
    res.writeHead(404,{'Content-Type':'text/html;charset=UTF8'});
    res.end('404');
}