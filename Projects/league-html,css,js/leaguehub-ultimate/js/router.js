const Router = {
  routes:{}, current:'',
  on(path, handler){ this.routes[path] = handler; },
  go(path, opts={}){
    if(!opts.silent) history.pushState({}, '', '#'+path);
    this.resolve();
  },
  resolve(){
    const hash = location.hash.slice(1) || '/';
    const params = new URLSearchParams(location.search);
    // Public routes
    if(params.get('league')){ return Pages.publicLeague(params.get('league')); }
    if(params.get('invite')){ return Pages.invite(params.get('invite')); }
    let route = '/', param = null;
    for(const r of Object.keys(this.routes)){
      if(r === hash){ route = r; break; }
      if(r.includes(':')){
        const re = new RegExp('^'+r.replace(/:([^/]+)/g,'([^/]+)')+'$');
        const m = hash.match(re);
        if(m){ route = r; param = m[1]; break; }
      }
    }
    this.current = route;
    this.routes[route]?.(param);
    window.scrollTo(0,0);
  }
};
window.addEventListener('popstate', () => Router.resolve());
window.addEventListener('hashchange', () => Router.resolve());
