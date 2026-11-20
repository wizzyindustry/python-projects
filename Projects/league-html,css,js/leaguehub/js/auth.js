const Auth = {
  getUsers() { return JSON.parse(localStorage.getItem("lh_users")||"[]"); },
  saveUsers(u) { localStorage.setItem("lh_users", JSON.stringify(u)); },
  getCurrent() { const id=localStorage.getItem("lh_current"); if(!id) return null; return this.getUsers().find(u=>u.id===id)||null; },
  login(email,pass) {
    const user=this.getUsers().find(u=>u.email===email&&u.password===pass);
    if(!user) return false;
    localStorage.setItem("lh_current",user.id); return true;
  },
  signup(email,pass) {
    const users=this.getUsers();
    if(users.find(u=>u.email===email)) return "Email already registered";
    const user={id:crypto.randomUUID(),email,password:pass};
    users.push(user); this.saveUsers(users);
    localStorage.setItem("lh_current",user.id); return true;
  },
  logout() { localStorage.removeItem("lh_current"); }
};