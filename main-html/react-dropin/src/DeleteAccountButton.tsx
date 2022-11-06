import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode";

const DeleteAccountButton = () =>{
const [isOn, setIsOn] = useState(true);
const baseURL = "https://us-central1-web3-cookie.cloudfunctions.net"
const cookieName = "BCA-universal-cookie";
const defaultCookieData = ""

// TODO refactor to use prop instead
const [localStorageData, setLocalStorageData] = useState(() => {
  let currentValue; // currently cookie is just a string not an object
  try {
    currentValue = Cookies.get(cookieName) || String(defaultCookieData)
    var decoded = jwt_decode(currentValue);
    console.log('DECODED', decoded)
  } catch (error) {
    console.error(">>>", error)
    currentValue = defaultCookieData;
  }
  return currentValue;
});



async function deleteData() {
  const localStorageString = Cookies.get(cookieName) || String(defaultCookieData)
  setLocalStorageData(localStorageString)

    const url = baseURL+"/deleteData";
    axios.post(url, {
        firebaseToken: localStorageString,
      }).then((response) => {
        setIsOn(response.data.dataConsent)
        Cookies.remove(cookieName);
        window.location.reload()
      }).catch(function (error) {
        console.error(" >>> ",error);
      });
}

return(

<div className="mt-8">
  <button  onClick={deleteData}  type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete all my data</button>
</div>

);
}
export default DeleteAccountButton;
