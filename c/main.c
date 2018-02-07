#include <stdio.h>
#include <math.h>
#include <limits.h>
#include <float.h>

void limitDemo() {
    printf("Variables of type char store values form %d to %d\n", CHAR_MIN, CHAR_MAX);
    printf("Variables of type unsigned char store values from 0 to %u\n", UCHAR_MAX);
    printf("Variables of type short store values from %d to %d\n", SHRT_MIN, SHRT_MAX);
    printf("Variables of type unsigned short store values from 0 to %u\n", USHRT_MAX);
    printf("Variables of type int store values from %d to %d\n", INT_MIN, INT_MAX);
    printf("Variables of type unsigned int store values from 0 to %u\n", UINT_MAX);
    printf("Variables of type long store values from %ld to %ld\n", LONG_MIN, LONG_MAX);
    printf("Variables of type unsigned long store values from 0 to %ld\n", ULONG_MAX);
    printf("Variables of type long long store values from %lld to %lld\n", LLONG_MIN, LLONG_MAX);
    printf("Variables of type unsigned long long store values from 0 to %lld\n", ULLONG_MAX);

    printf("\nThe size of the smallest positive non-zero value of type float is %.3e\n", FLT_MIN);
    printf("The size of the largest value of type float is %.3e\n", FLT_MAX);
    printf("The size of the smallest non-zero value of type double is %.3e\n", DBL_MIN);
    printf("The size of the largest value of type double is %.3e\n", DBL_MAX);
    printf("The size of the smallest non-zero value of type long double is %.3Le\n", LDBL_MIN);
    printf("The size of the largest value of type long double is %.3Le\n", LDBL_MAX);
    printf("\n");
}

void size() {
    printf("Variables of type char occupy %lu bytes\n", sizeof(char));
    printf("Variables of type short occupy %lu bytes\n", sizeof(short));
    printf("Variables of type int occupy %lu bytes\n", sizeof(int));
    printf("Variables of type long occupy %lu bytes\n", sizeof(long));
    printf("Variables of type long long occupy %lu bytes\n", sizeof(long long));
    printf("Variables of type float occupy %lu bytes\n", sizeof(float));
    printf("Variables of type double occupy %lu bytes\n", sizeof(double));
    printf("Variables of type long double occupy %lu bytes\n", sizeof(long double));
    printf("\n");
}

void charDemo() {
    char first = 'a';
    char second = 40;
    printf("%d - %c - %c - %c\n", first, second, first + 2, second + 37);
    printf("\n");
}

void enumeration() {
    enum Weekday {
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday
    };

    enum Color {
        red = 2,
        orange,
        yellow,
        green = 4,
        blue,
    };

    enum Weekday today = Wednesday;
    enum Weekday tomorrow = today + 1;

    printf("today: %d\n", today);
    printf("tomorrow: %d\n", tomorrow);

    enum Color r = red;
    enum Color o = red + 1;
    enum Color b = blue;
    printf("red: %d\norange: %d\nblue: %d\n", r, o, b);

    printf("\n");
}

int main() {
    limitDemo();
    size();
    charDemo();
    enumeration();

    return 0;
}