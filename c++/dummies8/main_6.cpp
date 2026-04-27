#include <iostream>
#include <print>

int getPizzaSize(const std::string sizetext)
{
    int nSize = 0;
    do
    {
        std::println("enter the size(diameteer) of a {} pizza.", sizetext);
        std::print("Valid sizes are from 2 to 32 inches:");
        std::cin >> nSize;
        std::cin.clear();            // Reset any error flags
        std::cin.ignore(1000, '\n'); // Ignore invalid input characters
    } while (nSize < 2 || nSize > 32);
    return nSize;
}

int main()
{
    auto a = getPizzaSize("haha");
    std::println("{}", a);

    return 0;
}