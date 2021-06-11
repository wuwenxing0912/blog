import EventHub from '../src/index';

type TestCase = (message: string) => void;

const test1: TestCase = message => {
  const eventHub = new EventHub();
  console.assert(eventHub instanceof Object === true);
  console.log(message);
};

const test2: TestCase = message => {
  const eventHub = new EventHub();
  let called = false;
  eventHub.on('test2', (data) => {
    called = true;
    console.log(data)
  });
  eventHub.emit('test2', 'test2');
  setTimeout(() => {
    console.assert(called === true);
    console.log(message);
  }, 1000);
};


const test3: TestCase = message => {
  const eventHub = new EventHub();
  let called = false;
  let fn = () => {
    called = true;
  };
  eventHub.on('test3', fn);
  eventHub.off('test3', fn);
  eventHub.emit('test3');

  setTimeout(() => {
    console.assert(called === false);
    console.log(message);
  }, 1000);
};

test1('EventHub 可以创建对象');
test2('.on, .emit');
test3('.on, .off, .emit');