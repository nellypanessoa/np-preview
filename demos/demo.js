
(()=>{'use strict';
document.querySelectorAll('[data-filter-group]').forEach(group=>{
 const name=group.getAttribute('data-filter-group');
 const buttons=[...group.querySelectorAll('[data-filter]')];
 const items=[...document.querySelectorAll('[data-category]')].filter(el=>el.getAttribute('data-filter-set')===name);
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const chosen=button.getAttribute('data-filter');
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  items.forEach(item=>{item.hidden=chosen!=='todos'&&item.getAttribute('data-category')!==chosen;});
 }));
});
document.querySelectorAll('[data-demo-form]').forEach(form=>{
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const output=form.querySelector('[data-form-result]');
  if(output){output.hidden=false;output.textContent='Vista de demostración: no se enviaron datos ni se generó una solicitud real.';output.focus();}
 });
});
const search=document.querySelector('[data-property-search]');
if(search){
 const cards=[...document.querySelectorAll('[data-property]')];
 const output=document.querySelector('[data-count]');
 const update=()=>{
  const operation=search.querySelector('[name=operacion]')?.value||'todas';
  const city=search.querySelector('[name=ciudad]')?.value||'todas';
  let visible=0;
  cards.forEach(card=>{const match=(operation==='todas'||card.dataset.operation===operation)&&(city==='todas'||card.dataset.city===city);card.hidden=!match;if(match)visible++;});
  if(output)output.textContent=visible+' inmueble'+(visible===1?' de muestra':'s de muestra')+' encontrado'+(visible===1?'':'s');
 };
 search.addEventListener('change',update);update();
}
})();