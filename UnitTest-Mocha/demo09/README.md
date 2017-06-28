###  生成规格文件
命令根据test目录的所有测试脚本，生成一个规格文件spec.md。-R markdown参数指定规格报告是markdown格式。
```bash
$ mocha --recursive -R markdown > spec.md
```
生成 **html**

```bash
$ mocha --recursive -R doc > spec.html
```