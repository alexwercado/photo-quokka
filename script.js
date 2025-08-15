// ---------- Minimal assets (SVG data URIs) ----------
const BG_SVGS = [
    { id: 'bg1', label: 'Liso gris', data: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800"><rect width="100%" height="100%" fill="#d0d2d5"/></svg>') },
    { id: 'bg2', label: 'Rojo textura', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1800'><defs><pattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='%23b71c1c'/><circle cx='8' cy='8' r='2' fill='%23000000' opacity='0.06'/></pattern></defs><rect width='100%' height='100%' fill='url(%23p)'/></svg>`)},
    { id: 'bg3', label: 'Rayas negras', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1800'><rect width='100%' height='100%' fill='%23f0f0f0'/><g stroke='%23000000' stroke-width='40' stroke-linecap='round' opacity='0.14'><path d='M0 0 L1200 1200' /><path d='M0 200 L1000 1200' /><path d='M200 0 L1400 1200' /></g></svg>`)},
    { id: 'bg4', label: 'Rayas rojas', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1800'><rect width='100%' height='100%' fill='%23efefef'/><g stroke='%23b71c1c' stroke-width='50' stroke-linecap='round' opacity='0.18'><path d='M0 1200 L1200 0' /><path d='M0 1000 L1000 0' /></g></svg>`)},
    { id: 'bg5', label: 'Azul', data: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800"><rect width="100%" height="100%" fill="#1e3a8a"/></svg>') }
  ];
  
  // Simple stickers as SVGs
  const STICKERS = [
    { id:'s-heart', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path fill='%23ff4d6d' d='M47.8 8c-5.6 0-9.8 3.4-11.8 7.4-2-4-6.2-7.4-11.8-7.4-7.4 0-13.6 6.2-13.6 13.6 0 19.5 22.6 26.1 25.4 26.9.6.1 1.1.1 1.7 0 2.8-.8 25.4-7.4 25.4-26.9C61.4 14.2 55.2 8 47.8 8z'/></svg>`)},
    { id:'s-star', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path fill='%23ffd166' d='M32 3l7.4 15L56 20l-12 10 3 17L32 41 17 47l3-17L8 20l16.6-2L32 3z'/></svg>`)},
    { id:'s-smile', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='28' fill='%23ffdd57'/><circle cx='22' cy='26' r='4' fill='%23000'/><circle cx='42' cy='26' r='4' fill='%23000'/><path d='M20 40c6 6 18 6 24 0' stroke='%23000' stroke-width='3' stroke-linecap='round' fill='none'/></svg>`)},
    { id:'s-flame', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path fill='%23ff6b00' d='M32 4s-6 10-6 16c0 8 6 12 6 12s-2 2-2 6c0 5 4 10 4 10s4-5 4-10c0-4-2-6-2-6s6-4 6-12c0-6-6-16-6-16z'/></svg>`)},
    { id:'s-logo', data: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g fill='none' stroke='%23000' stroke-width='8'><path d='M30 150 L100 40 L170 150' stroke-linecap='round'/><path d='M60 120 L140 120' stroke-linecap='round'/></g></svg>`) }
  ];
  
  // ---------- Canvas and state ----------
  const canvas = document.getElementById('editor');
  const ctx = canvas.getContext('2d');
  let canvasW = canvas.width, canvasH = canvas.height;
  
  let state = {
    bgIndex: 0,
    bgImage: null,
    mainImage: null,
    main: {x: canvasW/2, y: canvasH/2, scale:1, rot:0},
    stickers: [],
    selectedSticker: -1,
    selectedMain: false,
    dragging: null
  };
  
  // touch gesture state
  let touchGesture = {active:false, target:null, initialDist:0, initialAngle:0, startScale:1, startRot:0};
  let isTouchGestureActive = false;
  
  // preload backgrounds and stickers
  const bgImgs = [];
  const stickerImgs = {};
  
  function loadImages(list, destArray, callback){
    let loaded=0; list.forEach((item,i)=>{
      const img = new Image(); img.src = item.data; img.onload = ()=>{loaded++; if(loaded===list.length && callback) callback();};
      destArray[i]=img;
    })
  }
  
  function loadStickerImages(list, destObj, callback){
    let loaded=0; list.forEach((item,i)=>{
      const img=new Image(); img.src=item.data; img.onload=()=>{loaded++; if(loaded===list.length && callback) callback();}; destObj[item.id]=img;
    })
  }
  
  loadImages(BG_SVGS, bgImgs, ()=>{ state.bgImage = bgImgs[0]; render(); });
  loadStickerImages(STICKERS, stickerImgs, ()=>{/*ready*/});
  
  // ---------- UI build ----------
  const bgThumbs = document.getElementById('bgThumbs');
  BG_SVGS.forEach((b,i)=>{
    const el = document.createElement('div'); el.className='thumb'+(i===0?' selected':''); el.title=b.label;
    const img = new Image(); img.src=b.data; el.appendChild(img);
    el.addEventListener('click', ()=>{document.querySelectorAll('.thumb').forEach(t=>t.classList.remove('selected')); el.classList.add('selected'); state.bgIndex=i; state.bgImage=bgImgs[i]; render();});
    bgThumbs.appendChild(el);
  });
  
  const stickersWrap = document.getElementById('stickers');
  STICKERS.forEach(s=>{
    const el=document.createElement('div'); el.className='sticker-thumb'; const img=new Image(); img.src=s.data; el.appendChild(img);
    el.addEventListener('click', ()=>{ addSticker(s.id); }); stickersWrap.appendChild(el);
  });
  
  // upload
  const upload = document.getElementById('upload'); upload.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if(!f) return; const url = URL.createObjectURL(f); const img = new Image(); img.onload = ()=>{state.mainImage=img; state.main.scale= Math.min(canvasW/img.width, canvasH/img.height); state.main.x=canvasW/2; state.main.y=canvasH/2; state.main.rot = 0; document.getElementById('photoRot').value = 0; render(); URL.revokeObjectURL(url);}; img.src=url;
  });
  
  // photo zoom
  const z = document.getElementById('photoZoom'); z.addEventListener('input', ()=>{ state.main.scale = parseFloat(z.value); render(); });
  
  // photo rotation control
  const photoRot = document.getElementById('photoRot'); photoRot.addEventListener('input', ()=>{ state.main.rot = parseFloat(photoRot.value) * Math.PI/180; render(); });
  
  // move photo checkbox
  const movePhoto = document.getElementById('movePhoto');
  
  // sticker controls
  const stickerControls = document.getElementById('stickerControls');
  const stickerScale = document.getElementById('stickerScale');
  const stickerRot = document.getElementById('stickerRot');
  const deleteStickerBtn = document.getElementById('deleteSticker');
  
  stickerScale.addEventListener('input', ()=>{ if(state.selectedSticker>-1){ state.stickers[state.selectedSticker].scale = parseFloat(stickerScale.value); render(); }});
  stickerRot.addEventListener('input', ()=>{ if(state.selectedSticker>-1){ state.stickers[state.selectedSticker].rot = parseFloat(stickerRot.value) * Math.PI/180; render(); }});
  deleteStickerBtn.addEventListener('click', ()=>{ if(state.selectedSticker>-1){ state.stickers.splice(state.selectedSticker,1); state.selectedSticker=-1; updateStickerUI(); render(); }});
  
  // clear
  document.getElementById('clearBtn').addEventListener('click', ()=>{ state.mainImage=null; state.stickers=[]; state.selectedSticker=-1; state.selectedMain=false; render(); });
  
  // export
  document.getElementById('exportBtn').addEventListener('click', ()=>{
    // export at same canvas size
    const dt = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href=dt; a.download='edit.png'; a.click();
  });
  
  // add sticker
  function addSticker(id){ const img = stickerImgs[id]; if(!img) return; const s={id:id,img:img,x:canvasW/2,y:canvasH/2,scale:1,rot:0,w:img.width,h:img.height}; state.stickers.push(s); state.selectedSticker=state.stickers.length-1; state.selectedMain=false; updateStickerUI(); render(); }
  
  function updateStickerUI(){ if(state.selectedSticker>-1){ stickerControls.style.display='block'; const s=state.stickers[state.selectedSticker]; stickerScale.value = s.scale; stickerRot.value = s.rot * 180/Math.PI; } else stickerControls.style.display='none'; }
  
  // ---------- improved hit-testing & rotate handle ----------
  function getPointerPos(e){ const rect = canvas.getBoundingClientRect(); const x = (e.clientX - rect.left) * (canvas.width / rect.width); const y = (e.clientY - rect.top) * (canvas.height / rect.height); return {x,y}; }
  function getTouchPos(t){ const rect = canvas.getBoundingClientRect(); const x = (t.clientX - rect.left) * (canvas.width / rect.width); const y = (t.clientY - rect.top) * (canvas.height / rect.height); return {x,y}; }
  
  function isPointInSticker(s, x, y){ // transform point into sticker local coordinates (inverse rotation)
    const dx = x - s.x; const dy = y - s.y; const cos = Math.cos(-s.rot||0); const sin = Math.sin(-s.rot||0);
    const lx = dx * cos - dy * sin; const ly = dx * sin + dy * cos; const sw = (s.w||s.img.width) * (s.scale||1); const sh = (s.h||s.img.height) * (s.scale||1);
    return lx >= -sw/2 && lx <= sw/2 && ly >= -sh/2 && ly <= sh/2;
  }
  
  function isPointInMain(x, y){ if(!state.mainImage) return false; const s = state.main; const dx = x - s.x; const dy = y - s.y; const cos = Math.cos(-s.rot||0); const sin = Math.sin(-s.rot||0); const lx = dx * cos - dy * sin; const ly = dx * sin + dy * cos; const sw = state.mainImage.width * (s.scale||1); const sh = state.mainImage.height * (s.scale||1); return lx >= -sw/2 && lx <= sw/2 && ly >= -sh/2 && ly <= sh/2; }
  
  function getRotateHandlePos(s){ const sw = (s.w|| (s===state.main ? state.mainImage && state.mainImage.width : s.img.width)) * (s.scale||1); const sh = (s.h|| (s===state.main ? state.mainImage && state.mainImage.height : s.img.height)) * (s.scale||1); const d = Math.max(sw, sh)/2 + 28; // distance from center
    const hx = s.x + Math.sin(s.rot||0) * d; const hy = s.y - Math.cos(s.rot||0) * d; return {x: hx, y: hy}; }
  
  // ---------- touch gesture helpers ----------
  function distBetween(a,b){ const dx = a.x-b.x; const dy = a.y-b.y; return Math.hypot(dx,dy); }
  function angleBetween(a,b){ return Math.atan2(b.y-a.y, b.x-a.x); }
  
  // ---------- Pointer interactions (with rotate handle) ----------
  let pointerDown = false;
  canvas.addEventListener('pointerdown',(e)=>{ // ignore pointer events when a multi-touch gesture is active
    if(isTouchGestureActive) return;
    const p = getPointerPos(e); pointerDown = true;
    // check rotate handle first for selected sticker
    if(state.selectedSticker>-1){ const s = state.stickers[state.selectedSticker]; const h = getRotateHandlePos(s); const threshold = (e.pointerType==='touch')?20:14; const dx = p.x - h.x; const dy = p.y - h.y; if(Math.hypot(dx,dy) < threshold){ // start rotating sticker
        state.dragging = {type:'sticker-rotate', index: state.selectedSticker, startAngle: Math.atan2(p.y - s.y, p.x - s.x) - s.rot}; canvas.style.cursor = 'grabbing'; return; }
    }
  
    // check stickers top-down to select/drag
    for(let i=state.stickers.length-1;i>=0;i--){ const s=state.stickers[i]; if(isPointInSticker(s,p.x,p.y)){ state.selectedSticker=i; state.selectedMain=false; // calculate local offset for smooth dragging
        const dx = p.x - s.x; const dy = p.y - s.y; state.dragging = {type:'sticker-move', index:i, ox:dx, oy:dy}; updateStickerUI(); render(); canvas.style.cursor = 'grabbing'; return; }}
  
    // check rotate handle for main image (if any)
    if(state.mainImage){ const h = getRotateHandlePos(state.main); const threshold = (e.pointerType==='touch')?20:14; const dxh = p.x - h.x; const dyh = p.y - h.y; if(Math.hypot(dxh,dyh) < threshold){ // start rotating photo
        state.selectedSticker=-1; state.selectedMain=true; state.dragging = {type:'photo-rotate', startAngle: Math.atan2(p.y - state.main.y, p.x - state.main.x) - state.main.rot}; canvas.style.cursor = 'grabbing'; document.getElementById('photoRot').value = state.main.rot * 180/Math.PI; return; }}
  
    // if movePhoto enabled and mainImage exists, check main image bounding (with rotation)
    if(movePhoto.checked && state.mainImage && isPointInMain(p.x,p.y)){ state.selectedSticker=-1; state.selectedMain=true; const mi = state.mainImage; const dx = p.x - state.main.x; const dy = p.y - state.main.y; state.dragging = {type:'photo', ox: dx, oy: dy}; canvas.style.cursor = 'grabbing'; document.getElementById('photoRot').value = state.main.rot * 180/Math.PI; return; }
  
    // otherwise deselect
    state.selectedSticker=-1; state.selectedMain=false; updateStickerUI(); render();
  });
  
  canvas.addEventListener('pointermove',(e)=>{ if(isTouchGestureActive) return; const p = getPointerPos(e);
    if(!pointerDown || !state.dragging) { // update cursor when hovering handles or stickers
      // hover rotate handle for selected sticker or main
      let hoveringHandle = false;
      if(state.selectedSticker>-1){ const s = state.stickers[state.selectedSticker]; const h = getRotateHandlePos(s); const dx = p.x - h.x; const dy = p.y - h.y; if(Math.hypot(dx,dy) < 14) { canvas.style.cursor='grab'; hoveringHandle=true; } }
      if(!hoveringHandle && state.mainImage){ const h = getRotateHandlePos(state.main); const dx = p.x - h.x; const dy = p.y - h.y; if(Math.hypot(dx,dy) < 14) { canvas.style.cursor='grab'; hoveringHandle=true; } }
      if(!hoveringHandle){ // check hover on any sticker or main
        let hoverAny=false; for(let i=state.stickers.length-1;i>=0;i--){ if(isPointInSticker(state.stickers[i], p.x, p.y)){ canvas.style.cursor='grab'; hoverAny=true; break; }} if(!hoverAny && state.mainImage && isPointInMain(p.x,p.y)) { canvas.style.cursor='grab'; hoverAny=true; }
        if(!hoverAny) canvas.style.cursor='default'; }
      return; }
  
    const d = state.dragging;
    if(d.type==='sticker-move'){ const s = state.stickers[d.index]; s.x = p.x - d.ox; s.y = p.y - d.oy; render(); }
    else if(d.type==='sticker-rotate'){ const s = state.stickers[d.index]; const ang = Math.atan2(p.y - s.y, p.x - s.x); s.rot = ang - d.startAngle; updateStickerUI(); render(); }
    else if(d.type==='photo'){ state.main.x = p.x - d.ox; state.main.y = p.y - d.oy; render(); }
    else if(d.type==='photo-rotate'){ const s = state.main; const ang = Math.atan2(p.y - s.y, p.x - s.x); s.rot = ang - d.startAngle; photoRot.value = s.rot * 180/Math.PI; render(); }
  });
  
  canvas.addEventListener('pointerup',(e)=>{ if(isTouchGestureActive) return; pointerDown=false; state.dragging=null; canvas.style.cursor='default'; });
  canvas.addEventListener('pointercancel',(e)=>{ if(isTouchGestureActive) return; pointerDown=false; state.dragging=null; canvas.style.cursor='default'; });
  
  // ---------- touch (multi-touch) gestures for mobile ----------
  canvas.addEventListener('touchstart',(e)=>{
    if(e.touches.length===2){ e.preventDefault(); isTouchGestureActive = true; touchGesture.active = true;
      const t0 = getTouchPos(e.touches[0]); const t1 = getTouchPos(e.touches[1]); touchGesture.initialDist = distBetween(t0,t1); touchGesture.initialAngle = angleBetween(t0,t1);
      // prefer selected sticker, else selected main
      if(state.selectedSticker>-1){ touchGesture.target = {type:'sticker', index: state.selectedSticker}; const s = state.stickers[state.selectedSticker]; touchGesture.startScale = s.scale; touchGesture.startRot = s.rot; }
      else if(state.selectedMain){ touchGesture.target = {type:'main'}; touchGesture.startScale = state.main.scale; touchGesture.startRot = state.main.rot; }
      else { touchGesture.target = null; }
    }
  }, {passive:false});
  
  canvas.addEventListener('touchmove',(e)=>{
    if(!touchGesture.active) return; if(e.touches.length<2) return; e.preventDefault();
    const t0 = getTouchPos(e.touches[0]); const t1 = getTouchPos(e.touches[1]); const d = distBetween(t0,t1); const ang = angleBetween(t0,t1);
    const scaleFactor = d / touchGesture.initialDist;
    const deltaAng = ang - touchGesture.initialAngle;
    if(touchGesture.target){ if(touchGesture.target.type==='sticker'){ const s = state.stickers[touchGesture.target.index]; s.scale = Math.max(0.1, touchGesture.startScale * scaleFactor); s.rot = touchGesture.startRot + deltaAng; state.selectedMain = false; updateStickerUI(); render(); }
      else if(touchGesture.target.type==='main'){ state.main.scale = Math.max(0.1, touchGesture.startScale * scaleFactor); state.main.rot = touchGesture.startRot + deltaAng; photoRot.value = state.main.rot * 180/Math.PI; render(); }
    }
  }, {passive:false});
  
  canvas.addEventListener('touchend',(e)=>{
    if(e.touches.length < 2){ touchGesture.active=false; touchGesture.target=null; isTouchGestureActive=false; }
  }, {passive:false});
  
  // wheel to change scale of selected sticker (desktop)
  canvas.addEventListener('wheel',(e)=>{ if(state.selectedSticker>-1){ e.preventDefault(); const s = state.stickers[state.selectedSticker]; const delta = e.deltaY>0? -0.05:0.05; s.scale = Math.max(0.1, s.scale + delta); stickerScale.value = s.scale; render(); }});
  
  // ---------- rendering ----------
  function render(){ ctx.clearRect(0,0,canvasW,canvasH);
    // draw bg
    if(state.bgImage){ ctx.drawImage(state.bgImage, 0, 0, canvasW, canvasH); } else { ctx.fillStyle='#ddd'; ctx.fillRect(0,0,canvasW,canvasH); }
    // draw main image centered (with rotation)
    if(state.mainImage){ const mi = state.mainImage; const mw = mi.width*state.main.scale; const mh = mi.height*state.main.scale; ctx.save(); ctx.translate(state.main.x, state.main.y); ctx.rotate(state.main.rot||0); ctx.drawImage(mi, -mw/2, -mh/2, mw, mh);
      // draw faint outline when movePhoto enabled
      if(movePhoto.checked){ ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=4; ctx.strokeRect(-mw/2,-mh/2,mw,mh); ctx.restore(); }
      // draw rotate handle if main is selected
      if(state.selectedMain){ const handleDist = Math.max(mw, mh)/2 + 28; const hx = Math.sin(state.main.rot||0) * handleDist; const hy = -Math.cos(state.main.rot||0) * handleDist; ctx.beginPath(); ctx.arc(hx, hy, 14, 0, Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=2; ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -mh/2); ctx.lineTo(hx, hy); ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=2; ctx.stroke(); }
      ctx.restore();
    }
    // stickers
    state.stickers.forEach((s,i)=>{
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot||0); const sw = (s.w||s.img.width) * (s.scale||1); const sh = (s.h||s.img.height) * (s.scale||1); ctx.drawImage(s.img, -sw/2, -sh/2, sw, sh);
      if(i===state.selectedSticker){ ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=2; ctx.strokeRect(-sw/2, -sh/2, sw, sh);
        // draw rotate handle
        const handleDist = Math.max(sw, sh)/2 + 28; const hx = Math.sin(s.rot||0) * handleDist; const hy = -Math.cos(s.rot||0) * handleDist;
        ctx.beginPath(); ctx.arc(hx, hy, 14, 0, Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=2; ctx.stroke();
        // draw small line connecting
        ctx.beginPath(); ctx.moveTo(0, -sh/2); ctx.lineTo(hx, hy); ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=2; ctx.stroke();
      }
      ctx.restore();
    });
  }
  
  // resize canvas to be responsive but keep drawing scale
  function resizeCanvas(){ const wrap = canvas.parentElement; // keep aspect ratio portrait like example
    const oldW = canvasW; const oldH = canvasH;
    const maxW = Math.min(1100, wrap.clientWidth - 20);
    // choose height by aspect
    const desiredW = Math.max(320, maxW);
    const displayW = desiredW; const displayH = Math.round(displayW * (1500/900));
    // set CSS size and internal pixel ratio (use 1:1 to keep coordinates simple)
    canvas.style.width = displayW + 'px'; canvas.style.height = displayH + 'px';
    canvas.width = displayW; canvas.height = displayH;
    canvasW = canvas.width; canvasH = canvas.height;
    // keep transform identity so drawing coords == CSS pixels
    ctx.setTransform(1,0,0,1,0,0);
    // scale existing object coordinates to new size so they stay in same relative positions
    if(oldW && oldH){ const sx = canvasW / oldW; const sy = canvasH / oldH; state.main.x *= sx; state.main.y *= sy; state.stickers.forEach(s=>{ s.x *= sx; s.y *= sy; }); }
    render();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  // initial render
  render();
  