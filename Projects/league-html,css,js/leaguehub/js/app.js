let currentView="landing", currentLeagueId=null, currentTab="standings";

function toast(msg){const d=document.createElement("div");d.className="toast";d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2500);}

function navigate(view,leagueId){currentView=view;currentLeagueId=leagueId||null;render();}

function render(){
  renderNav();
  const m=document.getElementById("main-content");
  if(currentView==="landing") m.innerHTML=renderLanding();
  else if(currentView==="auth") m.innerHTML=renderAuth();
  else if(currentView==="dashboard") m.innerHTML=renderDashboard();
  else if(currentView==="league") m.innerHTML=renderLeague();
  bindEvents();
}

function renderNav(){
  const user=Auth.getCurrent();
  const nl=document.getElementById("nav-links");
  if(user) nl.innerHTML=`<button class="btn btn-outline btn-sm" onclick="navigate('dashboard')">Dashboard</button><button class="btn btn-sm btn-danger" onclick="Auth.logout();navigate('landing')">Logout</button>`;
  else nl.innerHTML=`<button class="btn btn-primary btn-sm" onclick="navigate('auth')">Sign In</button>`;
}

function renderLanding(){
  return `<div class="hero"><h1>⚽ LeagueHub</h1><p>Create leagues, generate fixtures, track results, and share standings — the simplest way to manage your sports leagues.</p><button class="btn btn-primary" onclick="navigate(Auth.getCurrent()?'dashboard':'auth')">Get Started</button></div>
  <div class="grid-cards"><div class="card text-center"><h2>📋 Create</h2><p class="text-muted text-sm">Set up a league in under a minute</p></div><div class="card text-center"><h2>🔄 Generate</h2><p class="text-muted text-sm">Auto round-robin fixtures</p></div><div class="card text-center"><h2>📊 Track</h2><p class="text-muted text-sm">Live standings & results</p></div></div>`;
}

function renderAuth(){
  return `<div style="max-width:380px;margin:3rem auto"><div class="card"><h2 id="auth-title">Sign In</h2>
  <div class="form-group"><label>Email</label><input id="auth-email" type="email" placeholder="you@example.com"></div>
  <div class="form-group"><label>Password</label><input id="auth-pass" type="password" placeholder="••••••••"></div>
  <button class="btn btn-primary" style="width:100%" id="auth-submit">Sign In</button>
  <p class="text-center text-sm mt-1">
    <span id="auth-toggle-text">No account?</span> <a href="#" id="auth-toggle" style="color:var(--primary)">Sign Up</a>
  </p></div></div>`;
}

function renderDashboard(){
  const user=Auth.getCurrent(); if(!user){navigate("auth");return "";}
  const leagues=LeagueDB.getAll().filter(l=>l.owner_id===user.id);
  let cards=leagues.map(l=>`<div class="card" style="cursor:pointer" onclick="navigate('league','${l.id}')"><div class="flex justify-between items-center"><h2>${esc(l.name)}</h2><span class="text-muted text-sm">${l.teams.length} teams</span></div><p class="text-muted text-sm mt-1">${l.matches.filter(m=>m.played).length}/${l.matches.length} played</p></div>`).join("");
  if(!cards) cards=`<div class="card text-center text-muted">No leagues yet. Create your first one!</div>`;
  return `<div class="flex justify-between items-center" style="margin-bottom:1rem"><h1>My Leagues</h1><button class="btn btn-primary" id="create-league-btn">+ New League</button></div><div class="grid-cards">${cards}</div>
  <div id="create-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;display:none;align-items:center;justify-content:center">
    <div class="card" style="max-width:400px;width:90%"><h2>Create League</h2><div class="form-group"><label>League Name</label><input id="new-league-name" placeholder="e.g. Sunday League 2025"></div><div class="flex gap-1"><button class="btn btn-primary" id="create-league-confirm">Create</button><button class="btn btn-outline" id="create-league-cancel">Cancel</button></div></div></div>`;
}

