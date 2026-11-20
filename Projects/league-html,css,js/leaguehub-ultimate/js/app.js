// === Toast === 
const Toast = {
  show(msg, type='info', title=null){
    const c = document.getElementById('toast-container');
    const icon = {success:'✅',error:'⚠️',info:'ℹ️'}[type]||'ℹ️';
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<div class="toast-icon">${icon}</div><div class="toast-body">
      ${title?`<div class="toast-title">${title}</div>`:''}
      <div class="${title?'toast-msg':'toast-title'}">${msg}</div>
    </div>`;
    c.appendChild(el);
    setTimeout(()=>{ el.style.transition='.3s'; el.style.opacity='0'; el.style.transform='translateX(380px)'; setTimeout(()=>el.remove(),300); }, 3500);
  }
};

// === Modal ===
const Modal = {
  show(title, body){
    document.getElementById('modal-root').innerHTML = `
      <div class="modal-overlay" onclick="if(event.target===this)Modal.close()">
        <div class="modal fade-in">
          <div class="modal-header">
            <div class="card-title">${title}</div>
            <button class="btn btn-ghost btn-icon" onclick="Modal.close()">✕</button>
          </div>
          <div class="modal-body">${body}</div>
        </div>
      </div>`;
  },
  close(){ document.getElementById('modal-root').innerHTML = ''; window._pendingIcon = null; }
};

// === Router setup ===
Router.on('/', ()=>Pages.landing());
Router.on('/auth', ()=>Pages.auth());
Router.on('/login', ()=>Pages.login());
Router.on('/dashboard', ()=>Pages.dashboard());
Router.on('/profile', ()=>Pages.profile());
Router.on('/league/:id', id=>Pages.leagueDetail(id));
Router.on('/privacy', ()=>Pages.privacy());
Router.on('/terms', ()=>Pages.terms());
Router.on('/cookies', ()=>Pages.cookies());
Router.on('/help', ()=>Pages.help());
Router.on('/contact', ()=>Pages.contact());
Router.on('/faq', ()=>Pages.faq());

// Initial render
document.addEventListener('DOMContentLoaded', ()=>Router.resolve());
