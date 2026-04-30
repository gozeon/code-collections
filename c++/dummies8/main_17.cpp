#include <iostream>
#include <fstream>
#include <random>
#include <stdexcept>
#include <filesystem>
#include <functional>
#include <expected>

std::vector<double> gen_prices()
{
    std::random_device rd{};
    std::default_random_engine generator(rd());
    std::normal_distribution distribution;

    std::vector<double> random_vec1(10);
    std::generate(random_vec1.begin(), random_vec1.end(), [&]()
                  { return distribution(generator); });
    return random_vec1;
}

void write_to_file_1(const std::vector<double> &prices, const std::string &filename)
{
    std::ofstream file{filename};
    if (file)
    {
        for (auto price : prices)
        {
            file << price << '\n';
        }
    }
    else
    {
        throw std::runtime_error("Failed to write to prices.txt");
    }
}

void write_to_file(const std::vector<double> &prices, const std::string &filename)
{
    const std::filesystem::path path = std::filesystem::current_path();
    const auto fully_pathed_filename = path / filename;

    // std::ofstream file{filename};
    // std::ios::out 指定写入模式。由于 ofstream 本身就是输出流，这个参数通常可以省略。
    // std::ios::app Append（追加） 的缩写
    std::ofstream file{filename, std::ios::out | std::ios::app};
    if (file)
    {
        for (auto price : prices)
        {
            file << price << '\n';
        }

        std::cout << "wrote to " << fully_pathed_filename << '\n';
    }
    else
    {
        auto error_message = "Failed to write to" + fully_pathed_filename.string();
        throw std::runtime_error(error_message);
    }
}

std::expected<double, std::string> get_number(std::istream &input_stream)
{
    double number{};
    input_stream >> number;
    if (input_stream)
    {
        return number;
    }
    input_stream.clear();
    input_stream.ignore(
        std::numeric_limits<std::streamsize>::max(),
        '\n');
    return std::unexpected{"That's not a number"};
}

std::vector<double> get_prices(std::istream &input_stream,
                               std::function<void()> prompt)
{
    prompt();
    std::vector<double> numbers{};
    auto number = get_number(input_stream);
    while (number.has_value())
    {
        numbers.push_back(number.value());
        prompt();
        number = get_number(input_stream);
    }
    return numbers;
}

std::vector<double> read_from_file(const std::string &filename)
{
    std::ifstream file{filename};
    if (file)
    {
        // cin、ifstream 属于 istream
        // cout、ofstream 属于 ostream
        auto prices = get_prices(file, []() {});
        for (auto price : prices)
        {
            std::cout << price << '\n';
        }

        return prices;
    }
    else
    {
        throw std::runtime_error("Failed to read from file");
    }
}

int main()
{
    try
    {
        const std::string filename = "prices.txt";
        if (std::filesystem::exists(filename))
        {
            auto prices = read_from_file(filename);
            if (!prices.empty())
            {
                std::cout << "read " << prices.size() << " prices\n";
            }
        }
        write_to_file(gen_prices(), "prices.txt");

        return 0;
    }
    catch (const std::exception &e)
    {
        std::cout << e.what() << '\n';
        return 1;
    }
}