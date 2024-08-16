int count_escapees(const char * htmltext)
{
    int count = 0;
    for (int i = 0; i < strlen(htmltext); i++)
    {
        if (htmltext[i] == '<' || htmltext[i] == '>')
        {
            count += 1;
        }
    }

    return count;
}

void doescape(const char * htmltext, char * expandedtext)
{
    int j = 0;
    for (int i = 0; i < strlen(htmltext); i++)
    {
        if (htmltext[i] == '<')
        {
            strcpy( & expandedtext[j], "&lt;");
            j += 4;
        }
        else if (htmltext[i] == '>')
        {
            strcpy( & expandedtext[j], "&gt;");
            j += 4;
        }
        else
        {
            expandedtext[j] = htmltext[i];
            j += 1;
        }
    }
}

char * escapehtml(const char * htmltext)
{
    int count = count_escapees(htmltext);
    int origlen = strlen(htmltext);
    int expandedlen = origlen + count * 4 + 1;

    char * expandedtext = malloc(sizeof(char) * expandedlen);
    doescape(htmltext, expandedtext);

    return expandedtext;
}

void do_main_03()
{
    const char * ori = "<a href='url'>link</a>";
    char * escap = escapehtml(ori);
    printf("ori: %s\n", ori);
    printf("escap: %s\n", escap);
    free(escap);
}
