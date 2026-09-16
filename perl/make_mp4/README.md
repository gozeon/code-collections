# make_mp4.pl 使用说明

把「音频 + 图片」批量合成为 mp4 视频的 Perl 脚本，面向 Windows 环境，不依赖任何第三方 Perl 模块，只需要系统里的 **ImageMagick** 和 **ffmpeg**。

- 读取音频目录，逐个音频生成一个 mp4；
- 按音频文件名「歌曲名-作者」自动生成文字封面（歌曲名、作者各一行，居中）；
- 图片目录里的图片随机排序做成幻灯片，视频片段按自身时长整段接入；
- 成片开头插入封面若干秒（只出现一次，循环时不会重复）；
- 输出到「音频目录/out」，中文文件名不乱码。

---

## 1. 环境要求

| 组件 | 要求 |
| --- | --- |
| Perl | 5.8 以上，只用自带核心模块（`Encode`、`File::Path`、`File::Spec`、`Getopt::Long`），无需 CPAN 安装任何东西 |
| ImageMagick | 提供 `magick`（7.x）或 `convert`（6.x）命令，用来生成文字封面 |
| ffmpeg | 用来编码和合并视频；建议同目录下带 `ffprobe` |
| ffprobe | 可选。用于读取音频/视频时长，缺少时仍能合成，只是少了「按音频长度裁剪」的优化 |
| 操作系统 | Windows 为主，Linux / macOS 也可运行 |

脚本会在 `PATH` 中自动查找 `magick` / `convert` / `ffmpeg` / `ffprobe`；找不到时可用 `--magick`、`--ffmpeg` 或配置文件里的 `magick` / `ffmpeg` 指定全路径。

---

## 2. 目录与文件命名规范

- **音频目录**：包含要合成的音频文件，文件名格式为 `歌曲名-作者.后缀`。
  分隔符支持 `-`、`－`、`—`、`–`（两侧空格可有可无）。没有分隔符时整个文件名当歌曲名，作者留空。
- **图片目录**：包含图片，也可以是视频片段。
  - 图片建议按 `Image00001.jpg` 五位从 1 递增命名（实际按扩展名识别，文件名不强制）；
  - 视频片段会按自身时长整段接到幻灯片里，**原声丢弃，始终使用音频文件的声音**；
  - 图片和视频会一起参与随机排序（可用 `shuffle = 0` 关闭）。

支持的扩展名：

| 类型 | 扩展名 |
| --- | --- |
| 音频 | `mp3 m4a m4b aac flac wav wma ogg oga opus ape wv ac3 dts mka mp2 aif aiff` |
| 图片 | `jpg jpeg jpe png bmp gif tif tiff webp` |
| 视频片段 | `mp4 m4v mov mkv webm avi wmv flv mpg mpeg m2ts ts 3gp ogv` |

音频文件名示例：

```text
夜空中最亮的星-逃跑计划.mp3   ->  歌曲名: 夜空中最亮的星   作者: 逃跑计划
```

---

## 3. 快速开始

```bat
:: 1) 直接用参数指定目录
perl make_mp4.pl -a D:\music\audio -i D:\music\picture

:: 2) 用配置文件（推荐，参数多的时候更省事）
perl make_mp4.pl -c make_mp4.ini

:: 3) 不带参数：自动读取脚本目录或当前目录下的 make_mp4.ini
perl make_mp4.pl

:: 4) 位置参数：第一个是音频目录，第二个是图片目录
perl make_mp4.pl D:\music\audio D:\music\picture
```

先把 `make_mp4.ini.example` 复制/改名为 `make_mp4.ini`（UTF-8 编码保存），按里面的注释改成本机路径即可。

参数优先级：**命令行 > 配置文件 > 默认值**。

---

## 4. 命令行参数

```text
perl make_mp4.pl -a <audio_dir> -i <image_dir> [options]
perl make_mp4.pl -c <config.ini>
perl make_mp4.pl <audio_dir> <image_dir>
```

