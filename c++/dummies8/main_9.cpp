#include <print>
#include <iostream>
#include <utility>

#include <source_location> // 需要 C++20

void log(const std::string &message,
         const std::source_location location = std::source_location::current())
{
    std::cout << "File: " << location.file_name() << " | "
              << "Line: " << location.line() << " | "
              << "Function: " << location.function_name() << " | "
              << "Message: " << message << std::endl;
}

enum STATE
{
    DC_OR_TERRITORY, // gets 0
    ALABAMA,         // gets 1
    ALASKA,          // gets 2
    ARKANSAS
};

int main()
{
    std::print("ALABAMA: {}\n", (int)STATE::ALABAMA);
    std::print("ALASKA: {}\n", std::to_underlying(STATE::ALASKA));

    std::cout << "Compile Date: " << __DATE__ << std::endl;
    std::cout << "Compile Time: " << __TIME__ << std::endl;
    std::cout << "At file: " << __FILE__ << std::endl;
    std::cout << "At line: " << __LINE__ << std::endl;
    log("这是一个现代化的日志消息");
    return 0;
}