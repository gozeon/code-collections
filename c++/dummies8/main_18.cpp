#include <iostream>
#include <string>
#include <print>
#include <expected>

// s 后缀 str 的类型会自动推导为 std::string，而不是指针
using namespace std::string_literals;

void show_characters_before(const std::string &value, char character)
{
    auto position = value.find(character);
    if (position != std::string::npos)
    {
        std::string partial = value.substr(0, position);
        std::cout << "Before " << character << ": " << partial << "\n";
    }
    else
    {
        std::cout << character << " not found\n";
    }
}

// ❌ 传统方式：会触发一次内存分配和字符串拷贝
void processString(std::string s)
{
    std::cout << s << std::endl;
}

// ✅ C++17 推荐：没有拷贝，性能极高
void processView(std::string_view sv)
{
    std::cout << sv << std::endl;
}

int main(int argc, char *argv[])
{
    auto a = "hello";  // const char*
    auto b = "hello"s; // std::string
    const std::string greeting{"Hello, world!"};
    const auto yet_another_greeting{"Hello, world!"s};
    std::string from_a_literal{"abc"};
    std::string from_some_chars{'a', 'b', 'c'};
    std::string triple_A(3, 'A');
    std::string triple_A_from_char_value(3, 65);

    std::cout << a << std::endl;
    std::cout << b << std::endl;
    std::cout << greeting << std::endl;
    std::cout << yet_another_greeting << std::endl;
    std::cout << from_a_literal << std::endl;
    std::cout << from_some_chars << std::endl;
    std::cout << triple_A << std::endl;
    std::cout << triple_A_from_char_value << std::endl;

    for (int i = 0; i < argc; ++i)
    {
        std::cout << "Argument " << argv[i] << '\n';
        show_characters_before(argv[i], '/');
        show_characters_before(argv[i], '\\');
    }

    std::println("{} {}", 1, 2);
    std::println("{0:} {1:}", 1, 2);
    std::println("{1:} {0:}", 1, 2);
    std::println("{1:} {0:} {1:}", 1, 2);

    std::println("{:.2f}", 1.9051);
    auto message = std::format("{}{}{}", "Hello"s, " again,"s, " world!"s);
    std::println("{}", message);
    // 右对齐
    std::println("Message: {: >20}", "some message");
    // 左对齐
    std::println("Message: {: <20}", "some message");
    // 居中
    std::println("Message: {:^20}", "some message");
}