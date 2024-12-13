from pathlib import Path
from moviepy.editor import *
from moviepy.video.fx.resize import resize

cwd = Path.cwd()
fixture_path = cwd / "fixtures"
output_path = cwd / "output"
output_path.mkdir(exist_ok=True)

target_file = str(fixture_path / "1.mp4")
output_file = str(output_path / "out.webm")
img_file = str(fixture_path / "1.jpg")

video_size = (480, 800)
bg_color = (202, 116, 80)

if __name__ == '__main__':
    result_clip = []

    clip = VideoFileClip(target_file).subclip(40, 60)
    clip_duration = clip.duration
    video_h = 320
    clip_pos_y = int((video_size[1] - video_h) / 2)
    clip = clip.resize((video_size[0], video_h)).set_position((0, clip_pos_y))

    # update audio
    # need compare audio duration and video duration
    # music_clip = AudioFileClip(audio_file).subclip(40, 50)
    # music_clip = afx.audio_loop(music_clip, duration=clip.duration)
    # clip = clip.set_audio(music_clip)
    result_clip.append(clip)

    bg_clip = ColorClip(size=video_size, color=bg_color).set_duration(clip_duration)
    result_clip.insert(0, bg_clip)

    top_img_clip = ImageClip(img_file).set_duration(clip_duration).set_position((0, 0))
    top_img_clip = resize(top_img_clip, (video_size[0], clip_pos_y))
    result_clip.append(top_img_clip)

    bottom_img_clip = top_img_clip.set_position((0, clip_pos_y + video_h))
    result_clip.append(bottom_img_clip)

    video = CompositeVideoClip(result_clip)

    video.write_videofile(output_file)
