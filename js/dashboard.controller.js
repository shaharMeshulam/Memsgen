'use strict'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
const MARGIN = 20;
let gElCanvas;
let gCtx;
let gIsDrag;
let gLatestSnapshootImg;
let gStartPos;
let gSelectedStickerId;
let gTextFocus = false;

function onDashboardInit(selectedImgId, memeId = null) {
    initDashboard(selectedImgId);
    renderStickers();
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    gSelectedStickerId = null;
    gTextFocus = false;
    resizeCanvas();
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', onResize);
    if (!memeId) draw();
    else onLoadMeme(memeId);
}

function renderStickers() {
    document.querySelector('.stickers').innerHTML = getStickers().map(sticker =>
        `<img src="${sticker.url}" onclick="onStickerClicked(${sticker.id})">`).join('');
}

function onStickerClicked(stickerId) {
    setSelectedLine(null);
    draw();
    renderSticker(getStickerById(stickerId), onAddSticker);
}

function onAddSticker(url, stickerX, stickerY, stickerWidth, stickerHeight) {
    addSticker(url, stickerX, stickerY, stickerWidth, stickerHeight);
    drawSelectedStickerRect();
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onMove(ev) {
    if (!gIsDrag) return;
    const pos = getEvPos(ev);
    const dx = pos.x - gStartPos.x;
    const dy = pos.y - gStartPos.y;
    move(dx, dy);
    gStartPos = pos;
    draw();
}

function onDown(ev) {
    ev.preventDefault();
    const { x, y } = getEvPos(ev);
    gStartPos = { x, y };
    const meme = getMeme()
    const lines = meme.lines;
    let selectedLineIdx = null;
    for (let i = 0; i < lines.length; i++) {
        const currLine = lines[i];
        let currLineX1 = null;
        switch (currLine.align) {
            case 'right':
                currLineX1 = currLine.x - currLine.width - MARGIN;
                break;
            case 'left':
                currLineX1 = currLine.x - MARGIN;
                break;
            default:
                currLineX1 = currLine.x - currLine.width / 2 - MARGIN
        }
        let currLineX2 = currLineX1 + currLine.width + MARGIN * 2;
        let currLineY1 = currLine.y - currLine.size - MARGIN / 4;;
        let currLineY2 = currLineY1 + currLine.size + MARGIN
        if (x > currLineX1 && x < currLineX2 && y > currLineY1 && y < currLineY2) {
            selectedLineIdx = i;
            break;
        }
    }
    const stickers = meme.stickers;
    let selectedStickerIdx = null;
    for (let i = 0; i < stickers.length; i++) {
        const currSticker = stickers[i];
        if (x > currSticker.x - MARGIN && x < currSticker.x + currSticker.width + MARGIN &&
            y > currSticker.y - MARGIN && y < currSticker.y + currSticker.height + MARGIN) {
            selectedStickerIdx = i;
            break;
        }
    }
    setSelectedLine(selectedLineIdx);
    setSelectedSticker(selectedStickerIdx);
    if (!isNaN(selectedLineIdx)) gIsDrag = true
    else gIsDrag = false;
    draw();
}

function onUp(ev) {
    gIsDrag = false;
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function onLoadMeme(memeId) {
    loadMeme(memeId);
    updateText();
    draw();
}

function onResize() {
    resizeCanvas();
    draw();
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    let vmin = Math.min(elContainer.offsetWidth, elContainer.offsetHeight)
    if (vmin < 550) vmin = elContainer.offsetWidth;
    gElCanvas.width = vmin;
    gElCanvas.height = vmin;
}

function updateText() {
    if(!getSelectedLine()) return;
    document.querySelector('[name=txt]').value = getSelectedLine().txt;
}

function onTextChange(txt) {
    if (!getSelectedLine()) return;
    setLineText(txt);
    draw();
}

function onChangeTextFromKeyup(ev) {
    if (!getSelectedLine() || gTextFocus) return;
    var elInput = document.querySelector('[name=txt]');
    if (ev.key === 'Backspace') {
        elInput.value = elInput.value.substr(0, elInput.value.length - 1);
    } else if (ev.which <= 90 && ev.which >= 48 || ev.which === 32) elInput.value += ev.key;
    onTextChange(elInput.value);
}

function onTextFocus() {
    gTextFocus = true;
}

function onTextBlur() {
    gTextFocus = false
}

function onChangeLine() {
    changeSelectedLineIdx();
    if (!getSelectedLine()) return;
    setSelectedSticker(null);
    updateText();
    draw();
}

function onAddTxt() {
    const text = document.querySelector('[name=txt]').value
    const textStrokeColor = document.querySelector('[name=text-stroke]').value;
    const textColor = document.querySelector('[name=text-color]').value;
    const textFont = document.querySelector('[name=font').value;
    addTxt(text, gElCanvas.width, gElCanvas.height, textStrokeColor, textColor, textFont);
    setSelectedSticker(null);
    draw();
}

function onRemove() {
    remove();
    draw();
}

function onChangeFontSize(diff) {
    if (!getSelectedLine()) return;
    changeFontSize(diff);
    draw();
}

function onSetAlign(alignOption) {
    if (!getSelectedLine()) return;
    setLineAlign(alignOption);
    draw();
}

function onSetFont(fontOption) {
    setFont(fontOption);
    if (!getSelectedLine()) return;
    draw();
}

function onStrokeColorChange(colorValue) {
    if (!getSelectedLine()) return;
    setLineStrokeColor(colorValue);
    draw();
}

function onTextColorChange(colorValue) {
    if (!getSelectedLine()) return;
    setLineTextColor(colorValue);
    draw();
}

function onSave() {
    const id = addMeme(getMeme(), gLatestSnapshootImg);
    setMemeId(id);
    renderMemes();
    onShowModal('save');
}

function onShare() {
    onShowModal('share');
    uploadImg(gLatestSnapshootImg);
}

function onDownloadCanvas(elLink) {
    const data = gLatestSnapshootImg;
    elLink.href = data;
}

function draw() {
    renderImg(getImgSrcById(getSelectedImgId()), () => {
        const meme = getMeme();
        meme.lines.forEach((line, idx) =>
            drawText(idx, line.txt, line.x, line.y, line.strokeColor, line.color, line.font, line.size, line.align)
        );
        meme.stickers.forEach(sticker => renderSticker(sticker));
        // if i want to save the meme i need to hide the rect around the text, and after i save i return the rect.
        // so i save "lastest snapshoot" to use when save or download or share
        // i allso need to delay the rects draw & the snapshoot so i push it the the end of the callstack so the draw will be after the sticker is renderd 
        gLatestSnapshootImg = gElCanvas.toDataURL();
        setTimeout(() => {
            drawLineSelectedRect();
            drawSelectedStickerRect();
        },0);
    });
}

function drawLineSelectedRect() {
    var currLine = getSelectedLine();
    if (!currLine) return;
    let lineX1;
    switch (currLine.align) {
        case 'right':
            lineX1 = currLine.x - currLine.width - MARGIN;
            break;
        case 'left':
            lineX1 = currLine.x - MARGIN
            break;
        default:
            lineX1 = currLine.x - currLine.width / 2 - MARGIN;
    }
    let lineX2 = currLine.width + MARGIN * 2;
    let lineY1 = currLine.y - currLine.size - MARGIN / 4;
    let lineY2 = currLine.size + MARGIN;
    drawRect(lineX1, lineY1, lineX2, lineY2);
}

function drawSelectedStickerRect() {
    const currSticker = getSelectedSticker();
    if (!currSticker) return;
    drawRect(currSticker.x - MARGIN, currSticker.y - MARGIN, currSticker.width + MARGIN * 2, currSticker.height + MARGIN * 2);
}

function renderImg(img, callback = null) {
    const image = new Image();
    image.onload = function () {
        const wrh = image.width / image.height;
        let newWidth = gElCanvas.width;
        let newHeight = newWidth / wrh;
        if (newHeight > gElCanvas.height) {
            newHeight = gElCanvas.height;
            newWidth = newHeight * wrh;
        }
        gCtx.drawImage(image, 0, 0, newWidth, newHeight);
        if (callback) callback();
    };
    image.src = img;
}

function renderSticker(sticker, callback = null) {
    const image = new Image();
    const stickerImage = sticker.url;
    let stickerX;
    let stickerY;
    let stickerWidth;
    let stickerHeight;
    image.onload = function () {
        if (callback) {
            stickerX = gElCanvas.width / 2 - image.width / 2;
            stickerY = gElCanvas.height / 2 - image.height / 2;
            stickerWidth = image.width;
            stickerHeight = image.height;
            callback(sticker.url, stickerX, stickerY, stickerWidth, stickerHeight);
        } else {
            stickerX = sticker.x;
            stickerY = sticker.y;
            stickerWidth = sticker.width;
            stickerHeight = sticker.height;
        }
        gCtx.drawImage(image, stickerX, stickerY, image.width, image.height);
        gLatestSnapshootImg = gElCanvas.toDataURL();
    };
    image.src = stickerImage;
}

function drawText(lineIdx, txt, x, y, strokeColor, color, font, size, align) {
    gCtx.save();
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = align;
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);
    setLineWidth(lineIdx, gCtx.measureText(txt).width);
    gCtx.restore();
}

function drawRect(x, y, x1, y1, borderColor = '#00ff00') {
    gCtx.save();
    gCtx.beginPath();
    gCtx.rect(x, y, x1, y1);
    gCtx.strokeStyle = borderColor;
    gCtx.stroke();
    gCtx.restore();
}
