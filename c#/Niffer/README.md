# Niffer

```
# 先上传到app.new文件夹，再同步过去
rsync -rc --out-format="%n" --exclude="app.db" --exclude="appsettings.Production.json" /root/app.new/ /root/app/

systemctl start niffer-app.service

journalctl -u niffer-app.service -n 50 -f
```

### config

`/etc/systemd/system/niffer-app.service`

```txt
[Unit]
Description=Niffer App
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/app
ExecStart=/root/app/Niffer --urls "http://0.0.0"
Restart=always
RestartSec=5
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=PORT=80

[Install]
WantedBy=multi-user.target
```