| 参数 | 说明 |
| --- | --- |
| `-a, --audio DIR` | 音频目录（必填） |
| `-i, --images DIR` | 图片/视频目录（必填） |
| `-o, --out DIR` | 输出目录，默认 `<音频目录>/out` |
| `-c, --config FILE` | 读取 UTF-8 编码的 ini 配置文件 |
| `--font FILE` | 封面字体（ttf/ttc），默认自动查找中文字体 |
| `--size WxH` | 视频尺寸，默认 `1280x720`（宽高会自动取偶数） |
| `--fps N` | 帧率，默认 `25` |
| `-s, --seconds N` | 每张图片显示秒数，默认 `5` |
| `--cover-seconds N` | 成片开头显示封面的秒数，默认 `2`，`0` = 不插封面；上限 30 |
| `--cover-color C` | 封面底色，默认 `#1e2a38` |
| `--title-color C` | 封面歌曲名颜色，默认 `white` |
| `--artist-color C` | 封面作者颜色，默认 `#c8d0d8` |
| `--title-size N` | 封面歌曲名字号，默认按视频高度计算 |
| `--artist-size N` | 封面作者字号，默认按视频高度计算 |
| `--vcodec C` | 视频编码器，默认 `libx264`（非 x264/x265 时改用 `-qscale:v 3`） |
| `--crf N` | x264/x265 质量参数，默认 `23`（数值越小越大越清晰） |
| `--preset C` | x264/x265 preset，默认 `ultrafast` |
| `--abitrate C` | 音频码率，默认 `192k` |
| `--pad-color C` | 图片比例不符时的填充色，默认 `black` |
| `--shuffle` / `--no-shuffle` | 图片随机顺序，默认开启 |
| `--verify-cover` / `--no-verify-cover` | 检查封面是否为空画面并重建，默认开启 |
| `--force` | 已存在的 mp4 也重新生成 |
| `--keep-temp` | 保留中间文件（封面文字、图片列表、幻灯片 mp4 等） |
| `--keep-cover` / `--no-keep-cover` | 是否保留生成的封面图，默认保留 |
| `--dry-run` | 只打印将要执行的命令，不实际运行 |
| `--magick CMD` | 指定 ImageMagick 命令（`magick` / `convert` / 全路径） |
| `--ffmpeg CMD` | 指定 ffmpeg 命令 |
| `--charset NAME` | 控制台参数与文件名的字符集，默认自动（Windows 为系统 ANSI 代码页，如 `CP936`；其它平台 `UTF-8`） |
| `-h, --help` | 显示帮助 |

---

## 5. 配置文件（make_mp4.ini）

- 语法：`key = value`，一行一条；`#` 或 `;` 开头为整行注释，行尾 `#` 也是注释；
- 颜色值（`#RRGGBB`）里的 `#` 不会被当成注释；
- 文件用 **UTF-8** 保存；空值不覆盖默认配置；
- 脚本会自动去掉配置中的零宽/双向控制等不可见字符。

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `audio_dir` | 无（必填） | 音频目录。别名：`audiodir`、`audio_directory`、`music`、`music_dir` |
| `image_dir` | 无（必填） | 图片/视频目录。别名：`imagedir`、`image_directory`、`picture_dir`、`pic_dir`、`pics`、`pictures` |
| `out_dir` | `<音频目录>/out` | 输出目录。别名：`outdir`、`output`、`output_dir` |
| `font` | 自动查找 | 封面字体（ttf/ttc） |
| `size` | `1280x720` | 视频尺寸，`WxH` |
| `fps` | `25` | 帧率 |
| `seconds` | `5` | 每张图片显示秒数 |
| `cover_seconds` | `2` | 片头封面秒数，`0` = 不插封面 |
| `cover_color` | `#1e2a38` | 封面底色 |
| `title_color` | `white` | 歌曲名颜色 |
| `artist_color` | `#c8d0d8` | 作者颜色 |
| `title_size` | 按视频高度计算 | 歌曲名字号 |
| `artist_size` | 按视频高度计算 | 作者字号 |
| `vcodec` | `libx264` | 视频编码器 |
| `crf` | `23` | x264/x265 质量参数 |
| `preset` | `ultrafast` | x264/x265 preset |
| `acodec` | `aac` | 音频编码器 |
| `abitrate` | `192k` | 音频码率 |
| `pad_color` | `black` | 图片比例不符时的填充色 |
| `shuffle` | `1` | `1`/`0`，图片是否随机顺序 |
| `verify_cover` | `1` | `1`/`0`，是否检查封面为空白并重建 |
| `force` | `0` | `1` = 已存在的 mp4 也重新生成 |
| `keep_temp` | `0` | `1` = 保留中间文件 |
| `keep_cover` | `1` | `1` = 保留生成的封面图 |
| `dry_run` | `0` | `1` = 只打印命令不执行 |
| `magick` | 自动查找 | ImageMagick 命令/全路径 |
| `ffmpeg` | 自动查找 | ffmpeg 命令/全路径 |
| `charset` | 自动 | 控制台/文件名编码，如 `CP936`、`GBK`、`UTF-8` |

