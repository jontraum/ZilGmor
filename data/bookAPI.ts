import { BookIndex, Link, LinkMap } from './types'

const sefariaAPIDomain = 'https://www.sefaria.org'
const sefariaAPITextPrefix = '/api/texts/'
const sefariaAPILinkPrefix = '/api/links/'

export interface BookText {
    /** Title of the section (gemara daf, tanach chapter, etc.) */
    title: string;
    heTitle: string;
    /** how the section is referenced when fetching it. Format is something like "title.section" */
    sectionRef: string;
    /** Section identifier without the book title. Could be chapter number in most cases, but for Gemara it's the Amud (e.g. '13a')
     * It is an array because in theory we could have requested multiple chapters/amudim/section in one request.
     */
    sections: Array<string | number>;
    /** Array of Hebrew verses in the chapter */
    he: string[];
    /** Array of English verses in the chapter. */
    text: string[];
    /** Identifier of the next chapter/amud/etc */
    next: string | null;
    /** Identifier of the previous chapter/amud */
    prev: string | null;
}

export function getBookText(book: string, chapter: string): Promise<BookText> {
  const cleanedBook = book.replaceAll(' ', '_')
  const uri = `${sefariaAPIDomain}${sefariaAPITextPrefix}${cleanedBook}.${chapter}`
  return fetch(uri, {cache: 'force-cache'})
    .then(response => response.json())
    .catch(err => console.warn('Error when trying to fetch', err))
}

export function splitBookRef(ref:string) {
  /** Sefaria's API gives next/prev references for the next thing to load, but you cannot just
   * use that reference as-is because of the way book components are separated by spaces, and
   * the way you have to treat spaces differently depending on whether they are within the
   * name of the book (e.g. 'Rosh Hashana') or are separaters between components.
   */
  const bookparts = ref.split(' ')
  const chapter = bookparts.pop()
  const bookname = bookparts.join(' ')
  return{bookname, chapter}
}

function getLinkLabel(link: Link): string {
  /** Get the label/heading under which we group the link.
   * Commentaries are grouped by the individual commentator (Rashi, Tosafos, etc)
   * Other types of links, like quotes from Tanach, Talmud, etc are grouped by link category
   */
  return link.category === 'Commentary' ? link.collectiveTitle.en : link.category
}

export function getNamesOfLinksForBook(book: string, chapter: string): Promise<void | Set<string>> {
  /** Get a promise that will return a set of names of commentaries/links that will be able to use when studying this
   *  chapter of the book. Used in constructing a selector for users to select which commentaries or links they want
   *  to use when learning this book
   */
  const cleanedBook = book.replaceAll(' ', '_')
  // The link API gives us far more info than we need for this purpose, but there doesn't seem to be a good alternative now.
  const uri = `${sefariaAPIDomain}${sefariaAPILinkPrefix}${cleanedBook}.${chapter}?with_text=0`
  return fetch(uri, {cache: 'force-cache'})
    .then(response => response.json())
    .then( (resp_json: Array<object>) => {
      const links = new Set<string>
      resp_json.forEach(link => {
        const label: string = getLinkLabel(link as Link)
        links.add(label)
      })
      return links
    }).catch( (err) => {
      console.warn('getNamesOfLinksForBook error ', err)
    })
}

export function GetLinks(ref: string): Promise<void | LinkMap> {
  const uri = `${sefariaAPIDomain}${sefariaAPILinkPrefix}${ref}?with_text=1`
  return fetch(uri, {cache: 'force-cache'})
    .then(response => response.json())
    .then( (links: Link[]) => {
      const linkMap: LinkMap = new Map() as LinkMap
      links.forEach( (link: Link) => {
        const label = getLinkLabel(link)
        let currentList = linkMap.get(label)
        if (!currentList) {
          currentList = []
          linkMap.set(label, currentList)
        }
        currentList.push(link)
      })
      return linkMap
    })
    .catch(err => console.warn('Error when trying to fetch', err))
}

export function getBookContents(bookSlug: string): Promise<BookIndex | null> {
  /** Get info needed for table of contents for a book */
  const cleanedBookSlug = bookSlug.replaceAll(' ', '%20')
  const uri = `${sefariaAPIDomain}/api/v2/index/${cleanedBookSlug}`
  return fetch(uri, {cache: 'force-cache'})
    .then(response => response.json())
    .catch(err => console.warn('Error when trying to fetch book contents ', cleanedBookSlug, err))
}

