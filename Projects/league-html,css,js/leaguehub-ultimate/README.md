# LeagueHub — Ultimate Edition

Standalone HTML / CSS / JavaScript league management app. **No build, no backend, no dependencies.**

## Run it
Just open `index.html` in any modern browser.

## Features
- ✅ Sign up → redirected to login for verification
- ✅ Profile photo upload (avatar settings)
- ✅ Create leagues, add teams with custom icons (emoji or uploaded logos)
- ✅ Auto round-robin fixture generation
- ✅ Live standings with W/D/L form badges
- ✅ Export standings & fixtures as PNG images
- ✅ Share league via public link
- ✅ Generate invitation links (email/WhatsApp/copy)
- ✅ Edit team icons directly from fixtures view
- ✅ Full footer with active legal & support pages
- ✅ Privacy Policy, Terms, Cookies, Help, Contact, FAQ pages
- ✅ Mobile responsive

## Files
- `index.html` — entry
- `css/style.css` + `css/components.css` — styles
- `js/storage.js` — localStorage wrapper
- `js/auth.js` — signup/login/profile
- `js/fixtures.js` — round-robin + standings calculator
- `js/league.js` — league/team/match/invite models
- `js/share.js` — invite links + image export
- `js/router.js` — hash-based router
- `js/pages.js` — page renderers
- `js/footer-pages.js` — legal/support content
- `js/app.js` — toast/modal/init
