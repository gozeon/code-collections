import asyncio
import os
import math
import random

import edge_tts
import shortuuid
from edge_tts import VoicesManager
from loguru import logger
from moviepy import ImageClip, AudioFileClip, concatenate_videoclips, vfx, TextClip, CompositeVideoClip

from pathlib import Path
from PIL import Image
import numpy as np

from moviepy.decorators import requires_duration


# Here you see a decorator that will verify if our clip have a duration
# MoviePy offer a few of them that may come handy when writing your own effects
@requires_duration
def zoom_in(clip, zoom_ratio=0.04):
    def filter(get_frame, t):
        img = Image.fromarray(get_frame(t))
        base_size = img.size

        new_size = [
            math.ceil(img.size[0] * (1 + (zoom_ratio * t))),
            math.ceil(img.size[1] * (1 + (zoom_ratio * t)))
        ]

        # The new dimensions must be even.
        new_size[0] = new_size[0] + (new_size[0] % 2)
        new_size[1] = new_size[1] + (new_size[1] % 2)

        img = img.resize(new_size)

        x = math.ceil((new_size[0] - base_size[0]) / 2)
        y = math.ceil((new_size[1] - base_size[1]) / 2)

        img = img.crop([
            x, y, new_size[0] - x, new_size[1] - y
        ]).resize(base_size)

        result = np.array(img)
        img.close()

        return result

    return clip.transform(filter, apply_to="mask")


@requires_duration
def zoom_out(clip, zoom_max_ratio=0.2, zoom_out_factor=0.04):
    def filter(get_frame, t):
        img = Image.fromarray(get_frame(t))
        base_size = img.size

        # Reverse the zoom effect by starting zoomed in and zooming out
        scale_factor = zoom_max_ratio - (zoom_out_factor * t)
        scale_factor = max(scale_factor, 0)  # Ensure scale factor doesn't go negative

        new_size = [
            math.ceil(base_size[0] * (1 + scale_factor)),
            math.ceil(base_size[1] * (1 + scale_factor))
        ]

        # The new dimensions must be even.
        new_size[0] = new_size[0] - (new_size[0] % 2)
        new_size[1] = new_size[1] - (new_size[1] % 2)

        img = img.resize(new_size)

        x = math.ceil((new_size[0] - base_size[0]) / 2)
        y = math.ceil((new_size[1] - base_size[1]) / 2)

        img = img.crop([
            x, y, new_size[0] - x, new_size[1] - y
        ])

        # Resize back to base size
        img = img.resize(base_size)

        result = np.array(img)
        img.close()

        return result

    return clip.transform(filter, apply_to="mask")

# 目标宽高比
target_size = (720, 1280)
target_size = (1080, 1920)
target_size = (1280, 720)
target_size = (1920, 1080)

# 需要确认的目录路径
dirs = [Path('logs'), Path('output')]

# 遍历目录列表，检查并创建目录
for dir_path in dirs:
    if not dir_path.exists():
        dir_path.mkdir(parents=True)  # 创建目录，parents=True 会递归创建父目录

# 配置日志文件：按日期切割日志
log_file = Path('logs').joinpath('app_{time:YYYY-MM-DD}.log')
logger.add(log_file, rotation="00:00", retention="7 days", level="DEBUG",
           format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}")


