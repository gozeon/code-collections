#include <print>
#include <iostream>
#include <memory>

// 引用 Reference variables，比传统的 * & 更好理解
void fn(int &pnArg)
{
    pnArg = 10;
}

struct Player
{
    Player() { std::cout << "玩家出生\n"; }
    ~Player() { std::cout << "玩家死亡\n"; }
    void attack() { std::cout << "发动攻击！\n"; }
};

int main()
{
    int myVar = 43;
    std::print("{}\n", (void *)&myVar);
    std::cout << &myVar << std::endl;

    int nVar;
    int *pVar;

    pVar = &nVar;
    *pVar = 10;

    std::print("{}: {}\n{}: {}\n", (void *)&nVar, nVar, (void *)pVar, *pVar);

    // 引用
    int a = 1;
    std::print("a: {}\n", a);
    fn(a);
    std::print("a: {}\n", a);

    // 智能指针, 不能复制！自动回收
    std::unique_ptr<int> pMyPtr;
    pMyPtr = std::make_unique<int>(42);
    std::print("Value of pLife: {}\n", *pMyPtr);
    *pMyPtr = 99;
    std::print("Value of pLife is now: {}\n", *pMyPtr);
    *pMyPtr = *pMyPtr + 14;
    std::print("Value of pLife changed to: {}\n", *pMyPtr);

    // 1. 创建：推荐使用 std::make_unique (C++14 起)
    std::unique_ptr<Player> p1 = std::make_unique<Player>();
    p1->attack(); // 像普通指针一样用 ->
    // 2. 尝试复制：会报错！
    // std::unique_ptr<Player> p2 = p1; // 编译失败，所有权是唯一的
    // 3. 移动：把所有权转给 p2
    std::unique_ptr<Player> p2 = std::move(p1);
    // 此时 p1 变为空，p2 拥有对象
    p2->attack();

    return 0;
}