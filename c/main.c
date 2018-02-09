#include <stdio.h>
#include <math.h>
#include <limits.h>
#include <float.h>
#include <ctype.h>
#include <stdlib.h>
#include <time.h>
#include <stdbool.h>
#include <string.h>

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

void convert() {
    char letter = 0;
    printf("Enter an letter: ");
    scanf("%c", &letter);
    if (isalpha(letter)) {
        if (isupper(letter)) {
            printf("upper: %c\n", letter);
            printf("lower: %c\n", tolower(letter));
        } else if (islower(letter)) {
            printf("upper: %c\n", toupper(letter));
            printf("lower: %c\n", letter);
        }
        printf("ASCII: %d", letter);
    } else {
        printf("You didn't enter letter");
    }

//    char letter = 0;
//    printf("Enter an letter: ");
//    scanf("%c", &letter);
//
//    if (letter >= 'A') {
//        if (letter <= 'Z') {
//            printf("%c\n", tolower(letter));
//            letter = letter + 'A' - 'a';
//
//        } else {
//            if (letter >= 'a') {
//                if (letter <= 'z') {
//                    printf("%c\n", toupper(letter));
//                    printf("You entered an uppercase %c\n", letter);
//                }
//            }
//        }
//    } else {
//        printf("You didn't enter letter");
//    }
}

//void mathRandom() {
//    int s = rand(); // 每次执行都会随机产生相同的数字
//    srand(time(NULL)); // 重新初始化序列数
//    int v = rand();
//    int a = rand();
//    printf("%d %d %d", s, v, a);
//}

/**
 * 延时
 * @param delay 秒
 */
void delay(int delay) {

    clock_t start_time = clock();

    for (; clock() - start_time < delay * CLOCKS_PER_SEC;);

}

void sumTime() {
    clock_t start, end;
    start = clock();
    for (int i = 0; i < 10; ++i) {
        delay(1);
        printf("%d\n", i);
    }
    end = clock();
    printf("time second: %f", (double) (end - start) / CLOCKS_PER_SEC);
}

void stringLength() {
	char str[][70] = {
    	"Computers do what you tell them to do, not what you want them to do.",
    	"abcd",
    	"e",
    };

    unsigned int strCount = sizeof(str)/sizeof(str[0]);

    for(unsigned int i = 0; i < strCount; ++i) {
    	printf("The string:\n  \"%s\"\n contains %lu characters.\n", str[i], strlen(str[i]));
    }
}

void stringCopy() {
    char source[] = "plearse copy this line";
    char destination[50];
    
    strcpy(destination, source);
    printf("source: %s\n", destination);
    printf("destination: %s\n", destination);
}

void stringContact() {
    char str1[50] = "To be, or not to be, ";
    char str2[] = "that is the question";
    char result[50];
    strcat(result, str1);
    strcat(result, str2);
    printf("str1: %s\n", str1);
    printf("str2: %s\n", str2);
    printf("result: %s\n", result);
}

void stringSearch() {
    char str[55] ="This is a string for testing";
    char *p;
    p = strchr(str,'i');
    printf ("Character i is found at position %ld\n", p - str + 1);
    printf ("%s\n", p);
    printf ("%s\n", ++p);
}

int main() {
//    limitDemo();
//    size();
//    charDemo();
//    enumeration();
//    convert();
//    mathRandom();
//    sumTime();
//    stringLength();
//    stringCopy();
//    stringContact();
    stringSearch();

    return 0;
}
