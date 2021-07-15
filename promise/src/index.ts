class MyPromise {
  callbacks = [];
  state = "pending";
  resolve(result) {
    setTimeout(() => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.callbacks.forEach(handle => {
        if (typeof handle[0] === "function") {
          handle[0].call(undefined, result);
        }
      });
    }, 0);
  }
  reject(reason) {
    setTimeout(() => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.callbacks.forEach(handle => {
        if (typeof handle[1] === "function") {
          handle[1].call(undefined, reason);
        }
      });
    }, 0);
  }

  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("Promise 只接收函数作为参数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(success?, fail?) {
    const handle = [];
    if (typeof success === "function") {
      handle[0] = success;
    }
    if (typeof fail === "function") {
      handle[1] = fail;
    }
    this.callbacks.push(handle);
  }
}

export default MyPromise;
