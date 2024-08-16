#include <stdio.h>

struct fraction
{
    int numerator;
    int denominator;
};

void get_fractions(struct fraction * fract, int numfrac)
{
    char buffer[32];
    for (int i = 0; i < numfrac; i++)
    {
        printf("Enter numerator for fraction %d: ", i + 1);
        fgets(buffer, 32, stdin);
        int numerator = atoi(buffer);
        printf("Enter denominator for fraction %d: ", i + 1);
        fgets(buffer, 32, stdin);
        int denominator = atoi(buffer);
        fract[i].numerator = numerator;
        fract[i].denominator = denominator;
    }
}

void invert_fractions(struct fraction * fract, int numfrac)
{
    for (int i = 0; i < numfrac; i++)
    {
        int tmp = fract -> numerator;
        fract -> numerator = fract -> denominator;
        fract -> denominator = tmp;

        fract = fract + 1; // next arr item
    }
}

void print_fractions(struct fraction * fract, int numfrac)
{
    for (int i = 0; i < numfrac; i++)
    {
        printf("%d: %d/%d\n", i + 1, (fract + i) -> numerator, (fract + i) -> denominator);
    }
}

void do_main_02()
{
    char buffer[32];
    printf("how many fractions to make?");
    fgets(buffer, 32, stdin);
    int numfrac = atoi(buffer);

    struct fraction * frac = malloc(sizeof(struct fraction) * numfrac);

    get_fractions(frac, numfrac);
    invert_fractions(frac, numfrac);
    print_fractions(frac, numfrac);

    free(frac);

}
