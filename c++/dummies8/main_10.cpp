#include <print>

struct Hero
{
    std::string name;
    int hp;
    int attackPower;

    Hero(std::string n, int h, int ap) : name(n), hp(h), attackPower(ap)
    {
    }
    ~Hero()
    {
        std::println("{} 销毁了！", name);
    }

    void attack(Hero &enemy)
    {
        std::println("{} 攻击了 {} !", name, enemy.name);
        enemy.takeDamage(attackPower);
    }
    void takeDamage(int damage)
    {
        hp -= damage;
        if (hp < 0)
        {
            hp = 0;
        }
        std::println("{} 剩余血量: {} !", name, hp);
    }
};

int main()
{
    Hero kaisa("卡莎", 100, 20);
    Hero yasuo("亚索", 120, 10);

    kaisa.attack(yasuo);

    return 0;
}