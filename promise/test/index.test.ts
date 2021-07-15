import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import Promise from "../src/index";

chai.use(sinonChai);

const assert = chai.assert;

/**
 * mocha 是JavaScript测试框架
 * chai 是断言库
 * sinon 辅助测试工具
 */

describe("Promise", () => {
  it("Promise 是一个类", () => {
    assert.isFunction(Promise);
    assert.isObject(Promise.prototype);
  });

  it("如果 new Promise() 接收的不是一个函数报错", () => {
    assert.throw(() => {
      //@ts-ignore
      //添加上述语句，typescript会忽略不符合逻辑的代码
      new Promise();
    });
  });

  it("new Promise(fn) 生成一个对象，对象有then方法", () => {
    const fn = () => {};
    const obj = new Promise(fn);
    assert.isObject(obj);
    assert.isFunction(obj.then);
  });

  it("new Promise(fn) 中的 fn 立即执行", () => {
    let fn = sinon.fake();
    new Promise(fn);
    assert.isTrue(fn.called);
  });

  it("new Promise(fn) 中的 fn 执行的时候接收 resolve 和 reject两个函数作为参数", done => {
    new Promise((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
      done();
    });
  });

  it("pormise.then(success) 会在 resolve 被调用的时候执行", done => {
    let success = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(success.called);
      resolve();
      setTimeout(() => {
        assert.isTrue(success.called);
        done();
      });
    });
    //@ts-ignore
    promise.then(success);
  });

  it("pormise.then(null, reject) 会在 reject 被调用的时候执行", done => {
    let fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called);
      reject();
      setTimeout(() => {
        assert.isTrue(fail.called);
        done();
      }, 0);
    });
    //@ts-ignore
    promise.then(null, fail);
  });

  it("2.2.1.1 如果 onFulfilled不是函数，必须忽略", () => {
    const promise = new Promise((resolve, reject) => {
      resolve();
    });
    promise.then(null);
  });

  it("2.2.1.2 如果 onRejected不是函数，必须忽略", () => {
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(null, null);
  });

  it("2.2.2 onFulfilled 是函数", done => {
    const success = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      resolve("xxx");//resolve传入参数 "xxx"
      resolve("xxxxx");
      setTimeout(() => {
        assert(promise.state === "fulfilled");
        assert(success.calledWith("xxx"));//success 被调用时的参数为 "xxx"
        assert.isTrue(success.calledOnce);
        done();
      }, 0);
    });
    promise.then(success);
  });

  it("2.2.3 onRejected 是函数", done => {
    const fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      reject("xxx");
      reject("xxxxx");
      setTimeout(() => {
        assert(promise.state === "rejected");
        assert(fail.calledWith("xxx"));
        assert.isTrue(fail.calledOnce);
        done();
      }, 0);
    });
    promise.then(null, fail);
  });

  it("2.2.4.1 在我的代码执行完之前，不得调用 then 后面的俩函数", done => {
    const success = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      resolve();
    });
    promise.then(success);
    assert(promise.state === "pending");
    assert.isFalse(success.called);
    setTimeout(() => {
      assert(promise.state === "fulfilled");
      assert.isTrue(success.called);
      done();
    }, 0);
  });

  it("2.2.4.2 在我的代码执行完之前，不得调用 then 后面的俩函数 失败回调", done => {
    const fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(null, fail);
    assert(promise.state === "pending");
    assert.isFalse(fail.called);
    setTimeout(() => {
      assert(promise.state === "rejected");
      assert.isTrue(fail.called);
      done();
    }, 0);
  });

  it("2.2.5.1 onFulfilled和onRejected必须被当做函数调用 with no this value", done => {
    const promise = new Promise((resolve, reject) => {
      resolve();
    });
    promise.then(function() {
      "use strict";
      assert(this === undefined);
      done();
    });
  });

  it("2.2.5.2 onFulfilled和onRejected必须被当做函数调用 with no this value, 失败回调", done => {
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(null, function() {
      "use strict";
      assert(this === undefined);
      done();
    });
  });

  it("2.2.6.1 then可以在同一个promise里被多次调用", done => {
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    const promise = new Promise((resolve, reject) => {
      resolve();
    });
    promise.then(callbacks[0]);
    promise.then(callbacks[1]);
    promise.then(callbacks[2]);

    setTimeout(() => {
      assert.isTrue(callbacks[0].called);
      assert.isTrue(callbacks[1].called);
      assert.isTrue(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    }, 0);
  });

  it("2.2.6.2 then可以在同一个promise里被多次调用, 失败回调", done => {
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(null, callbacks[0]);
    promise.then(null, callbacks[1]);
    promise.then(null, callbacks[2]);

    setTimeout(() => {
      assert.isTrue(callbacks[0].called);
      assert.isTrue(callbacks[1].called);
      assert.isTrue(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    }, 0);
  });
});
