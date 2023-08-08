export interface Title {
    he?: string;
    en: string;
}

export interface BookInfo {
    slug: string;
    title: Title;
}

/** A link provided by Sefaria's link API. Used for commentary and other references */
export interface Link {
    /** ??Where the link is linked from?? */
    anchorRef: string; // "Rosh Hashanah 2a:1"
    /** ??When same link is linked from multiple places?? */
    anchorRefExpanded: string[];
    anchorVerse: number; // 12,
    /** "Commentary", "Chasidut", "Mishnah", "Responsa" */
    category: string; // "Commentary",
    /** Overal name of the work, in Hebrew and English. "Rashi", "תוספות" */
    collectiveTitle: Title;

    /** I think this is used to sort e.g. when there are multiple Rashis on the same line.  */
    commentaryNum: number; // 1.0001,
    // compDate: number;
    // errorMargin: number;
    /** Text of the link, in Hebrew */
    he: string; // "<b>וכאשר יענו אתו.</b> בכל מה שהם נותנין לב לענות, כן לב הקדוש ברוך הוא להרבות ולהפריץ: "
    heTitle: string; // "רש\"י על שמות",
    // "heVersionTitle": "Vilna Edition",
    // "heLicense": "Public Domain",
    // "heVersionTitleInHebrew": "מהדורת וילנא",
    ref: string; //"Rashi on Exodus 1.12.1",
    sourceRef: string; // "Rashi on Exodus 1:12:1",
    /** Text of the link, in English */
    text: string; // "In any way in which they deigned to oppress, that was where the heart of the Holy Blessed One [saw fit to] increase and spread out.",
    // "_id": string; // "5234a6adedbab465c9549b14",
     /** Seems like "type" might have been replaced by "category". Type is often blank, and sometimes "commentary" */
    type: string;
}

export type LinkMap = Map<string, Link[]>
