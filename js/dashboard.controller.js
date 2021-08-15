'use strict'

const MARGIN = 20;
const SIZING_CIRCLE_RADIUS = 10;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
let gElCanvas;
let gCtx;
let gIsDrag;
let gLatestSnapshootImg;
let gStartPos;
let gSelectedStickerId;
let gTextFocus = false;
let gSizingCircleSelected = false;

function onDashboardInit(selectedImgId, memeId = null) {
    initDashboard(selectedImgId);
    renderStickers();
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    gSelectedStickerId = null;
    gTextFocus = false;
    gSizingCircleSelected = false;
    resizeCanvas();
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', onResize);
    if (!memeId) {
        draw();
        document.querySelector('[name=txt]').value = '';
    } else onLoadMeme(memeId);
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
    draw();
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
    const pos = getEvPos(ev);
    setCursorType(pos);
    if (!gIsDrag || !getSelectedLine() && !getSelectedSticker()) return;
    const dx = pos.x - gStartPos.x;
    const dy = pos.y - gStartPos.y;
    if (gSizingCircleSelected) {
        resize(dx, dy);
    } else move(dx, dy);
    gStartPos = pos;
    draw();
}

function setCursorType(pos) {
    if ((getSelectedLine() || getSelectedSticker()) && isMouseOnCircle(pos)) {
        gElCanvas.style.cursor = 'nwse-resize';
    } else if (gIsDrag && (getSelectedLine() && getSelectedLine().id === getMouseOnLineId(pos) || (getSelectedSticker() && getSelectedSticker().id === getMouseOnStickerId(pos)))) {
        gElCanvas.style.cursor = 'grabbing';
    } else if (!gIsDrag && (getSelectedLine() && getSelectedLine().id === getMouseOnLineId(pos) || (getSelectedSticker() && getSelectedSticker().id === getMouseOnStickerId(pos)))) {
        gElCanvas.style.cursor = 'grab';
    } else if (!gIsDrag && (getMouseOnLineId(pos) || getMouseOnStickerId(pos))) {
        gElCanvas.style.cursor = 'pointer';
    } else {
        gElCanvas.style.cursor = 'unset';
    }
}

function onDown(ev) {
    ev.preventDefault();
    gStartPos = getEvPos(ev);
    if (isMouseOnCircle(gStartPos) && (getSelectedLine() || getSelectedSticker())) {
        gSizingCircleSelected = true;
        gIsDrag = true;
    }
    else {
        const clickedLineId = getMouseOnLineId(gStartPos)
        const clickedStickerId = getMouseOnStickerId(gStartPos);
        if (clickedLineId) {
            setSelectedLine(clickedLineId);
            setSelectedSticker(null)
            updateText();
            gIsDrag = true;
            draw();
            return;
        } else if(clickedStickerId){
            if (clickedStickerId) {
                setSelectedSticker(clickedStickerId);
                setSelectedLine(null);
                document.querySelector('[name=txt]').value = '';
                gIsDrag = true;
                draw();
                return
            }
        } else if(getSelectedLine() || getSelectedSticker()) {
            setSelectedSticker(null);
            setSelectedLine(null);
            document.querySelector('[name=txt]').value = '';
            draw();
        }
    }
}

function onUp(ev) {
    gIsDrag = false;
    gSizingCircleSelected = false;
}


function isMouseOnCircle(clickedPos) {
    const selectedSticker = getSelectedSticker();
    const selectedLine = getSelectedLine();
    let circleX;
    let circleY;
    if (selectedLine || selectedSticker) {
        if (selectedSticker) {
            circleX = selectedSticker.x + selectedSticker.width + MARGIN;
            circleY = selectedSticker.y + selectedSticker.height + MARGIN;
        } else {
            circleY = selectedLine.y + MARGIN;
            circleX = getSelectedLineX() + selectedLine.width + MARGIN * 2;
        }
        let distance = Math.sqrt((circleX - clickedPos.x) ** 2 + (circleY - clickedPos.y) ** 2);
        return distance <= SIZING_CIRCLE_RADIUS;
    }
    return null;
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
    if (getSelectedLine()) updateText();
    else document.querySelector('[name=txt]').value = '';
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
    if (!getSelectedLine()) return;
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
    if (!getSelectedLine() && !getSelectedSticker()) return;
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
    draw(save);
}

