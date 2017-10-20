/**
 * @description
 * min - maxの間の数字を返す乱数
 * @param {number} min 最小値
 * @param {number} max 最大値
 */
export function random(min = 0, max = 100) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

/**
 * @description
 * setTimeoutのラッパー
 * @param {number} time 処理を止めたい秒数
 */
export function delay(time) {
  return new Promise(function(resolve, reject){
      const que = setTimeout(function(){
        clearTimeout(que); 
        resolve(time)
      }, time)
  })
}

/**
 * @description
 * `Text`クラスのインスタンス`textInstance`の`text`プロパティに、  
 * `textInstance`の幅をはみ出さないように、自動で折り返した`text`を格納する。
 * @param {Text} textInstance 自動で折り返した`text`を格納する`Text`クラスのインスタンス
 * @param {string} text `textInstance.text`に格納する自動で折り返す文字列
 */
export function wrapText(textInstance, text) {
  var initWidth = textInstance.lineWidth;
  var textArray = text.split('');
  var i = -1;
  var prevText = '';
  var lines = [];

  textInstance.text = '';

  while (textArray[++i]) {
    textInstance.text += textArray[i];
    if (textInstance.getMeasuredWidth() > initWidth) {
      lines.push(prevText);
      textInstance.text = textArray[i];
    }
    prevText = textInstance.text;
  }

  lines.push(prevText);
  textInstance.text = lines.join('\n');

  return textInstance.text;
}
