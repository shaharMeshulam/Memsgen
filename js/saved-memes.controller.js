'use strict'

function onSavedMemesInit() {
    renderMemes();
}

function renderMemes() {
    const memes = getMemes()
    if (!Object.keys(memes).length) {
        document.querySelector('.memes ul').innerHTML = '';
        document.querySelector('.memes h2').innerText = getTrans('dont-have-memes');
    } else {
        document.querySelector('.memes h2').innerText = '';
        let strHtml = '';
        for(let memeId in memes) {
            strHtml += `<li class="meme">
                    <img src="${memes[memeId].thumb}">
                    <div class="actions">
                        <button class="rounded bg-red" onclick="onRemoveMeme('${memeId}')" data-trans="remove">${getTrans('remove')}</button>
                        <button class="rounded bg-orange" onclick="onEditMeme('${memeId}')" data-trans="edit">${getTrans('edit')}Edit</button>
                    </div>
                </li>`;
        }
        document.querySelector('.memes ul').innerHTML = strHtml;
    }
}

function onRemoveMeme(memeId) {
    removeMeme(memeId);
    renderMemes();
}

function onEditMeme(memeId) {
    onSetPage('dashboard');
    onDashboardInit(null, memeId);
}