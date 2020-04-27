const expect = require('expect.js')

var compose = (f, g) => {
  return (arg) => {
    return f(g(arg))
  }
}

var f = (x) => {
  return x * x + 1
}

var g = (x) => {
  return x - 2
}

expect(compose(f, g)(2)).to.eql(f(g(2)))

var opposite = (n) => {
  return -n
}

expect(compose(opposite, opposite)(2)).to.eql(2)

var add = (x) => {
  return (y) => {
    return x + y
  }
}

expect(compose(opposite, add(2))(3)).to.eql(-5)

var list = {
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

var last_recuresive = (alist) => {
  return list.match(alist, {
    empty: () => {
      return null
    },
    cons: (head, tail) => {
      return list.match(tail, {
        empty: () => {
          return head
        },
        cons: (_, __) => {
          return last(tail)
        },
      })
    },
  })
}

var last = (alist) => {
  return compose(list.head, list.reverse)(alist)
}

expect(last(list.cons(1, list.cons(2, list.cons(3, list.empty()))))).to.eql(3)
