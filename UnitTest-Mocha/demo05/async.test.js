var expect = require('chai').expect;
var request = require('superagent');

it('异步请求应该返回一个对象', function(done) {
    request
    .get('https://api.github.com')
    .end(function(err, res) {
        expect(res).to.be.an('object');
        done();
    })
})