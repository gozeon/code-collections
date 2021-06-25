import JestHasteMap from 'jest-haste-map';
import {cpus} from 'os';

const hasteMap = new JestHasteMap.default({
	extensions: ['js'],
	maxWorkers: cpus().length,
	name: 'best-test-framework',
	platforms: [],
	rootDir: process.cwd(),
	roots: [process.cwd()],
});

const {hasteFS} = await hasteMap.build();
const testFiles = hasteFS.getAllFiles();
console.log(testFiles)
