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
 * @param {string} title
 * @param {{description: string; illustrations: string[]}[]} idioms
 */
function showPopupFor({title, idioms}) {
    const popupBlock = document.createElement('div');
    popupBlock.id = 'idioms-popup';

    const titleBlock = document.createElement('div');
    titleBlock.className = 'idioms-popup__title';

    const popupTitle = document.createElement('h3');
    popupTitle.innerHTML = title;
    titleBlock.appendChild(popupTitle);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', () => hidePopup(popupBlock));
    titleBlock.appendChild(closeButton);

    popupBlock.appendChild(titleBlock);
    popupBlock.appendChild(document.createElement('hr'));

    const idiomsContentBlock = document.createElement('div');
    idiomsContentBlock.className = 'idioms-content';

    idioms.forEach(idiom => {
        const idiomBlock = document.createElement('div');
        idiomBlock.className = 'idiom-content';
        idiomsContentBlock.appendChild(idiomBlock);

        const idiomDescription = document.createElement('div');
        idiomDescription.className = 'idiom-content__descriptions';
        idiomDescription.innerHTML = idiom.description;
        idiomBlock.appendChild(idiomDescription);

        const illustrationsBlock = document.createElement('div');
        illustrationsBlock.className = 'idiom-content__illustrations';
        idiomBlock.appendChild(illustrationsBlock);

        idiom.illustrations.forEach(illustration => {
            const illustrationItemBlock = document.createElement('div');
            illustrationItemBlock.className = 'idiom-content__illustrations--item';
            illustrationItemBlock.innerHTML = illustration;
            illustrationsBlock.appendChild(illustrationItemBlock);
        });
    });

    popupBlock.appendChild(idiomsContentBlock);
    document.body.appendChild(popupBlock);
}