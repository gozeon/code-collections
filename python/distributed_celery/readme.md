## 启动

```
docker compose up -d --build
```

## 增加worker

比如增加了worker3


```bash
docker compose -f 'docker-compose.yml' up -d --build 'worker3' 
```