#pragma once
// #pragma once 是一种预处理器指令，它的作用是防止同一个头文件被重复包含

#include <vector>
#include <expected>
#include <istream>

namespace stock_prices
{
    std::expected<double, std::string> get_number(std::istream &input_stream);

    inline bool negative(double value)
    {
        return value < 0.0;
    }

    std::vector<double> remove_invalid(std::vector<double> prices);
    void test_analysis();
    double average(const std::vector<double> &prices);
}