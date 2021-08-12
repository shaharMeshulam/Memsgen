'use strict'

const gKeywords = { cats: 0, dogs: 0, animals: 0, people: 0, politics: 0, cute: 0, celebrity: 0, babies: 0, sport: 0 };
const gImgs = [
    { id: 1, url: "img/memes/1.jpg", keywords: ['people', 'politics', 'celebrity'] },
    { id: 2, url: "img/memes/2.jpg", keywords: ['dogs', 'animals', 'cute'] },
    { id: 3, url: "img/memes/3.jpg", keywords: ['dogs', 'people', 'cute', 'babies'] },
    { id: 4, url: "img/memes/4.jpg", keywords: ['cats', 'cute'] },
    { id: 5, url: "img/memes/5.jpg", keywords: ['people', 'cute', 'babies'] },
    { id: 6, url: "img/memes/6.jpg", keywords: ['people', 'celebrity'] },
    { id: 7, url: "img/memes/7.jpg", keywords: ['people', 'cute', 'babies'] },
    { id: 8, url: "img/memes/8.jpg", keywords: ['people'] },
    { id: 9, url: "img/memes/9.jpg", keywords: ['people', 'babies', 'cute'] },
    { id: 10, url: "img/memes/10.jpg", keywords: ['people', 'politics', 'celebrity'] },
    { id: 11, url: "img/memes/11.jpg", keywords: ['people', 'sport'] },
    { id: 12, url: "img/memes/12.jpg", keywords: ['people', 'celebrity'] },
    { id: 13, url: "img/memes/13.jpg", keywords: ['people', 'celebrity'] },
    { id: 14, url: "img/memes/14.jpg", keywords: ['people', 'celebrity'] },
    { id: 15, url: "img/memes/15.jpg", keywords: ['people'] },
    { id: 16, url: "img/memes/16.jpg", keywords: ['people', 'celebrity'] },
    { id: 17, url: "img/memes/17.jpg", keywords: ['people', 'celebrity', 'politics'] },
    { id: 18, url: "img/memes/18.jpg", keywords: ['celebrity'] },
]
let gKeyword = '';

function getImagesForDisplay() {
    return gImgs.filter(img => img.keywords.some(keyword => keyword.includes(gKeyword)));
}

function setKeyword(keyword, rate = null) {
    gKeyword = keyword;
    if (rate) gKeywords[keyword] += rate;
}

function getKeywords() {
    return gKeywords;
}

function getImgSrcById(id) {
    return gImgs.find(img => img.id === id).url;
}