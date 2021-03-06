'use strict'

function onShowModal(modalName) {
    let f;
    switch (modalName) {
        case 'about':
            f = renderAboutModal;
            break;
        case 'share':
            f = renderShareModal;
            break;
        case 'save':
            f = renderOnSaveModal
            break;
        default:
    }
    document.querySelector('.modal .modal-content').innerHTML = f();
    document.body.classList.add('modal-open');
}

function onCloseModal() {
    document.body.classList.remove('modal-open');
}

function renderAboutModal() {
    return `<h2 data-trans="made-by">${getTrans('made-by')}</h2>
        <img class="img-fluid" src="img/me.jpg"/>`;
}

function renderShareModal() {
    return `<button class="share rounded bg-orange"><a href="#" target="_black" data-trans="share">${getTrans('share')}</a></button>
        <button class="rounded bg-orange"><a href="#" download="myMeme" onclick="onDownloadCanvas(this)" data-trans="download">${getTrans('download')}</button>`;
}

function renderOnSaveModal() {
    return '<h2>Your meme was saved to memes tab</h2>'
}