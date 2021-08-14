var gTrans = {
    language: {
        en: 'Language',
        he: 'שפה'
    },
    gallery: {
        en: 'Gallery',
        he: 'גלריה'
    },
    memes: {
        en: 'Memes',
        he: 'ממים',
    },
    about: {
        en: 'About',
        he: 'אודות'
    },
    searchPlaceholder: {
        en: 'Enter search keyword',
        he: 'הזן מילת חיפוש'
    },
    upload: {
        en: 'Upload from your computer',
        he: 'העלה תמונה מהמחשב'
    },
    monica: {
        en: 'Monica Geller',
        he: 'מוניקה גלר'
    },
    'monica-text': {
        en: 'is a fictional character, one of the six main characters who appears on the American sitcom Friends (1994–2004). Created by David Crane and Marta Kauffman',
        he: 'היא דמות בדיונית, אחת מששת הדמויות הראשיות המופיע בסיטקום האמריקאי חברים (1994–2004). נוצר על ידי דיוויד קריין ומרתה קאופמן'
    },
    save: {
        en: 'Save',
        he: 'שמור'
    },
    share: {
        en: 'Share',
        he: 'שתף'
    },
    remove: {
        en: 'Remove',
        he: 'מחק'
    },
    edit: {
        en: 'Edit',
        he: 'ערוך'
    },
    download: {
        en: 'Download',
        he: 'הורד'
    },
    'dont-have-memes': {
        en: 'You didn`t saved any memes yet',
        he: 'לא שמרת ממים עדיין'
    },
    'made-by': {
        en: 'Made By Shahar Meshulam',
        he: 'נוצר ע"י שחר משולם'
    },
    rights: {
        en: 'all rights reserved 2019',
        he: 'כל הזכויות שמורות 2019'
    },
    cats:{
        en: 'cats',
        he: 'חתולים'
    },
    dogs:{
        en: 'dogs',
        he: 'כלבים'
    },
    animals:{
        en: 'animals',
        he: 'חיות'
    },
    people:{
        en: 'people',
        he: 'אנשים'
    },
    politics:{
        en: 'politics',
        he: 'פוליטיקה'
    },
    cute:{
        en: 'cute',
        he: 'חמוד'
    },
    celebrity:{
        en: 'celebrity',
        he: 'מפורסמים'
    },
    babies:{
        en: 'babies',
        he: 'תינוקות'
    },
    sport:{
        en: 'sport',
        he: 'ספורט'
    }, 
    funny:{
        en: 'funny',
        he: 'מצחיק'
    },
    'more...': {
        en: 'more...',
        he: 'עוד...'
    },
    'less...': {
        en: 'less...',
        he: 'פחות...'
    }
}
var gLang = 'en';

function getTrans(transKey) {
    var keyTrans = gTrans[transKey];
    if (!keyTrans) return 'UNKNOWN';
    return keyTrans[gLang] || keyTrans['en'];
}

function setLang(lang) {
    gLang = lang;
}

function getCurrency() {
    return gCurrency[gLang];
}