const u='<section.+data-src="FarlexIdi">(.+?)</section>',d="<h2>(.+?)</h2>",p=`<div class=['"](ds-single|ds-list)['"]>(.+?)</div>`,E="(^.+?)<span",m="<span.+?>(.+?)</span>",I=t=>{const s=e(u,t);if(!s)return null;const n=e(d,s[0])[1],i=r(p,s[0]).map(o=>{const a=e(E,o[2])[1],l=r(m,o[2]).map(T=>T[1]);return{description:a,illustrations:l}});return{title:n,idioms:i}};function e(t,s){return r(t,s)[0]||null}function r(t,s){const n=new RegExp(t,"gm");return Array.from(s.matchAll(n))}const N=async(t,s,n)=>{const c=I(t.data.html);if(!c){n({success:!1});return}n({success:!0,data:c})},A=()=>{chrome.runtime.onMessage.addListener(N)};A();