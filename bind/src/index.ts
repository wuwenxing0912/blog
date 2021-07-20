function bind(asThis, ...args) {
	// this 就是函数
	const fn = this;
	if (typeof fn !== "function") {
		throw new Error("请使用函数调用bind");
	}
	function result(...args2) {
		return fn.call(this instanceof result ? this : asThis, ...args, ...args2);
	}
	result.prototype = Object.create(fn.prototype);
	return result;
}

//兼容写法
var slice = Array.prototype.slice;
function _bind(asThis) {
	// this 就是函数
	var fn = this;
	var fNOP = function () {};
	if (typeof fn !== "function") {
		throw new Error("请使用函数调用bind");
	}
	var args = slice.call(arguments, 1);
	function result() {
		var args2 = slice.call(arguments, 0);
		return fn.apply(
			result.prototype.isPrototypeOf(this) ? this : asThis,
			args.concat(args2)
		);
	}
	fNOP.prototype = fn.prototype;
	result.prototype = new fNOP();
	return result;
}

export default bind;

if (!Function.prototype.bind) {
	Function.prototype.bind = bind;
}
