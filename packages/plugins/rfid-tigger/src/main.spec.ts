import RfidTrigger from './main'

describe('RfidTrigger', () => {

  jest.setTimeout(1000000);
  
  it('do something', (done: any) => {
    new RfidTrigger();
    setTimeout(done, 10000);
  })
})