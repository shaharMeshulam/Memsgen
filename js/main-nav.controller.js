'use strict'

function onToggleMenu() {
    document.body.classList.toggle('main-nav-open');
    const elBtn = document.querySelector('.btn-menu');
    elBtn.classList.toggle('fa-bars');
    elBtn.classList.toggle('fa-times');
}

function onSetPage(pageName) {
    const elSelectedLink = document.querySelector('a.selected')
    if (elSelectedLink) elSelectedLink.classList.remove('selected');
    switch (pageName) {
        case 'gallery':
            document.querySelector('.gallery').hidden = false;
            document.querySelector('.dashboard').style.display = 'none';
            document.querySelector('.memes').hidden = true;
            document.querySelector('.link-gallery').classList.add('selected')
            break;
        case 'memes':
            document.querySelector('.gallery').hidden = true;
            document.querySelector('.dashboard').style.display = 'none';
            document.querySelector('.memes').hidden = false;
            document.querySelector('.link-memes').classList.add('selected');
            break;
        case 'dashboard':
            document.querySelector('.gallery').hidden = true;
            document.querySelector('.dashboard').style.display = 'flex';
            document.querySelector('.memes').hidden = true;
    }
}