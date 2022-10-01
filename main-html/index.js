import {
  nanoid
} from "nanoid";
import * as jwt from "jsonwebtoken";
import {
  ethers
} from "ethers";
import Web3Token from "web3-token";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";


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

function parseJwt(token) {
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

function nounceGen() {
  const array = new Uint32Array(10);
  const listNum = self.crypto.getRandomValues(array);
  return listNum[0]
}

async function main() {

  const currentIp = await getIP();
  // keccak256
  const hashIp = ethers.utils.id(`${currentIp}`);
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)

  const cookieExp =
    Math.floor(Date.now() / milisec) + posixYearSec(extendedExpYears);
  const uuid = nanoid(32);
  const dataPackage = {
    uuid: `${uuid}`,
    hashIp: hashIp
  };

  const collection = document.getElementsByClassName("connect-wallet-js-target");

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
        let web3token
        try {
          web3token = await Web3Token.sign(
            async (msg) => await signer.signMessage(msg), {
              domain: domain,
              statement: "I accept the blockchain-ads Terms of Service",
              expires_in: `${365 * 10}` + " days",
              dataPackage: dataPackage,
              // won't be able to use this token for one hour
              nonce: nounceGen()
            }
          );
        } catch (e) {
          console.log('>>>>> Error', e)
        }
        const {
          address,
          body
        } = await Web3Token.verify(web3token, {
          // verify that received token is signed only for our domain
          domain: domain,
          dataPackage: dataPackage
        });


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
            document.getElementById("signing-in-button").classList.add("cursor-not-allowed");
            document.getElementById("signing-in-button").disabled = true;
          });
        if (isMobileDevice) {
          console.log('DISCONNECT')
          await walletConnectProvider.disconnect()
        }

      })
  }
}
main();
