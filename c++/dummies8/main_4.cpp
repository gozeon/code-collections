#include <iostream>
#include <print>
#include <typeinfo>

int main()
{
    int nLucky = 0;
    std::print("Enter your luck number: ");
    std::cin >> nLucky;
    std::println("You entered {}", nLucky);


    // std::format
    double money = 1234.56789;
    std::println("Money is: ${:.2f}", money);

    float hotdog = 3.99;
    float hamburger = 4.99;
    float fries = 2.99;
    std::println("{:^40}", "Menu");
    std::println("========================================");
    std::println("{:<30}{:>10.2f}", "Hotdog", hotdog);
    std::println("{:<30}{:>10.2f}", "Hamburger", hamburger);
    std::println("{:<30}{:>10.2f}", "Fries", fries);

    

    return 0;
}