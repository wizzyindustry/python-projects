
const Auth = {
  STORAGE_KEY: "leaguehub_users",
  SESSION_KEY: "leaguehub_session",

  getUsers() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  },
  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  },
  signup(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return { error: "Email already registered" };
    if (password.length < 6) return { error: "Password must be at least 6 characters" };
    const user = { id: crypto.randomUUID(), name, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    this.saveUsers(users);
    this.setSession(user);
    return { user };
  },
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { error: "Invalid email or password" };
    this.setSession(user);
    return { user };
  },
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },
  setSession(user) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  },
  getSession() {
    const s = localStorage.getItem(this.SESSION_KEY);
    return s ? JSON.parse(s) : null;
  }
};
