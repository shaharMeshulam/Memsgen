'use strict';

let gIsMoreKeywords = false;

function onInitGallery() {
    renderKeyWords();
    renderGallery();
    renderKeyWordsDatalist();
}

function renderKeyWordsDatalist() {
    let strHtml = ''
    const keyWords = getKeywords();
    for (let keyword in keyWords) {
        strHtml += `<option value="${keyword}">`;
    }
    document.getElementById('keywords').innerHTML = strHtml;
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
    const str = gIsMoreKeywords ? 'Less...' : 'More...'
    strHtml += `<li onclick="onToggleMoreKeywords()">${str}</li>`
    document.querySelector('.keywords ul').innerHTML = strHtml;
}

function renderGallery() {
    const uploadNewHtmlStr = `<li class="bg-orange upload flex justify-center align-center direction-column">
            <label for="upload">
                Upload from your computer<div class="fas fa-upload"></div>
                <input type="file" name="upload" id="upload" onchange="onLoadImageFromInput(event)">
            </label>
        </li>`
    document.querySelector('.imgs-gallery').innerHTML = uploadNewHtmlStr + getImagesForDisplay().map(img => {
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
    onSetPage('dashboard');
    onDashboardInit(imgId);
}

function onLoadImageFromInput(ev) {
    const reader = new FileReader()

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        const imgId = addImage(img.src);
        img.onload = renderGallery();
        
    }
    reader.readAsDataURL(ev.target.files[0])
}