#include <print>
#include <cassert>
#include <iostream>
#include <istream>
#include <sstream>

// nodiscard 调用者“无视”了某个函数的返回值，请给出一个警告（Warning）
[[nodiscard]] bool get_number(std::istream &input_stream, double &number)
{
    input_stream >> number;
    if (input_stream)
    {
        return true;
    }
    else
    {
        // 如果在刷，需要清理
        // input_stream.clear();
        // input_stream.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        return false;
    }
}

void test_code()
{
    double value{};
    std::stringstream some_input{"1"};
    const bool ok = get_number(some_input, value);
    assert(ok);
    assert(value == 1);

    double unused{};
    std::stringstream bad_input{"q"};
    const bool not_ok = get_number(bad_input, unused);
    assert(!not_ok);
}

int main()
{

    int a{};   // a = 0
    float b{}; // b = 0.0f
    bool c{};  // c = false
    char d{};  // d = '\0' (空字符)
    int *p{};  // p = nullptr (空指针)

    test_code();

    double number{};
    std::println("Please enter anumber.");
    if (get_number(std::cin, number))
    {
        std::println("got {}, thank!", number);
    }
    else
    {
        std::println("something went wrong");
    }

    return 0;
}