import { nanoid } from "nanoid";
import * as jwt from "jsonwebtoken";
import { ethers } from "ethers";
import Web3Token from "web3-token";

const extendedExpYears = 10;
const cookieIssuer = "https://blockchain-ads.com";
const domain = "blockchain-ads.com";

const cookieName = "BCA-universal-cookie";
const milisec = 1000;

// function showCookie(){
//   const retrivedCookie = getCookie(cookieName);
//   const retrivedLocalstorage = localStorage.getItem(cookieName);
//
//   document.getElementById("jwt").innerHTML = `${retrivedCookie}`;
//   document.getElementById("data-cookie").innerHTML = `${JSON.stringify(parseJwt(retrivedCookie))}`;
//   document.getElementById("data-localstorage").innerHTML = `${JSON.stringify(
//     parseJwt(retrivedLocalstorage)
//   )}`;
// }

function fetchText(url) {
  return fetch(url).then(res => res.text());
}
function getIP(){
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

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

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

function nounceGen(){
  const array = new Uint32Array(10);
  const listNum = self.crypto.getRandomValues(array);
  return listNum[0]
}

document.getElementById("info").innerHTML = 'Please connect your wallet';
document.getElementById("info").classList.add("text-yellow-500");

async function main() {
  const currentIp = await getIP();
  // keccak256
  const hashIp = ethers.utils.id(`${currentIp}`);
// console.log('HASHIP', hashIp)

  const cookieExp =
    Math.floor(Date.now() / milisec) + posixYearSec(extendedExpYears);
  const uuid = nanoid(32);
  const dataPackage = { uuid: `${uuid}`,hashIp:hashIp };
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if(getCookie(cookieName) != null){
    document.getElementById("info").innerHTML = 'You have logged in';
    document.getElementById("info").classList.add("text-blue-500");
    document.getElementById("signing-in-button").classList.add("cursor-not-allowed");
    document.getElementById("signing-in-button").disabled = true;
  }
  // // Wallet
  document.getElementById("signing-in-button").addEventListener("click",
    async function() {

      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      try{
        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);
        document.getElementById("info").innerHTML = 'You have connected your wallet. Please Sign your signature';
        document.getElementById("info").classList.add("text-blue-500");
      } catch(e){
        document.getElementById("info").innerHTML = 'You have not connect your wallet yet. Please refresh page to connect again';
        document.getElementById("info").classList.add("text-red-500");
      }
      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const signer = provider.getSigner();
      let web3token
      try{

        web3token = await Web3Token.sign(
          async (msg) => await signer.signMessage(msg),
          {
            domain: domain,
            statement: "I accept the blockchain-ads Terms of Service",
            expires_in: `${365 * 10}` + " days",
            dataPackage: dataPackage,
            // won't be able to use this token for one hour
            nonce: nounceGen()
          }
        );
        document.getElementById("info").innerHTML = 'You have signed a signature. That is it! Thank you';
        document.getElementById("info").classList.add("text-blue-500");
      } catch(e){
        document.getElementById("info").innerHTML = 'You have not sign your signature yet. Please refresh page to sign again';
        document.getElementById("info").classList.add("text-red-500");
      }
      const { address, body } = await Web3Token.verify(web3token, {
        // verify that received token is signed only for our domain
        domain: domain,
        dataPackage: dataPackage

      });

      document.getElementById("address").innerHTML = `${address}`;

      // const url = 'https://us-central1-' + 'blockchain-ads-mvp' + '.cloudfunctions.net/auth';
      const signupUrl = 'https://us-central1-web3-cookie.cloudfunctions.net/signup';
      // const signupUrl = 'https://us-central1-' + 'blockchain-ads-mvp' + '.cloudfunctions.net/signup';
      const authenticateUrl = 'https://us-central1-web3-cookie.cloudfunctions.net/auth';
      // const authenticateUrl = 'https://us-central1-' + 'blockchain-ads-mvp' + '.cloudfunctions.net/auth';

      const firebaseToken = await fetchPostJson(signupUrl, {
        uuid: uuid,
        eip4361: web3token,
        hashIp: hashIp
      })
      .then((data) => {
          if (getCookie(cookieName) == null){
            setCookie(cookieName, data.token, extendedExpYears);
            window.localStorage.setItem(cookieName, data.token);
          }
          return data.token
      });
      await fetchPostJson(authenticateUrl, {
        firebaseToken: firebaseToken,
      })
      .then((data) => {
          // showCookie()
          document.getElementById("signing-in-button").classList.add("cursor-not-allowed");
          document.getElementById("signing-in-button").disabled = true;
      });
  })
  // showCookie()
}
main();
