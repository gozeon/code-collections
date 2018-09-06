use by docker

```bash
 docker build -t php:mysql .
docker run --rm -p 80:80 -v "$PWD":/var/www/html php:mysql
```
