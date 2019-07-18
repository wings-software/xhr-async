//
// proxymise - Chainable Promise Proxy
// https://github.com/kozhevnikov/proxymise
// Copyright (c) 2018 Ilya Kozhevnikov <license@kozhevnikov.com>, MIT license
//
interface KVO<T = any> {
  [key: string]: T
}

export default function proxymise<T, U = any>(target: T): T & U {
  if (typeof target === 'object') {
    const proxy = () => target
    ;(proxy as KVO).__proxy__ = true
    return new Proxy(proxy, handler)
  }
  return typeof target === 'function' ? new Proxy(target, handler) : target
}

const handler: ProxyHandler<any> = {
  construct(target, argumentsList) {
    if ((target as KVO).__proxy__) {
      target = target()
    }
    return proxymise(Reflect.construct(target, argumentsList))
  },

  get(target, property, receiver) {
    if ((target as KVO).__proxy__) {
      target = target()
    }
    if (property !== 'then' && property !== 'catch' && typeof target.then === 'function') {
      return proxymise(target.then((value: any) => get(value, property, receiver)))
    }
    return proxymise(get(target, property, receiver))
  },

  apply(target, thisArg, argumentsList) {
    if ((target as KVO).__proxy__) {
      target = target()
    }
    if (typeof target.then === 'function') {
      return proxymise(target.then((value: any) => Reflect.apply(value, thisArg, argumentsList)))
    }
    return proxymise(Reflect.apply(target, thisArg, argumentsList))
  }
}

const get = (target: any, property: string | number | symbol, receiver: any) => {
  const value = typeof target === 'object' ? Reflect.get(target, property, receiver) : target[property]
  if (typeof value === 'function' && typeof value.bind === 'function') {
    return Object.assign(value.bind(target), value)
  }
  return value
}
