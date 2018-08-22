import * as fs from 'fs';
import * as ts from 'typescript';

class Replacement {
	public static insert(pos: number, text: string) {
		return new Replacement(pos, pos, text)
	}

	constructor(readonly start: number, readonly end: number, readonly text = '') {
	}
}

function applyReplacements(source: string, replacements: Replacement[]) {
	replacements = replacements.sort((r1, r2) => r2.start - r1.start);
	for (const replacement of replacements) {
		source = source.slice(0, replacement.start) + replacement.text + source.slice(replacement.end);
	}
	return source;
}

function visit(node: ts.Node, replacements: Replacement[], fileName: string) {
	if (ts.isFunctionDeclaration(node)) {
		for (const param of node.parameters) {
			const params = [
				JSON.stringify(param.name.getText()),
				param.name.getText(),
				param.name.getEnd(),
				JSON.stringify(fileName)
			];

			const instrumentExpr = `console.log(${params.join(',')});\n`;

			replacements.push(
				Replacement.insert(node.body.getStart() + 1, instrumentExpr),
			);
		}
	}

	node.forEachChild(child => visit(child, replacements, fileName))
}

function instrument(fileName: string, sourceCode: string) {
	const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);
	const replacements: Replacement[] = [];
	visit(sourceFile, replacements, inputFile);
	console.log(applyReplacements(sourceCode, replacements));
}

const inputFile = process.argv[2];
instrument(inputFile, fs.readFileSync(inputFile, 'utf-8'));
