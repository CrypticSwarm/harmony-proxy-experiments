var Proxy = require('node-proxy')

function Just(obj) {
  return Proxy.create({
    get: function(receiver, name) {
      if (typeof obj[name] == 'function') return obj[name].bind(obj)
      return Maybe(obj[name])
    },
    enumerate: keyEnum,
    keys: keyEnum,
  })

  function keyEnum() {
    return typeof obj == 'object' ? Object.keys(obj) : []
  }
}

var Nothing = (function() {
  var Nothing = {}
  Object.defineProperty(Nothing, "valueOf"
  , { enumberable: false
    , writeable: true
    , value: function() { return null } 
    }
  )
  return Just(Nothing)
})()

function Maybe(obj) {
  return obj == null ? Nothing
  : Just(obj)
}

// Examples of Maybe below.
var obj = { a: 123, b: 45, c: { a: 'hello' }}
  , maybeObj = Maybe(obj)

function cleanCopy(item, key) {
  var ret = {}
  return item != Nothing && typeof item.valueOf() == 'object' ?
    Object.keys(item).forEach(function(prop) {
      ret[prop] = cleanCopy(item[prop])
    }) || ret
  : item.valueOf()
}
log = function(item, msg) {
  var itemIsObj = typeof item == 'object'
    , format = itemIsObj ? "%j <- %s" : "%s -> %s"
    , printItem = itemIsObj ? cleanCopy(item) : item
  console.log(format, printItem, msg)
}

console.log("Note: all of the Maybe values are cleaned.  Converts proxies to primitives back to primitives.")
log(typeof Maybe(123), "Given 'object' cooler if it was 'number'")
log(Maybe(123) == 123, 'Maybe(123) == 123')
log(Maybe(123) === 123, 'Maybe(123) === 123 //Would be neat if this were also true for a primitive')
log(Maybe(null), "Maybe(null)")
log(maybeObj, "Maybe({ a: 123, b: 45, c: { a: 'hello' })")
log(maybeObj.c, "Maybe({ a: 123, b: 45, c: { a: 'hello' }).c")
log(maybeObj.a.a, "Maybe({ a: 123, b: 45, c: { a: 'hello' }).a.a")
log(maybeObj.a.b.c.d, "Maybe({ a: 123, b: 45, c: { a: 'hello' }).a.b.c.d")
