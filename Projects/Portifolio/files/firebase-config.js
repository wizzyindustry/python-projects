(function() {
  'use strict';

  const CONFIG_KEY = 'wizzyFirebaseConfig';
  const DATA_KEY = 'wizzyAdminData';
  const DB_URL_KEY = 'wizzyRTDBUrl';

  const DEFAULT_CONFIG = {
    apiKey: "AIzaSyAGlw96F_M4ZVrCm47bujyA9jt-YJV3bGg",
    authDomain: "kingston-de40f.firebaseapp.com",
    projectId: "kingston-de40f",
    storageBucket: "kingston-de40f.firebasestorage.app",
    messagingSenderId: "245091752642",
    appId: "1:245091752642:web:ff0eba3ee6c5338e72795b",
    measurementId: "G-47TFNSRXTK"
  };

  window.FirebaseSync = {
    isConfigured,
    configure,
    getConfig,
    getDbUrl,
    setDbUrl,
    fetch: fetchData,
    push: pushData
  };

  function getDbUrl() {
    const custom = localStorage.getItem(DB_URL_KEY);
    if (custom) return custom;
    return 'https://kingston-de40f-default-rtdb.firebaseio.com/adminData.json';
  }

  function setDbUrl(url) {
    localStorage.setItem(DB_URL_KEY, url);
  }

  function isConfigured() {
    return !!(getConfig()?.apiKey && getConfig()?.projectId);
  }

  function getConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
    } catch { return DEFAULT_CONFIG; }
  }

  function configure(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  async function fetchData() {
    if (!isConfigured()) return null;
    try {
      const res = await fetch(getDbUrl());
      if (!res.ok) return null;
      const data = await res.json();
      return data || null;
    } catch (e) {
      return null;
    }
  }

  async function pushData(data) {
    if (!isConfigured()) return false;
    try {
      data._timestamp = Date.now();
      const res = await fetch(getDbUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncFromFirebase);
  } else {
    syncFromFirebase();
  }

  async function syncFromFirebase() {
    if (!isConfigured()) return;
    try {
      const fbData = await fetchData();
      if (!fbData) return;
      const localRaw = localStorage.getItem(DATA_KEY);
      const localData = localRaw ? JSON.parse(localRaw) : null;
      const fbTs = fbData._timestamp || 0;
      const localTs = localData ? (localData._timestamp || 0) : 0;
      if (fbTs > localTs) {
        localStorage.setItem(DATA_KEY, JSON.stringify(fbData));
        location.reload();
      }
    } catch (e) {
      // Silently fail
    }
  }
})();
