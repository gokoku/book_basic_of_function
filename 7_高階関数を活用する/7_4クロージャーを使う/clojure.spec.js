const expect = require('expect.js')

const counter = (init) => {
  let countingNumber = init
  return () => {
    countingNumber += 1
    return countingNumber
  }
}

const counterFromZero = counter(0)
expect(counterFromZero()).to.eql(1)

expect(counterFromZero()).to.eql(2)

expect(counterFromZero()).to.eql(3)

//-------クロージャーで普遍なデータ構造を作る

// 空のデータ構造を作る
// データ構造に値を入れて拡張する(拡張子)
// データ構造から値を取得する(抽出子)

let object = {
  empty: (_) => {
    return null
  },
  set: (key, value) => {
    return (obj) => {
      return (queryKey) => {
        if (key === queryKey) {
          return value
        } else {
          return object.get(queryKey)(obj)
        }
      }
    }
  },
  get: (key) => {
    return (obj) => {
      return obj(key)
    }
  },
}

const compose = (f, g) => {
  return (arg) => {
    return f(g(arg))
  }
}

const robots = compose(
  object.set('C3PO', 'Star Wars'),
  object.set('HAL9000', '2001: a space odessay')
)(object.empty())

expect(object.get('HAL9000')(robots)).to.eql('2001: a space odessay')