function renderLeague(){
  const league=LeagueDB.getById(currentLeagueId);
  if(!league){navigate("dashboard");return "";}
  const user=Auth.getCurrent(), isOwner=user&&league.owner_id===user.id;
  const table=calculateTable(league.teams,league.matches);
  const rounds=[...new Set(league.matches.map(m=>m.round))].sort((a,b)=>a-b);

  let tabs=`<div class="tabs"><div class="tab ${currentTab==="standings"?"active":""}" onclick="currentTab='standings';render()">Standings</div><div class="tab ${currentTab==="fixtures"?"active":""}" onclick="currentTab='fixtures';render()">Fixtures</div>${isOwner?`<div class="tab ${currentTab==="teams"?"active":""}" onclick="currentTab='teams';render()">Teams</div>`:""}</div>`;

  let content="";
  if(currentTab==="standings"){
    if(!table.length) content=`<div class="card text-center text-muted">Add teams and generate fixtures to see standings.</div>`;
    else content=`<div class="card" style="padding:0;overflow-x:auto"><table><thead><tr><th>#</th><th style="text-align:left">Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${table.map((e,i)=>`<tr><td>${i+1}</td><td>${esc(e.team)}</td><td>${e.played}</td><td>${e.wins}</td><td>${e.draws}</td><td>${e.losses}</td><td>${e.gf}</td><td>${e.ga}</td><td>${e.gd>0?"+":""}${e.gd}</td><td><strong>${e.pts}</strong></td></tr>`).join("")}</tbody></table></div>`;
  } else if(currentTab==="fixtures"){
    let gen="";
    if(isOwner&&league.matches.length===0&&league.teams.length>=2) gen=`<div class="text-center mt-1" style="margin-bottom:1rem"><button class="btn btn-primary" id="gen-fixtures">🔄 Generate Fixtures</button></div>`;
    if(!league.matches.length) content=gen+`<div class="card text-center text-muted">${league.teams.length<2?"Add at least 2 teams first.":"Click Generate Fixtures to create the schedule."}</div>`;
    else content=gen+rounds.map(r=>`<div class="card"><h2 style="font-size:1rem">Round ${r}</h2>${league.matches.filter(m=>m.round===r).map(m=>{
      if(isOwner) return `<div class="match-row"><span class="team">${esc(m.homeTeam)}</span><input type="number" min="0" value="${m.homeScore!==null?m.homeScore:""}" data-mid="${m.id}" data-side="h" class="score-input"><span style="color:var(--muted)">-</span><input type="number" min="0" value="${m.awayScore!==null?m.awayScore:""}" data-mid="${m.id}" data-side="a" class="score-input"><span class="team">${esc(m.awayTeam)}</span><button class="btn btn-primary btn-sm save-score" data-mid="${m.id}">✓</button></div>`;
      else return `<div class="match-row"><span class="team">${esc(m.homeTeam)}</span><strong>${m.played?m.homeScore:"-"}</strong><span style="color:var(--muted)">-</span><strong>${m.played?m.awayScore:"-"}</strong><span class="team">${esc(m.awayTeam)}</span></div>`;
    }).join("")}</div>`).join("");
  } else if(currentTab==="teams"&&isOwner){
    content=`<div class="card"><h2>Teams (${league.teams.length})</h2>
    <div class="flex gap-1 items-center" style="margin-bottom:1rem"><input id="new-team" placeholder="Team name" style="max-width:250px"><button class="btn btn-primary btn-sm" id="add-team-btn">+ Add</button></div>
    ${league.teams.length?league.teams.map(t=>`<div class="flex justify-between items-center" style="padding:.5rem .75rem;background:var(--secondary);border-radius:var(--radius);margin-bottom:.5rem"><span style="font-weight:600">${esc(t.name)}</span>${league.matches.length===0?`<button class="btn btn-danger btn-sm remove-team" data-tid="${t.id}">✕</button>`:""}</div>`).join(""):`<p class="text-muted text-sm">No teams yet.</p>`}
    ${league.teams.length>=2?`<button class="btn btn-primary mt-2" id="gen-fixtures">${league.matches.length?"🔄 Regenerate":"🔄 Generate"} Fixtures</button>`:""}
    </div>`;
  }

  const shareLink=window.location.href.split("?")[0]+`?view=${league.id}`;
  return `<div class="flex items-center gap-2" style="margin-bottom:1rem"><button class="btn btn-outline btn-sm" onclick="navigate('dashboard')">← Back</button><h1 style="font-size:1.25rem">⚽ ${esc(league.name)}</h1><button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('${shareLink}');toast('Link copied!')">📋 Share</button></div>${tabs}${content}`;
}

