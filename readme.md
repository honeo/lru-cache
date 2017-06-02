# lru-cache
* [honeo/lru-cache](https://github.com/honeo/lru-cache)  
* [@honeo/lru-cache](https://www.npmjs.com/package/@honeo/lru-cache)

## なにこれ
Map実装のかんたんLRU Cacheモジュール。

## 使い方
```bash
$ npm i @honeo/lru-cache
```
```js
const LRUCache = require('@honeo/lru-cache');
const cache = new LRUCache();

cache.set('foo', 'bar');
cache.get('foo'); // "bar"

for(let [key, value] of cache){
	key+value; // "foobar"
}
```

## API
[Map](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map)を継承している。

### new LRUCache([option])
インスタンスを作る。
```js
const cache = new LRUCache({
	capacity: 2501,
	expire: 1000*60*60 // 1h
});
```
#### option
|   key    |  type  | default  |    description     |
|:-------- |:------ | -------- | ------------------ |
| capacity | number | Infinity | キャッシュの最大数 |
| expire   | number | Infinity | キャッシュの期限ms |

#### expireについて
Lazy Expiration実装のため、すぐにGCさせたい場合は明示的に#delete()などで要素を削除する必要がある。また#sizeは期限切れの要素を含んだ数を返す。

<!--
### LRUCache#peek(key)
\#get()のキャッシュ順位を更新しない版。
```js
const value = cache.get('hoge');
``` -->

### LRUCache#set(key, value [, expire])
引数1をkeyとして引数2のvalueをキャッシュする。  
自身を返す。
```js
cache.set('hoge', 'hogehoge');

// expire: 1m
cache.set('fuga', 'fugafuga', 1000*60);
```

### LRUCache#capacity
インスタンスの最大キャッシュ数を取得・設定する。
```js
const number = cache.capacity;

// Max: 1000
cache.capacity = 1000;
```

### LRUCache#expire
インスタンスの標準キャッシュ期限を取得・設定する。
```js
const number = cache.expire;

// expire: 1h
cache.expire = 1000*60*60;
```
