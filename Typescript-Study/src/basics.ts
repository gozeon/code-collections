// boolean
const isDone = false;

// number
const height = 6;

// array
const list = [1, 2, 3];

// string
let str = "hello word";

// enum
enum Color { Red, Green, Blue };
let c: Color = Color.Red;

// any
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;

let list1: any[] = [1, true, "free"];

// void
function warnUser(): void {
  alert("This is my warning message");
}

// 联合类型
let path: string[] | string;
path = "/tmp/log.xml";
path = ["/tmp/log.js", "/tmp/log.css"];
// path = 1;

// 类型守护
let x: any = {/* ... */ };
if (typeof x === "string") { // 还可用用 instanceof
  // console.log(x.splice(3, 1)); // 错误 'string'不存在'splice'方法
}
// x 依然是是 any 类型

// 类型别名
type PrimitiveArray = Array<string | number | boolean>;
type MyNumber = number;
type Callback = () => void;

let array: PrimitiveArray = [11, "22", false];
let num: MyNumber = 2;
let getValue: Callback = () => undefined;

// 环境声明 全局声明 像使用window对象一样使用其他工程文件
interface ICustomConsole {
  log(arg: string): void;
}
declare var customConsole: ICustomConsole;
customConsole.log("hello world");

// 多选结构(switch)
enum AlertLevel {
  info,
  warning,
  error
}
function getAlertSubscribers(level: AlertLevel) {
  let emails = new Array<string>();
  switch (level) {
    case AlertLevel.info:
      emails.push("cst@domain.com");
      break;
    case AlertLevel.warning:
      emails.push("development@domain.com");
      emails.push("sysadmin@domain.com");
      break;
    case AlertLevel.error:
      emails.push("development@domain.com");
      emails.push("sysadmin@domain.com");
      emails.push("nanagement@domain.com");
      break;
    default:
      throw new Error("Invalid argument!");
  }
  return emails;
}
getAlertSubscribers(AlertLevel.info); // ["cst@domain.com"]

// 迭代对象的属性
let obj: any = { a: 1, b: 2, c: 3 };
for (let key in obj) {
  console.log(key + "=" + obj[key]);
}
/* 原理
for (var key in obj) {
    if (obj.hasOwnProperty(prop)) {
        // prop 没有被继承
    }
}
*/

// 具名函数
function greet(name?: string): string {
  if (name) {
    return "Hi" + name;
  } else {
    return "Hi";
  }
}

// 匿名函数
let greet1 = function (name?: string): string {
  if (name) {
    return "Hi" + name;
  } else {
    return "Hi";
  }
};

let greet2 = (name: string): string => {
  if (name) {
    return "Hi" + name;
  } else {
    return "Hi";
  }
};

let greet3: (name: string) => string = function (name: string): string {
  if (name) {
    return "Hi" + name;
  } else {
    return "Hi";
  }
};

function sume(a: number, b: number, callback: (result: number) => void) {
  callback(a + b);
}

// // 类
// class Character {
//     fullname: string;
//     constructor(firstname: string, lastname: string) {
//         this.fullname = firstname + " " + lastname;
//     }
//     greet(name?: string) {
//         if (name) {
//             return "Hi" + name + "! my name is " + this.fullname;
//         } else {
//             return "Hi my name is " + this.fullname;
//         }
//     }
// }

// var spark = new Character("Jacob", "keyes");
// var msg = spark.greet();
// alert(msg);
// var msg1 = spark.greet("Dr. Halsey");
// alert(msg1);

// 接口
interface LoggerInterface {
  log(arg: any): void;
}

class Logger implements LoggerInterface {
  public log(arg: any) {
    if (typeof console.log === "function") {
      console.log(arg);
    } else {
      alert(arg);
    }
  }
}

interface UserInterface {
  name: string;
  password: string;
}

let user: UserInterface = {
  name: "",
  password: "" // password 遗漏错误属性
};

// // 命名空间
// namespace Geometry {
//     interface VectorInterface {
//         /** */
//     }
//     export interface Vector2dInterface {
//         /** */
//     }
//     export interface Vector3dInterface {
//         /** */
//     }
//     export class Vector2d implements VectorInterface, Vector2dInterface {
//         /** */
//     }
//     export class Vector3d implements VectorInterface, Vector3dInterface {
//         /** */
//     }
// }

// var vector2dInstance: Geometry.Vector2dInterface = new Geometry.Vector2d();
// var vector3dInstance: Geometry.Vector3dInterface = new Geometry.Vector3d();

// 综合应用
module Geometry {
  export interface Vector2dInterface {
    toArray(callback: (x: number[]) => void): void;
    length(): number;
    normalize(): any;
  }

  export class Vector2d implements Vector2dInterface {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
      this._x = x;
      this._y = y;
    }

    public toArray(callback: (x: number[]) => void): void {
      callback([this._x, this._y]);
    }

    public length(): number {
      return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    public normalize() {
      let len = 1 / this.length();
      this._x *= len;
      this._y *= len;
    }
  }
}

let vector: Geometry.Vector2dInterface = new Geometry.Vector2d(2, 3);
vector.normalize();
vector.toArray(function (vectorAsArray: number[]) {
  alert("x: " + vectorAsArray[0] + "y: " + vectorAsArray[1]);
});
