Async function
  async function 可以用來定義一個非同步函式，讓這個函式本體是屬於非同步，但其內部以“同步的方式運行非同步”程式碼。
  await 則是可以暫停非同步函式的運行（中止 Promise 的運行），直到非同步進入 resolve 或 reject，當接收完回傳值後繼續非同步函式的運行。
  Promise 的回傳狀態，需要進入 resolve 或 reject 後，非同步函式才會繼續運行。

function promiseFn(num, time = 500) {
  return new Promise((resolve, reject) => {  --------------- 1
    setTimeout(() => {
      num ? resolve(`${num}, 成功`) : reject('失敗');
    }, time);
  });
}
async function getData() {
  const data1 =  await promiseFn(1) // 因為 await，promise 函式被中止直到回傳
  const data2 =  await promiseFn(2);
  console.log(data1, data2) // 1, 成功 2, 成功
}
getData();
  print (1.fulfilled ,2.'1, 成功 2, 成功');

Async / Await 目的是讓程式碼的結構變得更加簡潔、易懂，所以運用上也如上述一樣單純（如果沒有 “錯誤”，它確實很單純）

function promiseFn(num, time = 500) {
  return new Promise((resolve, reject) => {  
    setTimeout(() => {
      num ? resolve(`${num}, 成功`) : reject('失敗');
    }, time);
  });
}
// 寫法1.promise 使用then...catch
promiseFn(1)
  .then(res => {
    console.log(res);
    return promiseFn(0);
  })
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  });
// 寫法2.async/await 使用 try...catch 
  async function getData2() {
  try { // 專注在成功
    const data1 = await promiseFn(1);
    const data2 = await promiseFn(0);
    console.log(data1, data2);
  }
  catch (err) { // 專注在錯誤
    console.log('catch', err);
  }
}
getData2();

執行順序的技巧
  Promise 是透過鏈接及 Promise 的方法（Promise.all, Promise.race）來達到不同的執行順序方法。
  async/await 則讓非同步有了同步的寫法，因此許多原有的 JS 語法都可以一起搭配做使用，如迴圈、判斷式都是可利用的技巧，
  在了解這段以前，需要先知道非同步主要有兩個時間點：
    送出 “請求” 的時間
    取得 “回應” 的時間
    依據這段概念，又可以區分成：
      請求依序發出：一個一個往下執行
      請求平行發出：全部的請求一起發出
      回應依序列出：依據請求發出的順序，依序列出資源
      回應統一列出：不管什麼時候取得都統一列出
  Promise.all 平行執行，統一列出回應資訊

for...in 輸出的是屬性名稱(key) / for...of 輸出的是值(value)


