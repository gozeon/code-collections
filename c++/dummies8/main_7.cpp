#include <print>
#include <span>

int main()
{
    int myArray[5] = {10, 20, 30, 40, 50};
    // Creates a span referencing the array
    std::span<int> mySpan(myArray);
    // Print the span elements directly
    for (int &n : mySpan)
    {
        n *= 2;
        std::print("{} ", n);
    }
    std::println(); // print a new line

    // 这时候你会发现，原值(myarray) 的元素也被改了
    for (int n : myArray)
    {
        std::print("{} ", n);
    }

    std::println();

    // 直接声明
    // The following line is possible with C++ 26
    std::span<const int> mySpan1{{10, 20, 30, 40, 50}};
    for (int n : mySpan1)
    {
        std::print("{} ", n);
    }
    std::println();

    return 0;
}