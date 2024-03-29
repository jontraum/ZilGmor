import { BookInfo, BookSet } from './types'

export const tanach: BookInfo[] = [
  // Torah
  { title: { he: 'בְּרֵאשִׁית', en: 'Genesis'}, slug: 'Genesis'},
  { title: { he: 'שְׁמֹות', en: 'Exodus'}, slug: 'Exodus'},
  { title: { he: 'וַיִּקְרָא', en: 'Leviticus'}, slug: 'Leviticus'},
  { title: { he: 'בְּמִדְבַּר', en: 'Numbers'}, slug: 'Numbers'},
  { title: { he: 'דְּבָרִים', en: 'Deuteronomy'}, slug: 'Deuteronomy'},
  // Neviim
  { title: { he: 'יְהוֹשֻעַ', en: 'Joshua'}, slug: 'Joshua'},
  { title: { he: 'שֹׁפְטִים', en: 'Judges'}, slug: 'Judges'},
  { title: { he: 'שְׁמוּאֵל א', en: 'I Samuel'}, slug: 'I Samuel'},
  { title: { he: 'שְׁמוּאֵל ב', en: 'II Samuel'}, slug: 'II Samuel'},
  { title: { he: 'מְלָכִים א', en: 'I Kings'}, slug: 'I Kings'},
  { title: { he: 'מְלָכִים ב', en: 'II Kings'}, slug: 'II Kings'},
  { title: { he: 'יִרְמְיָהוּ', en: 'Jeremiah'}, slug: 'Jeremiah'},
  { title: { he: 'יְחֶזְקֵאל', en: 'Ezekiel'}, slug: 'Ezekiel'},
  { title: { he: 'יְשַׁעְיָהוּ', en: 'Isaiah'}, slug: 'Isaiah'},
  { title: { he: 'הוֹשֵׁעַ', en: 'Hosea'}, slug: 'Hosea'},
  { title: { he: 'יוֹאֵל', en: 'Joel'}, slug: 'Joel'},
  { title: { he: 'עָמוֹס', en: 'Amos'}, slug: 'Amos'},
  { title: { he: 'עֹבַדְיָה', en: 'Obadiah'}, slug: 'Obadiah'},
  { title: { he: 'יוֹנָה', en: 'Jonah'}, slug: 'Jonah'},
  { title: { he: 'מִיכָה', en: 'Micah'}, slug: 'Micah'},
  { title: { he: 'נַחוּם', en: 'Nahum'}, slug: 'Nahum'},
  { title: { he: 'חֲבַקּוּק', en: 'Habakkuk'}, slug: 'Habakkuk'},
  { title: { he: 'צְפַנְיָה', en: 'Zephaniah'}, slug: 'Zephaniah'},
  { title: { he: 'חַגַּי', en: 'Haggai'}, slug: 'Haggai'},
  { title: { he: 'זְכַרְיָה', en: 'Zechariah'}, slug: 'Zechariah'},
  { title: { he: 'מַלְאָכִי', en: 'Malachi'}, slug: 'Malachi'},
  // Ketuvim
  { title: { he: 'תְהִלִּים', en: 'Psalms'}, slug: 'Psalms'},
  { title: { he: 'מִשְלֵי', en: 'Proverbs'}, slug: 'Proverbs'},
  { title: { he: 'אִיּוֹב', en: 'Job'}, slug: 'Job'},
  
  { title: { he: 'שִׁיר הַשִׁירִים', en: 'Song of Songs'}, slug: 'Song of Songs'},
  { title: { he: 'רוּת', en: 'Ruth'}, slug: 'Ruth'},
  { title: { he: 'איכה', en: 'Lamentations'}, slug: 'Lamentations'},
  { title: { he: 'קהלת', en: 'Ecclesiastes'}, slug: 'Ecclesiastes'},
  { title: { he: 'אֶסְתֵר', en: 'Esther'}, slug: 'Esther'},
  
  { title: { he: 'דָּנִיֵּאל', en: 'Daniel'}, slug: 'Daniel'},
  { title: { he: 'עֶזְרָא', en: 'Ezrah'}, slug: 'Ezrah'},
  { title: { he: 'נְחֶמְיָה', en: 'Nehemia'}, slug: 'Nehemiah'},
  { title: { he: 'דברי הימים א', en: 'I Chronicles'}, slug: 'I Chronicles'},
  { title: { he: 'דברי הימים ב', en: 'II Chronicles'}, slug: 'II Chronicles'},
  // { title: { he: '', en: ''}, slug: ''},
]

