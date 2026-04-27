#include <iostream>
#include <print>

int main()
{
    int celsius;
    std::print("输入 temperature in celsius:");
    std::cin >> celsius;

    int factor;
    factor = 212 - 32;

    int fahrenheit;
    fahrenheit = factor * celsius / 100 + 32;

    std::print("Fahrenheit value is: ");
    std::println("{}", fahrenheit);

    return 0;
}