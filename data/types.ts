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
    /** Text of the link, in Hebrew. If multiple verses are selected, will be an array instead of a string. */
    he: string | string[]; // "<b>וכאשר יענו אתו.</b> בכל מה שהם נותנין לב לענות, כן לב הקדוש ברוך הוא להרבות ולהפריץ: "
    heTitle: string; // "רש\"י על שמות",
    // "heVersionTitle": "Vilna Edition",
    // "heLicense": "Public Domain",
    // "heVersionTitleInHebrew": "מהדורת וילנא",
    ref: string; //"Rashi on Exodus 1.12.1",
    sourceRef: string; // "Rashi on Exodus 1:12:1",
    /** Text of the link, in English. If multiple verses are selected, will be an array instead of a string. */
    text: string | string[]; // "In any way in which they deigned to oppress, that was where the heart of the Holy Blessed One [saw fit to] increase and spread out.",
    // "_id": string; // "5234a6adedbab465c9549b14",
     /** Seems like "type" might have been replaced by "category". Type is often blank, and sometimes "commentary" */
    type: string;
}

export type LinkMap = Map<string, Link[]>

// *******************************************************************************************************
// Book index and its related types.  Limiting to just what we are using, rather than all the fields Sefaria provides.
// *******************************************************************************************************

//** Useful in generating a table of contents, though BookIndexAlts might be preferable if it exists */
export interface BookIndexSchema {
    /** First element in sectionNames might be "Chapter". TOC can use this for a heading */
    sectionNames: string[];
    /** length of _lengths_ corresponds with length of _sectionNames_.
     * If sectionNames[0] is 'Chapter', then lengths[0] will be the total number of chapters.
     */
    lengths: number[];
}

/** An individual unit (commonly, a chapter for Gemara, or a parasha for Chumash) and references to its contents */
export interface BookIndexNode {
    /** Primary title in English. E.g. "Chapter 2" [for Gemara]. "Lech Lecha" [for Chumash] */
    title: string;
    /** primary title in Hebrew */
    heTitle: string;
    /** A list of text references. 
     * For Gemara, each one is an amud (or at the beginning or end of a chapter, a specified part of an amud). 
     * For Chumash, each is a range of chapters and verses for an aliya
    */
    refs: string[]
}

interface BookIndexAlts {
    [unitName: string]: {
        nodes: BookIndexNode[];
    }
}

export interface BookIndex {
    title: string;
    heTitle: string;
    schema: BookIndexSchema;
    alts?: BookIndexAlts;
}

