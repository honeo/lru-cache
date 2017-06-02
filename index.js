// Modules

// Var
const weakmap = new WeakMap(); // インスタンスをkey,対になるobjectがvalueとして入る

class LRUCache extends Map {

	/*
		weakmapに this:対になるobject を突っ込む

		object {
			capacity: number,
			expire: number
		}
	*/
	constructor({capacity=Infinity, expire=Infinity}={}){
		// validation
		if(typeof capacity!=='number' || typeof expire!=='number'){
			throw new TypeError('Invalid arguments');
		}
		super();
		// 自身の対になる設定オブジェクトをweakmapに登録
		weakmap.set(this, {
			capacity,
			expire
		});
	}

	/*
		いてれーたー
			keyはそのまま,valueは分解して渡す
	*/
	*[Symbol.iterator](){
		const iterator = Map.prototype.entries.call(this);
		for(let [key, {expire, value}] of iterator){
			yield [key, value];
		}
	}

	/*
		#entries()
			上をそのまま使いまわし
	*/
	entries(){
		return this[Symbol.iterator]();
	}

	/*
		#forEach()
			valueを分解して渡す
	*/
	forEach(callback, thisArg){
		Map.prototype.forEach.call(this, ({value}, key, map)=>{
			callback.call(thisArg, value, key, map);
		});
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
		if( Map.prototype.has.call(this, key) ){
			const {expire, value} = Map.prototype.get.call(this, key);
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
		return !!this.get(key);
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
	peek(key){
		if( this.has(key) ){
			const {expire, value} = this.get(key);
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
		//console.log('#set', key, value, _expire);
		const {expire} = weakmap.get(this);
		Map.prototype.set.call(this, key, {
			expire: (_expire||expire)+Date.now(),
			value
		});
		cacheSlicer.call(this);
		return this;
	}

	/*
		#values()
			値を分解して渡す
	*/
	*values(){
		const iterator = Map.prototype.values.call(this);
		for(let {expire, value} of iterator){
			yield value;
		}
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

}

/*
	キャッシュ数整理
		キャッシュ数がcapacityより多ければ古い順にカットする
		キャッシュ追加後とcapacity値の変更後に呼ばれる
		インスタンスをthisにして実行する
*/
function cacheSlicer(){
	const {capacity} = weakmap.get(this);
	if( capacity<this.size ){
		const num_over = this.size - capacity;
		let count = 0;
		for(let key of this.keys() ){
			this.delete(key);
			count++;
			if(count >= num_over){
				break;
			}
		}
	}
}


module.exports = LRUCache;
