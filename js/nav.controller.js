'use strict'

function onSetPage(pageName, elBtn) {
    document.querySelector('a.selected').classList.remove('selected');
    elBtn.classList.add('selected');
}