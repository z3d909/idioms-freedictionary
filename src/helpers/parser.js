const SECTION_PATTERN = '<section.+data-src="(.+?)">(.+?)<\\/section>';
const ALL_SECTION_PATTERN = '<section[^>]*>(.*?)<\\/section>';
const TITLE_PATTERN = '<h2>(.+?)<\/h2>';
const DESCRIPTION_SECTION_PATTERN = `<div class=['"](ds-single|ds-list)['"]>(.+?)<\/div>`;
const DESCRIPTION_PATTERN = '^(.*?)(?=<span class="illustration">)';
const ILLUSTRATION_PATTERN = '<span.+?>(.+?)<\/span>';

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

    return sections.map(section => parseSection(section));
}

/**
 *
 * @param section
 * @return {{idioms: {illustrations: string[], description: string}[], title: string}}
 */
function parseSection(section) {
    console.log(section[1]);
    const title = find(TITLE_PATTERN, section[1])[1];
    const descriptionSections = findAll(DESCRIPTION_SECTION_PATTERN, section[0]);

    const idioms = descriptionSections.map(descriptionSection => {
        const match = find(DESCRIPTION_PATTERN, descriptionSection[2])

        const description = match ? match[1] : descriptionSection[2];

        const illustrations = findAll(ILLUSTRATION_PATTERN, descriptionSection[2]).map(ill => ill[1]);

        return {description, illustrations};

    })

    return {title, idioms};
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