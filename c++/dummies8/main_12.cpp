#include <print>
#include <iostream>
#include <expected>

std::expected<double, std::string> get_number(std::istream &input_stream)
{
    double number{};
    input_stream >> number;
    if (input_stream)
    {
        return number;
    }
    return std::unexpected("That is not a number");
}

double get_number_1(std::istream &input_stream)
{
    double number{};
    input_stream >> number;
    if (input_stream)
    {
        if (number >= 0.0)
        {
            return number;
        }
        throw std::invalid_argument("please provide a nonnegative number");
    }

    throw std::exception{};
}

int main()
{

    std::cout << "Please enter a number.\n>";
    auto number = get_number(std::cin);
    if (number.has_value())
    {
        std::cout << "Got " << number.value() << " thanks!\n";
    }
    else
    {
        std::cout << number.error() << "\n";
    }

    try
    {
        std::cout << "Please enter a number. \n>";
        double number = get_number_1(std::cin);
        std::cout << "Got " << number << " thanks!\n";
    }
    catch (const std::invalid_argument &ex)
    {
        std::cout << ex.what() << "\n";
    }
    catch (const std::exception &ex)
    {
        std::cout << "something went wrong\n";
    }

    return 0;
}