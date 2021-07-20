import * as chai from "chai";
import bind from "../src/index";

const assert = chai.assert;

describe("bind", () => {
	it("1.bind 是函数", () => {
		//@ts-ignore
		Function.prototype.bind2 = bind;
		//@ts-ignore
		assert.isFunction(Function.prototype.bind2);
	});

	it("2.能够绑定 this", () => {
		//@ts-ignore
		Function.prototype.bind2 = bind;
		const f1 = function () {
			return this;
		};
		//@ts-ignore
		const f2 = f1.bind2({ name: "bind" });
		assert.equal(f2().name, "bind");
	});

	it("3.绑定 this, 接收参数 p1, p2", () => {
		//@ts-ignore
		Function.prototype.bind2 = bind;
		const f1 = function (p1, p2) {
			return [this, p1, p2];
		};
		//@ts-ignore
		const f2 = f1.bind2({ name: "bind" }, "x", "y");
		assert.equal(f2()[0].name, "bind");
		assert.equal(f2()[1], "x");
		assert.equal(f2()[2], "y");
	});

	it("4.绑定 this, 首先接收参数 p1, 后接收参数p2", () => {
		//@ts-ignore
		Function.prototype.bind2 = bind;
		const f1 = function (p1, p2) {
			return [this, p1, p2];
		};
		//@ts-ignore
		const f2 = f1.bind2({ name: "bind" }, "x");
		assert.equal(f2("y")[0].name, "bind");
		assert.equal(f2("y")[1], "x");
		assert.equal(f2("y")[2], "y");
	});

	it("5.能够使用 new", () => {
		//@ts-ignore
		Function.prototype.bind2 = bind;
		const f1 = function (p1, p2) {
			this.p1 = p1;
			this.p2 = p2;
		};
		//@ts-ignore
		const f2 = f1.bind2(undefined, "x", "y");
		const obj = new f2();
		assert.equal(obj.p1, "x");
		assert.equal(obj.p2, "y");
	});

	it("6.new 的时候绑定了 p1, p2，并且在 f1 的 prototype 上添加方法", () => {
		//@ts-ignore
		Function.prototype.bind2 = bind;
		const f1 = function (p1, p2) {
			this.p1 = p1;
			this.p2 = p2;
		};
		f1.prototype.method = function () {};
		//@ts-ignore
		const f2 = f1.bind2(undefined, "x", "y");
		const obj = new f2();
		assert.equal(obj.p1, "x");
		assert.equal(obj.p2, "y");
		assert.isTrue(f1.prototype.isPrototypeOf(obj));
		assert.isFunction(obj.method);
	});
});
