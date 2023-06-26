import styled from "@emotion/styled";
import React, { useState } from "react";
import { availableLocations } from "./utils";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;
// 透過陣列的 map 可以只保留 availableLocations中cityName 的部分，以此作為要讓使用者選擇的地區清單
const locations = availableLocations.map((location) => location.cityName);
// 從 props 中取出 cityName 和 setCurrentCity
const WeatherSetting = ({ setCurrentPage, cityName, setCurrentCity }) => {
  // 把 cityName 當成 locationName 這個 state 的預設值，因為 <input value={locationName}>，因此當使用者一進到此頁面時，地區的表單欄位就會是使用者當前的地區
  const [locationName, setLocationName] = useState(cityName);
  const handleChange = (e) => {
    setLocationName(e.target.value);
  };
  // 用來處理當使用者點擊儲存時要做的事
  const handleSave = () => {
    // 陣列中有列出的地區才是中央氣象局 API 有支援的地區，因此在 handleSave 中透過陣列的 includes 方法來判斷使用者輸入的資料有無包含在該陣列中
    if (locations.includes(locationName)) {
      // TODO: 儲存地區資訊...
      console.log(`儲存的地區資訊為：${locationName}`);
      // 透過 setCurrentPage 導回天氣資訊頁
      setCurrentPage("WeatherCard");
      // 當使用者按下「儲存」時呼叫 setCurrentCity 來更新 WeatherApp 內的 currentCity
      setCurrentCity(locationName);
      // 若不包含在 locations 內，則顯示錯誤提示
    } else {
      alert(`儲存失敗：您輸入的 ${locationName} 並非有效的地區`);
      return;
    }
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      <StyledInputList
        list="location-list"
        id="location"
        name="location"
        /* 使用 onChange 事件來監聽使用者輸入資料 */
        onChange={handleChange}
        // 透過 value 屬性就可以把該 <input> 欄位帶入預設值(使用者一進到設定頁時就看到「臺北市」)
        value={locationName}
      />

      <datalist id="location-list">
        {locations.map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>

      <ButtonGroup>
        {/* 呼叫 setCurrentPage 方法來換頁 */}
        <Back onClick={() => setCurrentPage("WeatherCard")}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
