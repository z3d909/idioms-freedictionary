import * as cheerio from 'cheerio';

export default class IdiomsManager {
    _context;

    /**
     * @param {Document} context
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * Parse page and find title of idioms and links to them
     * @return {{href: *, text: *}[]}
     */
    getIdiomsFromContext() {

        const $ = cheerio.load(this._context);

        return Array.from($('.content-holder section ul li a'))
            .map(li => ({
                href: li.attribs.href,
                text: $(li).text(),
            }));
    }
}