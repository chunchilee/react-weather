XMLHttpRequest / Ajax / Fetch / axios

Ajax 並不是單一的技術，而是一套綜合性的瀏覽器端網頁開發技術，用於取得遠端資料。
Promise 則是一個語法，專門用來處理非同步行為，並不是專門用來處理 Ajax 使用
Promise 是用來優化非同步的語法，而 Async、Await 可以基於 Promise 讓非同步的語法的結構類似於 “同步語言”，更易讀且好管理。
Asynchronous JavaScript and XML
  Asynchronous：非同步
  JavaScript：使用的程式語言
  XML：Client 與 Server 交換資料用的資料與方法，近年由於 JSON 等格式的流行，使用 Ajax 處理的資料並不限於 XML
  axios
  1.廣泛的瀏覽器支持
  2.可支援 Node.js 從後端發送的 Http request，這意味著 axios 可以兼用於前端與後端專案。
  3.直接將回應的 JSON 資料轉換成 JavaScript 的 Object，這十分方便！

fetch('<requestURL>')                  // 向 requestURL 發送請求
  .then((response) => response.json()) // 取得伺服器回傳的資料並以 JSON 解析
  .then((data) => console.log('data')); // 取得解析後的 JSON 資料

axios.get('<requestURL>') 
  .then((response) => console.log(response))
  .catch((error) => console.log(error))
  .then(( ) => );

請求資料
  畫面載入時就自動拉取一次
  另一個是在使用者點擊「重新整理」按鈕時拉取資料

Array
  Map 的目的是遍歷所有 item，經過處理之後，回傳同樣長度的陣列；
  filter 同樣是遍歷所有 item，但是回傳符合條件的 items。
  reduce 不僅僅有累加的功能，更可以實現 map 和 filter 的功能，可以說應用場景非常的廣。

React畫面的重新轉譯
透過 useState 建立了一個需要被監控的資料變數（count），並且透過 setCount 方法來改變 count 的數值時，React 會幫我們重新轉譯畫面。
	setCount被呼叫到
	count的值確實有改變
  這兩個條件缺一不可。
array.keys()  / array.from() 產生索引值 / array.find() 回傳第一個滿足所提供之測試函式的元素值 / Object.entires() 把物件的 key 和 value 轉成陣列

UseEffect
  組件渲染完後才會呼叫 useEffect 內的 function
  不管這個組件是第一次渲染還是重新渲染 useEffect 內的 function 一樣會在組件渲染完後被呼叫。

useEffect(<didUpdate>, [dependencies])
  要停止這個無限迴圈會需要在「特定時間」讓 useEffect 內的函式不要被呼叫到就可以，這個「特定時間」通常是「已經向 API 拉取過資料」或者「React 內的資料沒有變動」時。
  它是一個陣列，只要每次重新渲染後 dependencies 內的元素沒有改變，任何 useEffect 裡面的函式就不會被執行！
  •組件渲染完後，如果 dependencies 有改變，才會呼叫 useEffect 內的 function
  useEffect 的 dependencies 陣列中並沒有放入任何元素，也就是說，這個 useEffect 內的函式只會執行一次，就不會再被呼叫到了

useState 中的 state 指的是保存在 React 組件內部的資料狀態。
useEffect 中的 effect  指的是 副作用（side-effect） 的意思，在 React 中會把畫面渲染後和 React 本身無關而需要執行的動作稱做「副作用」，這些動作像是「發送 API 請求資料」、「手動更改 DOM 畫面」等等。
  「手動更改 DOM 畫面」指的是透過瀏覽器原生的 API 或其他第三方套件去操作 DOM，而不是透過讓React 組件內 state 改變而更新畫面呈現的方式。

setSomething 這個方法是會把舊有的資料全部清掉，用新的去覆蓋掉，而這也就是這裡問題的原因。
  在 setWeatherElement 中帶入函式，並在函式的參數中帶入 prevState 將可以取得原有的資料狀態
  透過物件的解構賦值把原有的資料放進去，後面在放入透過 API 取得的資料
  當箭頭函式單純只是要回傳物件時，可以連 return 都不寫，但回傳的物件需要使用小括號 () 包起來

useCallback 這樣的方法，在有需要時，它可以幫我們把這個函式保存下來，讓它不會隨著每次組件重新執行後，因為作用域不同而得到兩個不同的函式（by reference）
如果某個函式不需要被覆用，那麼可以直接定義在 useEffect 中，但若該方法會需要被共用，則把該方法提到 useEffect 外面後，記得用 useCallback 進行處理後再放到 useEffect 的 dependencies 中
useCallback 本身的用法不難就和 useEffect 很接近，差別在於“它是會回傳一個函式”。
不同的地方是 useCallback 會回傳一個函式，只有當 dependencies 有改變時，這個回傳的函式才會改變

const memoizedCallback = useCallback(() => { doSomething(a, b); },[a, b],);
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  useCallback 是用來在 dependencies 沒有改變的情況下，把某個 function 保存下來；
  useMemo 則是會在 dependencies 沒有改變的情況下，把某個運算的結果保存下來;
  只要 dependencies 的值沒有改變，useMemo 就會直接使用上一次計算過的結果而不會重新在運算一次;

關於 useMemo 的使用有一點需要留意的是， useMemo 會在組件渲染時（rendering）被呼叫，因此不應該在這個時間點進行任何會有副作用（side effect）的操作；若需要有副作用的操作，則應該使用的是 useEffect 而不是 useMemo。
  useCallback(fn, deps) 等同於 useMemo(() => fn, deps)

sass 權重 && > style > &
子層去修改父層資料 透過props從父層傳遞setSomething到子層 子層透過解構賦值將setSomething取出 便可觸發組建渲染 
這種把表單資料交給 React 來處理的就稱作 Controlled Components，也就是受 React 控制的資料；
如果不把表單資料交給 React，而是像過去一樣，選取到該表單元素後，才從該表單元素取出值的這種做法，就稱作 Uncontrolled Components，也就是不受 React 控制的資料。

useRef （透過 useRef 便可以在 Functional Component 中定義不會導致畫面重新渲染的變數）
  會回傳一個物件（refContainer），這個物件不會隨著每一次畫面重新渲染而指稱到不同的物件，而是可以一直指稱到同一個物件
  當 input 欄位內的資料有變動時，並不像 Controlled Component 一樣會促發畫面重新渲染
  透過 useRef 就可以幫助開發者，即使在組建重新渲染後，仍可以去取得同一個物件，並取出內部的值來用。
  當我們在 React 組件中想要定義一些「變數」，但當這些變數改變時，又不需要像 state 一樣會重新導致畫面渲染的話，就很適合使用 useRef

  // 儲存資料
localStorage.setItem(keyName, keyValue);

// 讀取特定資料
localStorage.getItem(keyName);

// 清除特定資料
localStorage.removeItem(keyName);

// 清除全部資料
localStorage.clear();

props 就是指由外部傳入該組件內的資料
hooks 裡面的 State 表示的是該組件自身內部的資料，也就是使用 useState 產生的資料。

