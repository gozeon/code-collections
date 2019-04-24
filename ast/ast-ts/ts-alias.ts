import * as ts from 'typescript';

const filePath = './model.ts';

const program = ts.createProgram([filePath], {});

const checker = program.getTypeChecker();

const source = program.getSourceFile(filePath);

const printer = ts.createPrinter();

const syntaxToKind = (kind: ts.Node['kind']) => {
  return ts.SyntaxKind[kind];
}

ts.forEachChild(source, node => {
  if (ts.isTypeAliasDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name)
    const type = checker.getDeclaredTypeOfSymbol(symbol)
    const properties = checker.getPropertiesOfType(type)
    properties.forEach(declaration => {
      console.log(declaration.name);
      console.log(declaration);
    });
  }
})
