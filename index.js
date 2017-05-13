// Modules

// Var
const weakmap = new WeakMap(); // インスタンスをkey,対になるobjectがvalueとして入る

class LRUCache {

	/*
		weakmapに this:対になるobject を突っ込む

		object {
			capacity: number,
			expire: number,
			map {
				key: object {
					value, 登録したkeyに対する値
					expire: number, 期限ms
				}
			}
		}

	*/
	constructor({capacity=Infinity, expire=Infinity}={}){
		// validation
		if(typeof capacity!=='number' || typeof expire!=='number'){
			throw new TypeError('Invalid arguments');
		}
		// 自身を対になるオブジェクトをweakmapに登録
		weakmap.set(this, {
			capacity,
			expire,
			map: new Map()
		});
	}

	/*
		いてれーたー
			mapをそのまんま流用
	*/
	*[Symbol.iterator](){
		const map = weakmap.get(this).map;
		for(let [key, {expire, value}] of map){
			yield [key, value];
		}
	}

	/*
		キャッシュされた全てのkey:valueを削除する
			引数
			返り値
	*/
	clear(){
		weakmap.get(this).map.clear();
	}

	/*
		引数keyに対する値を削除する
			引数
				1: key
			返り値
				boolean
	*/
	delete(key){
		return weakmap.get(this).map.delete(key);
	}


	/*
		引数keyに対するvalueを返す
			期限切れしていればなかったことにする
			そのkey:valueでsetし直して順位を更新する

			引数
				1: key
			返り値
				2: value or undefined
	*/
	get(key){
		const map = weakmap.get(this).map;
		if( map.has(key) ){
			const {expire, value} = map.get(key);
			const isTimeout = expire < Date.now();
			if( !isTimeout ){
				this.set(key, value);
				return value;
			}
		}
	}

	/*
		引数のkeyでキャッシュされているか
			期限処理を端折るためgetを使いまわすやっつけ実装。
	*/
	has(key){
		const map = weakmap.get(this).map;
		if( map.has(key) ){
			const isTimeout = map.get(key).expire < Date.now();
			return !isTimeout;
		}else{
			return false;
		}
	}

	/*
		引数keyに対するvalueを返す
			期限切れしていればなかったことにする
			#get()と違い順位を更新しない。

			引数
				1: key
			返り値
				2: value or undefined
	*/
	get(key){
		const map = weakmap.get(this).map;
		if( map.has(key) ){
			const {expire, value} = map.get(key);
			const isTimeout = expire < Date.now();
			if( !isTimeout ){
				return value;
			}
		}
	}

	/*
		キャッシュにKey:Valueを登録する
			キャッシュ数を整理する。

			引数
				1: keyにするやつ
				2: valueになるやつ
				3: op, 期限ms
			返り値
				this
	*/
	set(key, value, _expire){
		const {expire, map} = weakmap.get(this);
		map.set(key, {
			expire: (_expire||expire)+Date.now(),
			value
		});
		cacheSlicer.call(this);
		return this;
	}

	/*
		キャッシュ容量の取得・設定
			set
				代入されたのが数値なら上書きする。
				キャッシュ数を整理する。
			get
				現在値を返す。
	*/
	set capacity(arg){
		if( typeof arg==='number' ){
			weakmap.get(this).capacity = arg;
			cacheSlicer.call(this);
		}
	}
	get capacity(){
		return weakmap.get(this).capacity;
	}

	/*
		キャッシュ期限の取得・設定
			set
				代入されたのが数値なら上書きする。
			get
				現在値を返す。
	*/
	set expire(arg){
		if( typeof arg==='number' ){
			weakmap.get(this).expire = arg;
		}
	}
	get expire(){
		return weakmap.get(this).expire;
	}

	/*
		期限切れを含むキャッシュ数
			返り値
				number
	*/
	get size(){
		return weakmap.get(this).map.size;
	}

}

/*
	キャッシュ数整理
		キャッシュ数がcapacityより多ければ古い順にカットする
		キャッシュ追加後とcapacity値の変更後に呼ばれる
		インスタンスをthisにして実行する
*/
function cacheSlicer(){
	const {capacity, map} = weakmap.get(this);
	if( capacity<map.size ){
		const num_over = map.size - capacity;
		let count = 0;
		for(let key of map.keys() ){
			map.delete(key);
			count++;
			if(count >= num_over){
				break;
			}
		}
	}
}


module.exports = LRUCache;
