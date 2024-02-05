'use strict';

(async () => {
    const listNode = document.querySelector('.content-holder');
    listNode.addEventListener('click', onIdiomClick);
})()

/**
 * Click event handler
 * @param event
 * @return {Promise<void>}
 */
async function onIdiomClick(event) {
    if (event.target.tagName !== 'A') {
        return;
    }

    if (!event.currentTarget.querySelector('section ul').contains(event.target)) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const node = event.target;
    const {success, data} = await chromeSend({
        html: await idiomRequest(node.attributes.href.value),
        name: node.text,
    });

    if (!success) {
        return;
    }

    const popupElement = document.querySelector('div#idioms-popup');
    if (popupElement) {
        hidePopup(popupElement);
    }

    showPopupFor(data);
}

async function chromeSend(payload) {
    return await chrome.runtime.sendMessage({
        sender: 'COACH_IDIOMS',
        data:  payload
    });
}

/**
 * @param {string} url
 * @return {Promise<string>}
 */
async function idiomRequest(url)  {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send(null);
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                resolve(request.responseText);
            }
        }
        request.onerror = () => {
            reject(request.statusText);
        }
    })
}

/**
 * Remove popup element from DOM
 * @param element
 */
function hidePopup(element) {
    element.remove();
}

function copyToBuffer(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges(); // Clear any existing selections

    range.selectNodeContents(element); // Select the content of the element
    selection.addRange(range); // Add the range to the selection

    try {
        // Execute the copy command
        const successful = document.execCommand('copy');
        const msg = successful ? 'Content copied successfully.' : 'Content copy was unsuccessful.';
        console.log(msg);
    } catch (err) {
        console.error('Failed to copy content: ', err);
    }

    // Clear the selection
    selection.removeAllRanges();
}

/**
 * Create popup element and append to DOM
 * @param {{title: string; idioms: {description: string; illustrations: string[]}[]}[]} data
 */
function showPopupFor(data) {
    const popupBlock = document.createElement('div');
    popupBlock.id = 'idioms-popup';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.className = 'idioms-popup__close';
    closeButton.addEventListener('click', () => hidePopup(popupBlock));
    popupBlock.appendChild(closeButton);

    const copyButton = getCopyButton();
    popupBlock.appendChild(copyButton);

    const content = document.createElement('div');
    content.className = 'idioms-popup__content';

    data.forEach((section, index) => {
        const block = document.createElement('div');
        block.innerHTML = section;
        content.appendChild(block);
    });

    copyButton.addEventListener('click', () => copyToBuffer(content));
    popupBlock.appendChild(content);

    document.body.appendChild(popupBlock);
}

function getCopyButton() {
    const button = document.createElement('button');
    button.innerHTML = 'Copy';
    button.className = 'idioms-popup__copy';
    return button;
}

