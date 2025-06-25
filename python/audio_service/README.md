## run server

```bash
uv run uvicorn main:app --reload
```

## run celery

```bash
uv run celery -A app.tasks worker --loglevel=info
```

## run ruff

```bash
uv run ruff format
```