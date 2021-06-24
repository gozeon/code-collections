test('two plus two is four', () => {
	expect(2 + 2).toBe(4);
});


test('object assignment', () => {
	const data = {one: 1};
	data['two'] = 2;
	expect(data).toEqual({one: 1, two: 2});
});


test('adding positive numbers is not zero', () => {
	for (let a = 1; a < 10; a++) {
		for (let b = 1; b < 10; b++) {
			expect(a + b).not.toBe(0);
		}
	}
});


function compileAndroidCode() {
	throw new Error('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
	expect(() => compileAndroidCode()).toThrow();
	expect(() => compileAndroidCode()).toThrow(Error);

	// You can also use the exact error message or a regexp
	expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
	expect(() => compileAndroidCode()).toThrow(/JDK/);
});
