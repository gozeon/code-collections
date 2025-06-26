from fastapi import FastAPI
from app.tasks import example_task

app = FastAPI()

@app.get("/run-task")
def run_task():
    task = example_task.delay()
    return {"task_id": task.id}


@app.get("/status/{task_id}")
def get_status(task_id: str):
    from celery.result import AsyncResult
    from app.tasks import celery_app

    res = AsyncResult(task_id, app=celery_app)
    return {"status": res.status, "result": res.result}
