'use strict'

const DEFAULT_FONT_SIZE = 40;
const gStickesrs = [
    { id: 1, url: 'img/stickers/1.png' },
    { id: 2, url: 'img/stickers/2.png' },
    { id: 3, url: 'img/stickers/3.png' }
]
let gMeme;

function initDashboard(selectedImgId) {
    gMeme = {
        selectedImgId: selectedImgId,
        selectedLineIdx: null,
        selectedStickerIdx: null,
        lines: [],
        stickers: []
    }
}

function getMeme() {
    return gMeme;
}

function loadMeme(memeId) {
    gMeme = getMemeById(memeId);
}

function getStickerById(id) {
    return gStickesrs.find(sticker => sticker.id === id);
}

function getStickers() {
    return gStickesrs;
}

function addSticker(url, x, y, width, height) {
    gMeme.stickers.push({ id: makeId(), url, x, y, width, height });
    setSelectedSticker(gMeme.stickers.length - 1);
}

function getSelectedSticker() {
    return gMeme.stickers[gMeme.selectedStickerIdx];
}

function setSelectedSticker(id) {
    gMeme.selectedStickerIdx = gMeme.stickers.findIndex(sticker => sticker.id === id);
}

function setLineText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function addTxt(txt, elWidth, elHight, strokeColor, color, font) {
    let lineX = 0;
    let lineY = 0;
    switch (gMeme.lines.length) {
        case 0:
            lineX = elWidth / 2;
            lineY = DEFAULT_FONT_SIZE + 24;
            break;
        case 1:
            lineX = elWidth / 2;
            lineY = elHight - 24;
            break;
        default:
            lineX = elWidth / 2;
            lineY = elHight / 2;
    }
    gMeme.lines.push(_createLine(txt, lineX, lineY, strokeColor, color, DEFAULT_FONT_SIZE, font))
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function changeSelectedLineIdx() {
    const nextLineIdx = gMeme.selectedLineIdx + 1;
    if (gMeme.lines[nextLineIdx]) gMeme.selectedLineIdx++;
    else gMeme.selectedLineIdx = 0;
}

function move(dx, dy) {
    if (gMeme.selectedLineIdx !== null && gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].x += dx;
        gMeme.lines[gMeme.selectedLineIdx].y += dy;
    } else if (gMeme.selectedStickerIdx !== null && gMeme.selectedStickerIdx !== -1) {
        gMeme.stickers[gMeme.selectedStickerIdx].x += dx;
        gMeme.stickers[gMeme.selectedStickerIdx].y += dy;
    }
}

function resize(dx, dy) {
    const selectedSticker = getSelectedSticker();
    const selectedLine = getSelectedLine();
    if (selectedLine) {
        selectedLine.size += dx;
    } else if (selectedSticker) {
        selectedSticker.width += dx;
        selectedSticker.height += dy;
    }
}

function changeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function setLineAlign(alignOption) {
    gMeme.lines[gMeme.selectedLineIdx].align = alignOption;
}

function setFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function setLineStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color;
}

function setLineTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getSelectedLineX() {
    const selectedLine = getSelectedLine();
    let currLineX;
    switch (selectedLine.align) {
        case 'right':
            currLineX = selectedLine.x - selectedLine.width - MARGIN;
            break;
        case 'left':
            currLineX = selectedLine.x - MARGIN;
            break;
        default:
            currLineX = selectedLine.x - selectedLine.width / 2 - MARGIN
    }
    return currLineX;
}

function getMouseOnLineId(mousePos) {
    const lines = gMeme.lines;
    for (let i = 0; i < lines.length; i++) {
        const currLine = lines[i];
        let currLineX1 = getSelectedLineX();
        let currLineX2 = currLineX1 + currLine.width + MARGIN * 2;
        let currLineY1 = currLine.y - currLine.size - MARGIN / 4;;
        let currLineY2 = currLineY1 + currLine.size + MARGIN
        if (mousePos.x > currLineX1 && mousePos.x < currLineX2 && mousePos.y > currLineY1 && mousePos.y < currLineY2) {
            return getMeme().lines[i].id;
        }
    }
    return null;
}

function getMouseOnStickerId(mousePos) {
    const stickers = gMeme.stickers;
    for (let i = 0; i < stickers.length; i++) {
        const currSticker = stickers[i];
        if (mousePos.x > currSticker.x - MARGIN && mousePos.x < currSticker.x + currSticker.width + MARGIN &&
            mousePos.y > currSticker.y - MARGIN && mousePos.y < currSticker.y + currSticker.height + MARGIN) {
            return getMeme().stickers[i].id;
        }
    }
    return null;
}

function setSelectedLine(id) {
    gMeme.selectedLineIdx = gMeme.lines.findIndex(line => line.id === id);
}

function getSelectedImgId() {
    return gMeme.selectedImgId;
}

function setLineWidth(lineIdx, width) {
    gMeme.lines[lineIdx].width = width;
}

function remove() {
    if (gMeme.selectedLineIdx !== null && gMeme.selectedLineIdx !== -1) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.selectedLineIdx = null;
    } else if (gMeme.selectedStickerIdx !== null && gMeme.selectedStickerIdx !== -1) {
        gMeme.stickers.splice(gMeme.selectedStickerIdx, 1);
        gMeme.selectedStickerIdx = null;
    }
}

function setMemeId(id) {
    gMeme.id = id;
}

function _createLine(txt, x, y, strokeColor, color, size, font = 'Impact', align = 'center') {
    return {
        id: makeId(),
        txt,
        x,
        y,
        strokeColor,
        color,
        size,
        font,
        align
    }
}
