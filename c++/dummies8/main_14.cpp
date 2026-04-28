#include <print>
#include <iostream>
#include <expected>
#include <vector>

void vector_experiment()
{
    std::vector numbers{0, 1};
    std::cout << "Capacity " << numbers.capacity() << '\n';

    numbers.push_back(-123);
    numbers.insert(numbers.begin(), -456);

    auto iterator = numbers.begin();
    numbers.insert(++iterator, -789);

    numbers.erase(numbers.begin() + 2);

    // 固定长度
    numbers.shrink_to_fit();
    numbers.push_back(-90);
    std::cout << "Capacity after a shrink " << numbers.capacity() << '\n';

    for (const auto number : numbers)
    {
        std::cout << number << '\n';
    }
}

int main()
{
    vector_experiment();

    return 0;
}