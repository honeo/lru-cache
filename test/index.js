/*
	Test
*/
const {name, version} = require('../package.json');
console.log(`${name} v${version}: test`);

// Modules
const assert = require('assert');
const LRUCache = require('../');
const {is, not, any} = require('@honeo/check');
const Test = require('@honeo/test');

// 引数インスタンスにサンプルを登録して返す
function setContents(cache){
	const contentsArr = [
		['foo', 'bar'],
		['hoge', 'hogehoge'],
		['fuga', 'fugafuga'],
		['piyo', 'piyopiyo']
	];
	contentsArr.forEach( (contents)=>{
		cache.set(...contents);
	});
	return cache;
}

// 引数ms待って解決する
function sleep(ms, ...args){
	return new Promise( (resolve)=>{
		setTimeout(resolve, ms, ...args);
	});
}

Test([
	function(){
		console.log('require Constructor');
		return is.func(LRUCache);
	},

	function(){
		console.log('new LRUCache()');
		const cache = new LRUCache();
		return cache instanceof LRUCache;
	},

	function(){
		console.log('LRUCache#clear()');
		const cache = setContents(new LRUCache());
		cache.clear();
		return cache.size===0;
	},

	function(){
		console.log('LRUCache#delete()');
		const cache = new LRUCache();
		cache.set('hoge', 'hogehoge');
		cache.delete('hoge');
		return !cache.has('hoge');
	},

	function(){
		console.log('LRUCache#entries()');
		const cache = setContents(new LRUCache());
		const iterator = cache.entries();
		const res1 = iterator.next();
		const res2 = iterator.next();
		const res3 = iterator.next();
		const res4 = iterator.next();
		const res5 = iterator.next();
		return is.true(
			res1.value[0]==='foo',
			res1.value[1]==='bar',
			!res1.done,
			res2.value[0]==='hoge',
			res2.value[1]==='hogehoge',
			!res2.done,
			res3.value[0]==='fuga',
			res3.value[1]==='fugafuga',
			!res3.done,
			res4.value[0]==='piyo',
			res4.value[1]==='piyopiyo',
			!res4.done,
			res5.value===undefined,
			res5.done
		);
	},

	function(){
		console.log('LRUCache#forEach()');
		const cache = setContents(new LRUCache());
		let count = 0;
		cache.forEach( (value, key, map)=>{
			if(count===0){
				assert(key==='foo');
				assert(value==='bar');
			}
			if(count===1){
				assert(key==='hoge');
				assert(value==='hogehoge');
			}
			if(count===2){
				assert(key==='fuga');
				assert(value==='fugafuga');
			}
			if(count===3){
				assert(key==='piyo');
				assert(value==='piyopiyo');
			}
			count++;
		});
		return true;
	},

	function(){
		console.log('LRUCache#get(key)');
		const cache = new LRUCache();
		const key = 'hoge';
		const value = 'hogehoge';
		cache.set(key, value);
		console.log(cache.get(key), value);
		return cache.get(key)===value;
	},

	function(){
		console.log('LRUCache#has()');
		const cache = new LRUCache();
		const key = 'hoge';
		const value = 'hogehoge';
		cache.set(key, value);
		return cache.has(key);
	},

	function(){
		console.log('LRUCache#keys()');
		const cache = setContents(new LRUCache());
		const iterator = cache.keys();
		return is.true(
			iterator.next().value==='foo',
			iterator.next().value==='hoge',
			iterator.next().value==='fuga',
			iterator.next().value==='piyo'
		);
	},

	function(){
		console.log('LRUCache#set()');
		const cache = new LRUCache();
		setContents(cache);
		return cache.size===4;
	},
	async function(){
		console.log('LRUCache#set(key, value, expire)');
		const cache = new LRUCache();
		cache.set('hoge', 'hogehoge', 100);
		await sleep(111);
		return !cache.get('hoge');
	},

	function(){
		console.log('LRUCache#values()');
		const cache = setContents(new LRUCache());
		const iterator = cache.values();
		return is.true(
			iterator.next().value==='bar',
			iterator.next().value==='hogehoge',
			iterator.next().value==='fugafuga',
			iterator.next().value==='piyopiyo'
		);
	},

	// function(){
	// 	console.log('LRUCache#peek(key)');
	// 	const cache = new LRUCache();
	// 	return ;
	// },
	function(){
		console.log('option.capacity');
		const cache = setContents(new LRUCache({
			capacity: 2
		}));
		return is.true(
			cache.capacity===2,
			cache.size===2
		);
	},
	function(){
		console.log('LRUCache#capacity');
		const cache = setContents(new LRUCache());
		cache.capacity = 2;
		return is.true(
			cache.capacity===2,
			cache.size===2
		);
	},
	async function(){
		console.log('option.expire');
		const cache = new LRUCache({
			expire: 100
		});
		cache.set('foo', 'bar');
		await sleep(111);
		return !cache.has('foo');
	},
	async function(){
		console.log('LRUCache#expire');
		const cache = setContents(new LRUCache());
		cache.expire = 100;
		cache.set('foo', 'bar');
		await sleep(111);
		return !cache.has('foo');
	},
	function(){
		console.log('LRUCache#size');
		const cache = new LRUCache();
		const num_before = cache.size;
		cache.set('foo', 'bar');
		const num_after = cache.size;
		return num_before+num_after===1;
	},
	function(){
		console.log('LRUCache#[Symbol.iterator]');
		const cache = new LRUCache();
		cache.set('A', 'AAA');
		cache.set('B', 'BBB');
		cache.set('C', 'CCC');
		let count = 0;
		const arr = [];
		for(let [key, value] of cache){
			count++;
			arr.push({key, value});
		}
		return is.true(
			count===3,
			arr[0].key==='A',
			arr[0].value==='AAA',
			arr[1].key==='B',
			arr[1].value==='BBB',
			arr[2].key==='C',
			arr[2].value==='CCC'
		);
	}
], {
	exit: true
});
