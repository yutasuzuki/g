// 幅を指定するランダム関数
export function random(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min)) + min;
}