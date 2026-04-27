#include <iostream>
#include <print>

int main()
{
    int nloopcount;
    std::print("enter loop count:");
    std::cin >> nloopcount;

    for (; nloopcount > 0;)
    {
        nloopcount = nloopcount - 1;
        std::println("Only {} loops to go", nloopcount);
    }

    for (int n : {1, 2, 3, 4, 5, 1, 123, 1234, 12321})
    {
        std::print("{}, ", n);
    }
    std::println("");

    return 0;
}