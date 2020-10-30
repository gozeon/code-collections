from time import sleep

from PIL import Image, ImageFilter, Image, ImageDraw, ImageFont, ImageColor


def _open():
    """打开图像文件"""
    im = Image.open("./images/1.jpeg")
    im.show()


def _info():
    """图像信息"""
    im = Image.open("./images/1.jpeg")
    print(im.size)
    print(im.width)
    print(im.height)
    print(im.filename)


def _thumbnail():
    """缩略图"""
    im = Image.open("./images/1.jpeg")
    im.thumbnail((30, 30))
    im.show()


def _merge():
    """合并图片"""
    im1 = Image.open("./images/1.jpeg")
    im2 = Image.open("./images/2.jpeg")

    im1 = im1.resize((426, 240))
    im2 = im2.resize((426, 240))

    image1_size = im1.size

    new_image = Image.new('RGB', (2 * image1_size[0], image1_size[1]), (250, 250, 250))
    new_image.paste(im1, (0, 0))
    new_image.paste(im2, (image1_size[0], 0))

    new_image.show()


def _blur():
    """虚化"""
    image = Image.open("./images/1.jpeg")
    image = image.filter(ImageFilter.BoxBlur(20))

    image.show()


def _gaussian_blur():
    """Gaussian 高斯曲线 虚化"""
    image = Image.open("./images/1.jpeg")
    image = image.filter(ImageFilter.GaussianBlur(8))

    image.show()


def _crop():
    """裁剪"""
    image = Image.open("./images/1.jpeg")
    print(image.size)
    # 参数(x开始,y开始,x结束,y结束)
    copy = image.crop((0, 0, 20, 20))

    copy.show()


def _paste_logo():
    """添加logo"""

    image = Image.open("./images/1.jpeg")
    logo = Image.open("./images/2.jpeg")
    logo = logo.resize((50, 50))
    image.paste(logo, (10, 10))
    image.show()


def _flip():
    """翻转"""
    image = Image.open("./images/1.jpeg")
    image.show()
    sleep(3)
    image = image.transpose(Image.FLIP_LEFT_RIGHT)
    image.show()


def _rotate():
    """旋转"""
    image = Image.open("./images/1.jpeg")
    image.show()
    sleep(3)
    image = image.rotate(20)
    image.show()


def _resize():
    """大小调整"""
    image = Image.open("./images/1.jpeg")
    image = image.resize((100, 100))
    image.show()


def _watermark():
    """水印"""
    image = Image.open("./images/1.jpeg")
    width, height = image.size

    # 画笔
    draw = ImageDraw.Draw(im=image)
    text = "Hello World \n Yes"

    font = ImageFont.truetype("./font/FZLTSK.TTF", 8)
    text_width, text_height = draw.textsize(text, font)

    # 边距
    margin = 10

    x = width - text_width - margin
    y = height - text_height - margin

    draw.rectangle(xy=(0, 0, 20, 20), fill="red")
    draw.text(xy=(x, y), text=text, font=font, fill=(209, 239, 8))

    image.show()


def _filter():
    """过滤"""
    image = Image.open("./images/1.jpeg")
    image = image.filter(ImageFilter.CONTOUR)

    image.show()


def _color():
    """颜色"""
    blue_rgb = ImageColor.getrgb("blue")
    print(blue_rgb)

    img = Image.new("RGB", (255, 255), ImageColor.getrgb("#add8e6"))

    img.show()


def _draw_line():
    """画线"""
    image = Image.open("./images/1.jpeg")

    draw = ImageDraw.Draw(image)
    draw.line((0, 0) + image.size, fill=128)
    draw.line((0, image.size[1], image.size[0], 0), fill=128)

    image.show()


def _draw_line2():
    """画线"""
    image = Image.new('RGB', (500, 300), (125, 125, 125))
    draw = ImageDraw.Draw(image)
    draw.line((200, 100, 300, 200), fill=(0, 0, 0), width=10)

    image.show()


def _draw_ellipse():
    """画椭圆"""
    image = Image.new('RGB', (500, 300), (125, 125, 125))
    draw = ImageDraw.Draw(image)
    draw.ellipse((200, 125, 300, 200), fill=(255, 0, 0), outline=(0, 0, 0))

    image.show()


def _draw_rectangle():
    """画矩形"""
    image = Image.new('RGB', (500, 300), (125, 125, 125))
    draw = ImageDraw.Draw(image)
    draw.rectangle((200, 125, 300, 200), fill=(255, 0, 0), outline=(0, 0, 0))

    image.show()


def _draw_polygon():
    """画不规则图像"""
    image = Image.new('RGB', (500, 300), (125, 125, 125))
    draw = ImageDraw.Draw(image)
    draw.polygon(((200, 200), (300, 100), (250, 50)), fill=(255, 0, 0), outline=(0, 0, 0))

    image.show()


def _draw_text():
    """写字"""
    image = Image.open("./images/2.jpeg").convert('RGBA')
    txt = Image.new("RGBA", image.size, (255, 255, 255, 0))
    font = ImageFont.truetype("./font/Alibaba-PuHuiTi-Bold.otf", 10)

    d = ImageDraw.Draw(txt)

    d.text((14, 14), "Hello", font=font, fill=(255, 255, 255, 128))
    d.text((14, 60), "World", font=font, fill=(255, 255, 255, 255))

    image = Image.alpha_composite(image, txt)

    image.show()


if __name__ == "__main__":
    # _open()
    # _info()
    # _thumbnail()
    # _merge()

    # _blur()
    # _gaussian_blur()

    # _crop()
    # _flip()
    # _rotate()

    # _resize()

    # _watermark()
    # _filter()
    # _color()

    # _draw_line()
    # _draw_line2()
    # _draw_text()

    # _draw_ellipse()
    # _draw_rectangle()
    # _draw_polygon()
    _paste_logo()
