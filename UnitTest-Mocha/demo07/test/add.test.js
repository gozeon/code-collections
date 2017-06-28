const add = require("../src/add");
const expect = require("chai").expect;

describe("加法函数的测试", function(){
    it("2加1应该等于3", function(){
        expect(add(2, 1)).to.be.equal(3);
    });
    // it.only("1加1应该等于2", function(){
    //     expect(add(1, 1)).to.be.equal(2);
    // });
    it.skip("1加1应该等于2", function(){
        expect(add(1, 1)).to.be.equal(2);
    });
    it("1加0应该等于1", function(){
        expect(add(1, 0)).to.be.equal(1);
    });
});