# Markdown(个人笔记)  
  
## Table of Contents  

### 特别要注意的地方
1.  随便写相当于`p`标签
2.  空格的使用及数量
3.  换行两个空格加回车  
  
### 强调
  ```
  *adc*
  _adb_           以上等同于 <em>abc<em>
  **adc**
  __abc__         以上等同于 <strong>abc<strong>
  ```
### 特殊字符`<`和`&`
```
   &lt;   用来表示'<'  
   &amp;  用来表示'&'
```   
### 反斜杠 `\`    
插入一些符号(在符号前面加`\`)，支持的有以下  

`\`、`'`、`*`、`_`、`{}`、`[]`、`()`、`#`、`+`、`-`、`.`、`!`  
### 标题
间隔一个空格
```
# h1    
## h2
### h3
```
### 区块引用 blockquotes
前面加`>`  ,可嵌套（嵌套层数由`>`的数量决定），可使用其他Markdown语法
```
>hello 
>>hello
>>>1.  hello
>>>2.  hello
>>>>*.  hello
>>>>*.  hello
```
效果：
>hello
>>hello  

>>>1.   hello
>>>2.   hello
>>>>*    hello
>>>>*    hello       
  
### 列表 `ul`和`ol`
 普通间隔两个空格，嵌套时退格三个。
 ```
 +  aaa
 -  bbb
 *  ccc
 1.  aaa
 2.  bbb
 3.  ccc
 ```
效果：
 +  aaa
    -  bbb
    *  ccc
       1.  aaa
       2.  bbb   
### 代码块  `pre`
  1.  四个空格加回车
  2.  使用```进行包裹，并在第一行(与符号同行)注明语言  
  
### 链接  
>格式：`[](网址 "title")`，要有一个空格在双引号前面。
```
This is [an example](www.baidu.com "title") inline link
```
效果：   
This is  [an example](www.baidu.com.com "title") inline link   

### 图片  
>格式： `![Alt text](/path/to/img.jpg)`  
  
  *  []里面为注释文字  
  
### 分割线  `***`、`---`
*** 
---  

### 锚点
```markdown
# 锚点   
解析为 ： 
<h1 id="user-content-锚点">锚点 <h1>
[链接](#user-content-锚点)
```
[BACK TO TOP](#table-of-contents)
