# document
いわゆる製作メモ。

## TODO
必要になったら書く。
* #rForEach
 * forEachの逆順番。
* #peek()
 * getの順位を更新しない版。まだtestを書いてないため表記なし。
* #prune()
 * 期限切れを全て削除する。

## 期限について
Lazy Expiration。memcachedみたいにgetする際に期限チェックして、期限切れならスカ判定するだけ。つまり期限切れになってもすぐには開放せず、mapから要素への参照はところてんで捨てられるか#delete()するまで残り続ける。
