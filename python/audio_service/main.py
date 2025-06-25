from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import shutil
import uuid
from pathlib import Path

from app.tasks import normalize_audio_task, celery_app

# 获取当前脚本文件所在目录的“项目根路径”
BASE_DIR = Path(__file__).resolve().parent  # 或根据你的结构调整

TMP_DIR = BASE_DIR / "upload"
TMP_DIR.mkdir(parents=True, exist_ok=True)  # 自动创建目录（如果不存在）

app = FastAPI()

task_map = {}  # 可换成数据库或缓存记录任务对应路径等


@app.post("/normalize-audio/")
async def normalize_audio(file: UploadFile = File(...), target_level: float = -14.0):
    ext = Path(file.filename).suffix
    input_path = TMP_DIR / f"{uuid.uuid4()}{ext}"

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    task = normalize_audio_task.delay(str(input_path), ext, target_level)
    task_map[task.id] = input_path  # 可选：记录任务和路径

    return {"task_id": task.id}


@app.get("/status/{task_id}")
async def get_status(task_id: str):
    task = celery_app.AsyncResult(task_id)
    if task.state == "PENDING":
        return {"status": "pending"}
    elif task.state == "STARTED":
        return {"status": "processing"}
    elif task.state == "SUCCESS":
        output_path = task.result["output_path"]
        return {"status": "done", "download_url": f"/download/{task_id}"}
    elif task.state == "FAILURE":
        return {"status": "failed", "reason": str(task.result)}
    return {"status": task.state}


@app.get("/download/{task_id}")
async def download(task_id: str):
    task = celery_app.AsyncResult(task_id)
    if task.state != "SUCCESS":
        raise HTTPException(status_code=400, detail="File not ready")
    output_path = task.result["output_path"]
    return FileResponse(output_path, filename=Path(output_path).name)
