'use strict'
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
const MARGIN = 20;
let gElCanvas;
let gCtx;

function onDashboardInit(selectedImgId) {
    initDashboard(selectedImgId);
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    renderImg(getImgSrcById(selectedImgId));
    addMouseListeners();
    addTouchListeners();
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

}

function onDown(ev) {
    ev.preventDefault();
    const { x, y } = getEvPos(ev);
    var currLine = getSelectedLine();
    // const lineWidth = currLine.width;
    // const size = currLine.size;
    drawRect(currLine.x - currLine.width / 2 - MARGIN, currLine.y - currLine.size - MARGIN / 4, currLine.width + MARGIN + MARGIN, currLine.size + MARGIN);
}

function onUp(ev) {

}

function getEvPos(ev) {
    var pos = {
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

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth - 20;
    gElCanvas.height = gElCanvas.width
}

function onTextChange(txt) {
    if (!getSelectedLine()) return;
    setLineText(txt);
    draw();
}

function onChangeLine() {
    if (!getSelectedLine()) return;
    changeSelectedLineIdx();
    const currLine = getSelectedLine();

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

function draw() {
    renderImg(getImgSrcById(getSelectedImgId()), () => {
        const lines = getLines();
        lines.forEach((line, idx) => {
            drawText(idx, line.txt, line.x, line.y, line.strokeColor, line.color, line.font, line.size)
        });
        drawLineSelectedRect();
    });
}

function drawLineSelectedRect() {
    var currLine = getSelectedLine();
    if (!currLine) return;
    drawRect(currLine.x - currLine.width / 2 - MARGIN, currLine.y - currLine.size - MARGIN / 4, currLine.width + MARGIN + MARGIN, currLine.size + MARGIN);
}

function renderImg(img, callback = null) {
    var image = new Image();
    image.onload = function () {
        gCtx.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height);
        if (callback) callback();
    };
    image.src = img;
}

function drawText(lineIdx, txt, x, y, strokeColor, color, font, size) {
    gCtx.save();
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = "center";
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