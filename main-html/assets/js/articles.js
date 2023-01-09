const articles = [
    {
        date: 'Jan 7, 2023',
        section: 'Blochain',
        image: 'https://miro.medium.com/fit/c/224/224/1*un5JnU8yu_yaeVEXUBeugw.png',
        title: `Advertising in web3: A beginner’s guide`,
        text: `If you’re new to web3 advertising, here’s a beginner’s guide to get you started: Understand the basics of web3 technology: Web3 is based on blockchain technology, which uses decentralized networks and cryptographic techniques to enable secure and transparent transactions. …`
    },
    {
        date: 'Jan 4, 2023',
        section: 'Blochain',
        image: 'https://miro.medium.com/fit/c/224/224/1*8_65OGFBB9rXAt9u6FqYyA.jpeg',
        title: 'We analyze data from 10 DeFi projects running campaigns on Blockchain-Ads platform and this is what we learned',
        text: `In recent years, the decentralized finance (DeFi) industry has exploded in popularity, with the total value locked in DeFi reaching over $300 billion in 2021. As more and more DeFi projects emerge, user acquisition has become a key focus for many in the industry. …`
    },
    {
        date: 'Jul 15, 2022',
        section: 'NFT',
        image: 'https://miro.medium.com/fit/c/224/224/0*amLcTF_qx-P1yeMN',
        title: 'How to leverage the Blockchain-Ads Advertising Protocol for your NFT Project (Guide)',
        text: `As more and more Web3 Projects Alpha test our Advertising protocol, we will publish a guide of best practices and strategies based on historical data. Over 20 NFT projects have used Blockchain-Ads for marketing and advertising. While they all achieved a certain degree of success, it’s definitely safe to say…`
    },
    {
        date: 'Jul 1, 2022',
        section: 'Crypto',
        image: 'https://miro.medium.com/fit/c/224/224/1*RdBZkDOlLvY_GHVzVPqrLQ.png',
        title: 'On-Blockchain Data Attribution: Cookieless, Immutable, Anonymous and Secure.',
        text: 'With the death of 3rd party cookies and the termination of Google Universal Analytics, it is certainly going to be a time of upheaval for …'
    },
    {
        date: 'Jun 16, 2022',
        section: 'Crypto',
        image: 'https://miro.medium.com/fit/c/224/224/0*1bCyhjDbShlndubX',
        title: 'What is Wallet Targeting and how it increase Advertising ROI',
        text: 'A short while ago, Blockchain-Ads mentioned Wallet Targeting among the core features of the Alpha stage platform. …'
    },
    {
        date: 'Jun 11, 2022',
        section: 'Crypto',
        image: 'https://miro.medium.com/fit/c/224/224/0*AWMncWhBEdCTJNMW',
        title: 'Blockchain-Ads x CoinBag AMA RECAP: Wallet Targeting Technologies and Soulbound NFTs',
        text: 'Two weeks ago, the Blockchain-Ads Team had the opportunity to have Jasmine, from Coinbag.Finance as the special guest of our AMA. …'
    },
    {
        date: 'Jun 3, 2022',
        section: 'Web Advertising',
        image: 'https://miro.medium.com/fit/c/224/224/0*Vu4fcF90maFLg-qd',
        title: 'What is Blockchain-Ads: The Web3 Generation of Advertising',
        text: 'Blockchain-Ads is the first “Performance-based Web3 Advertising Ecosystem”. There is so much inside these 5 words. What does Performance-based means? What is a Web3 Advertising Ecosystem? We want to unpack all of this in this (short) article. If you have already heard about us before or you want to go…'
    },
    {
        date: 'Jun 3, 2022',
        section: 'Web 3',
        image: 'https://miro.medium.com/fit/c/224/224/0*7HsO2GbFzamaThao',
        title: 'Blockchain-Ads Partners With Cookie3 To Bring Data Attribution And User Segmentation To The Web3',
        text: 'Imagine a Web3 Advertising Ecosystem with the Performance of Google Ads, the level of Data Attribution and Segmentation of Google Analytics and the Privacy protection of the Brave Browser. Is it possible? Today the Blockchain-Ads Team is thrilled to announce our first Strategic Partnership with Cookie3: the First Analytics Platform…'
    }
];

function loadArticles() {
    const articlesHTML = document.getElementById("articles");
    articlesHTML.innerHTML = '';
    articleHeight = '670px';
    if (window.innerWidth <= 480) {
        articleHeight = '600px';
    } else if (window.innerWidth <= 1200) {
        articleHeight = '770px';
    }
    
    articles.forEach((article) => {
        articlesHTML.innerHTML = articlesHTML.innerHTML + `<div class="col-lg-4 col-sm-6">
        <div class="blog" style="height: ${articleHeight}">
            <div class="blog-photo">
                <img src="${article.image}" alt="blog-thumb">
            </div>
            <div class="blog-text">
                <ul class="blog-meta">
                    <li><a href="#">${article.date}</a></li>
                    <li><a href="#">${article.section}</a></li>
                </ul>
                <h4 class="title title-sm"><a href="#">${article.title}</a></h4>
                <p>${article.text}</p>
            </div>
        </div>
    </div>`
    });
}

loadArticles();
addEventListener("resize", (event) => {loadArticles()});