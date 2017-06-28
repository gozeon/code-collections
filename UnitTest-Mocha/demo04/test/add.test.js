import add from "../src/add.js";
import chai from "chai";

let expect = chai.expect;

describe('加法函数的测试(ES6)', function() {
    it('1加1应该等于2', function() {
        expect(add(1, 1)).to.be.equal(2);
    })
})
