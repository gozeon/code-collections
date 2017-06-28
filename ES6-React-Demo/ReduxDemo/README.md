# Redux
[Redux官网](http://redux.js.org/)  

在了解Redux之前，action和reducer听起来比较晦涩，其实他们没什么难懂的地方，action不过是一个特殊的Object，它描述了一个特定的行为：而reducer就是一个函数，接受数据和action，返回唯一的值，他会根据这些不同的action更新对应的state的值。  

store就是这两者的黏合剂，他能完成一下这些任务：
- 保存整个程序的state
- 可以通过getState() 方法返回state的值
- 可以通过dispatch()方法执行一个action
- 还可以通过subscribe(listen)注册回调，监听state的变化

# Redux 三大定律
- 单一数据源：整个应用的state存储在一个javascript对象中，redux用一个称为store的对象来存储整个state
- state是只读的：不能在state上面直接修改数据，改变state的唯一方法是触发action，action只是一个信息载体，一个普通的javascript对象
- 使用纯函数执行修改：为了描述action怎么样改变state，需要编写reducer来规定修改的规则。reducer是纯函数，接受先前的state和处理的action，返回新的state。reducer可以根据应用的大小拆分成多个，分别去操纵state的不同部分。纯函数的好处是它无副作用，仅仅依赖函数的输入，当输入确定时输出也一定保持一致。

# 数据流
Redux是严格的单项数据流，类似flux，可以让程序逻辑更加清晰、数据完全可控。应用中的数据变化都遵循相同的周期，这就是redux的口号，可以预测的javascript状态容器。
redux的数据流步骤：
- 调用store.dispatch(action)，来执行一个action。
- store调用传入的reducer函数，store的来源就是reducer，const store = createStore(rootReducer)。当前的state和action会传入到reducer这个函数中。
- reducer处理action并且返回新的state。在reducer这个纯函数中，可以根据传入的action，来生成新的state并且返回。
- store保存reducer返回的完整state。可以根据store.getState()来取得当前的state，也可以通过store.subscribe(listener)来监听state的变化。
