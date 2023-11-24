const SECTION_PATTERN = '<section.+data-src="(.+?)">(.+?)<\\/section>';
const ALL_SECTION_PATTERN = '<section[^>]*>(.*?)<\\/section>';
const PATTERN = /<div class=["'](?:SeeAlso|cprh)["'][^>]*>.*?<\/div>/gs;

/**
 * Parse context
 * @param {string} context
 * @return {{idioms: {illustrations: string[], description: string}[], title: string}[]}|null
 */
export default context => {
    const definitions = find(SECTION_PATTERN, context);
    const sections = findAll(ALL_SECTION_PATTERN, definitions[0]);

    if (!sections || !sections.length) {
        return null;
    }

    return sections.map(section => cleanSection(section));
}

/**
 *
 * @param section
 * @return {{idioms: {illustrations: string[], description: string}[], title: string}}
 */
function cleanSection(section) {
    return  section[1].replace(PATTERN, '');
}

function find(pattern, context) {
    const result = findAll(pattern, context);
    return result[0] || null
}

/**
 * Match all and check results
 * @param {string} pattern
 * @param {string} context
 * @return {[]|null}
 */
function findAll(pattern, context) {
    const regexp = new RegExp(pattern, 'gm');
    return Array.from(context.matchAll(regexp));
}