#include <print>
#include <iostream>
#include <algorithm>
#include <vector>
#include <ranges>

#include "input.h"

std::vector<double> get_prices(std::istream &input_stream)
{
    std::cout << "please enter some numbers.\n>";
    std::vector<double> numbers{};
    auto number = stock_prices::get_number(input_stream);
    while (number.has_value())
    {
        numbers.push_back(number.value());
        std::cout << '>';
        number = stock_prices::get_number(input_stream);
    }

    return numbers;
}

int main()
{
    stock_prices::test_analysis();

    auto prices = get_prices(std::cin);
    if (!prices.empty())
    {
        auto result = std::ranges::minmax(prices);
        std::cout << "min: " << result.min << '\n';
        std::cout << "max: " << result.max << '\n';
    }

    // 统计
    auto invalid = std::ranges::count_if(prices, stock_prices::negative);
    std::cout << invalid << " prices below zero\n";

    // 过滤
    auto iterator = std::ranges::find_if(prices, stock_prices::negative);
    auto positive = std::vector(prices.begin(), iterator);
    for (auto pos : positive)
    {
        std::cout << pos << " posi\n";
    }

    // 排序
    std::vector<double> asd = {7, 3, 8, 5};
    std::ranges::sort(asd); // 升序
    // std::ranges::sort(asd, std::ranges::greater{}); // 降序
    for (auto a : asd)
    {
        std::cout << a << " ";
    }

    // 匿名函数 lamda
    const std::vector prices{3.76, 1.5, -1.0, 3.0, 4.0, -2.0, 99.4};
    const double required_price = 4.75;
    auto non_negative = [](double price)
    { return price >= 0.0; };
    auto too_cheap = [required_price](double x)
    {
        std::cout << "Comparing " << x << '\n';
        return x <= required_price;
    };

    // filter 会检查所有数据，而 take_while 一旦遇到不符合条件的就立即掐断
    auto no_good = prices | std::views::filter(non_negative) | std::views::take_while(too_cheap);
    std::cout << "Too cheap:\n";
    for (double p : no_good)
    {
        std::cout << p << '\n';
    }

    return 0;
}