const menu=document.querySelector('.menu');const nav=document.querySelector('nav');if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
const y=document.querySelector('#year');if(y)y.textContent=new Date().getFullYear();

const form=document.querySelector('#quote-form');
if(form){
  const params=new URLSearchParams(location.search);
  const requested=params.get('service');
  if(requested){
    const preset=form.querySelector('[data-service="'+requested+'"]');
    if(preset)preset.checked=true;
  }

  const phone=form.querySelector('#phone');
  const contactRadios=[...form.querySelectorAll('[data-contact]')];
  const phoneHint=document.querySelector('#phone-hint');

  const updatePhone=()=>{
    const chosen=contactRadios.find(r=>r.checked);
    const needs=chosen&&(chosen.dataset.contact==='whatsapp'||chosen.dataset.contact==='sms');
    phone.required=!!needs;
    if(phoneHint){
      phoneHint.textContent=needs
        ? 'Número de teléfono obligatorio para '+(chosen.dataset.contact==='whatsapp'?'WhatsApp':'SMS')+'.'
        : 'Si eliges WhatsApp o SMS, el número de teléfono será obligatorio.';
    }
  };

  contactRadios.forEach(r=>r.addEventListener('change',updatePhone));
  updatePhone();

  const noneSocial=form.querySelector('[data-none-social]');
  const socials=[...form.querySelectorAll('input[name="Redes sociales"]')];
  socials.forEach(s=>s.addEventListener('change',()=>{
    if(s===noneSocial&&s.checked){
      socials.filter(x=>x!==s).forEach(x=>x.checked=false);
    }else if(s!==noneSocial&&s.checked&&noneSocial){
      noneSocial.checked=false;
    }
  }));

  const buildMessage=()=>{
    const fd=new FormData(form);
    const services=fd.getAll('Servicios a cotizar');
    const languages=fd.getAll('Idioma de atención');
    const networks=fd.getAll('Redes sociales');

    return [
      'Nueva solicitud de cotización',
      '',
      'Nombre y apellido: '+(fd.get('Nombre y apellido')||''),
      'Correo electrónico: '+(fd.get('Correo electrónico')||''),
      'Número de teléfono: '+(fd.get('Número de teléfono')||'No indicado'),
      '¿Ya cuenta con página web y desea optimizarla?: '+(fd.get('¿Ya cuenta con página web y desea optimizarla?')||''),
      'Servicios a cotizar: '+(services.length?services.join(', '):''),
      'Idioma(s) de atención: '+(languages.length?languages.join(', '):''),
      'Redes sociales: '+(networks.length?networks.join(', '):'No indicadas'),
      'Pago del servicio en: '+(fd.get('Pago del servicio en')||''),
      'Canal preferido: '+(fd.get('Canal preferido')||''),
      'Mensaje adicional: '+(fd.get('Mensaje adicional')||'Sin mensaje adicional')
    ].join('\n');
  };

  form.addEventListener('submit',e=>{
    const services=[...form.querySelectorAll('input[name="Servicios a cotizar"]:checked')];
    const langs=[...form.querySelectorAll('[data-group="language"]:checked')];
    const se=document.querySelector('#service-error');
    const le=document.querySelector('#language-error');
    let ok=true;

    if(se)se.classList.remove('error');
    if(le)le.classList.remove('error');

    if(!services.length){if(se)se.classList.add('error');ok=false;}
    if(!langs.length){if(le)le.classList.add('error');ok=false;}

    updatePhone();

    if(!form.checkValidity()||!ok){
      e.preventDefault();
      form.reportValidity();
      if(!ok){
        const target=!services.length?se:le;
        if(target)target.scrollIntoView({behavior:'smooth',block:'center'});
      }
      return;
    }

    const chosen=contactRadios.find(r=>r.checked);
    const channel=chosen?chosen.dataset.contact:'email';

    if(channel==='whatsapp'){
      e.preventDefault();
      const text=encodeURIComponent(buildMessage());
      window.location.href='https://wa.me/18572011220?text='+text;
      return;
    }

    if(channel==='sms'){
      e.preventDefault();
      const text=encodeURIComponent(buildMessage());
      window.location.href='sms:+18572011220?&body='+text;
      return;
    }

    // Si elige correo electrónico, el formulario continúa normalmente
    // y FormSubmit envía la solicitud a nellypanessoa@gmail.com.
  });
}