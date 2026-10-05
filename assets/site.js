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
  const submitButton=form.querySelector('.form-submit');
  const contactRadios=[...form.querySelectorAll('[data-contact]')];
  const phoneHint=document.querySelector('#phone-hint');

  const selectedChannel=()=>{
    const chosen=contactRadios.find(r=>r.checked);
    return chosen?chosen.dataset.contact:null;
  };

  const updateChannelUI=()=>{
    const channel=selectedChannel();
    const needs=channel==='whatsapp'||channel==='sms';
    phone.required=needs;
    if(phoneHint){
      phoneHint.textContent=needs
        ? 'Número de teléfono obligatorio para '+(channel==='whatsapp'?'WhatsApp':'SMS')+'.'
        : 'Si eliges WhatsApp o SMS, el número de teléfono será obligatorio.';
    }
    if(submitButton){
      if(channel==='whatsapp') submitButton.textContent='Continuar por WhatsApp ↗';
      else if(channel==='sms') submitButton.textContent='Continuar por SMS ↗';
      else if(channel==='email') submitButton.textContent='Enviar por correo electrónico ↗';
      else submitButton.textContent='Enviar solicitud de cotización ↗';
    }
  };

  contactRadios.forEach(r=>r.addEventListener('change',updateChannelUI));
  updateChannelUI();

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
    e.preventDefault();

    const services=[...form.querySelectorAll('input[name="Servicios a cotizar"]:checked')];
    const langs=[...form.querySelectorAll('[data-group="language"]:checked')];
    const se=document.querySelector('#service-error');
    const le=document.querySelector('#language-error');
    let ok=true;

    if(se)se.classList.remove('error');
    if(le)le.classList.remove('error');
    if(!services.length){if(se)se.classList.add('error');ok=false;}
    if(!langs.length){if(le)le.classList.add('error');ok=false;}

    updateChannelUI();

    if(!form.checkValidity()||!ok){
      form.reportValidity();
      if(!ok){
        const target=!services.length?se:le;
        if(target)target.scrollIntoView({behavior:'smooth',block:'center'});
      }
      return;
    }

    const channel=selectedChannel();
    const message=buildMessage();

    if(channel==='whatsapp'){
      window.location.assign('https://wa.me/18572011220?text='+encodeURIComponent(message));
      return;
    }

    if(channel==='sms'){
      const isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
      const separator=isiOS?'&':'?';
      window.location.assign('sms:+18572011220'+separator+'body='+encodeURIComponent(message));
      return;
    }

    if(channel==='email'){
      form.action='https://formsubmit.co/nellypanessoa@gmail.com';
      HTMLFormElement.prototype.submit.call(form);
      return;
    }
  });
}