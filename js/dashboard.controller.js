'use strict'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
const MARGIN = 20;
let gElCanvas;
let gCtx;
let gIsDrag;
let gLastEditWithoutRect;

function onDashboardInit(selectedImgId, memeId = null) {
    initDashboard(selectedImgId);
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', onResize);
    if (!memeId) draw();
    else onLoadMeme(memeId);
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
    const dx = pos.x;
    const dy = pos.y;
    moveLine(dx, dy);
    draw();
}

function onDown(ev) {
    ev.preventDefault();
    const { x, y } = getEvPos(ev);
    const lines = getLines();
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
        let currLineX2 = currLineX1 + currLine.width + MARGIN + MARGIN;
        let currLineY1 = currLine.y - currLine.size - MARGIN / 4;;
        let currLineY2 = currLineY1 + currLine.size + MARGIN
        if (x > currLineX1 && x < currLineX2 && y > currLineY1 && y < currLineY2) {
            selectedLineIdx = i;
            break;
        }
    }
    setSelectedLine(selectedLineIdx);
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
    document.querySelector('[name=txt]').value = getSelectedLine().txt;
}

function onTextChange(txt) {
    if (!getSelectedLine()) return;
    setLineText(txt);
    draw();
}

function onChangeTextFromKeyup(ev) {
    if (!getSelectedLine()) return;
    var elInput = document.querySelector('[name=txt]');
    if (ev.key === 'Backspace') {
        elInput.value = elInput.value.substr(0, elInput.value.length - 1);
    } else if (ev.which <= 90 && ev.which >= 48 || ev.which === 32) elInput.value += ev.key;
    onTextChange(elInput.value);
}

function onChangeLine() {
    changeSelectedLineIdx();
    if (!getSelectedLine()) return;
    updateText();
    draw();
}

function onAddTxt() {
    const text = document.querySelector('[name=txt]').value
    const textStrokeColor = document.querySelector('[name=text-stroke]').value;
    const textColor = document.querySelector('[name=text-color]').value;
    const textFont = document.querySelector('[name=font').value;
    addTxt(text, gElCanvas.width, gElCanvas.height, textStrokeColor, textColor, textFont);
    draw();
}

function onRemoveLine() {
    removeLine();
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
    const id = addMeme(getMeme(), gLastEditWithoutRect);
    setMemeId(id);
    renderMemes();
    onShowModal('save');
}

function onShare() {
    onShowModal('share');
    uploadImg(gElCanvas);
}

function onDownloadCanvas(elLink) {
    const data = gLastEditWithoutRect;
    elLink.href = data;
}

function draw() {
    renderImg(getImgSrcById(getSelectedImgId()), () => {
        const lines = getLines();
        lines.forEach((line, idx) => {
            drawText(idx, line.txt, line.x, line.y, line.strokeColor, line.color, line.font, line.size, line.align)
        });
        // if i want to save the meme i need to hide the rect around the text, and after i save i return the rect.
        // so i save "last edit" to use when save or download
        gLastEditWithoutRect = gElCanvas.toDataURL();
        drawLineSelectedRect();
    });
}

function drawLineSelectedRect() {
    var currLine = getSelectedLine();
    if (!currLine) return;
    let lineX1;
    switch (currLine.align) {
        case 'right':
            lineX1 = currLine.x - currLine.width - MARGIN;
            // drawRect(currLine.x - currLine.width - MARGIN, currLine.y - currLine.size - MARGIN / 4, currLine.width + MARGIN + MARGIN, currLine.size + MARGIN);
            break;
        case 'left':
            lineX1 = currLine.x - MARGIN
            // drawRect(currLine.x - MARGIN, currLine.y - currLine.size - MARGIN / 4, currLine.width + MARGIN + MARGIN, currLine.size + MARGIN);
            break;
        default:
            lineX1 = currLine.x - currLine.width / 2 - MARGIN;
        // drawRect(currLine.x - currLine.width / 2 - MARGIN, currLine.y - currLine.size - MARGIN / 4, currLine.width + MARGIN + MARGIN, currLine.size + MARGIN);
    }
    let lineX2 = currLine.width + MARGIN + MARGIN;
    let lineY1 = currLine.y - currLine.size - MARGIN / 4;
    let lineY2 = currLine.size + MARGIN;
    drawRect(lineX1, lineY1, lineX2, lineY2);
}

function renderImg(img, callback = null) {
    var image = new Image();
    image.onload = function () {
        gCtx.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height);
        if (callback) callback();
    };
    image.src = img;
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
