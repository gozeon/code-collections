#include <iostream>
#include <print>

int main()
{
    int nvalue1 = 1;
    int nvalue2 = 2;
    int nvalue3 = 3;

    int naverage = nvalue1 / 3 + nvalue2 / 3 + nvalue3 / 3;

    std::println("{}", naverage);

    float nvalue4 = 1.0;
    float nvalue5 = 2.0;
    float nvalue6 = 3.0;

    float naverage1 = nvalue4 / 3.0 + nvalue5 / 3.0 + nvalue6 / 3.0;

    std::println("{:.2f}", naverage1);

    return 0;
}