// An example of what the API returns...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const samplePageInfo = {
  'ref': 'Rosh Hashanah 13a',
  'heRef': 'ראש השנה י״ג א',
  'isComplex': false,
  'text': [
    '<b>But perhaps</b> the verse is referring to produce that <b>did not grow at all</b> during the seventh year, <b>and</b> nevertheless, <b>the Merciful One states</b> in the Torah that all the <i>halakhot</i> of the Sabbatical Year <b>continue to apply until the festival of <i>Sukkot</i></b> of the eighth year.',
    'The Gemara answers: <b>It should not enter your mind</b> to say this, <b>as it is written: “And the festival of gathering, which is at the end of the year,</b> when you have gathered in your labors out of the field” (<a class ="refLink" href="/Exodus.23.16" data-ref="Exodus 23:16">Exodus 23:16</a>). <b>What is</b> the meaning of <b>“gathering”? If we say</b> that it means: <b>A Festival that comes at the time of gathering</b> the crops, <b>isn’t it</b> already <b>written: “When you have gathered</b> in your labors”? There is no need to repeat this a second time.',
    '<b>Rather, what is</b> meant here by <b>“gathering”?</b> It means <b>harvesting. And the Sages have</b> an accepted <b>tradition that any grain that</b> reaches full growth so that it <b>is harvested on the festival</b> of <i>Sukkot</i> <b>is known</b> to <b>have reached one-third</b> of its growth <b>before Rosh HaShana, and</b> the Torah <b>calls</b> that period of the year until <i>Sukkot</i> <b>“at the end of the year,”</b> thereby indicating that it is still subject to the <i>halakhot</i> governing the previous year.',
    '§ <b><a href="/topics/rabbi-yirmeyah" class="namedEntityLink" data-slug="rabbi-yirmeyah">Rabbi Yirmeya</a> said to <a href="/topics/rav-zera" class="namedEntityLink" data-slug="rav-zera">Rabbi Zeira</a>: And are the Sages</b> able to <b>discern</b> precisely <b>between</b> produce that reached <b>one-third</b> of its growth <b>and</b> produce that reached <b>less than one-third</b> of its growth? <a href="/topics/rav-zera" class="namedEntityLink" data-slug="rav-zera">Rabbi Zeira</a> <b>said to him: Do I not</b> always <b>tell you that you must not take yourself out</b> of the bounds of <b>the <i>halakha</i>? All the measures of the Sages are like this;</b> they are precise and exact.',
    'For example, <b>one who immerses himself in</b> a ritual bath containing <b>forty <i>se’a</i></b> of water is rendered pure, but <b>in forty <i>se’a</i> less</b> the tiny amount of <b>a <i>kortov</i>,</b> he <b>cannot immerse</b> and become pure <b>in them.</b> Similarly, <b>an egg-bulk</b> of impure food <b>can render</b> other <b>food ritually impure,</b> but <b>an egg-bulk less</b> even the tiny amount of <b>a sesame</b> seed <b>does not render food ritually impure.</b>',
    'So too, a piece of cloth <b>three by three</b> handbreadths in size <b>is susceptible to ritual impurity</b> imparted by <b>treading,</b> but a piece of cloth <b>three by three</b> handbreadths <b>less one hair [<i>nima</i>] is not susceptible to ritual impurity</b> imparted by <b>treading.</b>',
    '<b><a href="/topics/rabbi-yirmeyah" class="namedEntityLink" data-slug="rabbi-yirmeyah">Rabbi Yirmeya</a> then said: What I said is nothing,</b> and my question had no basis, as it can be demonstrated that the Sages know how to determine that produce has reached one-third of its growth. <b>As <a href="/topics/rav-kahana-(v)" class="namedEntityLink" data-slug="כהנא-(ambiguous)">Rav Kahana</a> was</b> once <b>asked by the</b> other <b>colleagues</b> of the academy as follows: With regard to <b>the <i>omer</i></b> offering <b>that the <a href="/topics/jewish-people" class="namedEntityLink" data-slug="jewish-people">Jewish people</a> brought when they</b> first <b>entered <a href="/topics/israel" class="namedEntityLink" data-slug="israel">Eretz Yisrael</a></b> in the days of <a href="/topics/joshua" class="namedEntityLink" data-slug="joshua">Joshua</a>, <b>from where did they bring it? If you say</b> that this <i>omer</i> offering was brought from grain <b>that grew in the possession of a gentile,</b> there is a difficulty, as <b>the Merciful One states</b> in the Torah: “You shall bring an <i>omer</i> of the first fruits of <b>your harvest</b> to the priest” (<a class ="refLink" href="/Leviticus.23.13" data-ref="Leviticus 23:13">Leviticus 23:13</a>), from which it can be derived that it must be your harvest, grown in the possession of a Jew, <b>and not the harvest of a gentile.</b>',
    'The Gemara first questions the assumption of <a href="/topics/rav-kahana-(v)" class="namedEntityLink" data-slug="כהנא-(ambiguous)">Rav Kahana</a>’s colleagues: <b>From where</b> is it known <b>that</b> the <a href="/topics/jewish-people" class="namedEntityLink" data-slug="jewish-people">Jewish people</a> actually <b>brought</b> an <i>omer</i> offering that year? <b>Perhaps they did not offer</b> it at all. The Gemara rejects this argument: <b>It should not enter your mind</b> to say this, <b>as it is written: “And they did eat of the produce of the land on the next day after Passover”</b> (<a class ="refLink" href="/Joshua.5.11" data-ref="Joshua 5:11">Joshua 5:11</a>), which teaches: Only <b>on the next day after Passover did they eat</b> from the new grain, but <b>initially they did not eat</b> from it. Why? It is <b>because they</b> first <b>brought the <i>omer</i></b> offering on the sixteenth of Nisan as is required, <b>and</b> only <b>afterward did they eat</b> from the new grain. Therefore the question remains: <b>From where did they bring</b> the <i>omer</i> offering?',
    '<a href="/topics/rav-kahana-(v)" class="namedEntityLink" data-slug="כהנא-(ambiguous)">Rav Kahana</a> <b>said to them: Anything that</b> came into the possession of a Jew and <b>did not reach one-third</b> of its growth <b>in the possession of a gentile</b> is fit to be harvested for the sake of the <i>omer</i> offering.',
    '<a href="/topics/rabbi-yirmeyah" class="namedEntityLink" data-slug="rabbi-yirmeyah">Rabbi Yirmeya</a> concludes his proof: But there, too, one might ask: <b>Perhaps</b> the grain <b>had</b> in fact already <b>reached</b> one-third of its growth, <b>but they could not discern</b> with certainty between grain that had reached one-third of its growth and grain that had not. <b>Rather,</b> you must say that <b>they were able to discern</b> with certainty. <b>Here, too,</b> you can say that the Sages <b>can discern</b> with certainty between produce that has reached one-third of its growth before Rosh HaShana and produce that has not.',
    'The Gemara asks: This is not absolute proof, <b>as perhaps</b> the <a href="/topics/jewish-people" class="namedEntityLink" data-slug="jewish-people">Jewish people</a> brought the <i>omer</i> offering from grain that <b>did not grow at all</b> before they conquered the land, and the distinction was evident to all. <b>But where</b> produce <b>reached one quarter</b> of its growth, the Sages <b>cannot discern</b> with certainty the difference <b>between one-third and less than one-third.</b>',
    'The Gemara answers: <b>It should not enter your mind</b> to say this, <b>as it is written: “And the people came up from the Jordan on the tenth day of the</b> first <b>month”</b> (<a class ="refLink" href="/Joshua.4.19" data-ref="Joshua 4:19">Joshua 4:19</a>). <b>And if</b> it <b>enters your mind</b> to say <b>that</b> the grain <b>had not grown at all</b> before the <a href="/topics/jewish-people" class="namedEntityLink" data-slug="jewish-people">Jewish people</a> entered the land, <b>could it have reached full growth in</b> just <b>five days?</b>',
    'The Gemara rejects this argument: <b>Rather, what</b> can one say? <b>That</b> the grain <b>had reached one quarter or one-sixth [<i>danka</i>]</b> of its growth before the <a href="/topics/jewish-people" class="namedEntityLink" data-slug="jewish-people">Jewish people</a> conquered the land? This too is difficult, as one can <b>still</b> ask: <b>Could</b> the grain <b>have reached full growth in</b> just <b>five days? Rather, what have you to say?</b> One could say that with regard to <a href="/topics/israel" class="namedEntityLink" data-slug="israel">Eretz Yisrael</a> <b>it is written: “The land of the deer”</b> (<a class ="refLink" href="/Daniel.11.41" data-ref="Daniel 11:41">Daniel 11:41</a>), implying that the grain of <a href="/topics/israel" class="namedEntityLink" data-slug="israel">Eretz Yisrael</a> ripens with the swiftness of a deer. <b>Here, too,</b> one can say that <b>“the land of the deer” is written</b> with regard to <a href="/topics/israel" class="namedEntityLink" data-slug="israel">Eretz Yisrael</a> and applies to the ripening of the grain, so that it can ripen in just a few days.',
    '§ <b><a href="/topics/rabbi-chanina" class="namedEntityLink" data-slug="מרח-(ambiguous)">Rabbi Ḥanina</a> strongly objects to</b> the proof brought from the verse in Exodus cited above, which refers to <i>Sukkot</i> as the festival of gathering: <b>How can you say</b> that <b>this “gathering” means harvesting? But isn’t it written:</b> “You shall observe the festival of <i>Sukkot</i> seven days, <b>after you have gathered in from your threshing floor and from your winepress”</b> (<a class ="refLink" href="/Deuteronomy.16.13" data-ref="Deuteronomy 16:13">Deuteronomy 16:13</a>), <b>and the Master said</b> about this: <b>The verse speaks</b> here <b>of the waste of the threshing floor and the winepress,</b> which is used to make the roof of the <i>sukka</i>. If so, the gathering mentioned with regard to the festival of <i>Sukkot</i> is referring not to harvesting but to gathering straw from the threshing floor.',
    '<b><a href="/topics/rav-zera" class="namedEntityLink" data-slug="rav-zera">Rabbi Zeira</a> said</b> about this: <b>This matter was in our hands,</b> i.e., I thought that we had solid proof that the years for produce follow the first third of its growth, <b>but <a href="/topics/rabbi-chanina" class="namedEntityLink" data-slug="מרח-(ambiguous)">Rabbi Ḥanina</a> came and cast an axe upon it,</b> cutting it down, as <a href="/topics/rabbi-chanina" class="namedEntityLink" data-slug="מרח-(ambiguous)">Rabbi Ḥanina</a>’s objection has totally nullified the proof.',
    'The Gemara asks: <b>Rather, from where do we</b> derive that the years for produce follow the first third of its growth? The Gemara answers: <b>As it is taught</b> in a <i>baraita</i> that <b><a href="/topics/rabbi-yonatan" class="namedEntityLink" data-slug="rabbi-yonatan">Rabbi Yonatan</a> ben <a href="/topics/joseph" class="namedEntityLink" data-slug="joseph">Yosef</a> says:</b> The verse states: <b>“And it shall bring forth fruit for the three years”</b> (<a class ="refLink" href="/Leviticus.25.21" data-ref="Leviticus 25:21">Leviticus 25:21</a>);',
  ],
  'he': [
    'וְדִלְמָא לָא עָיֵיל כְּלָל, וְקָאָמַר רַחֲמָנָא תְּשַׁמֵּט וְתֵיזִיל עַד חַג הַסּוּכּוֹת!',
    'לָא סָלְקָא דַּעְתָּךְ, דִּכְתִיב: ״וְחַג הָאָסִיף בְּצֵאת הַשָּׁנָה״, מַאי ״אָסִיף״? אִילֵּימָא: חַג הַבָּא בִּזְמַן אֲסִיפָה — הָכְתִיב: ״בְּאׇסְפְּךָ״.',
    'אֶלָּא מַאי ״אָסִיף״ — קָצִיר. וְקִים לְהוּ לְרַבָּנַן דְּכׇל תְּבוּאָה שֶׁנִּקְצְרָה בֶּחָג, בְּיָדוּעַ שֶׁהֵבִיאָה שְׁלִישׁ לִפְנֵי רֹאשׁ הַשָּׁנָה, וְקָא קָרֵי לַהּ ״בְּצֵאת הַשָּׁנָה״.',
    'אֲמַר לֵיהּ <a href="/topics/rabbi-yirmeyah" class="namedEntityLink" data-slug="rabbi-yirmeyah">רַבִּי יִרְמְיָה</a> <a href="/topics/rav-zera" class="namedEntityLink" data-slug="rav-zera">לְרַבִּי זֵירָא</a>: וְקִים לְהוּ לְרַבָּנַן בֵּין שְׁלִישׁ לְפָחוֹת מִשְּׁלִישׁ? אֲמַר לֵיהּ: לָאו אָמֵינָא לָךְ לָא תַּפֵּיק נַפְשָׁךְ לְבַר מֵהִלְכְתָא? כׇּל מִדּוֹת חֲכָמִים — כֵּן הוּא.',
    'אַרְבָּעִים סְאָה הוּא טוֹבֵל, בְּאַרְבָּעִים סְאָה חָסֵר קוּרְטוֹב — אֵינוֹ יָכוֹל לִטְבּוֹל בָּהֶן. כְּבֵיצָה מְטַמֵּא טוּמְאַת אוֹכָלִין, כְּבֵיצָה חָסֵר שׁוּמְשׁוּם — אֵינוֹ מְטַמֵּא טוּמְאַת אוֹכָלִין.',
    'שְׁלֹשָׁה עַל שְׁלֹשָׁה — מִטַּמֵּא מִדְרָס, שְׁלֹשָׁה עַל שְׁלֹשָׁה חָסֵר נִימָא אַחַת — אֵינוֹ מִטַּמֵּא מִדְרָס.',
    'הֲדַר אָמַר <a href="/topics/rabbi-yirmeyah" class="namedEntityLink" data-slug="rabbi-yirmeyah">רַבִּי יִרְמְיָה</a>: לָאו מִילְּתָא הִיא דַּאֲמַרִי. דִּבְעוֹ מִינֵּיהּ חַבְרַיָּיא <a href="/topics/rav-kahana-(v)" class="namedEntityLink" data-slug="כהנא-(ambiguous)">מֵרַב כָּהֲנָא</a>: עוֹמֶר שֶׁהִקְרִיבוּ <a href="/topics/jewish-people" class="namedEntityLink" data-slug="ישראל-(ambiguous)">יִשְׂרָאֵל</a> בִּכְנִיסָתָן לָאָרֶץ, מֵהֵיכָן הִקְרִיבוּהוּ? אִם תֹּאמַר דְּעָיֵיל בְּיַד גּוֹי, ״קְצִירְכֶם״ אָמַר רַחֲמָנָא — וְלֹא קְצִיר גּוֹי.',
    'מִמַּאי דְּאַקְרִיבוּ, דִּלְמָא לָא אַקְרִיבוּ! לָא סָלְקָא דַּעְתָּךְ, דִּכְתִיב: ״וַיֹּאכְלוּ מֵעֲבוּר הָאָרֶץ מִמׇּחֳרַת הַפֶּסַח״. מִמָּחֳרַת הַפֶּסַח — אֲכוּל, מֵעִיקָּרָא — לָא אֲכוּל. דְּאַקְרִיבוּ עוֹמֶר וַהֲדַר אָכְלִי. מֵהֵיכָן הִקְרִיבוּ?',
    'אָמַר לָהֶן: כׇּל שֶׁלֹּא הֵבִיא שְׁלִישׁ בְּיַד גּוֹי.',
    'וְדִלְמָא עָיֵיל וְלָא קִים לְהוּ? אֶלָּא קִים לְהוּ — הָכָא נָמֵי קִים לְהוּ.',
    'וְדִלְמָא לָא עָיֵיל כְּלָל, אֲבָל הֵיכָא דְּעָיֵיל רִיבְעָא — בֵּין שְׁלִישׁ לְפָחוֹת מִשְּׁלִישׁ לָא קִים לְהוּ!',
    'לָא סָלְקָא דַּעְתָּךְ, דִּכְתִיב: ״וְהָעָם עָלוּ מִן הַיַּרְדֵּן בֶּעָשׂוֹר לַחֹדֶשׁ״, וְאִי סָלְקָא דַעְתָּךְ דְּלָא עָיֵיל כְּלָל — בְּחַמְשָׁה יוֹמֵי מִי קָא מָלְיָא?',
    'אֶלָּא מַאי, דְּעָיֵיל רִבְעָא אוֹ דַנְקָא? אַכַּתִּי בְּחַמְשָׁה יוֹמֵי מִי קָא מָלְיָא! אֶלָּא מַאי אִית לָךְ לְמֵימַר: ״אֶרֶץ צְבִי״ כְּתִיב בַּהּ — הָכָא נָמֵי: ״אֶרֶץ צְבִי״ כְּתִיב בַּהּ.',
    'מַתְקֵיף לַהּ <a href="/topics/rabbi-chanina" class="namedEntityLink" data-slug="מרח-(ambiguous)">רַבִּי חֲנִינָא</a>: וּמִי מָצֵית אָמְרַתְּ דְּהַאי ״אָסִיף״ קָצִיר הוּא? וְהָכְתִיב: ״בְּאׇסְפְּךָ מִגׇּרְנְךָ וּמִיִּקְבֶךָ״, וְאָמַר מָר: בִּפְסוֹלֶת גּוֹרֶן וְיֶקֶב הַכָּתוּב מְדַבֵּר!',
    'אָמַר <a href="/topics/rav-zera" class="namedEntityLink" data-slug="rav-zera">רַבִּי זֵירָא</a>: הָא מִילְּתָא הֲוַאי בִּידַן, וַאֲתָא <a href="/topics/rabbi-chanina" class="namedEntityLink" data-slug="מרח-(ambiguous)">רַבִּי חֲנִינָא</a> שְׁדָא בַּיהּ נַרְגָּא.',
    'אֶלָּא מְנָלַן? כִּדְתַנְיָא, <a href="/topics/rabbi-yonatan" class="namedEntityLink" data-slug="rabbi-yonatan">רַבִּי יוֹנָתָן</a> בֶּן <a href="/topics/joseph" class="namedEntityLink" data-slug="joseph">יוֹסֵף</a> אוֹמֵר: ״וְעָשָׂת אֶת הַתְּבוּאָה לִשְׁלֹשׁ הַשָּׁנִים״,',
  ],
  'versions': [
    {
      'title': 'Rosh Hashanah',
      'versionTitle': 'William Davidson Edition - Vocalized Aramaic',
      'versionSource': 'http://sefaria.org',
      'language': 'he',
      'status': 'locked',
      'license': 'CC-BY-NC',
      'versionNotes': 'Aramaic from The William Davidson digital edition of the <a href=\'https://www.korenpub.com/koren_en_usd/koren/talmud/koren-talmud-bavli-no.html\'>Koren Noé Talmud</a>, with commentary by <a href=\'/adin-even-israel-steinsaltz\'>Rabbi Adin Even-Israel Steinsaltz</a>\nNikud (vocalization) by <a href=\'https://dicta.org.il/\'>Dicta - the Israel Center for Text Analysis</a>',
      'digitizedBySefaria': '',
      'priority': 3.0,
      'versionTitleInHebrew': 'מהדורת וויליאם דייוידסון - ארמית המנוקד',
      'versionNotesInHebrew': 'הטקסט הארמי של מהדורת וויליאם דייוידסון הדיגיטלית מתוך <a href=\'https://www.korenpub.com/koren_en_usd/koren/talmud/koren-talmud-bavli-no.html\'>תלמוד קורן מהדורת נאה</a>, עם באור מאת <a href=\'/adin-even-israel-steinsaltz\'>הרב אבן־ישראל (שטיינזלץ)</a>\nמנוקד על ידי <a href=\'https://dicta.org.il/\'>דיקטה - המרכז הישראלי לניתוח טקסטים</a>',
      'extendedNotes': '',
      'extendedNotesHebrew': '',
      'purchaseInformationImage': '',
      'purchaseInformationURL': '',
      'shortVersionTitle': '',
      'shortVersionTitleInHebrew': '',
      'isBaseText': true,
    },
    {
      'title': 'Rosh Hashanah',
      'versionTitle': 'William Davidson Edition - English',
      'versionSource': 'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1',
      'language': 'en',
      'status': 'locked',
      'license': 'CC-BY-NC',
      'versionNotes': 'English from The William Davidson digital edition of the <a href=\'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1\'>Koren Noé Talmud</a>, with commentary by <a href=\'/adin-even-israel-steinsaltz\'>Rabbi Adin Even-Israel Steinsaltz</a>',
      'digitizedBySefaria': '',
      'priority': 2.0,
      'versionTitleInHebrew': 'מהדורת וויליאם דייוידסון - אנגלית',
      'versionNotesInHebrew': 'תרגום אנגלי של תלמוד מהדורת ויליאם דיוידסון מתוך מהדורת <a href=\'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1\'>Noé</a> עם פירוש <a href=\'/adin-even-israel-steinsaltz\'>הרב עדין אבן ישראל שטיינזלץ</a>, בהוצאת קורן ירושלים',
      'extendedNotes': '',
      'extendedNotesHebrew': '',
      'purchaseInformationImage': 'https://storage.googleapis.com/sefaria-physical-editions/1a1447c2d684eefbec90ce05b5ffe6d2.png',
      'purchaseInformationURL': 'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1/products/vol-11-beitza-rosh-hashana',
      'shortVersionTitle': 'Koren - Steinsaltz',
      'shortVersionTitleInHebrew': '',
      'isBaseText': false,
    },
    {
      'title': 'Rosh Hashanah',
      'versionTitle': 'Wikisource Talmud Bavli',
      'versionSource': 'http://he.wikisource.org/wiki/%D7%AA%D7%9C%D7%9E%D7%95%D7%93_%D7%91%D7%91%D7%9C%D7%99',
      'language': 'he',
      'status': 'locked',
      'license': 'CC-BY-SA',
      'versionNotes': '',
      'digitizedBySefaria': '',
      'priority': '',
      'versionTitleInHebrew': 'תלמוד בבלי (ויקיטקסט)',
      'versionNotesInHebrew': '',
      'extendedNotes': '',
      'extendedNotesHebrew': '',
      'purchaseInformationImage': '',
      'purchaseInformationURL': '',
      'shortVersionTitle': '',
      'shortVersionTitleInHebrew': '',
      'isBaseText': true,
    },
    {
      'title': 'Rosh Hashanah',
      'versionTitle': 'William Davidson Edition - Aramaic',
      'versionSource': 'https://korenpub.co.il/collections/the-noe-edition-koren-talmud-bavli-1',
      'language': 'he',
      'status': 'locked',
      'license': 'CC-BY-NC',
      'versionNotes': 'Aramaic from The William Davidson digital edition of the <a href=\'https://korenpub.co.il/collections/the-noe-edition-koren-talmud-bavli-1\'>Koren Noé Talmud</a>, with commentary by <a href=\'/adin-even-israel-steinsaltz\'>Rabbi Adin Even-Israel Steinsaltz</a>',
      'digitizedBySefaria': '',
      'priority': '',
      'versionTitleInHebrew': 'מהדורת וויליאם דייוידסון - ארמית',
      'versionNotesInHebrew': 'טקסט ארמי של תלמוד מהדורת ויליאם דיוידסון מתוך מהדורת <a href=\'https://korenpub.co.il/collections/the-noe-edition-koren-talmud-bavli-1\'>Noé</a> עם פירוש <a href=\'/adin-even-israel-steinsaltz\'>הרב עדין אבן ישראל שטיינזלץ</a>, בהוצאת קורן ירושלים',
      'extendedNotes': '',
      'extendedNotesHebrew': '',
      'purchaseInformationImage': 'https://storage.googleapis.com/sefaria-physical-editions/7d93a8f239b2c73523d3b2e9399ce1a8.png',
      'purchaseInformationURL': 'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1/products/vol-11-beitza-rosh-hashana',
      'shortVersionTitle': '',
      'shortVersionTitleInHebrew': '',
      'isBaseText': true,
    },
    {
      'title': 'Rosh Hashanah',
      'versionTitle': 'Talmud Bavli. German trans. by Lazarus Goldschmidt, 1929 [de]',
      'versionSource': 'https://www.nli.org.il/he/books/NNL_ALEPH001042448/NLI',
      'language': 'en',
      'status': '',
      'license': '',
      'versionNotes': '',
      'digitizedBySefaria': '',
      'priority': '',
      'versionTitleInHebrew': '',
      'versionNotesInHebrew': '',
      'extendedNotes': '',
      'extendedNotesHebrew': '',
      'purchaseInformationImage': '',
      'purchaseInformationURL': '',
      'shortVersionTitle': 'Lazarus Goldschmidt, 1929',
      'shortVersionTitleInHebrew': '',
      'isBaseText': false,
    },
  ],
  'textDepth': 2,
  'sectionNames': [
    'Daf',
    'Line',
  ],
  'addressTypes': [
    'Talmud',
    'Integer',
  ],
  'lengths': [
    69,
    1025,
  ],
  'length': 69,
  'heTitle': 'ראש השנה י״ג א',
  'titleVariants': [
    'Talmud Rosh Hashanah',
    'Tractate Rosh Hashanah',
    'Rosh HaShanah',
    'Masekhet Rosh Hashanah',
    'Rosh HaShana',
    'R. Hash.',
    'Rosh hash-Shanah',
    'Rosh ha-Shanah',
    'BT Rosh Hashanah',
    'Rosh Ha-shana',
    'Rosh Hashanah',
  ],
  'heTitleVariants': [
    'ר"ה',
    'ר״ה',
    'ר”ה',
    'ראש השנה',
  ],
  'type': 'Talmud',
  'primary_category': 'Talmud',
  'book': 'Rosh Hashanah',
  'categories': [
    'Talmud',
    'Bavli',
    'Seder Moed',
  ],
  'order': [
    5,
    4,
  ],
  'sections': [
    '13a',
  ],
  'toSections': [
    '13a',
  ],
  'isDependant': false,
  'indexTitle': 'Rosh Hashanah',
  'heIndexTitle': 'ראש השנה',
  'sectionRef': 'Rosh Hashanah 13a',
  'firstAvailableSectionRef': 'Rosh Hashanah 13a',
  'heSectionRef': 'ראש השנה י״ג א',
  'isSpanning': false,
  'versionTitle': 'William Davidson Edition - English',
  'versionTitleInHebrew': 'מהדורת וויליאם דייוידסון - אנגלית',
  'shortVersionTitle': 'Koren - Steinsaltz',
  'shortVersionTitleInHebrew': '',
  'versionSource': 'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1',
  'versionStatus': 'locked',
  'versionNotes': 'English from The William Davidson digital edition of the <a href=\'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1\'>Koren Noé Talmud</a>, with commentary by <a href=\'/adin-even-israel-steinsaltz\'>Rabbi Adin Even-Israel Steinsaltz</a>',
  'extendedNotes': '',
  'extendedNotesHebrew': '',
  'versionNotesInHebrew': 'תרגום אנגלי של תלמוד מהדורת ויליאם דיוידסון מתוך מהדורת <a href=\'https://korenpub.com/collections/the-noe-edition-koren-talmud-bavli-1\'>Noé</a> עם פירוש <a href=\'/adin-even-israel-steinsaltz\'>הרב עדין אבן ישראל שטיינזלץ</a>, בהוצאת קורן ירושלים',
  'digitizedBySefaria': false,
  'license': 'CC-BY-NC',
  'formatEnAsPoetry': false,
  'heVersionTitle': 'William Davidson Edition - Vocalized Aramaic',
  'heVersionTitleInHebrew': 'מהדורת וויליאם דייוידסון - ארמית המנוקד',
  'heShortVersionTitle': '',
  'heShortVersionTitleInHebrew': '',
  'heVersionSource': 'http://sefaria.org',
  'heVersionStatus': 'locked',
  'heVersionNotes': 'Aramaic from The William Davidson digital edition of the <a href=\'https://www.korenpub.com/koren_en_usd/koren/talmud/koren-talmud-bavli-no.html\'>Koren Noé Talmud</a>, with commentary by <a href=\'/adin-even-israel-steinsaltz\'>Rabbi Adin Even-Israel Steinsaltz</a>\nNikud (vocalization) by <a href=\'https://dicta.org.il/\'>Dicta - the Israel Center for Text Analysis</a>',
  'heExtendedNotes': '',
  'heExtendedNotesHebrew': '',
  'heVersionNotesInHebrew': 'הטקסט הארמי של מהדורת וויליאם דייוידסון הדיגיטלית מתוך <a href=\'https://www.korenpub.com/koren_en_usd/koren/talmud/koren-talmud-bavli-no.html\'>תלמוד קורן מהדורת נאה</a>, עם באור מאת <a href=\'/adin-even-israel-steinsaltz\'>הרב אבן־ישראל (שטיינזלץ)</a>\nמנוקד על ידי <a href=\'https://dicta.org.il/\'>דיקטה - המרכז הישראלי לניתוח טקסטים</a>',
  'heDigitizedBySefaria': false,
  'heLicense': 'CC-BY-NC',
  'formatHeAsPoetry': false,
  'title': 'Rosh Hashanah 13a',
  'heBook': 'ראש השנה',
  'alts': [],
  'index_offsets_by_depth': null,
  'next': 'Rosh Hashanah 13b',
  'prev': 'Rosh Hashanah 12b',
  'commentary': [],
  'sheets': [],
  'layer': [],
}