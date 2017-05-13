# lru-cache
* [honeo/lru-cache](https://github.com/honeo/lru-cache)  
* [@honeo/lru-cache](https://www.npmjs.com/package/@honeo/lru-cache)

## なにこれ
Mapと同じ感覚で使えるかんたんLRU Cacheモジュール。

## 使い方
```bash
$ npm i -S @honeo/lru-cache
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

### LRUCache#delete(key)
キャッシュされている引数のkeyを削除する。
```js
const bool = cache.delete('hoge');
```

### LRUCache#get(key)
引数をkeyとしてキャッシュされている値を返す。
```js
const value = cache.get('hoge');
```

### LRUCache#has(key)
引数のkeyがキャッシュされているか。
```js
const bool = cache.has('hoge');
```

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

// expire: 1min
cache.set('fuga', 'fugafuga', 1000*60);
```

### LRUCache#capacity
インスタンスの最大キャッシュ数を取得・設定する。
```js
const number = cache.capacity;
cache.capacity = number*2;
```

### LRUCache#expire
インスタンスの標準キャッシュ期限を取得・設定する。
```js
const ms = cache.expire;
cache.expire = ms*2;
```

### LRUCache#size
登録されているキャッシュ数(期限切れを含む)を返す。
```js
const number = cache.size;
```
