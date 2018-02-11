//  main.cpp
//  xcode-c++
//
//  Created by goze on 11/02/2018.
//  Copyright © 2018 goze. All rights reserved.
//
#include <iostream>
#include <sstream>
#include <string>
#include <array>

void introduction() {
    int a, b, sum;
    std::cin >> a;
    std::cin >> b;
    
    sum = a + b;
    std::cout << sum << std::endl;
}

void declarationOfVariables() {
    int foo{5};
    auto bar = foo;
    decltype(foo) n = 10;  // the same as: int n
    
    std::cout << bar << std::endl;
    std::cout << n << std::endl;
    
}

void IntroductionToStrings() {
    std::string mystring;
    mystring = "This is a string";
    
    std::string mysrtring2{"This is two string"};
    std::cout << mystring << std::endl;
    std::cout << mysrtring2 << std::endl;
}

void cinAndStrings() {
    std::string mystr;
    std::cout << "What's your name ?";
    getline(std::cin, mystr);
    std::cout << "Hello " << mystr << ".\n";
    std::cout << "What is your favorite team? ";
    getline(std::cin, mystr);
    std::cout << "I like " << mystr << " too!\n";
}

void stringStreamDemo() {
    std::string mystr;
    float price = 0;
    int quantity = 0;
    
    std::cout << "Enter oprice: ";
    getline(std::cin, mystr);
    std::stringstream(mystr) >> price;
    std::cout << "Enter quantity: ";
    getline(std::cin, mystr);
    std::stringstream(mystr) >> quantity;
    std::cout << "Total price: " << price * quantity << std::endl;
    
}

void rangeBaseForLoop() {
    std::string str {"Hello!"};
    for (char c : str) {
        std::cout << "[" << c << "]";
    }
    
    std::cout << "\n";
}

void gotoDemo() {
    int n = 10;
mylabel:
    std::cout << n << ", ";
    n--;
    if (n > 3) {
        goto mylabel;
    }
    std::cout << "liftoff\n";
}

long factorial(long a) {
    if (a > 1) {
        return (a * factorial(a-1));
    } else {
        return 1;
    }
}

void Recusivity() {
    long number = 10;
    std::cout << number << "! = " << factorial(number) << std::endl;
}

int operate(int a, int b) {
    return (a * b);
}

double operate (double a, double b) {
    return (a/b);
}

void overloadedDome() {
    int x{5};
    int y{2};
    double n{5.0};
    double m{2.0};
    
    std::cout << operate(x, y) << std::endl;
    std::cout << operate(n, m) << std::endl;
}

template <class T>
T sum(T a, T b) {
    T result;
    result = a + b;
    return result;
}

template <class T, class U>
bool are_equal(T a, U b) {
    return (a==b);
}

template <class T, int N>
T fixed_multiply(T val) {
    return val * N;
}

void templateDemo() {
    int i{5};
    int j{6};
    int k;
    double f{2.0};
    double g{0.5};
    double h;
    
    k = sum<int>(i, j);
    h = sum<double>(f, g);
    
    std::cout << k << std::endl;
    std::cout << h << std::endl;
    
    if(are_equal(10, 10.0)) {
        std::cout << "x and y are equal;\n";
    } else {
        std::cout << "x and y are not equal;\n";
    }
    
    std::cout << fixed_multiply<int, 2>(10) << std::endl;
    std::cout << fixed_multiply<int, 3>(10) << std::endl;
}

namespace foo {
    int value() {
        return 5;
    }
}

namespace bar {
    const double pi = 3.1416;
    double value () { return 2 * pi; }
}

void namespaceDemo() {
    std::cout << foo::value() << std::endl;
    std::cout << bar::value() << std::endl;
    std::cout << bar::pi << std::endl;
}

void multidimensionalArray() {
    int jimmy [3][5];
    int n, m;
    for (n = 0; n < 3; n++) {
        for (m = 0 ; m < 5; m++) {
            jimmy[n][m] = (n + 1) * (m + 1);
        }
    }
    
    for(n = 0; n < 3; n++) {
        for (m = 0; m < 5; m++) {
            std::cout << jimmy[n][m] << ' ';
        }
        std::cout << std::endl;
    }
}

