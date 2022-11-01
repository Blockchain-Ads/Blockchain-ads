import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode";
import useLocalStorage, {localStorageDatas} from "./LocalStorageContext"

const ToggleButton = () => {
// TODO get data from DB
const [isOn, setIsOn] = useState(true);
const cookieName = "BCA-universal-cookie";
const defaultCookieData = ""
const baseURL = "https://us-central1-web3-cookie.cloudfunctions.net"

useEffect(() => {
  const url = baseURL+"/alldata";
  (async ()=>{
  const localStorageString = await localStorageData;

  axios.post(url, {
      firebaseToken: localStorageString,
    }).then((response) => {
      setIsOn(response.data.dataConsent)
    }).catch(function (error) {
      console.error(" >>> ",error);
    });
})();

}, []);

  const { localStorageData, setLocalStorageData } = useLocalStorage()

// const [localStorageData, setLocalStorageData] = useState(() => {
//   let currentValue; // currently cookie is just a string not an object
//   try {
//     currentValue = Cookies.get(cookieName) || String(defaultCookieData)
// console.log('CURRENTVALUE', currentValue)
//     const decoded = jwt_decode(currentValue);
//     console.log('DECODED', decoded)
//   } catch (error) {
//     console.error(">>>", error)
//     currentValue = defaultCookieData;
//   }
//   return currentValue;
// });



async function toggleDataConsent() {
    setLocalStorageData(Cookies.get(cookieName) || String(defaultCookieData))
    const localStorageString = Cookies.get(cookieName) || String(defaultCookieData)
    const url = baseURL+"/dataConsent";
    axios.post(url, {
        firebaseToken: localStorageString,
      }).then((response) => {
        setIsOn(response.data.dataConsent)
        // setPost(response.data);
      }).catch(function (error) {
        console.error(" >>> ",error);
      });
}
return(

<div className="mt-4">
  <p>localStorageData</p>

  <p>{localStorageData}</p>
  <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
    <input type="checkbox" value="" id="default-toggle" className="sr-only peer"></input>
    {isOn ? (
      <div className="flex flex-row" >
        <div onClick={toggleDataConsent} className="w-11 h-6 bg-blue-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-blue-700  after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-blue-600"></div>
        <div className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Data sharing ON</div>
      </div>
    ) : (
      <div className="flex flex-row">
        <div onClick={toggleDataConsent} className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Data sharing OFF</span>
      </div>
      )}
  </label>
</div>

);
}
export default ToggleButton;
