import { useState, useEffect, useCallback } from 'react';
const authorizationKey = 'CWB-507B37E0-0383-4D8C-878D-628B54EC3536';
// 讓 fetchCurrentWeather 可以接收 locationName 作為參數
const fetchCurrentWeather = locationName => {
  // 在 API 的網址中可以帶入 locationName 去撈取特定地區的天氣資料
  // 加上 return 直接把 fetch API 回傳的 Promise 回傳出去
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`,
  )
    .then(response => response.json())
    .then(data => {
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {},
      );

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
      };
    });
};
// 讓 fetchWeatherForecast 可以接收 cityName 作為參數
const fetchWeatherForecast = cityName => {
  // 在 API 的網址中可以帶入 cityName 去撈取特定地區的天氣資料
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`,
  )
    .then(response => response.json())
    .then(data => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {},
      );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};
// 讓 useWeatherApi 可以接收參數
const useWeatherApi = currentLocation => {
  // 將傳入的 currentLocation 透過解構賦值取出 locationName 和 cityName
  const { locationName, cityName } = currentLocation;
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
    isLoading: true,
  });
  // useCallback 在有需要時，它可以幫我們把這個函式保存下來，讓它不會隨著每次組件重新執行後，因為作用域不同而得到兩個不同的函式。
  // 不同的地方是 useCallback 會回傳一個函式，只有當 dependencies 有改變時，這個回傳的函式才會改變
  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      //  fetch API 本身就會回傳 Promise，因此透過 async function 中的 await 語法搭配 Promise.all就可以等待 fetch API 的資料都回應後才讓程式碼繼續往後走
      const [currentWeather, weatherForecast] = await Promise.all([
        // locationName 是給「觀測」天氣資料拉取 API 用的地區名稱
        fetchCurrentWeather(locationName),
        // cityName 是給「預測」天氣資料拉取 API 用的地區名稱
        fetchWeatherForecast(cityName),
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };
    // 在 setState 中如果是帶入函式的話，可以取得前一次的資料狀態
    setWeatherElement(prevState => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();
    // 記得將 locationName 和 cityName 帶入 useCallback 的 dependencies 中。這時候一旦 locationName 或 cityName 改變時，useCallback 回傳的 fetchData 就會改變，此時 useEffect 內的函式就會再次執行，拉取最新的天氣資料
  }, [locationName, cityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;