布尔项 `1/true/yes/on` 为开，其它为关。

> 注：`acodec`、`title_size`、`artist_size`、`dry_run` 只能在配置文件里设置，没有对应的命令行参数。

---

## 6. 输出目录结构

```text
<输出目录>/                 # 默认 <音频目录>/out
├── 歌曲名-作者.mp4         # 每个音频对应一个成片
├── make_mp4.log            # 运行日志（每次追加）
├── covers/                 # 生成的封面图缓存
│   ├── 歌曲名-作者.jpg
│   └── .cover_format       # 封面缓存签名，排版/配色变化时自动重建
└── _work/                  # 中间文件，默认跑完自动删除（--keep-temp 保留）
```

处理规则：

- 已存在且大小正常的 mp4 会**跳过**（`skip (exists)`）；上次失败留下的半成品（小于 1024 字节）会自动删除重做；
- 任一个失败时脚本退出码为 `1`，全部成功为 `0`；
- 封面按文件名缓存，只有封面排版版本或配色/字体/尺寸等配置变化时才会重建，不用手动 `--force`。

---

## 7. 工作流程

1. 读取配置（命令行 + ini），扫描音频目录与图片目录；
2. 按音频名解析出「歌曲名」和「作者」，用 ImageMagick 生成文字封面：
   两行文字分别渲染成图片、逐行校验后居中合成到底色上，生成后会检查不是纯色空图，否则换字体/排版重试；
3. 用 ffmpeg 把随机顺序的图片（和视频片段）编码成幻灯片，在每次换图处强制打关键帧；
4. 把片头封面和幻灯片循环拷贝拼接到音频长度，输出 mp4（封面只在开头出现一次，循环时只重复正片）。

封面文字通过 UTF-8 文本文件交给 ImageMagick 读取（而不是命令行参数），以避免 Windows 下的中文乱码。

---

## 8. 日志与排查

每次运行都会把过程追加写入 `<输出目录>/make_mp4.log`（UTF-8），常见标签：

| 标签 | 含义 |
| --- | --- |
| `CMD` | 实际执行的命令 |
| `EXIT` | 命令退出码与耗时 |
| `OUT` / `PROBE` | 命令输出、探测结果 |
| `TEXT` | 从文件名解析出的歌曲名/作者 |
| `COVER` | 封面生成/取舍过程 |
| `FILE` | 产出或需要的文件及大小（`MISSING` 表示没生成） |
| `DUR` / `CHUNK` / `MERGE` | 时长、分段、合并信息 |
| `VIDEO` | 成片信息（分辨率、时长、体积等） |
| `WARN` / `note` | 警告与诊断提示 |

排查建议：

- **封面出不来 / 是白板**：日志里会有 `note:` 说明（字体不可用、缺字形、文字颜色与底色相同等）。指定中文字体后加 `--force` 重跑：
  ```bat
  perl make_mp4.pl -c make_mp4.ini --font C:\Windows\Fonts\msyh.ttc --force
  ```
- **提示找不到 ImageMagick / ffmpeg**：装上并把可执行文件加入 `PATH`，或用 `--magick` / `--ffmpeg` 指定全路径。
- **中文文件名乱码**：用 `--charset GBK`（或 `CP936` / `UTF-8`）显式指定；配置文件务必存成 UTF-8 且不带 BOM。
- **成片体积太大**：提高 `crf`（`26`~`28`）、降低 `fps`（`10`~`15`）、`preset` 改 `veryfast`。
- **想看实际执行了哪些命令**：加 `--dry-run`，或直接看日志里的 `CMD` 行。

---

## 9. 文件清单

| 文件 | 说明 |
| --- | --- |
| `make_mp4.pl` | 主脚本 |
| `make_mp4.ini.example` | 配置文件示例（复制为 `make_mp4.ini` 后修改） |
| `make_mp4.ini` | 本机配置（自动读取） |
| `README.md` | 本文档 |
