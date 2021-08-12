'use strict'

let gMeme;
let gFontSize;

function initDashboard(selectedImgId) {
    gMeme = {
        selectedImgId: selectedImgId,
        selectedLineIdx: null,
        lines: []
    }
    gFontSize = 40;
}

function getMeme() {
    return gMeme;
}

function loadMeme(memeId) {
    gMeme = getMemeById(memeId);
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
            lineY = gFontSize + 24;
            break;
        case 1:
            lineX = elWidth / 2;
            lineY = elHight - 24;
            break;
        default:
            lineX = elWidth / 2;
            lineY = elHight / 2;
    }
    gMeme.lines.push(_createLine(txt, lineX, lineY, strokeColor, color, gFontSize, font))
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function changeSelectedLineIdx() {
    const nextLineIdx = gMeme.selectedLineIdx + 1;
    if (gMeme.lines[nextLineIdx]) gMeme.selectedLineIdx++;
    else gMeme.selectedLineIdx = 0;
}

function moveLine(dx, dy) {
    if(!gMeme.lines[gMeme.selectedLineIdx]) return;
    gMeme.lines[gMeme.selectedLineIdx].x = dx;
    gMeme.lines[gMeme.selectedLineIdx].y = dy;
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

function getLines() {
    return gMeme.lines;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function setSelectedLine(idx) {
    gMeme.selectedLineIdx = idx;
}

function getSelectedImgId() {
    return gMeme.selectedImgId;
}

function setLineWidth(lineIdx, width) {
    gMeme.lines[lineIdx].width = width;
}

function removeLine() {
    if (gMeme.selectedLineIdx === null) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = null;
}

function setMemeId(id) {
    gMeme.id = id;
}

function _createLine(txt, x, y, strokeColor, color, size, font = 'Impact', align = 'center') {
    return {
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
