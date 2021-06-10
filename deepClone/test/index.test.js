const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const assert = chai.assert;
const deepClone = require("../src/index");
describe('deepClone', () => {
  it('是一个函数', () => {
    assert.isFunction(deepClone);
  });

  it('能复制基本数据类型', () => {
    const num = 1;
    const num2 = deepClone(num);
    assert(num === num2);

    const str = 'str';
    const str2 = deepClone(str);
    assert(str === str2);

    const bool = false;
    const bool2 = deepClone(bool);
    assert(bool === bool2);

    const undef = undefined;
    const undef2 = deepClone(undef);
    assert(undefined === undef2);

    const nul = null;
    const nul2 = deepClone(nul);
    assert(nul === nul2);

    const sym = Symbol();
    const sym2 = deepClone(sym);
    assert(sym === sym2);    
  });

  describe('复制对象', () => {
    it('能复制普通对象', () => {
      const obj = {a: 'a', sub: {b: 'b'}};
      const obj2 = deepClone(obj);
      assert(obj !== obj2);
      assert(obj.sub !== obj2.sub);
      assert(obj.a === obj2.a);
      assert(obj.sub.b === obj2.sub.b);
    });

    it('能复制数组对象', () => {
      const arr = [[1, 2], [3, 4], [5, 6]];
      const arr2  = deepClone(arr);
      assert(arr !== arr2);
      assert(arr[0] !== arr2[0]);
      assert(arr[1] !== arr2[1]);
      assert(arr[2] !== arr2[2]);
      assert.deepEqual(arr, arr2);
    });

    it('能复制函数', () => {
      const fn = function(x, y) {return x + y + 1};
      fn.obj = {a: 'a', sub: {b: 'b'}};
      const fn2  = deepClone(fn);
      assert(fn !== fn2);
      assert(fn.obj !== fn2.obj);
      assert(fn.obj.a === fn2.obj.a);
      assert(fn.obj.sub !== fn2.obj.sub);
      assert(fn.obj.sub.b === fn2.obj.sub.b);
      assert(fn(1, 2) === fn2(1, 2));
    });

    it('能复制环', () => {
      const obj = {a: 'a'};
      obj.self = obj;
      const obj2 = deepClone(obj);
      assert(obj !== obj2);
      assert(obj.a === obj2.a);
      assert(obj.self !== obj2.self);
    });

    it('能复制正则表达式', () => {
      const reg = new RegExp("hi\\d+", "gi");
      reg.obj = {a: 'a', sub: {b: 'b'}};
      const reg2  = deepClone(reg);
      assert(reg.source === reg2.source);
      assert(reg.flags === reg2.flags);
      assert(reg !== reg2);
      assert(reg.obj !== reg2.obj);
      assert(reg.obj.a === reg2.obj.a);
      assert(reg.obj.sub !== reg2.obj.sub);
      assert(reg.obj.sub.b === reg2.obj.sub.b);
    });

    it('能复制日期', () => {
      const date = new Date();
      date.obj = {a: 'a', sub: {b: 'b'}};
      const date2  = deepClone(date);
      assert(date.getTime() === date2.getTime())
      assert(date !== date2);
      assert(date.obj !== date2.obj);
      assert(date.obj.a === date2.obj.a);
      assert(date.obj.sub !== date2.obj.sub);
      assert(date.obj.sub.b === date2.obj.sub.b);
    });

    it('仅复制对象自有属性', () => {
      const obj = Object.create({name: 'deepClone'});
      obj.xxx = {a: 'a', sub: {b: 'b'}};
      const obj2  = deepClone(obj);
      assert(obj !== obj2);
      assert.isFalse("name" in obj2);
      assert(obj.xxx !== obj2.xxx);
      assert(obj.xxx.a === obj2.xxx.a);
      assert(obj.xxx.sub !== obj2.xxx.sub);
      assert(obj.xxx.sub.b === obj2.xxx.sub.b);
    });

    it("很复杂的对象", () => {
      const a = {
        n: NaN,
        n2: Infinity,
        s: "",
        bool: false,
        null: null,
        u: undefined,
        sym: Symbol(),
        o: {
          n: NaN,
          n2: Infinity,
          s: "",
          bool: false,
          null: null,
          u: undefined,
          sym: Symbol()
        },
        array: [
          {
            n: NaN,
            n2: Infinity,
            s: "",
            bool: false,
            null: null,
            u: undefined,
            sym: Symbol()
          }
        ]
      };
      const a2 = deepClone(a);
      assert(a !== a2);
      assert.isNaN(a2.n);
      assert(a.n2 === a2.n2);
      assert(a.s === a2.s);
      assert(a.bool === a2.bool);
      assert(a.null === a2.null);
      assert(a.u === a2.u);
      assert(a.sym === a2.sym);
      assert(a.o !== a2.o);
      assert.isNaN(a2.o.n);
      assert(a.o.n2 === a2.o.n2);
      assert(a.o.s === a2.o.s);
      assert(a.o.bool === a2.o.bool);
      assert(a.o.null === a2.o.null);
      assert(a.o.u === a2.o.u);
      assert(a.o.sym === a2.o.sym);
      assert(a.array !== a2.array);
      assert(a.array[0] !== a2.array[0]);
      assert.isNaN(a2.array[0].n);
      assert(a.array[0].n2 === a2.array[0].n2);
      assert(a.array[0].s === a2.array[0].s);
      assert(a.array[0].bool === a2.array[0].bool);
      assert(a.array[0].null === a2.array[0].null);
      assert(a.array[0].u === a2.array[0].u);
      assert(a.array[0].sym === a2.array[0].sym);
    });
  });
});