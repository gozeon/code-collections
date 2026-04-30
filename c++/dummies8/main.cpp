#include <variant>
#include <string>
#include <print>
#include <unordered_map>

using namespace std::string_literals;

template <class... Ts>
struct overloaded : Ts...
{
    using Ts::operator()...;
};
template <class... Ts>
overloaded(Ts...) -> overloaded<Ts...>;

int main()
{
    // 多种类型
    using ConfigValue = std::variant<int, std::string, bool>;
    // 哈希表
    std::unordered_map<std::string, ConfigValue> settings;

    settings["id"] = 100;
    settings["name"] = "name"s;
    settings["active"] = true;

    // 批量处理
    for (const auto &[key, value] : settings)
    {
        std::print("{}: ", key);
        std::visit([](auto &&arg)
                   { std::println("{}", arg); }, value);

        // 使用getif处理
        if (auto s = std::get_if<bool>(&value))
        {
            std::println(" get_if 处理bool值 {}", *s);
        }

        // overloaded + visit
        std::visit(overloaded{[](int i)
                              { std::println("overloaded 处理 int {}", i); },
                              [](const std::string &s)
                              { std::println("overloaded 处理 string {}", s); }},
                   value);
    }
}