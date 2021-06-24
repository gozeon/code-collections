jest.mock('../src/request')

const getUserName = require('../src/user')

// The assertion for a promise must be returned.
it('works with promises', () => {
	expect.assertions(1)
	return getUserName(4).then(data => expect(data).toEqual('Mark'))
})
