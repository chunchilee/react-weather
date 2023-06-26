import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as DayThunderstorm } from './images/day-thunderstorm.svg';
import { ReactComponent as DayClear } from './images/day-clear.svg';
import { ReactComponent as DayCloudyFog } from './images/day-cloudy-fog.svg';
import { ReactComponent as DayCloudy } from './images/day-cloudy.svg';
import { ReactComponent as DayFog } from './images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './images/day-snowing.svg';
import { ReactComponent as NightThunderstorm } from './images/night-thunderstorm.svg';
import { ReactComponent as NightClear } from './images/night-clear.svg';
import { ReactComponent as NightCloudyFog } from './images/night-cloudy-fog.svg';
import { ReactComponent as NightCloudy } from './images/night-cloudy.svg';
import { ReactComponent as NightFog } from './images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './images/night-snowing.svg';

const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    19,
    20,
    29,
    30,
    31,
    32,
    38,
    39,
  ],
  isSnowing: [23, 37, 42],
};

const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
};

const IconContainer = styled.div`
  flex-basis: 30%;

  svg {
    max-height: 110px;
  }
`;
// 使用 Object.entries 將 weatherTypes 這個物件的 key 和 value 轉成陣列，把 key 取做 weatherType，把 value 取做 weatherCodes
// 針對該陣列使用 find 方法來跑迴圈，搭配 includes 方法來檢驗 API 回傳的「天氣代碼」，會對應到哪一種「天氣型態」
// 找到的陣列會長像這樣 ['isClear', [1]]，因此可以透過透過陣列的賦值，取出陣列的第一個元素，並取名為 weatherType 後回傳
const weatherCode2Type = weatherCode =>
  Object.entries(weatherTypes).reduce(
    (currentWeatherType, [weatherType, weatherCodes]) =>
    // 如果參數沒辦法被轉換成數字，則它會回傳 NaN
      weatherCodes.includes(Number(weatherCode))
        ? weatherType
        : currentWeatherType,
    '',
  );
const WeatherIcon = ({ currentWeatherCode, moment }) => {
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState('isClear');
  // 「組件渲染完後，如果 dependencies 有改變，才會呼叫 useEffect 內的 function」
  // useMemo 則是會在 dependencies 沒有改變的情況下，把某個運算的結果保存下來
  const theWeatherIcon = useMemo(() => weatherCode2Type(currentWeatherCode), [
    currentWeatherCode,
  ]);

  useEffect(() => {
    setCurrentWeatherIcon(theWeatherIcon);
  }, [theWeatherIcon]);

  return (
    <IconContainer>{weatherIcons[moment][currentWeatherIcon]}</IconContainer>
  );
};

export default WeatherIcon;
