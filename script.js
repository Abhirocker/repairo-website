const data={
  screens:["Premium Screens","Repairo's core launch category: premium-equivalent display components for major smartphone brands, designed around quality assurance, traceability and technician-friendly distribution."],
  batteries:["Batteries","A planned second-stage category focused on reliable replacement power cells, backed by the same quality and warranty philosophy."],
  charging:["Charging Ports","A planned expansion category for precision charging components, supported by technician training for more complex installations."],
  cameras:["Cameras & More","Supporting components in Repairo's longer-term portfolio, including cameras and adjacent repair parts."]
};
const modal=document.getElementById("modal");
document.querySelectorAll(".product").forEach(card=>card.onclick=()=>{
  const d=data[card.dataset.product];
  document.getElementById("modal-title").textContent=d[0];
  document.getElementById("modal-description").textContent=d[1];
  modal.classList.remove("hidden");
});
function closeModal(){modal.classList.add("hidden")}
document.getElementById("close").onclick=closeModal;
document.querySelector(".backdrop").onclick=closeModal;
document.getElementById("modal-link").onclick=closeModal;

document.getElementById("verify").onclick=()=>{
  const value=document.getElementById("serial").value.trim();
  const out=document.getElementById("verify-result");
  if(!value){out.textContent="Please enter a product ID.";out.style.color="#8b4d30";return}
  out.textContent=`✓ Prototype result: ${value} is recognized as a Repairo component.`;
  out.style.color="#5a7115";
};

document.getElementById("partner-form").onsubmit=(e)=>{
  e.preventDefault();
  document.getElementById("form-message").textContent="✓ Thanks! Your interest has been recorded in this prototype.";
  e.target.reset();
};

document.getElementById("hamburger").onclick=()=>{
  document.getElementById("nav").classList.toggle("mobile-open");
};
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>document.getElementById("nav").classList.remove("mobile-open"));
