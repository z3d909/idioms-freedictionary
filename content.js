'use strict';

(async () => {
    const listNode = document.querySelector('.content-holder section ul');
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

    event.preventDefault();
    event.stopPropagation();

    // const node = event.target.querySelector('a');
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

    data.forEach((section, index) => {
        if (index > 0) {
            popupBlock.appendChild(document.createElement('hr'));
        }

        const block = document.createElement('div');
        block.innerHTML = section;
        popupBlock.appendChild(block);
    });

    document.body.appendChild(popupBlock);
}