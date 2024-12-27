from PIL.Image import Resampling
from moviepy import *
from PIL import Image
import numpy as np
# 目标宽高比
target_size = (720, 1280)
target_size = (1080, 1920)
target_size = (1280, 720)
target_size = (1920, 1080)

image_files = [
    "C:\\Users\\62497\\Pictures\\cat.png",
    "C:\\Users\\62497\\Pictures\\image.png",
    "C:\\Users\\62497\\Pictures\\cars.jpg",
]

def resize_img(file_path, target_size):
    print(file_path)
    """
    调整图像大小，保持宽高比，不足的部分用黑色填充，超出的部分裁剪。
    :param file_path: 图片文件路径
    :param target_size: 目标尺寸 (width, height)
    :return: 调整后的图像数组
    """
    # 打开图像
    image = Image.open(file_path)
    # 转换为RGB模式，避免透明背景问题
    image = image.convert('RGB')
    image = image.resize(target_size)
    clip = ImageClip(np.array(image))
    image.close()
    clip = clip.with_duration(2)
    clip = clip.with_fps(5)
    effect = [
        # vfx.FadeIn(.5),
        # vfx.FadeOut(.5),
        # vfx.CrossFadeIn(.5),
        # vfx.CrossFadeOut(.5),

        # zoom in
        # vfx.Resize(lambda t : 1+0.02*t),

    ]
    if file_path == "C:\\Users\\62497\\Pictures\\cars.jpg":
        old = clip.with_duration(4)
        clip = clip.with_effects([vfx.Scroll(x_speed=target_size[0] * 0.8,y_speed=target_size[1] * 0.8)])
        clip = CompositeVideoClip([old,clip])
        return clip

    if file_path == "C:\\Users\\62497\\Pictures\\image.png":
        old = clip.with_duration(4)
        # clip = clip.with_effects([vfx.SlideIn(duration=2, side="right")]).with_duration(4)
        clip = clip.with_effects([vfx.SlideOut(duration=2, side="right")]).with_duration(4)
        clip = CompositeVideoClip([old,clip])
        return clip
    clip = clip.with_effects(effect)
    return clip


# 统一调整所有图片的大小，保持宽高比
image_files_resized = [resize_img(img, target_size) for img in image_files]
# 合成视频
final_video = concatenate_videoclips(image_files_resized,  method="compose")
final_video.write_videofile("output_video.mp4", codec='libx264')
