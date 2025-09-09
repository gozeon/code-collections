from typing import Union, List
import uuid
import os
import shutil
import pathlib
from enum import Enum

from loguru import logger
logger.add("file_daily.log", rotation="1 day")

from fastapi import FastAPI, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

app = FastAPI()
tasks = {} # 存储任务状态与结果

# 生产文件存放目录
OUT_DIR = "out"
os.makedirs(OUT_DIR, exist_ok=True)

from gradio_client import Client, handle_file
client = Client(src="http://10.10.100.150:7860/")

# 挂载静态目录
app.mount("/files", StaticFiles(directory=OUT_DIR), name="files")

class RefVideo(str, Enum):
    man_news_909 = ("909_news_man.m4a", "男声 909频道 新闻 ")
    woman_news_909 = ("909_news_woman.m4a", "女声 909频道 新闻 ")

    def __new__(cls, value: str, label: str):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.label = label  # 增加中文说明
        return obj

    def __str__(self):
        return self.label

class TaskModel(BaseModel):
    ref_video: RefVideo = Field(description="参考音频")
    text: str = Field(min_length=1, max_length=1500, description="生成音频的文本")

@app.get("/ref-videos")
def get_ref_videos():
    """
    返回 RefVideo 枚举供前端下拉框使用
    """
    return [{"label": member.label, "value": member.value} for member in RefVideo]

@app.post("/start/task")
def start_task(task: TaskModel, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    def long_task():
        try:
            tasks[task_id] = {"status": "running"}
            logger.info(f"{task_id} 开始生成: {task}")
            result = client.predict(handle_file(task.ref_video.value), task.text, api_name="/gen_single")
            logger.info(f"{task_id} 复制文件: {result}")
            tmp_file_path = result["value"]
            suffix = pathlib.PurePosixPath(tmp_file_path).suffix
            filename = f"{task_id}{suffix}"
            out_file_path = os.path.join(OUT_DIR, filename)
            shutil.copy(tmp_file_path, out_file_path)
            logger.info(f"{task_id} 完成: {out_file_path}")
            tasks[task_id] = {"status": "done", "result": result, "download_url": f"/files/{filename}"}
        except Exception as e:
            logger.info(f"{task_id} 失败: {str(e)}")
            tasks[task_id] = {"status": "error", "error": str(e)}

    background_tasks.add_task(long_task)
    tasks[task_id] = {"status": "queued"}
    return {"task_id": task_id}

@app.get("/status/{task_id}")
def get_status(task_id: str):
    return tasks.get(task_id, {"status": "not found"})

