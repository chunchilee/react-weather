import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import WeatherCard from './WeatherCard';
// 實際上發送 API 請求，拉取資料的動作（useWeatherApi）是在 WeatherApp.js 中被呼叫到
import useWeatherApi from './useWeatherApi';
import sunriseAndSunsetData from './sunrise-sunset.json';
import WeatherSetting from './WeatherSetting';
import { findLocation } from './utils';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getMoment = (locationName) => {
  // 日出日落時間中找出符合的地區
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName,
  );
  // 若找不到該地區則表示該地區的日出日落時間不在資料庫中，回傳 null
  if (!location) return null;
  // 透過 new Date() 取得當前時間
  const now = new Date();
  // 因為日出日落中使用的時間格式 2019-10-08，因此把當前時間也轉成這種時間格式
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');
  // 找到該地區的資料後，從中找出符合當天日期的資料
  const locationDate = location?.time.find((time) => time.dataTime === nowDate);

  if (!locationDate) {
    throw new Error(
      `找不到 ${locationName} 在 ${nowDate} 的日出日落資料，可能需要更新日出日落時刻資料，請參考 'https://github.com/pjchender/learn-react-from-hook-realtime-weather-app#更新日出日落的資料'`,
    );
  }
  // 為了方便比較時間的早晚，將「日出」、「日落」以及「當前」時間透過 getTime() 這個方法轉成時間戳記（TimeStamp
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`,
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`,
  ).getTime();

  const nowTimeStamp = now.getTime();
  // 若當前時間介於日出和日落中間，則表示為白天（day），否則為晚上（night)
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};
const WeatherApp = () => {
  console.log('--- invoke function component ---');
  // 從 localStorage 取出 cityName，並取名為 storageCity
  const storageCity = localStorage.getItem('cityName');
  // 使用 useState 定義當前要拉取天氣資訊的地區，預設值先定為「臺北市」;若 storageCity 存在則作為 currentCity 的預設值，否則使用 '臺北市'
  const [currentCity, setCurrentCity] = useState(storageCity || '臺北市');
  // 根據 currentCity 來找出對應到不同 API 時使用的地區名稱，找到的地區取名為 currentLocation，否則回傳空物件
  const currentLocation = findLocation(currentCity) || {};
  // 使用 useWeatherApi Hook 後就能取得 weatherElement 和 fetchData 這兩個方法，把 currentLocation 當成參數傳入 useWeatherApi 中 
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  // 使用 useState 並定義 currentTheme 的預設值為 light
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies;根據日出日落資料的地區名稱（currentLocation.sunriseCityName），找出對應的日出日落時間
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [
    currentLocation.sunriseCityName,
  ]);

  useEffect(() => {
     // 根據 moment 決定要使用亮色或暗色主題
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  useEffect(() => {
    // 透過 useEffect 來設定 localStorage 中 cityName 的值
    localStorage.setItem('cityName', currentCity);
    // 透過 useEffect 來設定 localStorage 中 cityName 的值
  }, [currentCity]);

  return (
    // 把所有會用到主題配色的部分都包在 ThemeProvider 內，透過 theme 這個 props 傳入深色主題
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* 透過條件渲染的方式，使用 && 判斷式來決定要呈現哪個組件在畫面上 */}
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            // 把縣市名稱（currentLocation.cityName）透過 props 傳入 WeatherCard 中用以顯示
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            // 把縣市名稱（currentLocation.cityName）透過 props 傳入 WeatherSetting 中用以當作表單「地區」欄位的預設值
            cityName={currentLocation.cityName}
            // 把 setCurrentCity 方法透過 props 傳入，讓 WeatherSetting 可以去修改 currentCity，以更新要拉取天氣資料的地區
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;