export const tanachMap = {}
tanach.forEach(book => tanachMap[book.slug] = book)
export function isTanach(slug: string):boolean {
  return !!tanachMap[slug]
}

export const mishnah: BookInfo[] = [
  // סדר זרעים
  { title: { he: 'ברכות', en: 'Berakhot' }, slug: 'Mishnah Berakhot' },
  { title: { he: 'פאה', en: 'Peah' }, slug: 'Mishnah Peah' },
  { title: { he: 'דמאי', en: 'Demai' }, slug: 'Mishnah Demai' },
  { title: { he: 'כלאים', en: 'Kilayim' }, slug: 'Mishnah Kilayim' },
  { title: { he: 'שביעית', en: 'Sheviit' }, slug: 'Mishnah Sheviit' },
  { title: { he: 'תרומות', en: 'Terumot' }, slug: 'Mishnah Terumot' },
  { title: { he: 'מעשרות', en: 'Maasrot' }, slug: 'Mishnah Maasrot' },
  { title: { he: 'מעשר שני', en: 'Maaser Sheni' }, slug: 'Mishnah Maaser Sheni' },
  { title: { he: 'חלה', en: 'Challah' }, slug: 'Mishnah Challah' },
  { title: { he: 'ערלה', en: 'Orlah' }, slug: 'Mishnah Orlah' },
  { title: { he: 'ביכורים', en: 'Bikkurim' }, slug: 'Mishnah Bikkurim' },
  // Seder Moed
  {
    title: {
      he: 'שבת',
      en: 'Shabbat',
    },
    slug: 'Mishnah Shabbat',
  },
  { title: { he: 'עירובין', en: 'Eruvin' }, slug: 'Mishnah Eruvin' },
  { title: { he: 'פסחים', en: 'Pesachim' }, slug: 'Mishnah Pesachim' },
  { title: { he: 'שקלימ', en: 'Shekalim' }, slug: 'Mishnah Shekalim' },
  { title: { he: 'יומא', en: 'Yoma' }, slug: 'Mishnah Yoma' },
  { title: { he: 'סוכה', en: 'Sukkah' }, slug: 'Mishnah Sukkah' },
  { title: { he: 'ביצה', en: 'Beitza' }, slug: 'Mishnah Beitzah' },
  {
    title: {
      he: 'ראש השנה',
      en: 'Rosh Hashana',
    },
    slug: 'Mishnah Rosh Hashanah',
  },
  { title: { he: 'תענית', en: 'Ta\'anit' }, slug: 'Mishnah Taanit' },
  { title: { he: 'מגילה', en: 'Megillah' }, slug: 'Mishnah Megillah' },
  { title: { he: 'מועד קטן', en: 'Mo\'ed Katan' }, slug: 'Mishnah Moed Katan' },
  { title: { he: 'חגיגה', en: 'Chagigah' }, slug: 'Mishnah Chagigah' },
  // Nashim
  { title: { he: 'יבמות', en: 'Yevamot' }, slug: 'Mishnah Yevamot' },
  { title: { he: 'כתובות',en: 'Ketubot' }, slug: 'Mishnah Ketubot' },
  { title: { he: 'נדרים', en: 'Nedarim' }, slug: 'Mishnah Nedarim' },
  { title: { he: 'נזיר', en: 'Nazir' }, slug: 'Mishnah Nazir' },
  { title: { he: 'סוטה', en: 'Sotah' }, slug: 'Mishnah Sotah' },
  { title: { he: 'גיטין', en: 'Gittin' }, slug: 'Mishnah Gittin' },
  { title: { he: 'קידושין', en: 'Kiddushin' }, slug: 'Mishnah Kiddushin' },
  // סדר נזיקין:
  { title: { he: 'בבא קמא', en: 'Bava Kamma'}, slug: 'Mishnah Bava Kamma'},
  { title: { he: 'בבא מציעא', en: 'Bava Metzia'}, slug: 'Mishnah Bava Metzia'},
  { title: { he: 'בבא בתרא', en: 'Bava Batra'}, slug: 'Mishnah Bava Batra'},
  { title: { he: 'סנהדרין', en: 'Sanhedrin'}, slug: 'Mishnah Sanhedrin'},
  { title: { he: 'מכות', en: 'Makkot'}, slug: 'Mishnah Makkot'},
  { title: { he: 'שבועות', en: 'Shevuot'}, slug: 'Mishnah Shevuot'},
  { title: { he: 'עדיות', en: 'Eduyot' }, slug: 'Mishnah Eduyot' },
  { title: { he: 'עבודה זרה', en: 'Avodah Zarah'}, slug: 'Mishnah Avodah Zarah'},
  { title: { he: 'אבות', en: 'Pirkei Avot' }, slug: 'Pirkei Avot' },
  { title: { he: 'הוריות', en: 'Horayot'}, slug: 'Mishnah Horayot'},
  // סדר קודשים
  { title: { he: 'זבחים', en: 'Zevachim'}, slug: 'Mishnah Zevachim'},
  { title: { he: 'מנחות', en: 'Menachot'}, slug: 'Mishnah Menachot'},
  { title: { he: 'חולין', en: 'Chullin'}, slug: 'Mishnah Chullin'},
  { title: { he: 'בכורות', en: 'Bekhorot'}, slug: 'Mishnah Bekhorot'},
  { title: { he: 'ערכין', en: 'Arakhin'}, slug: 'Mishnah Arakhin'},
  { title: { he: 'תמורה', en: 'Temurah'}, slug: 'Mishnah Temurah'},
  { title: { he: 'כריתות', en: 'Keritot'}, slug: 'Mishnah Keritot'},
  { title: { he: 'מעילה', en: 'Meilah'}, slug: 'Mishnah Meilah'},
  { title: { he: 'תמיד', en: 'Tamid'}, slug: 'Mishnah Tamid'},
  { title: { he: 'מדות', en: 'Middot' }, slug: 'Mishnah Middot' },
  { title: { he: 'קינים', en: 'Kinnim' }, slug: 'Mishnah Kinnim' },
  //   סדר טהרות
  { title: { he: 'כלים', en: 'Kelim' }, slug: 'Mishnah Kelim' },
  { title: { he: 'אהלות', en: 'Oholot' }, slug: 'Mishnah Oholot' },
  { title: { he: 'נגעים', en: 'Negaim' }, slug: 'Mishnah Negaim' },
  { title: { he: 'פרה', en: 'Parah' }, slug: 'Mishnah Parah' },
  { title: { he: 'טהרות', en: 'Tahorot' }, slug: 'Mishnah Tahorot' },
  { title: { he: 'מקואות', en: 'Mikvaot' }, slug: 'Mishnah Mikvaot' },
  { title: { he: 'נידה', en: 'Niddah'}, slug: 'Mishnah Niddah'},
  { title: { he: 'מכשירין', en: 'Makhshirin' }, slug: 'Mishnah Makhshirin' },
  { title: { he: 'זבים', en: 'Zavim' }, slug: 'Mishnah Zavim' },
  { title: { he: 'טבול יום', en: 'Tevul Yom' }, slug: 'Mishnah Tevul Yom' },
  { title: { he: 'ידים', en: 'Yadayim' }, slug: 'Mishnah Yadayim' },
  { title: { he: 'עוקצים', en: 'Oktzin' }, slug: 'Mishnah Oktzin' },
]

