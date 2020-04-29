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
  foldr: (alist) => {
    return (accumulator) => {
      return (CALLBACK) => {
        return list.match(alist, {
          empty: () => {
            return accumulator
          },
          cons: (head, tail) => {
            return CALLBACK(head)(list.foldr(tail)(accumulator)(CALLBACK))
          },
        })
      }
    }
  },
}

const numbers = list.cons(1, list.cons(2, list.cons(3, list.empty())))

const sum = (alist) => {
  return list.foldr(alist)(0)((item) => {
    return (accumulator) => {
      return accumulator + item
    }
  })
}

expect(sum(numbers)).to.eql(6)

const length = (alist) => {
  return list.foldr(alist)(0)((item) => {
    return (accumulator) => {
      return accumulator + 1
    }
  })
}
expect(length(numbers)).to.eql(3)

const product = (alist) => {
  return list.foldr(alist)(1)((item) => {
    return (accumulator) => {
      return accumulator * item
    }
  })
}

expect(product(numbers)).to.eql(6)
