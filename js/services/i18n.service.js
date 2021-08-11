var gTrans = {
    welcome: {
        en: 'Welcome to my bookshop',
        he: 'ברוכים הבאים לחנות הספרים שלי'
    },
    language: {
        en: 'language',
        he: 'שפה'
    },
    'log-out': {
        en: 'Log Out',
        he: 'התנתק'
    },
    'create-new-book': {
        en: 'Create new book',
        he: 'צור ספר חדש'
    },
    'filter-by-title': {
        en: 'Filter By Title',
        he: 'סינון לפי כותרת'
    },
    id: {
        en: 'Id',
        he: 'מספר זיהוי'
    },
    title: {
        en: 'Title',
        he: 'כותרת'
    },
    price: {
        en: 'Price',
        he: 'מחיר'
    },
    actions: {
        en: 'Actions',
        he: 'פעולות'
    },
    rate: {
        en: 'rate',
        he: 'ניקוד'
    },
    'img-url': {
        en: 'Image Url',
        he: 'נתיב תמונה'
    },
    read: {
        en: 'read',
        he: 'קרא'
    },
    update: {
        en: 'Update',
        he: 'עדכן'
    },
    delete: {
        en: 'Delete',
        he: 'מחק'
    },
    'add-book': {
        en: 'Add Book',
        he: 'צור ספר'
    },
    close: {
        en: 'Close',
        he: 'סגור'
    },
    back: {
        en: 'back',
        he: 'אחורה'
    },
    next: {
        en: 'next',
        he: 'הבא'
    }
}
var gLang = 'en';
gCurrency = {
    en: {
        lang: 'en-EN',
        currency: 'USD'
    },
    he: {
        lang: 'he-HE',
        currency: 'ILS'
    }
}

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