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

    // Clears errors
    input_stream.clear();
    // Mops up unused input
    input_stream.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return std::unexpected{"That's not a number"};
}

void show_numbers(const std::array<double, 5u> &numbers)
{
    for (const auto number : numbers)
    {
        std::cout << number << '\n';
    }
}

void max_numbers(const std::array<double, 5u> &numbers)
{
    double biggest = numbers[0];
    for (const auto number : numbers)
    {
        if (number > biggest)
        {
            biggest = number;
        }
    }

    std::cout << "the biggest number is " << biggest << '\n';
}

int main()
{

    std::cout << "Please enter a number.\n>";
    std::array<double, 5u> numbers{};
    size_t count{0u};

    while (count < numbers.size())
    {
        std::cout << '>';
        auto number = get_number(std::cin);
        if (number.has_value())
        {
            numbers[count] = number.value();
            std::cout << "got " << number.value() << " thanks!\n";
        }
        else
        {
            std::cout << number.error() << "\n";
        }
        ++count;
    }

    show_numbers(numbers);
    max_numbers(numbers);

    return 0;
}