export const bavli: BookInfo[] = [
  { title: { he: 'ברכות', en: 'Berakhot' }, slug: 'Berakhot' },
  // Seder Moed
  {
    title: {
      he: 'שבת',
      en: 'Shabbat',
    },
    slug: 'Shabbat',
  },
  { title: { he: 'עירובין', en: 'Eruvin' }, slug: 'Eruvin' },
  { title: { he: 'פסחים', en: 'Pesachim' }, slug: 'Pesachim' },
  { title: { he: 'יומא', en: 'Yoma' }, slug: 'Yoma' },
  { title: { he: 'סוכה', en: 'Sukkah' }, slug: 'Sukkah' },
  { title: { he: 'ביצה', en: 'Beitza' }, slug: 'Beitzah' },
  {
    title: {
      he: 'ראש השנה',
      en: 'Rosh Hashana',
    },
    slug: 'Rosh Hashanah',
  },
  { title: { he: 'תענית', en: 'Ta\'anit' }, slug: 'Taanit' },
  { title: { he: 'מגילה', en: 'Megillah' }, slug: 'Megillah' },
  { title: { he: 'מועד קטן', en: 'Mo\'ed Katan' }, slug: 'Moed Katan' },
  { title: { he: 'חגיגה', en: 'Chagigah' }, slug: 'Chagigah' },
  // Nashim
  { title: { he: 'יבמות', en: 'Yevamot' }, slug: 'Yevamot' },
  { title: { he: 'כתובות',en: 'Ketubot' }, slug: 'Ketubot' },
  { title: { he: 'נדרים', en: 'Nedarim' }, slug: 'Nedarim' },
  { title: { he: 'נזיר', en: 'Nazir' }, slug: 'Nazir' },
  { title: { he: 'סוטה', en: 'Sotah' }, slug: 'Sotah' },
  { title: { he: 'גיטין', en: 'Gittin' }, slug: 'Gittin' },
  { title: { he: 'קידושין', en: 'Kiddushin' }, slug: 'Kiddushin' },
  // סדר נזיקין:
  { title: { he: 'בבא קמא', en: 'Bava Kamma'}, slug: 'Bava Kamma'},
  { title: { he: 'בבא מציעא', en: 'Bava Metzia'}, slug: 'Bava Metzia'},
  { title: { he: 'בבא בתרא', en: 'Bava Batra'}, slug: 'Bava Batra'},
  { title: { he: 'סנהדרין', en: 'Sanhedrin'}, slug: 'Sanhedrin'},
  { title: { he: 'מכות', en: 'Makkot'}, slug: 'Makkot'},
  { title: { he: 'שבועות', en: 'Shevuot'}, slug: 'Shevuot'},
  { title: { he: 'עבודה זרה', en: 'Avodah Zarah'}, slug: 'Avodah Zarah'},
  { title: { he: 'הוריות', en: 'Horayot'}, slug: 'Horayot'},
  // סדר קודשים
  { title: { he: 'זבחים', en: 'Zevachim'}, slug: 'Zevachim'},
  { title: { he: 'מנחות', en: 'Menachot'}, slug: 'Menachot'},
  { title: { he: 'חולין', en: 'Chullin'}, slug: 'Chullin'},
  { title: { he: 'בכורות', en: 'Bekhorot'}, slug: 'Bekhorot'},
  { title: { he: 'ערכין', en: 'Arakhin'}, slug: 'Arakhin'},
  { title: { he: 'תמורה', en: 'Temurah'}, slug: 'Temurah'},
  { title: { he: 'כריתות', en: 'Keritot'}, slug: 'Keritot'},
  { title: { he: 'מעילה', en: 'Meilah'}, slug: 'Meilah'},
  { title: { he: 'תמיד', en: 'Tamid'}, slug: 'Tamid'},
  //   סדר טהרות
  { title: { he: 'נידה', en: 'Niddah'}, slug: 'Niddah'},
  //  { title: { he: "", en: "" }, slug: "" },
]

export const fullIndex: BookSet[] = [
  { 
    title: { he: 'תנ"ך', en: 'Tanakh'},
    books: tanach,
  },
  {
    title: { he: 'משנה', en: 'Mishnah'},
    books: mishnah,
  },
  {
    title: { he: 'תלמוד בבלי', en: 'Talmud Bavli'},
    books: bavli,
  },
]
