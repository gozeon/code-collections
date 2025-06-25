from celery import Celery
import uuid
from pathlib import Path
from ffmpeg_normalize import FFmpegNormalize

# 获取当前脚本文件所在目录的“项目根路径”
BASE_DIR = Path(__file__).resolve().parent.parent  # 或根据你的结构调整

TMP_DIR = BASE_DIR / "upload"
TMP_DIR.mkdir(parents=True, exist_ok=True)  # 自动创建目录（如果不存在）

CELERY_DIR = BASE_DIR / "celery_data"
CELERY_DIR.mkdir(parents=True, exist_ok=True)


celery_app = Celery(
    "tasks", broker="redis://192.168.20.162:6379/0", backend=CELERY_DIR.as_uri()
)


@celery_app.task(bind=True)
def normalize_audio_task(self, input_path: str, ext: str, target_level: float):
    try:
        output_path = TMP_DIR / f"normalized_{uuid.uuid4()}{ext}"
        normalizer = FFmpegNormalize(
            target_level=target_level,
            true_peak=-1,
            dynamic=True,
            audio_codec="aac",
            audio_bitrate=64000,
            sample_rate=48000,
            debug=True,
        )
        normalizer.add_media_file(
            input_path,
            str(output_path),
        )
        normalizer.run_normalization()
        return {"output_path": str(output_path)}
    except Exception as e:
        self.retry(exc=e, countdown=5, max_retries=3)
        raise
