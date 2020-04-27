const expect = require('expect.js')

/*  not:: FUN[NUM => BOOL] => FUN[NUM => BOOL] */
var not = (predicate) => {
  return (arg) => {
    return !predicate(arg)
  }
}

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
  /* filter:: FUN[T => BOOL] => STREAM[T] => STREAM[T] */
  filter: (predicate) => {
    return (aStream) => {
      return stream.match(aStream, {
        empty: () => {
          return stream.empty()
        },
        cons: (head, tailThunk) => {
          if (predicate(head)) {
            return stream.cons(head, () => {
              return stream.filter(predicate)(tailThunk())
            })
          } else {
            return stream.filter(predicate)(tailThunk())
          }
        },
      })
    }
  },
  /* remove:: FUN[T => BOOL] => STREAM[T] => STREAM[T] */
  remove: (predicate) => {
    console.log('**** remove')
    return (aStream) => {
      return stream.filter(not(predicate))(aStream)
    }
  },
}

var generate = (aStream) => {
  var _stream = aStream
  return () => {
    return stream.match(_stream, {
      empty: () => {
        return null
      },
      cons: (head, tailThunk) => {
        _stream = tailThunk()
        return head
      },
    })
  }
}

const enumFrom = (n) => {
  return stream.cons(n, () => {
    return enumFrom(n + 1)
  })
}

/* 無限の性数列を生成する */
const integers = enumFrom(0)

/* 無限ストリームからジェネレーターを生成する */
const intGenerator = generate(integers)

expect(intGenerator()).to.eql(0)
expect(intGenerator()).to.eql(1)
expect(intGenerator()).to.eql(2)
expect(intGenerator()).to.eql(3)

/* エラトステネスのふるい */
const sieve = (aStream) => {
  return stream.match(aStream, {
    empty: () => {
      return null
    },
    cons: (head, tailThunk) => {
      return stream.cons(head, () => {
        return sieve(
          stream.remove((item) => {
            return multipleOf(item)(head)
          })(tailThunk())
        )
      })
    },
  })
}

/* 無限の素数列 */
const primes = sieve(enumFrom(2))
const primeGenerator = generate(primes)

expect(primeGenerator()).to.eql(2)
expect(primeGenerator()).to.eql(3)
expect(primeGenerator()).to.eql(4)
