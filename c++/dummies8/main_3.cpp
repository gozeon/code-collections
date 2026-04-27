#include <iostream>
#include <print>
#include <typeinfo>

int main()
{
    long int lva1;
    long lva2;
    lva1 = lva2 = 1;
    double dv = 10.0;
    const double PI = 3.14159;

    std::println("{}, {}, {}, {}", lva1, lva2, dv, PI);

    char cl = 'C';
    std::string sword = "C";

    std::println("char: {}", cl);
    std::println("string: {}", sword);

    std::println("\nline\ttable\\haha");

    int var1 = 0;
    decltype(var1) var2;

    std::println("type of var2: {}", typeid(var2).name());

    return 0;
}