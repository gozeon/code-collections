// 函数声明和函数表达式

alert(greetNamed("Jhon"));
// alert(greetUnname("Bob")); // 报错 变量提示

function greetNamed(name: string): string {
    if (name) {
        return "Hi " + name;
    }
}

let greetUnname = function (name: string): string {
    if (name) {
        return "Hi" + name;
    }
};

// 可选参数
function add(foo: number, bar: number, foobar?: number): number {
    let result = foo + bar;
    if (foobar !== undefined) {
        result += foobar;
    }
    return result;
}

alert(add(2, 3));
alert(add(2, 3, 4));

// 默认参数
function add1(foo: number, bar: number, foobar = 0): number {
    return foo + bar + foobar;
}

alert(add1(2, 3));
alert(add1(2, 3, 4));

// 有剩余参数的函数
function add2(...foo: number[]): number {
    let result = 0;
    for (let i = 0; i < foo.length; i++) {
        result += foo[i];
    }
    return result;
}

alert(add2(2, 2, 2, 2, 2, 2));

// 函数重载
// 函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力
function test(name: string): string; // 重载签名
function test(age: number): string; // 重载签名
function test(single: boolean): string; // 重载签名
function test(value: (string | number | boolean)): string { // 实现签名
    switch (typeof value) {
        case "string":
            return `My name is ${value}`;
        case "number":
            return `I'm ${value} years old`;
        case "boolean":
            return value ? "I'm single" : "I'm not single";
        default:
            console.log("Invalid Operation!");
    }
}

alert(test("Remo"));
alert(test(23));
alert(test(false));

// 函数作用域
// 一些低级语言(比如c语言)包含了底层内存管理特性。在拥有更高层抽象的编程语言中，当变量被创建时，内存就已经被分配,
// 并且在他们不被使用时会被清理掉。这个清理内存的过程被称为垃圾回收，由于JavaScript运行时的垃圾回收器实现。
// 垃圾回收器通常非常高效，但希望它能帮我们处理掉所有内存泄漏时就会有问题。垃圾回收器会在变量脱离作用域时清理掉它
// 们，所有理解TypeScript的作用域的工作机制对我们来说是非常重要的，这样我们就能理解变量的生命周期。
// 一些编程语言使用程序的源代码结构来指定哪些变量被引用(词法作用域),另一些编程语言使用程序运行时堆栈状态来指定哪些
// 变量被引用(动态作用域)。主要的现代编程语言使用词法作用域，词法作用域往往比动态作用域更易被人和分析工具理解。

// 变量提升：在运行时中，所有的变量声明都会在函数执行前移动到函数的顶端，这种行为为变量提升

// 立即执行函数
// 立即执行函数表达式（IIFE）是一种设计模式，使用函数作用域作为一个词法作用域。。
// IIFE可以被用于防止全局作用域中的变量提示导致的污染。。

let bar = 0; // 全局的的

(function () {
    let foo = 0; // 在函数作用域中中
    bar = 1; // 在全局作用域中中
    console.log(bar); // 1
    console.log(foo); // 0
})();

console.log(bar); // 1
