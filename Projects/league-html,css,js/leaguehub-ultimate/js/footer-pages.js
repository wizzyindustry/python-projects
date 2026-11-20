// === Footer / Static Pages ===
Object.assign(Pages, {
  privacy(){
    App().innerHTML = renderNav() + `<div class="container"><div class="static-page fade-in">
      <h1>Privacy Policy</h1>
      <div class="static-meta">Last updated: ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
      <p>At LeagueHub, your privacy matters. This policy explains what data we collect, how we use it, and the choices you have.</p>
      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email, and password (encrypted) when you sign up.</li>
        <li><strong>League data:</strong> league names, teams, fixtures, and scores you create.</li>
        <li><strong>Usage data:</strong> anonymous analytics about how the platform is used.</li>
        <li><strong>Device data:</strong> browser, IP address, and timestamps for security.</li>
      </ul>
      <h2>2. How We Use Your Data</h2>
      <ul>
        <li>To provide and improve the LeagueHub service.</li>
        <li>To authenticate you and protect your account.</li>
        <li>To send essential service emails (password resets, important changes).</li>
        <li>To analyze usage and improve features (aggregated only).</li>
      </ul>
      <h2>3. Sharing Your Data</h2>
      <p>We do not sell your data. We share data only with trusted service providers (hosting, analytics) under strict confidentiality agreements, or when legally required.</p>
      <h2>4. Public Content</h2>
      <p>League pages shared via public links are accessible to anyone with the link. Do not share sensitive information through public leagues.</p>
      <h2>5. Your Rights</h2>
      <ul>
        <li>Access, edit, or delete your account at any time from your profile.</li>
        <li>Request a complete data export by emailing privacy@leaguehub.app.</li>
        <li>Withdraw consent for non-essential processing.</li>
      </ul>
      <h2>6. Data Retention</h2>
      <p>Your data is kept while your account is active. You may delete your account at any time, and we'll erase your data within 30 days.</p>
      <h2>7. Children's Privacy</h2>
      <p>LeagueHub is not directed at children under 13. We do not knowingly collect data from children under 13.</p>
      <h2>8. Contact</h2>
      <p>Questions about privacy? Email <strong>privacy@leaguehub.app</strong>.</p>
    </div></div>${renderFooter()}`;
  },

  terms(){
    App().innerHTML = renderNav() + `<div class="container"><div class="static-page fade-in">
      <h1>Terms of Service</h1>
      <div class="static-meta">Last updated: ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
      <p>Welcome to LeagueHub. By creating an account or using our service, you agree to these terms.</p>
      <h2>1. Account Eligibility</h2>
      <p>You must be at least 13 years old to create an account. You're responsible for maintaining the confidentiality of your password.</p>
      <h2>2. Acceptable Use</h2>
      <ul>
        <li>Don't use LeagueHub for unlawful, abusive, or fraudulent activity.</li>
        <li>Don't attempt to break, hack, or disrupt the service.</li>
        <li>Don't upload offensive content, hate speech, or content that infringes others' rights.</li>
        <li>Don't impersonate other people or organizations.</li>
      </ul>
      <h2>3. Your Content</h2>
      <p>You retain ownership of leagues, teams, and data you create. By using LeagueHub, you grant us permission to host and display this content as needed to operate the service.</p>
      <h2>4. Service Availability</h2>
      <p>We strive for high uptime but cannot guarantee uninterrupted access. The service is provided "as is" without warranty.</p>
      <h2>5. Termination</h2>
      <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time.</p>
      <h2>6. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, LeagueHub is not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
      <h2>7. Changes to These Terms</h2>
      <p>We may update these terms from time to time. We'll notify you of significant changes via email or in-app notification.</p>
      <h2>8. Governing Law</h2>
      <p>These terms are governed by the laws of your country of residence, without regard to conflict of laws principles.</p>
      <h2>9. Contact</h2>
      <p>Questions? Email <strong>legal@leaguehub.app</strong>.</p>
    </div></div>${renderFooter()}`;
  },

  cookies(){
    App().innerHTML = renderNav() + `<div class="container"><div class="static-page fade-in">
      <h1>Cookies Policy</h1>
      <div class="static-meta">Last updated: ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
      <p>This policy explains how LeagueHub uses cookies and local storage to provide a better experience.</p>
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored in your browser. We also use <strong>localStorage</strong> to keep your league data offline-friendly.</p>
      <h2>2. Cookies We Use</h2>
      <ul>
        <li><strong>Essential:</strong> Keep you signed in and remember your active league. Cannot be disabled.</li>
        <li><strong>Functional:</strong> Remember your theme, layout, and language preferences.</li>
        <li><strong>Analytics:</strong> Help us understand how users navigate the platform (anonymous).</li>
        <li><strong>None third-party advertising:</strong> We don't run ads or use ad-trackers.</li>
      </ul>
      <h2>3. Local Storage</h2>
      <p>LeagueHub uses your browser's local storage to save your leagues, teams, and match results. Clearing your browser data will delete this information.</p>
      <h2>4. Managing Cookies</h2>
      <p>You can control cookies through your browser settings:</p>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
        <li><strong>Firefox:</strong> Preferences → Privacy & Security</li>
        <li><strong>Safari:</strong> Preferences → Privacy</li>
        <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
      </ul>
      <p>Note: Disabling essential cookies will prevent LeagueHub from working properly.</p>
      <h2>5. Third-Party Services</h2>
      <p>We do not currently use third-party advertising, social tracking, or marketing cookies.</p>
      <h2>6. Updates</h2>
      <p>If our use of cookies changes, we'll update this page and notify you in-app.</p>
      <h2>7. Questions?</h2>
      <p>Email <strong>privacy@leaguehub.app</strong>.</p>
    </div></div>${renderFooter()}`;
  },

  help(){
    App().innerHTML = renderNav() + `<div class="container"><div class="static-page fade-in">
      <h1>Help Center</h1>
      <div class="static-meta">Everything you need to get started and master LeagueHub.</div>
      <h2>🚀 Getting Started</h2>
      <p><strong>1. Create an account</strong> — Sign up with email and password. After signup, you'll be redirected to the login page to verify your account.</p>
      <p><strong>2. Create your first league</strong> — From your dashboard, click "+ New League" and give it a name.</p>
      <p><strong>3. Add teams</strong> — Open your league, go to the Teams tab, and add at least 2 teams with custom icons.</p>
      <p><strong>4. Generate fixtures</strong> — Click "Generate Fixtures" to auto-create a round-robin schedule.</p>
      <p><strong>5. Enter results</strong> — In the Fixtures tab, enter scores after each match. Standings update instantly.</p>

      <h2>👥 Managing Teams</h2>
      <p>Add teams by name, with optional emoji icons or custom uploaded logos (under 500KB). You can edit team icons anytime — even on the fixtures page. Teams can only be deleted before fixtures are generated.</p>

      <h2>📊 Standings & Tables</h2>
      <p>Standings use the standard 3-1-0 system (win-draw-loss). Tiebreakers go: Points → Goal Difference → Goals Scored → Team Name. The "Form" column shows the last 5 results as colored badges.</p>

      <h2>📸 Sharing & Exporting</h2>
      <p>Click "Share" on any league to get a shareable link. You can also export the standings or fixtures as a downloadable PNG image — perfect for posting in WhatsApp groups, Twitter, or printing.</p>

      <h2>✉️ Inviting Others</h2>
      <p>Use "Invite" to generate a unique invite code. Share the link via email, WhatsApp, or any messenger. Recipients sign in/up and are taken directly to your league.</p>

      <h2>🛠️ Troubleshooting</h2>
      <ul>
        <li><strong>Lost data?</strong> Data is stored in your browser. Clearing cookies/cache will erase it.</li>
        <li><strong>Can't see the Teams tab?</strong> Only the league owner can manage teams.</li>
        <li><strong>Image export not working?</strong> Try a modern browser (Chrome, Firefox, Safari, Edge — latest versions).</li>
      </ul>

      <h2>💬 Still need help?</h2>
      <button class="btn btn-primary mt-2" onclick="Router.go('/contact')">Contact Support</button>
    </div></div>${renderFooter()}`;
  },

  contact(){
    App().innerHTML = renderNav() + `<div class="container"><div class="static-page fade-in">
      <h1>Contact Us</h1>
      <div class="static-meta">We'd love to hear from you. Choose your preferred channel below.</div>

      <div class="contact-grid">
        <div class="contact-method">
          <div class="icon">📧</div>
          <h3>Email Support</h3>
          <p class="text-muted">For general questions, bug reports, and feature requests.</p>
          <p style="margin-top:10px"><strong>support@leaguehub.app</strong></p>
          <p class="text-sm text-muted">Response time: within 24 hours</p>
        </div>
        <div class="contact-method">
          <div class="icon">🐛</div>
          <h3>Bug Reports</h3>
          <p class="text-muted">Found something broken? We want to know!</p>
          <p style="margin-top:10px"><strong>bugs@leaguehub.app</strong></p>
          <p class="text-sm text-muted">Include screenshots and browser info</p>
        </div>
        <div class="contact-method">
          <div class="icon">🚀</div>
          <h3>Partnerships</h3>
          <p class="text-muted">Schools, clubs, and organizations welcome.</p>
          <p style="margin-top:10px"><strong>partners@leaguehub.app</strong></p>
        </div>
        <div class="contact-method">
          <div class="icon">💬</div>
          <h3>Community</h3>
          <p class="text-muted">Join our Discord for tips, ideas, and chat with other organizers.</p>
          <p style="margin-top:10px"><strong>discord.gg/leaguehub</strong></p>
        </div>
      </div>

      <h2 style="margin-top:48px">Send us a message</h2>
      <div class="card">
        <div class="card-body">
          <form onsubmit="event.preventDefault();Toast.show('Message sent! We\\'ll be in touch.','success');event.target.reset();">
            <div class="form-group"><label class="label">Your Name</label><input class="input" required/></div>
            <div class="form-group"><label class="label">Email</label><input class="input" type="email" required/></div>
            <div class="form-group"><label class="label">Subject</label>
              <select class="select select input" required>
                <option>General Question</option><option>Bug Report</option>
                <option>Feature Request</option><option>Partnership</option>
              </select>
            </div>
            <div class="form-group"><label class="label">Message</label><textarea class="input textarea" rows="5" required></textarea></div>
            <button class="btn btn-primary">Send Message →</button>
          </form>
        </div>
      </div>
    </div></div>${renderFooter()}`;
  },

  faq(){
    App().innerHTML = renderNav() + `<div class="container"><div class="static-page fade-in">
      <h1>Frequently Asked Questions</h1>
      <div class="static-meta">Quick answers to the most common questions.</div>
      ${[
        ['Is LeagueHub free?','Yes — the core features (creating leagues, fixtures, standings, sharing) are completely free. Premium features may be added later for power users.'],
        ['How many leagues can I create?','Unlimited! Create as many leagues as you need.'],
        ['How many teams can a league have?','LeagueHub is optimized for 5-20 teams, but technically supports more. Larger leagues may have more rounds.'],
        ['Can teams play each other twice (home and away)?','Currently, leagues use single round-robin. Home-and-away support is coming soon.'],
        ['Can I edit a score after entering it?','Yes! Owners can update any score at any time. Standings recalculate instantly.'],
        ['How do I share my league with others?','Open the league and click "Share" for a view-only link, or "Invite" to generate a personal invitation link.'],
        ['Can I export the standings?','Yes! Click "Save as Image" on any standings or fixtures view to download a high-resolution PNG.'],
        ['What happens if I delete my account?','Your account, leagues, teams, and matches are all permanently removed within 30 days.'],
        ['Does LeagueHub work on mobile?','Absolutely! LeagueHub is designed mobile-first. Use it on any phone, tablet, or desktop.'],
        ['Can I add custom team logos?','Yes! Upload images (under 500KB) or use any emoji as a team icon.'],
        ['Is my data backed up?','Currently, league data is stored in your browser. Cloud backup with sync is on the roadmap.'],
        ['How do tiebreakers work?','Standings sort by: 1) Points  2) Goal Difference  3) Goals Scored  4) Team Name (alphabetical).'],
      ].map((q,i)=>`
        <div class="faq-item ${i===0?'open':''}" onclick="this.classList.toggle('open')">
          <div class="faq-q">${q[0]}</div>
          <div class="faq-a">${q[1]}</div>
        </div>
      `).join('')}
      <p class="text-center mt-8">Don't see your question? <a onclick="Router.go('/contact')" style="color:var(--teal-400);cursor:pointer">Contact us →</a></p>
    </div></div>${renderFooter()}`;
  }
});
