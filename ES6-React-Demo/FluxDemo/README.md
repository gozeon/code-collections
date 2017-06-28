# FluxDemo
练习Flux
# 目录结构
- components
  - Todo.jsx(程序框架)
  - List.jsx(待办事项列表)
  - CreateButton.jsx(新建待办事项按钮)
- actions
  - TodoAction.js(程序中所有的action)
- dispatcher
  - AppDispatcher.js(程序中的总调度)
- stores
  - TodoStore.js(管理程序中数据的存放)

# 运行
```bash
npm run dev
```

# Flux
Flux是Facebook官方提出的一套前端应用架构模式，它的核心概念就是单向数据流。  

单向数据流是Flux的核心。MVC这种软件架构，它的数据流动是双向的。controller是model和view之间交互的媒介，他要处理view的交互操作，通知model进行更新，同时在操作成功后通知view更新。这种双向的模式在model和view的对应关系变得越来越复杂的时候，就会遇到很多困难，难以维护和调试。

# Flux整个流程

Action -> Dispatcher -> Store -> View  

### Action
Action就是用来描述一个行为的对象，里面有相关的信息，比如说一个创建文章的Action可以是{actionName: 'createpost', data: {'content': 'new stuff'}}

### Dispatcher
Dispatcher是一个信息的分发宗欣，它也是Action和Store的连接中心，Dispatcher可以使用dispatch方法执行一个Action，并且可以用register方法注册回调，在回调方法中处理store的内容

### Store
Store处理完毕之后，它可以使用emit方法向其他地方发送命名为‘change’的广播，告知他们Store已经发生变更

### View
View是监听这change事件，一旦change事件被触发，那么该层可以调用setState来更新整个UI

流程：当用户在view上有一个交互时，Dispatcher广播（dispatch方法）一个action（就是一个Object对象，里面包含action的类型和要传递的数据），在整个程序的总调度台（Dispatcher）里面注册了各种类型的action类型，在对应的类型中，store（也是一个Object对象，实现了订阅-发布的功能）对这个action进行响应，对数据做对应的处理，然后触发一个自定义事件，同时，在view上注册这个store的事件回调，响应这个事件并且重新渲染洁面

### Flux的优缺点
每种软件架构都有它特定的适用场景，Flux也不例外。  
实现Flux架构会增加你的代码量，它引入了大量的概念和文件，其实完全可以在一个组件内完成所有的需求。  
使用Flux并不是为了简化代码量，而是因为它带来了清晰的数据流，并且合理地把数据和组件的state分离，对于做比较复杂的多人项目来说，这样是大有裨益的，保持了清晰的逻辑，数据流动更加明了，提供了可预测的状态，避免了多向数据流动带来的混乱和维护困难的问题。  
所以不是所有的场景都适合Flux，如果你的应用足够简单，全都是静态组件，组件之间没有共享数据，那么Flux只会给你徒增烦恼。
