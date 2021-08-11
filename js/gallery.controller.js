'use strict';

let gIsMoreKeywords = false;

function onInitGallery() {
    renderKeyWords();
    renderGallery();
}

function renderKeyWords() {
    let strHtml = '';
    let count = 0;
    const keyWords = getKeywords();
    for (let keyword in keyWords) {
        count++;
        if (count > 5 && !gIsMoreKeywords) break;
        strHtml += `<li style="font-size: calc(1em + ${keyWords[keyword]}em)" onclick="onKeywordClick('${keyword}')">${keyword}</li>`;
    }
    strHtml += `<li onclick="onToggleMoreKeywords()">More...</li>`
    document.querySelector('.keywords ul').innerHTML = strHtml;
}

function renderGallery() {
    document.querySelector('.imgs-gallery').innerHTML = getImagesForDisplay().map(img => {
        return `<li onclick="onSelectImg(${img.id})"><img src="${img.url}"></li>`
    }).join('')
}

function onSearch(query) {
    setKeyword(query);
    renderGallery();
}

function onKeywordClick(keyword) {
    setKeyword(keyword, 0.1);
    renderKeyWords();
    renderGallery();
}

function onToggleMoreKeywords() {
    gIsMoreKeywords = !gIsMoreKeywords;
    renderKeyWords();
}

function onSelectImg(imgId) {
    document.querySelector('.gallery').hidden = true;
    document.querySelector('.dashboard').hidden = false;
    onDashboardInit(imgId);
}