void pseudoMultidimensionalArray() {
    int jimmy [3 * 5];
    int n, m;
    for (n = 0; n < 3; n++) {
        for(m = 0; m < 5; m ++) {
            jimmy[n * 5 + m] = (n + 1) * (m + 1);
        }
    }
    
    for(n = 0; n < 3; n++) {
        for (m = 0; m < 5; m++) {
            std::cout << jimmy[n * 5 + m] << ' ';
        }
        std::cout << std::endl;
    }
}

void languageBuildInArray() {
    int myarray[3] = {10, 20, 30};
    
    for (int i = 0; i < 3; ++i) {
        ++myarray[i];
    }
    
    for (int elem: myarray) {
        std::cout << elem << std::endl;
    }
}

void containerLibraryArray() {
    std::array<int, 3> myarray {10, 20, 30};
    
    for (int i = 0; i < myarray.size(); ++i) {
        ++myarray[i];
    }
    
    for (int elem : myarray) {
        std::cout << elem << std::endl;
    }
}

void myFirstPointer() {
    int firstvalue, secondvalue;
    int * mypointer;
    
    mypointer = &firstvalue;
    *mypointer = 10;
    mypointer = &secondvalue;
    *mypointer = 20;
    std::cout << "firstvalue is " << firstvalue << std::endl;
    std::cout << "secondvalue is " << secondvalue << std::endl;
}

void morePointers() {
    int firstvalue = 5, secondvalue = 15;
    int *p1, *p2;
    
    p1 = &firstvalue;
    p2 = &secondvalue;
    *p1 = 10;  // firstvalue = 10
    *p2 = *p1; // secondvalue = 10
    p1 = p2;   // p1 = &secondvalue
    *p1 = 20;  // secondvalue = 20
    
    std::cout << "firstvalue is " << firstvalue << std::endl;
    std::cout << "secondvalue is " << secondvalue << std::endl;
}

void pointerArray () {
    int numbers[5];
    int *p;
    
    p = numbers;
    *p = 10;
    p++;
    *p = 20;
    p = &numbers[2];
    *p = 30;
    p = numbers + 3;
    *p = 40;
    p = numbers;
    *(p + 4) = 50;
    
    for (int n = 0; n < 4; n++) {
        std::cout << numbers[n] << std::endl;
    }
}

void increment_all(int *start, int *stop) {
    int *current = start;
    
    while (current != stop) {
        ++(*current);
        ++current;
         std::cout << current << std::endl;
    }
}

void print_all(const int *start, const int *stop) {
    const int *current = start;
    while (current != stop) {
        std::cout << *current << std::endl;
        ++current;
    }
}

void pointerAsArgument() {
    int number[] = {10, 20, 30};
    increment_all(number, number + 3);
    print_all(number, number + 3);
}

void increase(void* data, int psize) {
    if(psize == sizeof(char)) {
        char* pchar;
        pchar = (char*)data;
        ++(*pchar);
    } else {
        int* pint;
        pint = (int*)data;
        ++(*pint);
    }
}

void voidPointer() {
    char a = 'x';
    int b{1602};
    increase(&a, sizeof(a));
    increase(&b, sizeof(b));
    std::cout << a << ", " << b << std::endl;
}

int addition(int a, int b) {
    return (a + b);
}

int subtraction(int a, int b) {
    return (a - b);
}

int operation(int x, int y, int (*functocall)(int, int)) {
    int g;
    g = (*functocall)(x, y);
    return (g);
}

void pointerToFunctions() {
    int m, n;
    int (*minus)(int, int) = subtraction;
    
    m = operation (7, 5, addition);
    n = operation (20 ,m, minus);
    
    std::cout << m << ", " << n << std::endl;
    
}

int main(int argc, const char * argv[]) {
//    introduction();
//    declarationOfVariables();
//    IntroductionToStrings();
//    cinAndStrings();
//    stringStreamDemo();
//    rangeBaseForLoop();
//    gotoDemo();
//    Recusivity();
//    overloadedDome();
//    templateDemo();
//    namespaceDemo();
//    multidimensionalArray();
//    pseudoMultidimensionalArray();
//    languageBuildInArray();
//    containerLibraryArray();
//    myFirstPointer();
//    morePointers();
//    pointerArray();
//    pointerAsArgument();
//    voidPointer();
    pointerToFunctions();
    
    return 0;
}
