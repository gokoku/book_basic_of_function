const expect = require('expect.js')

function* genCounter() {
  yield 1
  yield 2
  return 3
}

var counter = genCounter()

expect(counter.next().value).to.eql(1)

expect(counter.next().value).to.eql(2)

expect(counter.next().value).to.eql(3)

expect(counter.next().value).to.eql()
