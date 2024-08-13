https://github.com/capistrano/capistrano

- 自定义scm，本地上传可执行文件
- 使用 nohup 和 pkill

## 部署
```
cap production deploy
```
## 回滚
```
cap production deploy:rollback
```
## 回滚到固定版本
```
cap production deploy:rollback ROLLBACK_RELEASE=20160614133327
```