// Admin data loader — replaces hardcoded content with admin-managed data
(function() {
  try {
    const raw = localStorage.getItem('wizzyAdminData');
    if (!raw) return;
    const admin = JSON.parse(raw);

    // === STATS ===
    if (admin.stats) {
      const nums = document.querySelectorAll('.stat-number');
      const keys = ['projects', 'clients', 'years', 'awards'];
      let anyValue = false;
      nums.forEach((el, i) => {
        if (i < keys.length && admin.stats[keys[i]] !== undefined) {
          const val = admin.stats[keys[i]];
          el.dataset.target = val;
          el.textContent = val + (val >= 20 ? '+' : '');
          if (val > 0) anyValue = true;
        }
      });
      // Hide the stats row until the admin saves at least one non-zero number.
      const row = document.querySelector('.stats-row');
      if (row && !anyValue) row.classList.add('is-empty');
    }

    // === PROJECTS (projects.html) ===
    if (admin.projects && admin.projects.length) {
      const lists = document.querySelectorAll('.projects-list');
      if (lists.length) {
        // Group admin projects by category
        const grouped = { websites: [], 'graphic-design': [], logos: [], posters: [] };
        admin.projects.forEach(p => {
          const cat = p.category || 'websites';
          if (grouped[cat]) grouped[cat].push(p);
          else grouped[cat] = [p];
        });

        lists.forEach(list => {
          const cat = list.dataset.category;
          const items = grouped[cat] || [];
          if (items.length) {
            list.innerHTML = '';
            items.forEach(p => {
              const div = document.createElement('div');
              div.className = 'project-item reveal';
              div.id = 'admin-project-' + p.id;
              const imgStyle = p.image
                ? 'style="background-image:url(' + escAttr(p.image) + ');background-size:cover;background-position:center;"'
                : 'style="background:linear-gradient(135deg,#1a1a2e,#16213e);"';
              const initials = p.title ? p.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
              div.innerHTML = '<div class="project-img" ' + imgStyle + '>' + (p.image ? '' : '<span>' + initials + '</span>') + '</div><div class="project-body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.description || '') + '</p><div class="tech"><span>' + (p.techs || []).join('</span><span>') + '</span></div><a href="project-detail.html?id=' + p.id + '" class="project-view-link">View Details &rarr;</a></div>';
              list.appendChild(div);
            });
          }
        });
      }
    }

    // === TESTIMONIALS ===
    if (admin.testimonials && admin.testimonials.length) {
      const track = document.querySelector('.carousel-track');
      const dots = document.querySelector('.carousel-dots');
      if (track && dots) {
        track.innerHTML = '';
        dots.innerHTML = '';
        admin.testimonials.forEach((t, i) => {
          const div = document.createElement('div');
          div.className = 'testimonial';
          div.dataset.index = i;
          const avatarHtml = t.image ? '<img src="' + escAttr(t.image) + '" alt="' + esc(t.author) + '">' : esc(t.initial || t.author[0]);
          div.innerHTML = '<p>"' + esc(t.text) + '"</p><div class="author"><div class="author-avatar">' + avatarHtml + '</div><div class="author-info"><strong>' + esc(t.author) + '</strong><span>' + esc(t.role || '') + '</span></div></div>';
          track.appendChild(div);
          const dot = document.createElement('span');
          dot.className = 'dot';
          dot.dataset.index = i;
          dots.appendChild(dot);
        });
        // Just set first slide active — page script handles the rest
        const first = track.querySelector('.testimonial');
        const firstDot = dots.querySelector('.dot');
        if (first) first.classList.add('active');
        if (firstDot) firstDot.classList.add('active');
      }
    }

    // === SERVICES ===
    if (admin.services && admin.services.length) {
      const grid = document.querySelector('.services-grid');
      if (grid) {
        grid.innerHTML = '';
        admin.services.forEach(s => {
          const card = document.createElement('div');
          card.className = 'service-card';
          card.innerHTML = '<div class="service-header"><h3>' + esc(s.title) + '</h3></div><div class="service-expand"><p>' + esc(s.description || '') + '</p><div class="service-tech"><span>' + (s.techs || []).join('</span><span>') + '</span></div></div>';
          grid.appendChild(card);
          card.addEventListener('click', function() {
            const wasOpen = this.classList.contains('open');
            document.querySelectorAll('.service-card.open').forEach(c => c.classList.remove('open'));
            if (!wasOpen) this.classList.add('open');
          });
        });
      }
    }

    // === BLOG PREVIEW (home page & blog page) ===
    if (admin.blogs && admin.blogs.length) {
      const grid = document.querySelector('.blog-preview-grid');
      if (grid) {
        const isBlogPage = !!grid.closest('.blog-list');
        var allBlogs = admin.blogs;
        var currentTag = 'all';
        var perPage = isBlogPage ? 9 : 6;
        var currentPage = 1;
        var loadMoreBtn = null;

        // Populate tag filters (blog page only)
        if (isBlogPage) {
          var tagSet = {};
          allBlogs.forEach(function(b) { if (b.tag) tagSet[b.tag] = true; });
          var tags = Object.keys(tagSet).sort();
          var filterBar = document.getElementById('blogTagFilters');
          if (filterBar) {
            tags.forEach(function(tag) {
              var btn = document.createElement('button');
              btn.className = 'blog-tag-filter';
              btn.dataset.tag = tag;
              btn.textContent = tag;
              btn.addEventListener('click', function() {
                filterBar.querySelectorAll('.blog-tag-filter').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentTag = tag;
                grid.innerHTML = '';
                currentPage = 1;
                if (loadMoreBtn) { loadMoreBtn.remove(); loadMoreBtn = null; }
                renderBlogPage(1);
              });
              filterBar.appendChild(btn);
            });
          }
        }

        function getFilteredBlogs() {
          if (currentTag === 'all') return allBlogs;
          return allBlogs.filter(function(b) { return b.tag === currentTag; });
        }

        function renderBlogPage(page) {
          var filtered = getFilteredBlogs();
          var start = (page - 1) * perPage;
          var end = Math.min(start + perPage, filtered.length);
          var items = filtered.slice(start, end);
          items.forEach(function(b) {
            var card = document.createElement('div');
            card.className = 'blog-card';
            var imgHtml = b.image ? '<div class="blog-img"><img src="' + escAttr(b.image) + '" alt="' + esc(b.title) + '"></div>' : '';
            card.innerHTML = imgHtml + '<div class="blog-meta"><span>' + esc(b.date || '') + '</span><span>· ' + esc(b.readTime || '3 min read') + '</span></div><h3>' + esc(b.title) + '</h3><p>' + esc(b.description || '') + '</p><span class="blog-tag">' + esc(b.tag || 'General') + '</span>';
            card.addEventListener('click', function() { openBlogModal(b.id, admin.blogs); });
            grid.appendChild(card);
          });
          // Show/hide load more button
          if (!loadMoreBtn) {
            loadMoreBtn = grid.parentElement.querySelector('.load-more-btn');
          }
          if (end >= filtered.length) {
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
          } else {
            if (!loadMoreBtn) {
              loadMoreBtn = document.createElement('button');
              loadMoreBtn.className = 'load-more-btn';
              loadMoreBtn.textContent = 'Load More';
              loadMoreBtn.style.cssText = 'display:block;margin:24px auto;padding:10px 28px;background:transparent;border:1px solid var(--gold);color:var(--gold);border-radius:8px;cursor:pointer;font-size:0.9rem';
              loadMoreBtn.addEventListener('click', function() {
                currentPage++;
                renderBlogPage(currentPage);
              });
              grid.parentElement.appendChild(loadMoreBtn);
            }
            loadMoreBtn.style.display = 'block';
          }
        }

        renderBlogPage(1);
      }
    }

  } catch(e) {
    // Silently fail
  }

  function esc(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function escAttr(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
})();

// === BLOG MODAL (global) ===
window.openBlogModal = function(id, blogs) {
  var modal = document.getElementById('blogModal');
  var content = document.getElementById('blogModalContent');
  if (!modal || !content) return;
  var blog = null;
  for (var i = 0; i < blogs.length; i++) {
    if (blogs[i].id == id) { blog = blogs[i]; break; }
  }
  if (!blog) return;
  function esc(s) { if (typeof s !== 'string') return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function escAttr(s) { if (typeof s !== 'string') return ''; return s.replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  var imgHtml = blog.image ? '<img src="' + escAttr(blog.image) + '" alt="' + esc(blog.title) + '" class="blog-featured-img">' : '';
  var shareTitle = encodeURIComponent(blog.title);
  var shareUrl = encodeURIComponent(window.location.href.split('?')[0].split('#')[0]);
  var shareHtml = '<div class="share-btns"><span>Share: </span>' +
    '<a href="https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '" target="_blank" rel="noopener" title="Facebook">FB</a>' +
    '<a href="https://twitter.com/intent/tweet?text=' + shareTitle + '&url=' + shareUrl + '" target="_blank" rel="noopener" title="Twitter">&#120143;</a>' +
    '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + shareUrl + '&title=' + shareTitle + '" target="_blank" rel="noopener" title="LinkedIn">in</a>' +
    '<a href="https://api.whatsapp.com/send?text=' + shareTitle + '%20' + shareUrl + '" target="_blank" rel="noopener" title="WhatsApp">WA</a></div>';
  content.innerHTML = '<div class="blog-header">' + imgHtml + '<h2>' + esc(blog.title) + '</h2><div class="blog-meta"><span>' + esc(blog.date || '') + '</span><span> · ' + esc(blog.readTime || '3 min read') + '</span></div><span class="blog-tag">' + esc(blog.tag || 'General') + '</span></div><div class="blog-body">' + (blog.content || '<p>' + esc(blog.description || '') + '</p>') + '</div>' + shareHtml;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeBlogModal = function() {
  var modal = document.getElementById('blogModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
};
