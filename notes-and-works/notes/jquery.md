# jQuery入门
  
## Table of Contents

1. [jQuery 基础知识](#jQuery 基础知识)
1. [jQuery 核心：选取元素](#jQuery 核心：选取元素)
1. [jQuery 核心：DOM操作的原则](#jQuery 核心：DOM操作的原则)
1. [jQuery 核心：DOM操作](#jQuery 核心：DOM操作)
1. [jQuery 核心：事件处理](#jQuery 核心：事件处理)
1. [jQuery 核心：Ajax](#jQuery 核心：Ajax)
1. [jQuery 辅助工具方法](#jQuery 辅助工具方法)
1. [jQuery 核心：扩展jQuery对象的属性和方法](#jQuery 核心：扩展jQuery对象的属性和方法)
  
## jQuery 基础知识
### 什么是jQuery
jQuery是一个非常流行的快速、小巧、功能强大的开源JavaScript库。就像官方所宣称的那样——"Write less，do more"，它使得我们常用的HTML文档遍历、DOM操作、事件处理、动画效果、Ajax、工具方法等功能代码的实现变得非常简单。更重要的是，它还为我们做了跨浏览器的兼容。  
### 如何使用
引入jQuery库的文件，一般选`.min`压缩文件，一个例子：  
```html
<!DOCTYPE html>
<html>
<head>
	<title>模板</title>
	<meta charset="UTF-8" />
	<style>
		.foobar{
			border: 1px solid blue;
		}
	</style>
	<!-- 引入jQuery库的js文件 -->
	<script src="//code.jquery.com/jquery-1.11.1.js"></script>
</head>
<body>
	<input id="username" type="text" >
	<!-- 编写JS代码并使用jQuery -->
	<script type="text/javascript">
	// 以下代码将把id为username的元素的value值改为"Hello CodePlayer!"。
	jQuery("#username").val("Hello CodePlayer!");
	</script>
</body>
</html>
```
  
### jQuery的运行原理
在jQuery库中实际上定义了一个`jQuery()`方法，它是jQuery库的核心。我们调用该方法并传入指定的参数，就可以返回一个jQuery实例对象，该对象中包含匹配的一个或多个DOM元素。接着，我们就可以使用jQuery对象上的方法来操作它所匹配的DOM元素。  
  
> 注意：既然获得的是jQuery对象，你就只能使用jQuery对象的方法，而不能在jQuery对象上调用DOM元素(Element对象)自身的方法(比如getElementById())，除非你已经通过某些方式将它转换成了DOM元素。  
  
此外，为了尽可能的减少代码量，jQuery库还未函数`jQuery`定义了一个别名变量`$`，他们是完全相同的(jQuery===$),因此，我们也可以使用$来来替代jQuery，同样以上面的代码为例：  
```javascript
// $是jQuery的别名，因为JS支持使用$作为变量名称，而且$更加简短、易于书写
$("#username").val("Hello CodePlayer!");
```
  
### ready()准备就绪时执行代码
如果我们在<head>中引入jQuery库文件，并编写相应的jQuery代码来操作DOM元素。这很可能导致操作无法成功，因为此时<body>内的元素可能还没有加载出来，也就获取不到对应的元素。因此，我们一般会将自己的jQuery代码写在ready()事件函数中。ready()函数的作用相当于window.onload，它用于在当前文档加载准备就绪后执行对应的函数。  
```javascript
$(document).ready(function(){
    // 在这里编写我们希望在DOM准备就绪后执行的代码
});
```
  
如果你觉得这种写法有点麻烦，你还可以使用下面这种简写的方法:  
```javascript
// $( function ) 是 $(document).ready( function ) 的简写形式
$( function(){
    // 在这里编写我们希望在DOM准备就绪后执行的代码
} );
```
  
> jQuery的ready()函数可以重复调用，绑定的回调函数将在DOM准备就绪后按照绑定顺序依次执行。此外，ready()和window.onload并不兼容，因此不要混合使用。  
  
> js文件和内嵌的js代码一般不建议放在<head>标签中，而应该放在内容主体的结束标签</body>之前。从而让浏览器先加载页面内容，然后再加载并解析执行js代码。这样可以让网速较慢的用户能够更快地看到页面的展示内容，提高用户体验。  
  
**[⬆ back to top](#table-of-contents)**  
  
## jQuery 核心：选取元素
### 使用jQuery选择器选取元素，并封装为jQuery对象
在JS原生DOM中，我们想要对DOM元素进行操作，首先得获取到对应的元素(getElementById()、getElementByTagName()等),然后再对这些元素进行操作。  
同样的，jQuery也需要先选取所需的DOM元素，然后再针对这些元素进行操作。我们先来看看jQuery如何获取所需的元素。  
在jQuery中，我们一般通过一个字符串来标识匹配的元素，例如：  
```javascript
$("#uid"); // 选取id属性为"uid"的单个元素
$("p"); // 选取所有的p元素
$(".test"); // 选择所有带有CSS类名"test"的元素
$("[name=books]"); // 选择所有name属性为"books"的元素
```
  
jQuery获取元素就是通过类似于CSS选择器的字符串来匹配对应的元素，我们一般将其称作jQuery选择器(selector)。**几乎所有的CSS选择器都可以当做jQuery选择器来使用，只要CSS选择器对哪些元素生效，对应的jQuery选择器就可以选取到哪些元素。**  
  
和CSS选择器一样，jQuery选择器也支持多个选择器任意组合使用。  
```javascript
// 多个选择器以空格或指定符号隔开，将匹配与前者具有指定关系的最后一个选择器所表示的元素
$("#uid span"); // 选择id为"uid"的元素的所有后代span元素
$("p > span"); // 选择p元素的所有子代span元素
$("div + p"); // 选择div元素后面紧邻的同辈p元素
$("div p span"); // 选择div元素的所有后代p元素的后代span元素


// 多个选择器之间没有空格，将匹配同时满足这些选择器条件的元素
$("p#uid"); // 选择id属性为"uid"的p元素
$("div.foo"); // 选择所有带有CSS类名"foo"的div元素
$(".foo.bar"); // 选择所有同时带有CSS类名"foo"和"bar"的元素
$("input[name=books][id]"); // 选择所有name属性为"books"并且具备id属性的元素
```
  
此外，为了更加便于使用，jQuery还定制了特有的选择器：  
```javascript
// jQuery特有的选择器，当然也可以和其他选择器任意组合使用
$(":checkbox"); // 选取所有的checkbox元素
$(":text"); // 选取所有type为text的input元素
$(":password"); // 选取所有type为password的input元素
$(":checked"); // 选取所有选中的radio、checkbox、option元素
$(":selected"); // 选取所有选中的option元素
$(":input"); // 选取所有的表单控件元素(所有input、textarea、select、button元素)
```
  
当我们使用`$(选择器字符串)`匹配到指定的元素后，将返回一个jQuery对象。该对象就包含匹配到的所有DOM元素。如果指定的选择器没有匹配到任何元素，将返回一个空的jQuery对象(不包含任何DOM元素)。  
  
### 将现有的DOM元素封装为jQuery对象
当然，jQuery也可以直接把一个或多个DOM元素直接转换成jQuery对象，以便于我们使用jQuery对象的方法对其进行操作。  
```javascript
var uid = document.getElementById("uid");
var ps = document.getElementsByTagName("p");
var unames = document.getElementsByName("uname");
var domsArray = [ document.getElementById("uid1"), document.getElementById("uid2") ];
// 将以上DOM元素直接转换为jQuery对象
$( uid ); 
$( ps ); 
$( unames );
$( domsArray );
$( ); // 不传入任何参数，返回空的jQuery对象(不匹配任何元素)
```
  
### 将HTML字符串封装为jQuery对象
Query还支持将HTML字符串转换为临时DOM元素，并包含在返回的jQuery对象中.  
```javascript
// 你同样可以使用jQuery对象的方法对这些临时的DOM元素进行操作，或者将它们插入到文档的指定位置。
$('<span></span>'); // 包含一个临时的span元素
$('<span/>'); // 包含一个临时的span元素，和上一行代码的作用相同
$('<div id="mydiv"><p class="foo bar">Hello CodePlayer</p></div>'); // 包含一个临时的div元素，其内嵌一个子节点p元素
```
  
### 元素筛选
有些时候，我们已经获得了一个匹配指定DOM元素的jQuery对象。不过我们需要根据jQuery对象来筛选指定的元素。例如：只选取集合中符合某些条件的元素，删除集合中符合某些条件的元素，查找当前匹配元素的子元素、父元素、同辈元素、上一个元素、下一个元素等与之具有特定关系的元素。  
jQuery为我们提供了一系列的文档筛选方法，方便我们快速地选取我们所需的元素。  
```javascript
// 以下方法都返回一个新的jQuery对象，他们包含筛选到的元素
$("ul li").eq(1); // 选取ul li中匹配的索引顺序为1的元素(也就是第2个li元素)
$("ul li").first(); // 选取ul li中匹配的第一个元素
$("ul li").last(); // 选取ul li中匹配的最后一个元素
$("ul li").slice(1, 4); // 选取第2 ~ 4个元素
$("ul li").filter(":even"); // 选取ul li中所有奇数顺序的元素
$("div").find("p"); // 选取所有div元素的所有后代p元素
$("div").children(); // 选取所有div元素的所有子代元素
$("div").children("p"); // 选取所有div元素的所有子代p元素
$("span").parent(); // 选取所有span元素的父元素
$("span").parent(".foo.bar"); // 选取所有span元素的带有CSS类名"foo"和"bar"的父元素
$("#uid").prev(); // 选取id为uid的元素之前紧邻的同辈元素
$("#uid").next(); // 选取id为uid的元素之后紧邻的同辈元素
```
  
**[⬆ back to top](#table-of-contents)**  

## jQuery 核心：DOM操作的原则
### 切记混淆jQuery对象和Element对象的方法
对于初学者，尤其要注意这一点。上面我们提到的所有选取元素的方法，返回的并不是DOM元素(Element对象)，而是jQuery对象，只是其中封装了所有DOM元素。接下来我们进行DOM操作，也应该使用jQuery对象的方法，而不是Element对象的方法。当然，jQuery对象也可以转换为DOM元素，后面我们会提到。  
### Get and Set in One 原则
为了更加易于使用，jQuery提供了简洁的DOM操作API，其方法往往是"读写一体"的。也就是说，某个方法既可用于读取操作，也可用于设置操作。如果没有为其传入表示值的参数，则表示获取操作，将返回获取到的数据；如果为其传入了表示值的参数，则表示设置操作，它将设置DOM元素指定属性的值。  
```javascript
// 返回一个匹配id为"username"的元素的jQuery对象
var  uid = $("#username");
// 没有传入value参数，返回第一个匹配元素的value属性值
var value = uid.val();
// 传入了value参数，设置所有匹配元素的value值为"CodePlayer"
uid.val("CodePlayer");

// 返回匹配所有包含CSS类名"foo"的div元素的jQuery对象
var div = $("div.foo");
// 没有传入value参数，返回第一个匹配元素的value元素
var fontSize = div.css("font-size");
// 传入了value参数，设置所有匹配元素的font-size样式为"14px"
div.css("font-size", "14px");
```
  
### Get first Set all 原则
在学习jQuery的DOM操作时，我们首先应该了解一下"Get first Set all"原则。jQuery对象几乎所有的DOM操作方法都遵守"Get first Set all"原则。简而言之，假设当前jQuery对象匹配多个元素，如果使用jQuery对象的方法来获取数据("读"数据)，则只会获取第一个匹配元素的数据；如果使用jQuery对象的方法来设置元素数据("写"数据)，则会对所有匹配元素都进行设置操作。  
```javascript
var $lis = $("ul li"); // 匹配ul元素的所有后代li元素
var className = $lis.attr("class"); // 只获取第一个匹配的li元素的class属性
$lis.attr("class", "codeplayer"); // 将所有匹配的li元素的class属性设为"codeplayer"
```
  
### 链式编程风格
 ```javascript
 // jQuery的链式编程风格
$("div").find("ul").addClass("menu").children().css("margin", 0).hide();

// 以下是上述代码的分解描述
$("div") // 返回一个匹配所有div元素的jQuery对象
.find("ul") // 返回匹配这些div元素中的所有后代ul元素的jQuery对象
.addClass("menu") // 为这些ul元素添加CSS类名"menu"，并返回当前对象本身
.children() // 返回匹配这些ul元素中的所有子代元素的jQuery对象
.css("margin", 0) // 为这些子代元素设置css样式"margin: 0"，并返回当前对象本身
.hide(); // 隐藏这些子代元素，并返回当前对象本身
 ```
   
显然，这种链式编程风格的实现机制，就是jQuery对象的所有实例方法，在没有特殊的返回需求的情况下，一般都会返回该jQuery对象本身(或者其它jQuery对象)，因此我们可以继续调用返回的jQuery对象上的方法。  
  
> $("#uid").val()、 $("div").attr("id") 等方法在没有传入值参数时，它们将返回指定DOM元素的特定属性值，它们有特定的返回需求，因此无法进行链式编程。如果是$("#uid").val("CodePlayer")、 $("div").attr("id", "myId")等情况，此时它们不需要返回特定的值，将返回当前jQuery本身，因此可用于链式编程。  
  
### 智能DOM操作，静默容错
在JS原生DOM操作中，如果通过getElementById()、getElementsByName()等方式获取不到对应的元素，那么将返回null，在null上访问属性或方法，将会抛出异常。  
与此不同的是，jQuery在匹配不到对应元素时将返回一个空的jQuery对象，我们仍然可以调用jQuery对象的方法，而且并不会报错。因为jQuery会智能地处理这种情况。如果该方法用于获取数据，则返回null或undefined；如果该方法用于设置数据，则忽略设置操作，并返回该空对象本身；如果该方法用于筛选元素，则同样返回一个新的jQuery空对象。  
```javascript
// 没有标签为abc的DOM元素，$("abc")是一个空的jQuery对象，调用其find()方法将返回一个新的jQuery空对象
var a = $("abc").find("p");

// 如果不存在id为notFound的元素，$("#notFound")是一个空的jQuery对象，获取其id属性，将返回undefined。
var b = $("#notFound").attr("id");

// 如果不存在id为notFound的元素，$("#notFound")是一个空的jQuery对象，获取其高度值，将返回null。
var c = $("#notFound").height();

// 如果不存在id为uname的元素，$("#uname")是一个空的jQuery对象，设置其value值，将忽略该设置操作，并返回该空对象本身
var d = $("#uname").val("xxxxx");
```
  
**[⬆ back to top](#table-of-contents)**  
  
## jQuery 核心：DOM操作
### 属性操作
在jQuery中，对DOM元素进行属性操作，主要是通过以下方法实现的：  
```javascript
// selector 表示具体的选择器

$("selector").val(); // 获取第一个匹配元素的value值(一般用于表单控件)
$("selector").val("Hello"); // 设置所有匹配元素的value值为"Hello"

$("selector").html(); // 获取第一个匹配元素的innerHTML值
$("selector").html("Hello"); // 设置所有匹配元素的innerHTML值为"Hello"

$("selector").text(); // 获取第一个匹配元素的innerText值(jQuery已进行兼容处理)
$("selector").text("Hello"); // 设置所有匹配元素的innerText值为"Hello"

$("selector").attr("class"); // 获取第一个匹配元素class属性
$("selector").attr("class", "code"); // 设置所有匹配元素的class属性为"code"
$("selector").removeAttr("class"); // 移除所有匹配元素的class属性

$("selector").prop("checked"); // 获取第一个匹配元素的checked属性值
$("selector").prop("checked", true); // 设置所有匹配元素的checked属性值为true(意即选中所有匹配的复选框或单选框)
$("selector").removeProp("className"); // 移除所有匹配元素的className属性
```
  
对于val()、html()、text()方法，相信大家都能够理解。而attr()和prop()这两个方法，就是通用的属性获取或设置方法，不过attr()方法针对的是HTML文档节点的属性，prop()方法针对的是文档节点对应的DOM元素对象的属性。此外，它们各有一个对应的属性删除方法：removeAttr()和removeProp()。  
### 文档处理
jQuery还提供了众多的文档处理方法。通过这些方法，我们可以轻松地插入、修改、移动、删除指定的DOM元素。  
```javascript
// 以下$A均表示当前jQuery对象，$B可以是选择器字符串、html字符串、DOM元素、jQuery对象

$A.before( $B ); // 在$A之前插入$B
$A.after( $B ); // 在$A之后插入$B

$A.insertBefore( $B ); // 将$A插入到$B之前的位置
$A.insertAfter( $B ); // 将$A插入到$B之后的位置

$A.append( $B ); // 在$A内部的末尾位置追加$B
$A.appendTo( $B ); // 将$A追加到$B内部的末尾位置

$A.prepend( $B ); // 在$A内部的开头位置追加$B
$A.prependTo( $B ); // 将$A追加到$B内部的开头位置

$A.replaceAll( $B ); // 用$A替换$B
$A.replaceWidth( $B ); // 用$B替换$A

$A.wrap( $B ); // 在$A的外侧包裹$B
$A.unwrap( ); // 只移除$A的父元素的标签
$A.wrapAll( $B ); // 在整个$A的外侧用单个$B将其包裹起来
$A.wrapInner( $B ); // 在$A的内侧包裹$B

$A.empty(); // 清空$A的所有内容
$A.remove(); // 删除$A及其绑定的事件、附加数据等
$A.detach(); // 删除$A，但保留其绑定的事件、附加数据等

$A.clone(); // 克隆一个$A
```
  
除了*wrap*系列方法以及empty()、clone()方法外，当使用上述插入、追加、替换、删除方法时，如果用于插入/追加/替换/删除的元素是文档中的元素，则这些元素将从原位置上消失。  
### CSS操作
几乎所有的CSS操作都可以通过jQuery的css()方法来进行。
```javascript
$("selector").css("margin-left"); // 获取第一个匹配元素的margin-left的属性值
$("selector").css("marginLeft"); // 与上一行代码作用相同，css()支持这两种写法

$("selector").css("marginLeft", 15); // 设置所有匹配元素的margin-left为15px(数字的默认单位均为px)
$("selector").css( { marginLeft: 15, color: "red", fontSize: "14px"} ); // 一次性设置所有匹配元素的多个样式属性

$("selector").css( "marginLeft", ""); // 设为空字符串，则表示删除该样式属性
```
  
此外，jQuery还提供了直接获取或设置高度、宽度、偏移位置的方法.  
### 动画效果
```javascript
$("selector").show(); // 显示隐藏的元素，默认不带过渡动画效果
$("selector").show( 400 ); // 显示隐藏的元素，带有400毫秒的过渡动画效果
$("selector").show( "fast" ); // 显示隐藏的元素，带有200毫秒的过渡动画效果
$("selector").show( "slow" ); // 显示隐藏的元素，带有600毫秒的过渡动画效果

$("selector").hide(); // 隐藏显示的元素，其用法与show()相同
$("selector").toggle(); // 切换显示/隐藏元素(如果显示就隐藏，隐藏就显示)，其用法与show()类似

/* 下面的slide*、fade*系列方法与上面的show()、hide()、toggle()等方法作用相同，
 * 用法也类似，只是带有不同的动画效果
 */

$("selector").slideDown(); // 显示隐藏的元素，带有向下滑动的过渡动画效果
$("selector").slideUp(); // 隐藏显示的元素，带有向上滑动的过渡动画效果
$("selector").slideToggle(); // 切换显示/隐藏的元素，带有向上/下滑动的过渡动画效果

$("selector").fadeIn(); // 显示隐藏的元素，带有淡入的过渡动画效果
$("selector").fadeOut(); // 隐藏显示的元素，带有淡出的过渡动画效果
$("selector").fadeToggle(); // 隐藏显示的元素，带有淡出的过渡动画效果
```
  
此外，jQuery还支持自定义基于CSS样式的动画效果。你可以使用animate()方法设置CSS样式，并执行一个从当前样式到指定样式的过渡动画效果。  
```javascript
// 设置所有匹配元素的css样式"width: 200px; height: 100px"，并执行一个当前样式到指定样式的过渡动画效果
// 动画的执行时间为 1000 毫秒
$("selector").animate( { width: "200px", height: "100px" }, 1000 );
```
  
**[⬆ back to top](#table-of-contents)**  
  
## jQuery 核心：事件处理
jQuery具有强大的DOM事件处理功能，使用jQuery的事件处理方法，我们可以非常方便地为DOM元素的指定事件绑定处理函数。以click事件为例：  
```javascript
function handler( event ){
    // 事件处理函数的执行代码
    // 参数event表示当前事件对象，该对象已经过jQuery封装标准化处理
    // 函数内的this表示触发事件的当前DOM元素(不是jQuery对象)


        // 如果函数的返回值为false，可以阻止事件冒泡和元素的默认事件行为。
        // 例如：a标签的click事件的默认跳转行为；form标签的submit事件的默认表单提交行为
}

// 以下方法均可为所有匹配元素的click事件绑定处理函数
$("selector").click( handler );
$("selector").bind( "click", handler );
$("selector").live( "click", handler ); // 该方法已过时，不建议使用
$(document).delegate( "selector", "click", handler );
$("selector").on( "click", handler );
$("selector").one( "click", handler ); // 用于绑定一次性事件，第一次触发后就自动解除绑定
```
  
以上方法均可重复调用，从而为指定的click事件绑定多个处理函数。触发click事件时，将按照绑定顺序依次执行每个处理函数。  
与click()方法类似，jQuery还提供绝大多数事件的绑定方法，例如:dblclick()、focus()、change()、hover()、submit()(仅限于<form>表单元素)、mousedown()、mouseover()、keydown()、keypress()等。  
而bind()、delegate()、on()等方法，是通过传入指定事件名称的字符串来区分事件类型的，甚至你还可以为自定义的事件绑定处理函数。下面以bind()方法举例，其它方法也与此类似：  
```javascript
$("selector").bind( "dblclick", handler );
$("selector").bind( "keyup", handler );
$("selector").bind( "mouseout", handler );

// bind()等事件方法均支持为多个事件(以空格隔开)绑定同一个处理函数
$("selector").bind( "mouseenter mouseleve", function(event){
    if(event.type == "mouseenter"){
        // mouseenter事件的执行代码
    }else if(event.type == "mouseleve"){
        // mouseleve事件的执行代码     
    }
} );

// 事件名称可以带有命名空间
$("selector").bind( "mouseout.foo", handler );
```
  
jQuery还支持手动触发指定的事件。  
```javascript
// 触发所有匹配元素上的click事件
$("selector").trigger("click");

// 触发所有匹配元素上的change事件
$("selector").trigger("change");

// 触发所有匹配元素上绑定在foo命名空间下的mouseout事件的处理函数
$("selector").trigger("mouseout.foo");
```
  
除了trigger()方法外，triggerHandler()也可以手动触发事件。此外，我们还可以解除元素上绑定的事件处理函数。  
```javascript
//主要用于解除通过click()、dblclick()等直接事件方法以及bind()、one()等方法绑定的处理函数
$("selector").unbind("click");
//主要用于解除通过live()方法绑定的处理函数
$("selector").die("click");
//主要用于解除通过delegate()方法绑定的处理函数
$(document).undelegate("selector", "click");
//主要用于解除通过on()方法绑定的处理函数
$("selector").off("click");

/* 实际上，多数时候，它们是可以混用的 */
```
  
**[⬆ back to top](#table-of-contents)**  
  
## jQuery 核心：Ajax
jQuery还对Ajax进行了封装了，我们可以非常方便地发送一个Ajax请求，并对响应进行处理。  
```javascript
$.ajax({
    url: "ajax.php?action=add",
    type: "post",
    data: "username=hello&password=123456", // 附加的请求数据，也可以为对象格式
    dataType: "json",
    success: function(data){
        // 这是Ajax请求成功后执行的回调函数
        // 因为dataType为json，如果服务器返回的是JSON格式数据，jQuery会将其转为对应的JS对象

        // 假设data为{ msg: "Ajax请求成功", uid: 2 }
        alert( data.msg );
    }
});
```
  
$.ajax()是是jQuery中Ajax的底层实现，其它Ajax请求方法都是基于该方法实现的。  
```javascript
// 以GET方式发送Ajax请求
$.get("ajax.php", { username: "hello", password: "123456" }, function(data){
    // 这是Ajax请求成功后执行的回调函数，就是上面$.ajax中的success选项
});

// 以POST方式发送Ajax请求
$.post("ajax.php", { username: "hello", password: "123456" }, function(data){
    // 这是Ajax请求成功后执行的回调函数，就是上面$.ajax中的success选项
});
```
  
**[⬆ back to top](#table-of-contents)**  
  
## jQuery 辅助工具方法
jQuery还为我们提供了许多的辅助工具方法，以便于我们进行各种常用的代码逻辑处理。  
```javascript
// 去除字符串两端的空白字符
var str1 = $.trim( "  abc d  " ); // "abc d"
var str2 = $.trim( null ); // ""
// 判断是否是数组
var isArray1 = $.isArray( [] ); // true
var isArray2 = $.isArray( new Array() ); // true
// 判断是否是函数
var result1 = $.isFunction( function(){} ); // true
var result2 = $.isFunction( new Function() ); // true
// 检索数组中是否存在指定值，并返回其第一次出现的索引
var index1 = $.inArray( 2, [ 1, 3, 5, 2, 0 ] ); // 3
var index2 = $.inArray( 3, [ 2 ] ); // -1 (不存在返回-1)
// 将JSON字符串转为对应的JS对象
var jsonObj = $.parseJSON( '{ "name": "CodePlayer", "age": 18 }' );
var jsonArray = $.parseJSON( '[ 12, "CodePlayer", true ]' );
```
  
### 遍历方法
此外，在jQuery中还有几个常用的遍历函数，我们可以使用这些函数遍历数组元素或对象属性，并执行对应的回调函数。  
```javascript
// $.each()用于遍历数组元素或对象属性
var array = [ 12, "jQuery", true ];
$.each( array, function(i, value){
    // i 表示当前迭代元素的索引或对象的属性名称
    // value 表示当前迭代的数组元素或对象的属性值
    // this 与  value 相同
    alert( i + " = " + value );

    // 如果函数return false，将终止遍历
});

// $.map()用于遍历数组元素或对象属性，并将每次执行遍历函数的返回值封装为数组返回
var obj = { name: "jQuery", age: 20, isAdmin: true };
var resultArray = $.map( obj, function(value, i){ // 注意参数顺序与each()不同
    // value 表示当前迭代的数组元素或对象的属性值
    // i 表示当前迭代元素的索引或对象的属性名称
    // this 指向全局对象(window)

    if( typeof value === "number"){
        return null; // 如果函数返回null或undefined，则不会添加到结果数组中
    }else{
        return value;
    }
} );
// resultArray 为 [ "jQuery", true ]


//$.grep()用于遍历数组元素，并根据函数的返回值(true/false)来过滤数组元素
var array2 = [ "Hello", 12, "jQuery", true ];
var resultArray2 = $.grep( array2, function(value, i){ // 注意参数顺序与each()不同
    // value 表示当前迭代的数组元素
    // i 表示当前迭代元素的索引
    // this 指向全局对象(window)

    return i % 2 == 0; // 保留返回值不为false的元素
} );
// resultArray2 为 [ "Hello", "jQuery" ];
```
  
上面的方法全是静态方法。此外，jQuery还有两个同名的实例方法each()和map()，专门用于遍历jQuery对象匹配的所有元素。  
```javascript
// 遍历所有的p元素，并执行对应的函数
$("p").each(function(i, element){
    // i 表示当前迭代元素的索引
    // element 表示当前迭代的DOM元素
    // this === element     
});


// 返回包含所有匹配元素value值的数组
$(":checkbox:checked").map(function(i, element){
    // i 表示当前迭代元素的索引
    // element 表示当前迭代的DOM元素
    // this === element
    return this.value;      
});
```
  
### DOM元素和jQuery对象的相互转换
在前面我们已经知道如何将DOM元素转换为jQuery对象，以使用jQuery对象的方法对DOM元素进行操作。有些时候，我们也可能需要将jQuery对象转换DOM元素。  
在此之前，我们应该先了解jQuery对象所包含的DOM元素是存储在什么属性中的。  
实际上jQuery对象是一个类数组对象。它将匹配的所有DOM元素都依次存储在数字索引形式的属性中，并用length属性存储DOM元素的个数。  
```javascript
var p = $("p"); // 返回一个包含所有p元素的jQuery对象
p[0]; // 第1个p元素
p[0].id ; // 返回第1个p元素的id
p[1]; // 第2个p元素
p[2]; // 第3个p元素
p.length; // p元素的个数
```
  
此外，jQuery还给我们提供了一个get()方法，用于获取对应索引的DOM元素。  
```javascript
var p = $("p"); // 返回一个包含所有p元素的jQuery对象
p.get(0); // 第1个p元素
p.get(1); // 第2个p元素
p.get(2); // 第3个p元素
p.get( ); // 不传入任何参数，将以数组形式返回包含的所有p元素
```
  
**[⬆ back to top](#table-of-contents)**  
  
## jQuery 核心：扩展jQuery对象的属性和方法
如果我们要开发基于jQuery的插件，我们一般需要在jQuery对象上添加自定义的属性和方法。jQuery为我们提供了两个主要的方法，以分别为全局jQuery对象或实例jQuery对象扩展自定义的属性和方法.  
  
**[⬆ back to top](#table-of-contents)**