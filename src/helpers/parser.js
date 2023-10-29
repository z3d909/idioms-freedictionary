const SECTION_PATTERN = '<section.+data-src="FarlexIdi"\>(.+?)\<\/section\>';
const TITLE_PATTERN = '<h2>(.+?)<\/h2>';
const DESCRIPTION_SECTION_PATTERN = `<div class=['"](ds-single|ds-list)['"]>(.+?)<\/div>`;
const DESCRIPTION_PATTERN = '(^.+?)<span';
const ILLUSTRATION_PATTERN = '<span.+?>(.+?)<\/span>';

/**
 * Parse context
 * @param {string} context
 * @return {{title: string, idioms: {description: string, illustrations: string[]}}[]}|null
 */
export default context => {
    const section = find(SECTION_PATTERN, context);

    if (!section) {
        return null;
    }

    const title = find(TITLE_PATTERN, section[0])[1];

    const descriptionSections = findAll(DESCRIPTION_SECTION_PATTERN, section[0]);

    const idioms = descriptionSections.map(descriptionSection => {
        const description = find(DESCRIPTION_PATTERN, descriptionSection[2])[1];
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