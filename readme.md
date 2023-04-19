[![🚀 Deploy website on push](https://github.com/Blockchain-Ads/Blockchain-ads/actions/workflows/deploy.yml/badge.svg)](https://github.com/Blockchain-Ads/Blockchain-ads/actions/workflows/deploy.yml)

# This is a MVP frontend repository for https://blockchain-ads.com/web3-cookie/

The frontend is connect to backend via these endpoint (Hardcoded)



*This is live*

https://us-central1-web3-cookie.cloudfunctions.net/alldata

https://us-central1-web3-cookie.cloudfunctions.net/auth

https://us-central1-web3-cookie.cloudfunctions.net/dataConsent

https://us-central1-web3-cookie.cloudfunctions.net/deleteData

https://us-central1-web3-cookie.cloudfunctions.net/signup

# Getting started
*assume you are in main-html*

Right now the repo is under refactoring process all functionality under index.js will be migrate under react-dropin directory

### Prerequisites
Incase you don't have `serve` globally installed
``` bash
npm install --global serve

```

1. Install dependencies
``` bash
npm i
```

2. Show serve web page
``` bash
serve web3-cookie
```

3. To start develop index.js
``` bash
npm start
```

4. To update react option modal
``` bash
cd react-dropin && npm run build
```
