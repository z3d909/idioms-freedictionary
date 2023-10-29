import parser from './helpers/parser.js';


/**
 *
 * @param {{sender: string; data: {html: string, name: string}}} payload
 * @param {object} sender
 * @param {function} sendResponse
 * @return {Promise<void>}
 */
const listener = async (payload, sender, sendResponse) => {
    const idiomData = parser(payload.data.html);

    if (!idiomData) {
        sendResponse({success: false});
        return;
    }

    sendResponse({success: true, data: idiomData});
}

export default () => {
    chrome.runtime.onMessage.addListener(listener);
}
