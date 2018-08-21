# npm pack
> `package.json` name-version.tgz


```bash
npm pack
```

# Usage
package.json

```
"dependencies": {
	<package>: "../<path>/<package>.tgz"
}
```

or internet

```
"dependencies": {
	<package>: "http://<ip>/<path>/<package>.tgz"
}
```

# note
.npmignore

```txt
*.tgz
```


