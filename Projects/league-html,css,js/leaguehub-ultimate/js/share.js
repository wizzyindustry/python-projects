// Image snapshot using SVG foreign-object → PNG; invite links
const Share = {
  link(leagueId){ return `${location.origin}${location.pathname}?league=${leagueId}`; },
  invite(leagueId){
    const inv = Invites.create(leagueId);
    return `${location.origin}${location.pathname}?invite=${inv.code}`;
  },
  copy(text){
    navigator.clipboard?.writeText(text);
    Toast.show('Copied to clipboard!','success');
  },
  async snapshot(elementId, filename){
    const el = document.getElementById(elementId);
    if(!el){ Toast.show('Nothing to capture','error'); return; }
    Toast.show('Generating image...','info');
    const rect = el.getBoundingClientRect();
    const w = Math.ceil(rect.width), h = Math.ceil(rect.height);
    // Clone with inline styles
    const clone = el.cloneNode(true);
    const styles = window.getComputedStyle(el);
    inlineAllStyles(el, clone);
    const xml = `<svg xmlns="http://www.w3.org/2000/svg" width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px;font-family:'Space Grotesk',sans-serif;">
          ${new XMLSerializer().serializeToString(clone)}
        </div>
      </foreignObject>
    </svg>`;
    const svgBlob = new Blob([xml],{type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w*2; canvas.height = h*2;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0,0,canvas.width, canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename || 'leaguehub.png';
        a.click();
        Toast.show('Image downloaded!','success');
      },'image/png');
      URL.revokeObjectURL(url);
    };
    img.onerror = () => Toast.show('Image generation failed','error');
    img.src = url;
  }
};

function inlineAllStyles(source, target){
  const srcs = source.querySelectorAll('*');
  const tgts = target.querySelectorAll('*');
  // Set on root
  copyStyle(source, target);
  for(let i=0;i<srcs.length;i++) copyStyle(srcs[i], tgts[i]);
}
function copyStyle(s, t){
  const cs = window.getComputedStyle(s);
  const props = ['color','background','background-color','background-image','font','font-family','font-size','font-weight','padding','margin','border','border-radius','display','flex-direction','align-items','justify-content','gap','width','height','text-align','line-height','letter-spacing','box-shadow','overflow','text-transform'];
  let style = '';
  props.forEach(p => { const v = cs.getPropertyValue(p); if(v) style += `${p}:${v};`; });
  t.setAttribute('style', style);
}
