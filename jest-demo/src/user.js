const request = require('./request')

function getUserName(userID) {
	return request('/users/' + userID).then(user => user.name);
}

module.exports = getUserName