function save() {
    const id = addMeme(getMeme(), gLatestSnapshootImg);
    setMemeId(id);
    renderMemes();
    onShowModal('save');
    // restore rect around selected text / sticker
    drawLineSelectedRect();
    drawSelectedStickerRect();
    drawSizingCircle();
}

function onShare() {
    draw(share)
}

function share() {
    onShowModal('share');
    uploadImg(gLatestSnapshootImg);
    // restore rect around selected text / sticker
    drawLineSelectedRect();
    drawSelectedStickerRect();
    drawSizingCircle();
}

function onDownloadCanvas(elLink) {
    const data = gLatestSnapshootImg;
    elLink.href = data;
}

function draw(shareSaveCallback) {
    renderImg(getImgSrcById(getSelectedImgId()), () => {
        const meme = getMeme();
        meme.lines.forEach((line, idx) =>
            drawText(idx, line.txt, line.x, line.y, line.strokeColor, line.color, line.font, line.size, line.align)
        );
        meme.stickers.forEach((sticker, idx) => {
            if (idx === meme.stickers.length - 1) {
                // if the sticker is last i want to save, if its not last so dont save yet
                renderSticker(sticker, null, shareSaveCallback);
            } else {
                renderSticker(sticker)
            }
        });
        // if i want to save the meme i need to hide the rect around the text, and after i save i return the rect. (in save function)
        if (!shareSaveCallback) {
            drawLineSelectedRect();
            drawSelectedStickerRect();
            drawSizingCircle();
        }
        // if there are no sticker call the save / share function (if there are stickers the callback is called from renderStickr()
        if (!meme.stickers.length && shareSaveCallback) {
            gLatestSnapshootImg = gElCanvas.toDataURL();
            shareSaveCallback();
        }
    });
}

function drawLineSelectedRect() {
    var currLine = getSelectedLine();
    if (!currLine) return;
    let lineX1 = getSelectedLineX();
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

function drawSizingCircle() {
    let selectedLine = getSelectedLine();
    let selectedSticker = getSelectedSticker();
    if (selectedSticker) {
        drawArc(selectedSticker.x + selectedSticker.width + MARGIN, selectedSticker.y + selectedSticker.height + MARGIN);
    } else if (selectedLine) {
        let currLineX = getSelectedLineX();
        drawArc(currLineX + selectedLine.width + MARGIN * 2, selectedLine.y + MARGIN);
    }
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

function renderSticker(sticker, onLoadCallback = null, shareSaveCallback) {
    const image = new Image();
    const stickerImage = sticker.url;
    let stickerX;
    let stickerY;
    let stickerWidth;
    let stickerHeight;
    image.onload = function () {
        if (onLoadCallback) {
            stickerX = gElCanvas.width / 2 - image.width / 2;
            stickerY = gElCanvas.height / 2 - image.height / 2;
            stickerWidth = image.width;
            stickerHeight = image.height;
            onLoadCallback(sticker.url, stickerX, stickerY, stickerWidth, stickerHeight);
        } else {
            stickerX = sticker.x;
            stickerY = sticker.y;
            stickerWidth = sticker.width;
            stickerHeight = sticker.height;
        }
        gCtx.drawImage(image, stickerX, stickerY, stickerWidth, stickerHeight);
        if (shareSaveCallback) {
            gLatestSnapshootImg = gElCanvas.toDataURL();
            shareSaveCallback();
        }
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

function drawArc(x, y, size = SIZING_CIRCLE_RADIUS, color = 'blue') {
    gCtx.save();
    gCtx.beginPath();
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, size, 0, 2 * Math.PI);
    gCtx.strokeStyle = 'white';
    gCtx.stroke();
    gCtx.fillStyle = color;
    gCtx.fill();
    gCtx.restore();
}
