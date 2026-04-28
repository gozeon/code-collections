#include <iostream>
#include <random>
void random_experiment()
{
    std::random_device rd{};
    std::default_random_engine generator(rd());
    std::uniform_int_distribution distribution{1, 6};
    const int roll = distribution(generator);
    std::cout << "Dice roll " << roll << '\n';

    // 填充vector
    std::vector<int> random_vec(10);
    std::generate(random_vec.begin(), random_vec.end(), [&]()
                  { return distribution(generator); });
    for (auto r : random_vec)
    {
        std::cout << r << " ";
    }
    std::cout << "\n";

    std::vector<double> random_vec1(10);
    std::normal_distribution distribution1;
    std::generate(random_vec1.begin(), random_vec1.end(), [&]()
                  { return distribution1(generator); });
    for (auto r : random_vec1)
    {
        std::cout << r << " ";
    }
    std::cout << "\n";
}
int main()
{
    random_experiment();
}