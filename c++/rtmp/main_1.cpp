#include <iostream>
#include <fstream>

extern "C"
{
#include <librtmp/rtmp.h>
#include <librtmp/log.h>
}

int main()
{
    const char *url = "rtmp://43.247.4.158:1935/tjradio/XIANGSHENG";
    const char *filename = "out.flv";

    RTMP_LogSetLevel(RTMP_LOGDEBUG);

    RTMP *rtmp = RTMP_Alloc();
    RTMP_Init(rtmp);

    // 超时
    rtmp->Link.timeout = 5;

    if (!RTMP_SetupURL(rtmp, (char *)url))
    {
        std::cerr << "设置url失败" << std::endl;
        RTMP_Free(rtmp);
        return -1;
    }

    if (!RTMP_Connect(rtmp, NULL) || !RTMP_ConnectStream(rtmp, 0))
    {
        std::cerr << "连接失败" << std::endl;
        RTMP_Free(rtmp);
        return -1;
    }

    std::ofstream file(filename, std::ios::binary);
    if (!file.is_open())
    {
        std::cerr << "无法创建文件" << std::endl;
        RTMP_Free(rtmp);
        return -1;
    }

    std::cout << "开始录制到: " << filename << "(ctrl+c stop)" << std::endl;
    char buffer[1024 * 64];
    int readSize = 0;

    while ((readSize = RTMP_Read(rtmp, buffer, sizeof(buffer))) > 0)
    {
        file.write(buffer, readSize);
        std::cout << "已接收: " << readSize << " bytes" << std::endl;
    }

    std::cout << "\n结束录制" << std::endl;

    file.close();
    RTMP_Close(rtmp);
    RTMP_Free(rtmp);

    return 0;
}