class TextToSpeechVideo:
    def __init__(self, text: str, images_folder: str, audio_output_path: str, video_output_path: str,
                 voice: str = 'Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)'):
        self.text = text
        self.images_folder = images_folder
        self.audio_output_path = audio_output_path
        self.video_output_path = video_output_path
        self.voice = voice

    async def generate_speech(self):
        """生成语音并保存为音频文件"""
        communicate = edge_tts.Communicate(self.text, voice=self.voice)
        await communicate.save(self.audio_output_path)
        logger.info(f"音频已保存为 {self.audio_output_path}")


    def get_random_image_clip(self, image_path: str, duration: float):
        image = Image.open(image_path)
        # 转换为RGB模式，避免透明背景问题
        image = image.convert('RGB')
        image = image.resize(target_size)
        new_image = np.array(image)
        image.close()

        """从图片路径加载图片并添加随机动效"""
        image_clip = ImageClip(new_image).with_duration(duration)
        image_clip = image_clip.with_position('center').resized(width=800)
        image_clip = image_clip.with_fps(30)
        zoom_effect = [zoom_in, zoom_out]
        image_clip = random.choice(zoom_effect)(image_clip)

        effects = [
            # 加速减速,常用于gif
            # vfx.AccelDecel(),
            # 黑白
            # vfx.BlackAndWhite(),
            # 眨眼
            # vfx.Blink(duration_on=0.5, duration_off=0.5),
            # 裁剪
            # vfx.Crop(),
            vfx.CrossFadeIn(duration * 0.1),
            vfx.CrossFadeOut(duration * 0.1),
            # vfx.EvenSize(),
            vfx.FadeIn(duration * 0.1),
            vfx.FadeOut(duration * 0.1),
            # 冻结某一帧
            # vfx.Freeze(),
            # 冻结某一区域
            # vfx.FreezeRegion(),
            # 调整视频的亮度和对比度
            # vfx.GammaCorrection(),
            # 模糊视频的指定区域
            # vfx.HeadBlur(),
            # 用于反转视频的颜色
            # vfx.InvertColors(),
            # vfx.Loop(),
            # 用于调整视频的亮度和对比度
            # vfx.LumContrast(),
            # 用于将视频转换为可以平滑循环的格式
            # vfx.MakeLoopable(),
            # 用于给视频添加边距（可以是任何颜色）
            # vfx.Margin(),
            # 用于将两个视频的遮罩进行“与”操作，保留它们的交集部分。
            # vfx.MasksAnd(),
            # vfx.MaskColor(),
            # vfx.MasksOr(),
            # 用于将视频水平翻转。
            # vfx.MirrorX(),
            # 用于将视频垂直翻转。
            # vfx.MirrorY(),
            # 用于调整视频的颜色，使用乘法方式来调整颜色的亮度和对比度。
            # vfx.MultiplyColor(),
            # vfx.MultiplySpeed(),
            # vfx.Painting(),
            # vfx.Resize(lambda t: 1 + 0.02 * t),
            # vfx.Rotate(angle=90),
            # vfx.Scroll(),
            # vfx.SlideIn(1, "left"),
            # vfx.SlideIn(1, "right"),
            # vfx.SlideIn(1, "top"),
            # vfx.SlideIn(1, "bottom"),
            # vfx.SlideOut(1, "left"),
            # vfx.SlideOut(1, "right"),
            # vfx.SlideOut(1, "top"),
            # vfx.SlideOut(1, "bottom"),
            # vfx.SuperSample(),
            # 时间反转（倒放视频）
            # vfx.TimeMirror(),
            # 用于将视频的时间对称化。
            # vfx.TimeSymmetrize(),

        ]
        image_clip = image_clip.with_effects([random.choice(effects)])
        return image_clip

    def create_video(self):
        """根据生成的音频创建视频"""
        # 加载音频文件
        audio_clip = AudioFileClip(self.audio_output_path)

        # 获取音频的时长
        audio_duration = audio_clip.duration

        # 加载图片路径并随机选择图片
        image_files = [os.path.join(self.images_folder, f) for f in os.listdir(self.images_folder) if
                       f.endswith(('jpg', 'png', 'jpeg'))]
        random.shuffle(image_files)  # 随机打乱图片顺序

        # 设置水印的位置，每隔2秒随机更新位置
        def random_position(t):
            if t < 2:
                return (10, 10)
            index = int(t // 2)  # 每2秒换一次位置
            random.seed(index)  # 固定随机种子，确保同一个时间段位置固定
            return (random.randint(0, target_size[0] - watermark.w), random.randint(0, target_size[1] - watermark.h))

        # 创建文字水印
        watermark = TextClip(font=Path('/System/Library/Fonts/Supplemental/Arial Unicode.ttf'), text="水印文字", font_size=16, color='red')
        watermark = watermark.with_position(random_position).with_duration(audio_duration - 2)

        # 创建视频的片段
        video_clips = []
        total_duration = 0
        for image_path in image_files:
            # 随机分配图片展示的时间，确保总时长与音频时长一致
            duration = random.uniform(2, 5)  # 每张图片展示2到5秒
            if total_duration + duration > audio_duration:
                duration = audio_duration - total_duration  # 确保不会超出音频时长
            total_duration += duration

            # 获取带有随机动效的图片片段
            video_clip = self.get_random_image_clip(image_path, duration)
            video_clips.append(video_clip)

        # 合并所有图片片段
        final_video = concatenate_videoclips(video_clips, method="compose")

        # 设置视频的音频
        final_video = final_video.with_audio(audio_clip)
        # 水印
        final_video = CompositeVideoClip([final_video, watermark])

        # 输出视频
        final_video.write_videofile(self.video_output_path, codec="libx264", audio_codec="aac")
        logger.info(f"视频已保存为 {self.video_output_path}")

    async def generate_video(self):
        """生成视频文件"""
        # await self.generate_speech()
        self.create_video()


async def gen_video(text, image_path):
    # 随机人声
    voices = await VoicesManager.create()
    voice = voices.find(Locale="zh-CN")

    uid = shortuuid.uuid()
    audio_output_path = "output/" + uid + ".mp3"
    audio_output_path = "output/out.mp3"
    video_output_path = "output/" + uid + ".mp4"
    video_output_path = "output/" + "out" + ".mp4"

    # 创建 TextToSpeechVideo 对象并生成视频
    tts_video = TextToSpeechVideo(text, image_path, audio_output_path, video_output_path, random.choice(voice)["Name"])
    await tts_video.generate_video()

# 主函数
if __name__ == "__main__":
    # 设定文本、图片路径、音频和视频输出路径
    text = "你好，这是一个生成视频的示例，音频和视频将在这里合成。"
    image_path = Path("image")  # 替换为你的背景图片路径

    asyncio.run(gen_video(text, image_path))