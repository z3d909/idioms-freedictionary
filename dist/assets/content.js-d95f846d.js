(async()=>{document.querySelector(".content-holder").addEventListener("click",u);const t=document.querySelectorAll(".list-holder")[1];t&&t.addEventListener("click",d)})();async function u(e){if(e.target.tagName!=="A"||!e.currentTarget.querySelector("section ul").contains(e.target))return;e.preventDefault(),e.stopPropagation();const t=e.target;await r(t)}async function d(e){if(e.target.tagName!=="A")return;e.preventDefault(),e.stopPropagation();const t=e.target;await r(t)}async function r(e){const{success:t,data:o}=await l({html:await p(e.attributes.href.value),name:e.text});if(!t)return;const n=document.querySelector("div#idioms-popup");n&&i(n),f(o)}async function l(e){return await chrome.runtime.sendMessage({sender:"COACH_IDIOMS",data:e})}async function p(e){return new Promise((t,o)=>{const n=new XMLHttpRequest;n.open("GET",e,!0),n.send(null),n.onreadystatechange=()=>{n.readyState===4&&t(n.responseText)},n.onerror=()=>{o(n.statusText)}})}function i(e){e.remove()}function m(e){const t=window.getSelection(),o=document.createRange();t.removeAllRanges(),o.selectNodeContents(e),t.addRange(o);try{const c=document.execCommand("copy")?"Content copied successfully.":"Content copy was unsuccessful.";console.log(c)}catch(n){console.error("Failed to copy content: ",n)}t.removeAllRanges()}function f(e){const t=document.createElement("div");t.id="idioms-popup";const o=document.createElement("button");o.innerHTML="X",o.className="idioms-popup__close",o.addEventListener("click",()=>i(t)),t.appendChild(o);const n=y();t.appendChild(n);const c=document.createElement("div");c.className="idioms-popup__content",e.forEach((a,g)=>{const s=document.createElement("div");s.innerHTML=a,c.appendChild(s)}),n.addEventListener("click",()=>m(c)),t.appendChild(c),document.body.appendChild(t)}function y(){const e=document.createElement("button");return e.innerHTML="Copy",e.className="idioms-popup__copy",e}
