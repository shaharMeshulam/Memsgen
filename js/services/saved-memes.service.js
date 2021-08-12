'use strict'

const DB_KEY = 'memesDb';
let gMemes;
savedMemesInit();

function savedMemesInit() {
    gMemes = loadFromStorage(DB_KEY) || {};
}

function getMemeById(memeId) {
    return gMemes[memeId];
}

function getMemes() {
    return gMemes;
}

function addMeme(meme, thumb) {
    if(!meme.id) meme.id = makeId();
    meme.thumb = thumb;
    gMemes[meme.id] = meme;
    _saveToStorage();
    return meme.id;
}

function removeMeme(id) {
    delete gMemes[id];
    _saveToStorage();
}

function _saveToStorage() {
    saveToStorage(DB_KEY, gMemes);
}