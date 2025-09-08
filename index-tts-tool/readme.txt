## index-tts 工具

> 只是目前使用index-tts做尝试，才专门起的

依赖index-tts进行音频克隆和生成， 支持桌面(windows)、API接口、多角色。

## 实现思路

API接口使用 fastapi + gradio_client

桌面使用 winform

每次生成单角色视频，选中多条进行合并。

合并方式有两种： NAudio 和 Audacity(lof文件)

> 用客户端模式，减少文件传输和对音频的后续处理，体验更好。
> 因为是api模式，后续可以增加模型，比如 https://microsoft.github.io/VibeVoice/

## 目录

api： ptyhon接口服务
AudioTool: winform桌面

## refrence

https://github.com/index-tts/index-tts

