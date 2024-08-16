#include <stdio.h>
#include <string.h>

#define KEY "mysecretkey" // ��Կ

// XOR ���ܺͽ��ܺ���
void xor_encrypt_decrypt(const char * input, char * output,
                         const char * key)
{
    size_t key_len = strlen(key);
    size_t input_len = strlen(input);

    for (size_t i = 0; i < input_len; ++i)
    {
        // ʹ��λ�������������
        output[i] = input[i] ^ key[i % key_len];

        //unsigned char in_char = input[i];
        //unsigned char key_char = key[i % key_len];
        //unsigned char out_char = in_char ^ key_char;

        //output[i] = out_char;

        // ��ӡ�������Ľ��
        //printf("Input char: '%c' (0x%02x)\n", in_char, in_char);
        //printf("Key char: '%c' (0x%02x)\n", key_char, key_char);
        //printf("Encrypted/Decrypted char: '%c' (0x%02x)\n", out_char, out_char);
        //printf("--------\n");
    }
    output[input_len] = '\0'; // ȷ������ַ����Կ��ַ���β

}

void do_main_04()
{
    char text[256];
    char encrypted[256];
    char decrypted[256];

    printf("Enter text to encrypt: ");
    fgets(text, sizeof(text), stdin);

    // ȥ�����з�
    size_t len = strlen(text);
    if (len > 0 && text[len - 1] == '\n')
    {
        text[len - 1] = '\0';
    }

    // ����
    xor_encrypt_decrypt(text, encrypted, KEY);

    printf("Encrypted text: ");
    for (size_t i = 0; i < strlen(text); ++i)
    {
        printf("%02x", (unsigned char) encrypted[i]);
    }
    printf("\n");

    // ����
    xor_encrypt_decrypt(encrypted, decrypted, KEY);
    printf("Decrypted text: %s\n", decrypted);

}
