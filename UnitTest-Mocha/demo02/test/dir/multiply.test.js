const multiply = require("../../src/multiply");
const expect = require("chai").expect;

describe("乘法测试", function() {
    it("2乘2应该等于4", function() {
        expect(multiply(2, 2)).to.be.equal(4);
    })
});