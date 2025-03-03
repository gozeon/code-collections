const path = require("path");

const fs = require("fs-extra");
const globby = require("globby");
const Koa = require("koa");
const cors = require("@koa/cors");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const Ajv = require("ajv");

const config = require("./config/index");

const ajv = new Ajv();
const app = new Koa();

const mockSchema = {
	type: "object",
	additionalProperties: false,
	required: ["path", "data"],
	properties: { path: { type: "string" }, data: { type: "object" } }
};

ajv.addSchema(mockSchema, "mockSchema");

const MOCK_FOLDER = config.get("MOCK_FOLDER");
const MOCK_PATH = path.join(__dirname, MOCK_FOLDER);

fs.ensureDirSync(MOCK_PATH);

app.use(cors());
app.use(bodyParser());
app.use(logger());

/**
 * mock
 */
app.use(async (ctx, next) => {
	const jsonFile = path.join(MOCK_PATH, ctx.url.split('?')[0] + ".json");
	const existJsonFile = fs.existsSync(jsonFile);

	if (existJsonFile) {
		console.log("data file: ", jsonFile);
		ctx.body = fs.readJsonSync(jsonFile);
	}
	await next();
});

/**
 * api
 */
app.use(async ctx => {
	if (ctx.method === "GET" && ctx.url === "/api/mock") {
		try {
			const result = [];
			const files = await globby([MOCK_PATH]);

			for (let i = 0; i < files.length; i++) {
				// win mac 正反斜杠
				const isWin = process.platform === "win32";
				const rootPath = isWin
					? path.posix.join(...MOCK_PATH.split(path.sep))
					: MOCK_PATH;
				const deleteRootPath = files[i].replace(new RegExp(rootPath), "");
				const deleteEndJson = deleteRootPath.replace(/\.json$/g, "");

				result.push(deleteEndJson);
			}

			ctx.body = {
				data: result
			};
		} catch (error) {
			ctx.body = {
				result: "no",
				message: JSON.parse(JSON.stringify(error))
			};
		}
	}

	if (ctx.method === "POST" && ctx.url === "/api/mock") {
		const valid = ajv.validate("mockSchema", ctx.request.body);
		if (valid) {
			try {
				let { path: newPath, data: newData } = ctx.request.body;
				if (newPath.slice(-1) === "/") {
					newPath = newPath.substring(0, newPath.length - 1);
				}
				// 判断是否存在
				// if (fs.existsSync(path.join(MOCK_PATH, newPath + ".json"))) {
				//   ctx.body = {
				//     result: "no",
				//     message: `${newPath}已经存在`
				//   };
				// } else {
				//   console.log("create path:", newPath);
				//   console.log("create data:", newData);

				//   await fs.mkdirpSync(path.join(MOCK_PATH, newPath));
				//   await fs.writeJSONSync(
				//     path.join(MOCK_PATH, newPath + ".json"),
				//     newData
				//   );

				//   ctx.body = Object.assign({}, ctx.request.body, { result: "ok" });
				// }

				console.log("create path:", newPath);
				console.log("create data:", newData);

				await fs.mkdirpSync(path.join(MOCK_PATH, newPath));
				await fs.writeJSONSync(
					path.join(MOCK_PATH, newPath + ".json"),
					newData
				);

				ctx.body = Object.assign({}, ctx.request.body, { result: "ok" });
			} catch (error) {
				ctx.body = {
					result: "no",
					message: JSON.parse(JSON.stringify(error))
				};
			}
		} else {
			ctx.body = {
				errors: ajv.errors
			};
		}
	}
});

app.listen(config.get("PORT"));
