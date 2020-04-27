const expect = require('expect.js')

var multipleOf = (n) => {
  return (m) => {
    if (m % n === 0) return true
    else return false
  }
}

var even = multipleOf(2)

expect(even(4)).to.eql(true)

/* これはコンビネータではないのでコンビネータにする */

/*  not:: FUN[NUM => BOOL] => FUN[NUM => BOOL] */
var not = (predicate) => {
  return (arg) => {
    return !predicate(arg)
  }
}

var odd = not(even)

expect(odd(3)).to.eql(true)
expect(odd(2)).to.eql(false)
