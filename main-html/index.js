import {
  nanoid
} from "nanoid";
import * as jwt from "jsonwebtoken";
import {
  ethers
} from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import ID5 from '@id5io/id5-api.js/lib/id5-api.js';
import Cookies from 'js-cookie'

const extendedExpYears = 10;
const cookieIssuer = "https://blockchain-ads.com";
const domain = "blockchain-ads.com";

const cookieName = "BCA-universal-cookie";
const milisec = 1000;

const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: "f5a8016d22144904b71b3ec15d298b86" // required
    }
  }
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});


function fetchText(url) {
  return fetch(url).then(res => res.text());
}

function getIP() {
  return fetchText('https://www.cloudflare.com/cdn-cgi/trace').then(data => {
    const ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/
    const ip = data.match(ipRegex)[0];
    return ip
  });
}


async function fetchPostJson(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function posixYearSec(years) {
  return years * 365 * 24 * 60 * 60;
}

function setCookie(name, value, years) {
  let date = new Date();
  date.setTime(date.getTime() + posixYearSec(years) * milisec);
  const expires = "; expires=" + date.toUTCString();

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

async function wait(ref){
  return new Promise(async (resolve, reject) => {
    while (ref._userId == undefined){
      await new Promise(r => setTimeout(r, 300));
    }
    resolve(ref._userId);
  });
}

async function main() {
  const collection = document.getElementsByClassName("connect-wallet-js-target");
  const cookie = getCookie(cookieName)

  if(cookie != null){
    // Cookie existed
    const decoded = jwt.decode(cookie);
    const cookieIsExpired = (decoded.exp + (60 * 60)) < Math.floor(Date.now()/1000)
    if (cookieIsExpired){
      // Cookie expired
      Cookies.remove(cookieName)
      const element = document.getElementById("root");
      element.className = "hidden";
      for (let i = 0; i < collection.length; i++) {
        collection[i].classList.add("bg-blue-500");
        collection[i].classList.add("hover:bg-blue-800");
      }
    } else {
      // Cookie not expired (Already sign in)
      for (let i = 0; i < collection.length; i++) {
        collection[i].classList.add("cursor-not-allowed");
        collection[i].classList.add("bg-opacity-0");
        collection[i].classList.add("hover:bg-opacity-0");
        collection[i].innerHTML = "Wallet Connected";
        collection[i].disabled = true;
      }
    }

  }else {
    // Wallet not yet connected
    const element = document.getElementById("root");
    element.className = "hidden";
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.add("bg-blue-500");
      collection[i].classList.add("hover:bg-blue-800");
    }
  }

  const id5Status = await ID5.init({ partnerId: 1238 })
  const id5Device = await id5Status.onAvailable((status) => {
    return status.getUserId()
  });

  const id5DeviceId = await wait(id5Device);

  const currentIp = await getIP();
  // keccak256
  const hashIp = ethers.utils.id(`${currentIp}`);
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)

  const cookieExp =
    Math.floor(Date.now() / milisec) + posixYearSec(extendedExpYears);
  const uuid = nanoid(32);


  // // Wallet
  for (let i = 0; i < collection.length; i++) {
    collection[i].addEventListener("click",
      async function() {
        // After click button wiil popup wallet connect modal
        const walletConnectProvider = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(walletConnectProvider);

        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = await provider.getSigner();
        const address = await signer.getAddress()
        const dataPackage = {
          uuid: `${uuid}`,
          hashIp: hashIp,
          id5DeviceId: id5DeviceId,
          address: address,
          hostname: window.location.hostname
        };
        for (let i = 0; i < collection.length; i++) {
          collection[i].classList.add("bg-yellow-300");
          collection[i].classList.add("hover:bg-yellow-800");
          collection[i].innerHTML = "Please accept term of service";
        }

        const signupUrl = 'https://us-central1-web3-cookie.cloudfunctions.net/signup';
        // const signupUrl = 'http://localhost:5001/web3-cookie/us-central1/signup';
        const authenticateUrl = 'https://us-central1-web3-cookie.cloudfunctions.net/auth';
        // const authenticateUrl = 'http://localhost:5001/web3-cookie/us-central1/auth';

        const firebaseToken = await fetchPostJson(signupUrl, {
            dataPackage: dataPackage,
          })
          .then((data) => {
            if (getCookie(cookieName) == null) {
              setCookie(cookieName, data.token, extendedExpYears);
              window.localStorage.setItem(cookieName, data.token);
            }
            return data.token
          });
        await fetchPostJson(authenticateUrl, {
            firebaseToken: firebaseToken,
          })
          .then((data) => {
            for (let i = 0; i < collection.length; i++) {
              collection[i].classList.add("cursor-not-allowed");
              collection[i].classList.add("bg-opacity-0");
              collection[i].classList.add("hover:bg-opacity-0");
              collection[i].innerHTML = "Wallet Connected";
              collection[i].disabled = true;
              const element = document.getElementById("root");
              element.classList.remove("hidden");

            }
          });
        if (isMobileDevice) {
          console.log('DISCONNECT')
          await walletConnectProvider.disconnect()
        }
      })
  }
}
main();
