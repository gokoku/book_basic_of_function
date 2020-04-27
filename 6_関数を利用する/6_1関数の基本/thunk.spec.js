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

// サンクで無限を表現する
//
// STREAM[T] = empty()
//           | cons(T, FUN[_ => STREAM[T]])

const stream = {
  match: (data, pattern) => {
    return data(pattern)
  },
  empty: () => {
    return (pattern) => {
      return pattern.empty()
    }
  },
  cons: (head, tailThunk) => {
    return (pattern) => {
      return pattern.cons(head, tailThunk)
    }
  },
  /* head:: STREAM[T] => T */
  head: (aStream) => {
    return stream.match(aStream, {
      empty: () => {
        return null
      },
      cons: (value, tailThunk) => {
        return value
      },
    })
  },
  /* tail:: STREAM[T] => STREAM[T] */
  tail: (aStream) => {
    return stream.match(aStream, {
      empty: () => {
        return null
      },
      cons: (head, tailThunk) => {
        return tailThunk()
      },
    })
  },
  take: (aStream, n) => {
    return stream.match(aStream, {
      empty: () => {
        return list.empty()
      },
      cons: (head, tailThunk) => {
        if (n === 0) {
          return list.empty()
        } else {
          return list.cons(head, stream.take(tailThunk(), n - 1))
        }
      },
    })
  },
}

const theStream = stream.cons(1, () => {
  return stream.cons(2, () => {
    return stream.empty()
  })
})

expect(stream.head(theStream)).to.eql(1)

const ones = () => {
  return stream.cons(1, () => {
    return ones()
  })
}

const enumFrom = (n) => {
  return stream.cons(n, () => {
    return enumFrom(n + 1)
  })
}

expect(list.toArray(stream.take(enumFrom(1), 4))).to.eql([1, 2, 3, 4])

expect(list.toArray(stream.take(ones(), 4))).to.eql([1, 1, 1, 1])

expect(list.toArray(stream.take(ones(), 5))).to.eql([1, 1, 1, 1, 1])
