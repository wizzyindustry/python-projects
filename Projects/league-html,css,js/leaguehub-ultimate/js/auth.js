const Auth = {
  current(){ return Store.get(KEYS.SESSION); },
  users(){ return Store.get(KEYS.USERS, []); },
  saveUsers(u){ Store.set(KEYS.USERS, u); },
  signup(name, email, password){
    const users = this.users();
    if(users.find(u => u.email === email)) throw new Error('Email already registered');
    const user = { id: uid(), name, email, password, avatar:null, bio:'', joined: Date.now() };
    users.push(user); this.saveUsers(users);
    // Add to "pending verification" — must login to verify
    Store.set(KEYS.PENDING, email);
    return user;
  },
  login(email, password){
    const user = this.users().find(u => u.email === email && u.password === password);
    if(!user) throw new Error('Invalid email or password');
    Store.set(KEYS.SESSION, { id:user.id, email:user.email, name:user.name });
    Store.del(KEYS.PENDING);
    return user;
  },
  logout(){ Store.del(KEYS.SESSION); },
  update(patch){
    const users = this.users();
    const sess = this.current();
    if(!sess) return;
    const i = users.findIndex(u => u.id === sess.id);
    if(i>-1){ users[i] = {...users[i], ...patch}; this.saveUsers(users);
      Store.set(KEYS.SESSION, {...sess, name: users[i].name, email: users[i].email});
    }
    return users[i];
  },
  fullUser(){ const s = this.current(); if(!s) return null; return this.users().find(u=>u.id===s.id); }
};
