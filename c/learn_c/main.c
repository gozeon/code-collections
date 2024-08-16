#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h>

#include "01.c"
#include "02.c"
#include "03.c"
#include "04.c"

void do_std_io()
{
    int character;
    character = getchar();
    while (character != EOF)
    {
        putchar(character);
        character = getchar();
    }
}

void do_sizeof()
{
    char c = 'a';
    short s = 0xbeef;
    int i = 100000;
    long l = 10000000000L;
    long long ll = 222222222222222LL;
    float f = 100;
    double d = 20;

    printf("A char is %lu bytes\n", sizeof(c));
    printf("A shot is %lu bytes\n", sizeof(s));
    printf("A int is %lu bytes\n", sizeof(i));
    printf("A long is %lu bytes\n", sizeof(l));
    printf("A long long is %lu bytes\n", sizeof(ll));
    printf("A float is %lu bytes\n", sizeof(f));
    printf("A double is %lu bytes\n", sizeof(d));
}

void do_bool()
{
    bool t = true;
    bool f = false;

    printf("Boolean type true: %d\n", t);
    printf("Boolean type false: %d\n", f);
}

void do_pre_post_var()
{
    int i = 42;
    i++;
    printf("pre_post i=42\n");
    printf("pre_post i++: %d\n", i);
    i--;
    printf("pre_post i--: %d\n", i);

    int j;
    printf("pre_post i=%d, j=%d\n", i, j);
    j = (i++ + 10);
    printf("pre_post j = (i++ + 10), i=%d, j=%d\n", i, j);
    j = (++i + 10);
    printf("pre_post j = (++i + 10), i=%d, j=%d\n", i, j);

}

#define SECOND 2
#define FIFTH 4

void do_bitwise()
{
    unsigned char flags = 0b00000000;
    flags = (1 << SECOND);
    flags = flags | (1 << FIFTH);
    printf("0x%x\n", flags);
}

void do_for()
{
    for (int i = 0; i < 10; i++)
    {

        if (i == 1)
        {
            continue;
        }
        printf("%d\n", i);
        if (i == 3)
        {
            break;
        }
    }
}

void do_array()
{
    int arr[0];
    int arr1[0];
    memset(arr1, 0, sizeof(int));

    int arr2[] =
    {
        1,
        2,
        3
    };
    int arr3[3] =
    {
        1,
        2,
        3
    };

    char arr4[3][3];
    char arr5[3][3] =
    {
        {
            'a',
            'b',
            'c'
        },
        {
            'd',
            'e',
            'f'
        },
        {
            'g',
            'h',
            'i'
        },
    };
}

void do_array_with_io()
{
    printf("How many scores to input?");
    char buffer[10];
    fgets(buffer, 10, stdin);
    int num_scores = atoi(buffer);
    int scores[num_scores];
    for (int i = 0; i < num_scores; i++)
    {
        printf("Enter score %d:", i + 1);
        fgets(buffer, 10, stdin);
        scores[i] = atoi(buffer);
    }
}

void do_string()
{
    char str[] =
    {
        'h',
        'i'
    };
    printf("%s\n", str);

    char str1[] = "hi,y";
    printf("%s\n", str1);

    str1[3] = 'i';
    printf("%s\n", str1);

}

void do_string_length()
{
    char name[128];
    printf("Please type your name: ");
    fgets(name, 128, stdin);
    printf("your name is %d characters long.\n", strlen(name) - 1);
    // why strlen(name) - 1?
    // fgets includes the \n (newline) character that the user types in
    // the string filled in name, and we don't want to include that
    // character as part of the length of the name.
}

void do_string_copy()
{
    char buffer[128];
    printf("give a string: ");
    fgets(buffer, 128, stdin);
    size_t size = strlen(buffer) + 1;
    char copy[size];
    strcpy(copy, buffer);
    printf("cpy: %s", copy);
    do_string_lower_supper(copy);
}

void do_string_lower_supper(char buffer[])
{
    for (int i = 0; i < strlen(buffer); i++)
    {
        if (isupper(buffer[i]))
        {
            buffer[i] = tolower(buffer[i]);
        }
    }

    printf("lower-cased: %s\n", buffer);
}

void do_string_strip()
{
    char s[128] = "hello\n\n\t";
    int index = strlen(s) - 1;
    while (index >= 0)
    {
        if (isspace(s[index]))
        {
            s[index] = '\0';
            index = index - 1;
        }
        else
        {
            break;
        }
    }

    printf("%s\n", s);
}

void do_struct()
{
    struct fraction
    {
        int numerator;
        int denominator;
    };

    struct fraction f1;
    f1.numerator = 3;
    f1.denominator = 5;
    printf("f1 is %d/%d\n", f1.numerator, f1.denominator);

    struct fraction f2 =
    {
        3,
        5
    };
    printf("f2 is %d/%d\n", f2.numerator, f2.denominator);

    struct fraction f3 =
    {
        .denominator = 5,
        .numerator = 3
    };
    printf("f3 is %d/%d\n", f3.numerator, f3.denominator);

    struct fraction f4 = f3;
    printf("f4 is %d/%d\n", f4.numerator, f4.denominator);

    typedef struct fraction fraction_alise_name;
    fraction_alise_name f5 = f4;
    printf("f5 is %d/%d\n", f5.numerator, f5.denominator);

    struct fraction arr[2];
    arr[0].numerator = 3;
    arr[0].denominator = 5;
    printf("arr[0] is %d/%d\n", arr[0].numerator, arr[0].denominator);

    struct student
    {
        char name[32]; // 32
        char age; // 1
        short class_year; // 2
    };

    struct student s =
    {
        "goze",
        2021,
        1
    };
    printf("sizeof a student sturct: %lu = 36\n", sizeof(s));
}

void do_point()
{
    int i = 2;
    int * p = & i; // p holds address of i

    * p = * p + 1; // dereference p (follow pointer), add one to int to which
    // p points, then assign back to int to which p points
    printf("%d\n", i); // -> will print 3
}

void swap(int * a, int * b)
{
    int tmp = * a;
    * a = * b;
    * b = tmp;
}

void do_point_swap()
{
    int x = 42, y = 13;
    printf("x=%d,y=%d\n", x, y);
    swap( & x, & y);
    printf("x=%d,y=%d\n", x, y);
}

struct demo
{
    int a;
    int b;
};

void struct_point_swap(struct demo * d)
{
    int tmp = d -> a;
    d -> a = d -> b;
    d -> b = tmp;
}

void do_point_struct()
{
    struct demo d =
    {
        1,
        2
    };
    printf("demo a=%d, b=%d\n", d.a, d.b);
    struct_point_swap( & d);
    printf("demo a=%d, b=%d\n", d.a, d.b);

}

void do_point_array()
{
    int arr[] =
    {
        1,
        2,
        3
    };
    printf("%d\n", arr[1]);
    printf("%d=1\n", * arr);

}

int main()
{
    // do_std_io();
    do_sizeof();
    do_bool();
    do_pre_post_var();
    do_bitwise();
    do_for();
    do_array();
    //do_array_with_io();
    do_string();
    //do_string_length();
    //do_string_copy();
    do_string_strip();
    do_struct();

    do_main_01();

    do_point();
    do_point_swap();
    do_point_struct();
    do_point_array();

    //do_main_02();

    //do_main_03();

    do_main_04();
    return EXIT_SUCCESS;
}
