```cmd
docker run --rm --name my-openresty-test -p 8080:8080 -v %cd%/conf/test.conf:/etc/nginx/conf.d/test.conf:ro -v %cd%/lua/:/app/lua openresty/openresty:alpine

# 修改配置后
docker exec my-openresty-test openresty -s reload
```cmd


### refrence

- https://github.com/thibaultcha/lua-resty-mlcache/
- https://github.com/ledgetech/lua-resty-http
- https://github.com/GUI/lua-resty-txid