function esc(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML;}

function bindEvents(){
  // Auth
  let isSignup=false;
  const toggle=document.getElementById("auth-toggle");
  if(toggle) toggle.onclick=e=>{e.preventDefault();isSignup=!isSignup;document.getElementById("auth-title").textContent=isSignup?"Sign Up":"Sign In";document.getElementById("auth-submit").textContent=isSignup?"Sign Up":"Sign In";document.getElementById("auth-toggle-text").textContent=isSignup?"Have an account?":"No account?";document.getElementById("auth-toggle").textContent=isSignup?"Sign In":"Sign Up";};
  const authBtn=document.getElementById("auth-submit");
  if(authBtn) authBtn.onclick=()=>{
    const email=document.getElementById("auth-email").value.trim(),pass=document.getElementById("auth-pass").value;
    if(!email||!pass){toast("Fill in all fields");return;}
    if(isSignup){const r=Auth.signup(email,pass);if(r===true){toast("Account created!");navigate("dashboard");}else toast(r);}
    else{if(Auth.login(email,pass)){toast("Welcome back!");navigate("dashboard");}else toast("Invalid credentials");}
  };

  // Dashboard
  const clBtn=document.getElementById("create-league-btn");
  const modal=document.getElementById("create-modal");
  if(clBtn&&modal){
    clBtn.onclick=()=>{modal.style.display="flex";};
    document.getElementById("create-league-cancel").onclick=()=>{modal.style.display="none";};
    document.getElementById("create-league-confirm").onclick=()=>{
      const name=document.getElementById("new-league-name").value.trim();
      if(!name){toast("Enter a name");return;}
      LeagueDB.create(name,Auth.getCurrent().id);toast("League created!");modal.style.display="none";render();
    };
  }

  // Teams
  const addTeam=document.getElementById("add-team-btn");
  if(addTeam) addTeam.onclick=()=>{const n=document.getElementById("new-team").value.trim();if(!n)return;LeagueDB.addTeam(currentLeagueId,n);render();};
  document.querySelectorAll(".remove-team").forEach(b=>b.onclick=()=>{LeagueDB.removeTeam(currentLeagueId,b.dataset.tid);render();});

  // Fixtures
  const genBtn=document.getElementById("gen-fixtures");
  if(genBtn) genBtn.onclick=()=>{const l=LeagueDB.getById(currentLeagueId);l.matches=generateFixtures(l.teams);LeagueDB.update(l);currentTab="fixtures";toast("Fixtures generated!");render();};

  // Scores
  document.querySelectorAll(".save-score").forEach(b=>b.onclick=()=>{
    const mid=b.dataset.mid, row=b.parentElement;
    const hInput=row.querySelector(`[data-mid="${mid}"][data-side="h"]`);
    const aInput=row.querySelector(`[data-mid="${mid}"][data-side="a"]`);
    const h=parseInt(hInput.value),a=parseInt(aInput.value);
    if(isNaN(h)||isNaN(a)||h<0||a<0){toast("Enter valid scores");return;}
    const l=LeagueDB.getById(currentLeagueId);
    const m=l.matches.find(x=>x.id===mid);
    m.homeScore=h;m.awayScore=a;m.played=true;
    LeagueDB.update(l);toast("Score saved!");render();
  });
}

// Handle shared links
(function(){
  const params=new URLSearchParams(window.location.search);
  const viewId=params.get("view");
  if(viewId&&LeagueDB.getById(viewId)){currentView="league";currentLeagueId=viewId;currentTab="standings";}
  else if(Auth.getCurrent()) currentView="dashboard";
  render();
})();