#include <limits>
#include <vector>
#include <algorithm>
#include <numeric>
#include <cassert>
#include "input.h"

namespace stock_prices
{
    std::expected<double, std::string> get_number(std::istream &input_stream)
    {
        double number{};
        input_stream >> number;
        if (input_stream)
        {
            return number;
        }

        input_stream.clear();
        input_stream.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        return std::unexpected{"That is not a number"};
    }

    std::vector<double> remove_invalid(std::vector<double> prices)
    {
        auto new_end = std::remove_if(prices.begin(), prices.end(), negative);
        prices.erase(new_end, prices.end());

        /* 展开写法
        for (auto iterator = prices.begin(); iterator != prices.end();)
        {
            if (negative(*iterator))
            {
                iterator = prices.erase(iterator);
            }
            else
            {
                ++iterator;
            }
        }
            */
        return prices;
    }
    void test_analysis()
    {
        auto got = remove_invalid({-1.2, 3.5});
        assert(got.size() == 1);
        assert(got[0] == 3.5);

        try
        {
            average({});
            assert(false);
        }
        catch (const std::exception &)
        {
        }

        assert(average({1.0}) == 1.0);
    }
    double average(const std::vector<double> &prices)
    {
        if (prices.empty())
        {
            throw std::invalid_argument("Prices  cannot be empty");
        }
        return std::accumulate(prices.begin(), prices.end(), double{}) / prices.size();
    }
}