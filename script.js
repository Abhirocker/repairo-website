const fallbackData={
  screens:["Premium Screens","Repairo's core launch category: premium-equivalent display components for major smartphone brands, designed around quality assurance, traceability and technician-friendly distribution."],
  batteries:["Batteries","A planned second-stage category focused on reliable replacement power cells, backed by the same quality and warranty philosophy."],
  charging:["Charging Ports","A planned expansion category for precision charging components, supported by technician training for more complex installations."],
  cameras:["Cameras & More","Supporting components in Repairo's longer-term portfolio, including cameras and adjacent repair parts."]
};
const modal=document.getElementById("modal");
// Real pricing teaser on each card, when the catalogue data file is loaded on this page.
if(typeof REPAIRO_CATALOG!=="undefined"){
  document.querySelectorAll(".product").forEach(card=>{
    const cat=REPAIRO_CATALOG.find(c=>c.id===card.dataset.product);
    if(!cat)return;
    const cheapest=Math.min(...cat.items.map(i=>i.duplicate));
    const copy=card.querySelector(".product-copy > div");
    if(copy){
      const teaser=document.createElement("span");
      teaser.className="price-teaser";
      teaser.textContent=`From ${RepairoCatalog.formatINR(cheapest)}`;
      copy.appendChild(teaser);
    }
  });
}
document.querySelectorAll(".product").forEach(card=>card.onclick=()=>{
  const catId=card.dataset.product;
  const cat=typeof REPAIRO_CATALOG!=="undefined"?REPAIRO_CATALOG.find(c=>c.id===catId):null;
  if(cat){
    const cheapestOriginal=Math.min(...cat.items.map(i=>i.original));
    const cheapestDup=Math.min(...cat.items.map(i=>i.duplicate));
    document.getElementById("modal-title").textContent=cat.name;
    document.getElementById("modal-description").textContent=
      `${cat.tagline} Duplicate from ${RepairoCatalog.formatINR(cheapestDup)} · Original from ${RepairoCatalog.formatINR(cheapestOriginal)}.`;
    const link=document.getElementById("modal-link");
    link.href=`components.html?cat=${catId}`;
    link.textContent="";
    link.innerHTML="View full catalogue & book <b>→</b>";
  }else{
    const d=fallbackData[catId];
    document.getElementById("modal-title").textContent=d[0];
    document.getElementById("modal-description").textContent=d[1];
  }
  modal.classList.remove("hidden");
});
function closeModal(){if(modal)modal.classList.add("hidden")}
if(modal){
  const closeBtn=document.getElementById("close");
  if(closeBtn)closeBtn.onclick=closeModal;
  const backdrop=document.querySelector(".backdrop");
  if(backdrop)backdrop.onclick=closeModal;
  const modalLink=document.getElementById("modal-link");
  if(modalLink)modalLink.onclick=closeModal;
}

const verifyBtn=document.getElementById("verify");
if(verifyBtn)verifyBtn.onclick=()=>{
  const value=document.getElementById("serial").value.trim();
  const out=document.getElementById("verify-result");
  if(!value){out.textContent="Please enter a product ID.";out.style.color="#8b4d30";return}
  out.textContent=`✓ Prototype result: ${value} is recognized as a Repairo component.`;
  out.style.color="#5a7115";
};

const partnerForm=document.getElementById("partner-form");
if(partnerForm)partnerForm.onsubmit=(e)=>{
  e.preventDefault();
  document.getElementById("form-message").textContent="✓ Thanks! Your interest has been recorded in this prototype.";
  e.target.reset();
};

document.getElementById("hamburger").onclick=()=>{
  document.getElementById("nav").classList.toggle("mobile-open");
};
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>document.getElementById("nav").classList.remove("mobile-open"));

// Expanded prototype interactions
function showResult(id,msg){const el=document.getElementById(id);if(el){el.textContent=msg;el.classList.add('show')}}
const cl=document.getElementById('customer-login');
if(cl) cl.onsubmit=e=>{e.preventDefault();showResult('customer-result','✓ Demo sign-in successful. Customer dashboard access is simulated for this academic prototype.')};
const tl=document.getElementById('tech-login');
if(tl) tl.onsubmit=e=>{e.preventDefault();showResult('tech-result','✓ Demo technician sign-in successful. Opening the proposed Repairo partner experience.')};
const tf=document.getElementById('track-form');
if(tf) tf.onsubmit=e=>{e.preventDefault();const id=document.getElementById('track-id').value.trim()||'REP-1048';showResult('track-result',`✓ ${id}: Demo status — repair completed and quality check passed. Actual tracking would connect to technician/order data.`)};
const wf=document.getElementById('warranty-form');
if(wf) wf.onsubmit=e=>{e.preventDefault();const id=document.getElementById('warranty-id').value.trim()||'REP-SCR-0001';showResult('warranty-result',`✓ ${id}: Prototype result — component recognized. Proposed coverage: 12–24 month warranty.`)};
const diagSteps=document.querySelectorAll('.diagnose-step');
if(diagSteps.length){
  let current=1,diagCategory='screens';
  const progress=document.getElementById('diag-progress');
  function go(n){
    current=n;
    diagSteps.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));
    if(progress)progress.style.width=Math.min(100,n*25)+'%';
    if(n===5){
      const label={screens:'SCREEN',batteries:'BATTERY',charging:'CHARGING PORT',cameras:'CAMERA'}[diagCategory]||'SCREEN';
      const scoreEl=document.getElementById('diag-score');if(scoreEl)scoreEl.textContent=label;
      const cta=document.getElementById('diag-primary-cta');if(cta)cta.href='components.html?cat='+diagCategory;
    }
  }
  document.querySelectorAll('.choice[data-next]').forEach(b=>b.onclick=()=>{if(b.dataset.category)diagCategory=b.dataset.category;go(Number(b.dataset.next))});
  document.querySelectorAll('.choice[data-finish]').forEach(b=>b.onclick=()=>go(5));
}
