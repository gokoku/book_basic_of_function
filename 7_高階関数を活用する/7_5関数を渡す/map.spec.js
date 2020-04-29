const expect = require('expect.js')

const list = {
  match: (data, pattern) => {
    return data(pattern)
  },
  empty: (_) => {
    return (pattern) => {
      return pattern.empty()
    }
  },
  cons: (head, tailThunk) => {
    return (pattern) => {
      return pattern.cons(head, tailThunk)
    }
  },
  head: (alist) => {
    return list.match(alist, {
      empty: () => {
        return null
      },
      cons: (value, tailThunk) => {
        return value
      },
    })
  },
  tail: (alist) => {
    return list.match(alist, {
      empty: (_) => {
        return null
      },
      cons: (head, tailThunk) => {
        return tailThunk
      },
    })
  },
  reverse: (alist) => {
    var reverseHelper = (alist, accumulator) => {
      return list.match(alist, {
        empty: () => {
          return accumulator
        },
        cons: (head, tail) => {
          return reverseHelper(tail, list.cons(head, accumulator))
        },
      })
    }
    return reverseHelper(alist, list.empty())
  },

  toArray: (alist) => {
    var toArrayHelper = (alist, accumulator) => {
      return list.match(alist, {
        empty: () => {
          return accumulator
        },
        cons: (head, tail) => {
          return toArrayHelper(tail, accumulator.concat(head))
        },
      })
    }
    return toArrayHelper(alist, [])
  },
  map: (alist, transform) => {
    return list.match(alist, {
      empty: () => {
        return list.empty()
      },
      cons: (head, tail) => {
        return list.cons(transform(head), list.map(tail, transform))
      },
    })
  },
}

var compose = (f, g) => {
  return (arg) => {
    return f(g(arg))
  }
}

/* map:: FUN[T => T] => LIST[T] => LIST[T] */

const map = (callback) => {
  return (alist) => {
    return list.match(alist, {
      empty: () => {
        return list.empty()
      },
      cons: (head, tail) => {
        return list.cons(callback(head), map(callback)(tail))
      },
    })
  }
}

/* map処理の対象となる数値のリスト */

const numbers = list.cons(1, list.cons(2, list.cons(3, list.empty())))

const mapDouble = map((n) => {
  return n * 2
})

expect(compose(list.toArray, mapDouble)(numbers)).to.eql([2, 4, 6])

const mapSquare = map((n) => {
  return n * n
})

expect(compose(list.toArray, mapSquare)(number)).to.eql([1, 4, 9])
