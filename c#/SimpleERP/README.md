# Simple ERP

```
# 先上传到app.new文件夹，再同步过去
rsync -rc --out-format="%n" --exclude="app.db" --exclude="appsettings.Production.json" /root/erp.new/ /root/erp/

systemctl start erp-app.service

journalctl -u erp-app.service -n 50 -f
```

### config

`/etc/systemd/system/erp-app.service`

```txt
[Unit]
Description=ERP App
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/erp
ExecStart=/root/erp/SimpleERP --urls "http://0.0.0.0:8080"
Restart=always
RestartSec=5
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.targe
```