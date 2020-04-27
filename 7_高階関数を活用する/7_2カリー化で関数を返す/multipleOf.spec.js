const expect = require('expect.js')

var multipleOf_noncurry = (n, m) => {
  if (m % n === 0) return true
  else return false
}

expect(multipleOf_noncurry(2, 4)).to.eql(true)

var multipleOf = (n) => {
  // 外側から
  return (m) => {
    // 内側
    if (m % n === 0) {
      return true
    } else {
      return false
    }
  }
}

expect(multipleOf(2)(4)).to.eql(true)

var exponentail = (base) => {
  return (index) => {
    if (index === 0) {
      return 1
    } else {
      return base * exponentail(base)(index - 1)
    }
  }
}

expect(exponentail(2)(3)).to.eql(8)

var flip = (fun) => {
  return (x) => {
    return (y) => {
      return fun(y)(x)
    }
  }
}

/* flip で引数を逆転させて 2乗を定義する */
var square = flip(exponentail)(2)
var cube = flip(exponentail)(3)

expect(square(2)).to.eql(4)

expect(cube(2)).to.eql(8)

/*--------コラム チャーチ数---------------------*/
var zero = (f) => {
  return (x) => {
    return x
  }
}

var one = (f) => {
  return (x) => {
    return f(x)
  }
}

var two = (f) => {
  return (x) => {
    return f(f(x))
  }
}

var three = (f) => {
  return (x) => {
    return f(f(f(x)))
  }
}

var succ = (x) => {
  return x + 1
}

expect(three(succ)(0)).to.eql(3)
