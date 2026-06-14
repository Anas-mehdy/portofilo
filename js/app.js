// Main Application JavaScript

// --- CONFIGURATION ---
// Paste your Webhook URL from Make, Zapier, or n8n here to receive leads automatically.
// If left empty, the form runs in demo mode (simulates submission and displays success modal).
const LEADS_WEBHOOK_URL = ""; 

// App State
let currentLang = "ar"; // Default language
let activeProjects = [];
let lightboxProjectIdx = -1;
let lightboxItemIdx = -1;

// DOM Elements
const header = document.getElementById("header");
const langBtn = document.getElementById("lang-btn");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const portfolioGrid = document.getElementById("portfolio-grid");
const leadForm = document.getElementById("lead-form");
const successModal = document.getElementById("success-modal");
const successModalClose = document.getElementById("success-modal-close");

// Admin Panel DOM Elements
const adminTriggerBtn = document.getElementById("admin-trigger-btn");
const adminModal = document.getElementById("admin-modal");
const adminGate = document.getElementById("admin-gate");
const adminDashboard = document.getElementById("admin-dashboard");
const adminPasswordInput = document.getElementById("admin-password");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminGateClose = document.getElementById("admin-gate-close");
const adminPanelClose = document.getElementById("admin-panel-close");
const adminCancelBtn = document.getElementById("admin-cancel-btn");
const adminSaveBtn = document.getElementById("admin-save-btn");
const adminAddProjectBtn = document.getElementById("admin-add-project");
const adminExportBtn = document.getElementById("admin-export-btn");
const adminResetBtn = document.getElementById("admin-reset-btn");
const adminProjectList = document.getElementById("admin-project-list");
const copyFeedback = document.getElementById("copy-feedback");

// Dynamic Input Placeholders for Translation
const inputPlaceholders = {
  ar: {
    "form-name": "مثال: أحمد العتيبي",
    "form-phone": "مثال: +966500000000",
    "form-desc": "مثال: أريد ربط الطلبات بفاتورة تلقائية وإرسال تذكيرات للعميل عبر الواتس عند الدفع...",
    "admin-password": "رمز المرور الخاص بالإدارة"
  },
  en: {
    "form-name": "e.g., John Doe",
    "form-phone": "e.g., +447123456789",
    "form-desc": "e.g., I want to connect my orders to automated invoicing and WhatsApp updates...",
    "admin-password": "Admin Password"
  }
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  activeProjects = getProjects();
  updateLanguage(currentLang);
  setupScrollEffects();
  setupRevealAnimations();
  setupLightbox();
});

// --- NAVIGATION & SCROLL ---
function setupScrollEffects() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Mobile navigation toggle
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  
  // Animate hamburger lines
  const spans = menuToggle.querySelectorAll("span");
  if (navLinks.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

// Close mobile menu when link clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    const spans = menuToggle.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  });
});


// --- TRANSLATION ENGINE ---
langBtn.addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  updateLanguage(currentLang);
});

function updateLanguage(lang) {
  // Update HTML attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = translations[lang].dir;
  document.body.setAttribute("lang", lang);
  
  // Translate static content
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // Translate placeholders
  for (const id in inputPlaceholders[lang]) {
    const el = document.getElementById(id);
    if (el) {
      el.placeholder = inputPlaceholders[lang][id];
    }
  }

  // Refresh dynamic portfolio items in the correct language
  renderPortfolio();
}


// --- MEDIA MARKUP GENERATION HELPER ---
window.getMediaMarkup = function(item, options = {}) {
  const defaults = { autoplay: false, muted: false, controls: true, loop: true, style: "" };
  const settings = { ...defaults, ...options };
  
  if (!item || !item.url) {
    if (item && item.type === "video") {
      return `<div style="display: flex; align-items: center; justify-content: center; height: 100%; min-height: 200px; color: var(--text-muted); font-size: 0.85rem;">${currentLang === "ar" ? "لا يوجد فيديو مضاف بعد" : "No video loaded yet"}</div>`;
    }
    return "";
  }
  
  const url = item.url.trim();
  
  if (item.type === "image") {
    return `<img src="${url}" alt="Media asset" loading="lazy" style="${settings.style}">`;
  }
  
  // Video type
  // 1. Raw iframe embed code
  if (url.startsWith("<iframe")) {
    let embedCode = url;
    // Add autoplay parameter to iframe src if requested
    if (settings.autoplay && !embedCode.includes("autoplay=1")) {
      embedCode = embedCode.replace(/src="([^"]+)"/, (match, src) => {
        const separator = src.includes("?") ? "&" : "?";
        return `src="${src}${separator}autoplay=1"`;
      });
    }
    return embedCode;
  }
  
  // 2. YouTube URLs
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  if (isYoutube) {
    let embedUrl = url;
    if (url.includes("watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      const id = url.split("/").pop().split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    }
    const autoplayParam = settings.autoplay ? "autoplay=1&mute=1" : "autoplay=0";
    return `<iframe src="${embedUrl}?${autoplayParam}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="${settings.style}"></iframe>`;
  }
  
  // 3. Vimeo URLs
  const isVimeo = url.includes("vimeo.com");
  if (isVimeo) {
    let embedUrl = url;
    if (!url.includes("player.vimeo.com")) {
      const parts = url.split("/");
      const id = parts[parts.length - 1].split("?")[0];
      embedUrl = `https://player.vimeo.com/video/${id}`;
    }
    const autoplayParam = settings.autoplay ? "autoplay=1&muted=1" : "autoplay=0";
    return `<iframe src="${embedUrl}?${autoplayParam}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="${settings.style}"></iframe>`;
  }
  
  // 4. Direct video files (MP4 / WebM / Base64 uploads)
  const autoplayAttr = settings.autoplay ? "autoplay" : "";
  const muteAttr = (settings.muted || settings.autoplay) ? "muted" : "";
  const controlsAttr = settings.controls ? "controls" : "";
  const loopAttr = settings.loop ? "loop" : "";
  
  return `<video src="${url}" ${controlsAttr} ${autoplayAttr} ${muteAttr} ${loopAttr} playsinline style="${settings.style}"></video>`;
};

// --- PORTFOLIO DYNAMIC RENDERING ---
function renderPortfolio() {
  portfolioGrid.innerHTML = "";
  
  if (activeProjects.length === 0) {
    portfolioGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No projects found.</p>`;
    return;
  }
  
  activeProjects.forEach((proj, index) => {
    const title = currentLang === "ar" ? proj.titleAr : proj.titleEn;
    const problem = currentLang === "ar" ? proj.problemAr : proj.problemEn;
    const solution = currentLang === "ar" ? proj.solutionAr : proj.solutionEn;
    const result = currentLang === "ar" ? proj.resultAr : proj.resultEn;
    
    // Choose icon based on index or title keywords
    let iconClass = "fa-solid fa-gears";
    if (proj.id && proj.id.includes("lead")) iconClass = "fa-solid fa-users-gear";
    else if (proj.id && proj.id.includes("order")) iconClass = "fa-solid fa-box-open";
    else if (proj.id && proj.id.includes("notification")) iconClass = "fa-solid fa-comment-sms";
    else if (proj.id && proj.id.includes("ai")) iconClass = "fa-solid fa-microchip";
    else if (proj.id && proj.id.includes("appointment")) iconClass = "fa-solid fa-calendar-days";
    else if (proj.id && proj.id.includes("inbox")) iconClass = "fa-solid fa-inbox";
    
    // Render media HTML (Carousel supports multiple images/videos)
    let mediaMarkup = "";
    if (proj.mediaItems && proj.mediaItems.length > 0) {
      if (proj.mediaItems.length === 1) {
        // Render single item (no carousel arrows needed)
        const item = proj.mediaItems[0];
        let assetHtml = window.getMediaMarkup(item, { autoplay: false, muted: true, controls: true });
        mediaMarkup = `
          <div class="portfolio-carousel">
            ${assetHtml}
            <div class="slide-click-overlay" onclick="openLightbox(${index}, 0)"></div>
          </div>
        `;
      } else {
        // Render carousel slideshow
        let slidesHtml = "";
        let dotsHtml = "";
        
        proj.mediaItems.forEach((item, itemIdx) => {
          const isActive = itemIdx === 0 ? "active" : "";
          let assetHtml = window.getMediaMarkup(item, { autoplay: false, muted: true, controls: true });
          
          slidesHtml += `
            <div class="carousel-slide ${isActive}">
              ${assetHtml}
              <div class="slide-click-overlay" onclick="openLightbox(${index}, ${itemIdx})"></div>
            </div>
          `;
          dotsHtml += `<div class="carousel-dot ${isActive}" onclick="selectCarouselSlide(this, ${itemIdx})"></div>`;
        });
        
        mediaMarkup = `
          <div class="portfolio-carousel">
            ${slidesHtml}
            <button class="carousel-nav prev" aria-label="Previous Slide"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="carousel-nav next" aria-label="Next Slide"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="carousel-dots">${dotsHtml}</div>
          </div>
        `;
      }
    }

    const card = document.createElement("div");
    card.className = "portfolio-card reveal";
    card.innerHTML = `
      <span class="portfolio-badge" data-i18n="portfolioTag">${translations[currentLang].portfolioTag}</span>
      ${mediaMarkup}
      <div class="portfolio-header">
        <div class="portfolio-icon"><i class="${iconClass}"></i></div>
        <h3>${title}</h3>
      </div>
      <div class="portfolio-details">
        <div class="detail-block">
          <div class="detail-title">${translations[currentLang].portfolioProblem}</div>
          <div class="detail-content">${problem}</div>
        </div>
        <div class="detail-block">
          <div class="detail-title">${translations[currentLang].portfolioSolution}</div>
          <div class="detail-content">${solution}</div>
        </div>
        <div class="detail-block">
          <div class="detail-title">${translations[currentLang].portfolioResult}</div>
          <div class="detail-content" style="color: var(--accent-cyan); font-weight: 600;">${result}</div>
        </div>
      </div>
    `;
    
    portfolioGrid.appendChild(card);
  });
  
  // Re-trigger observer for newly rendered portfolio elements
  setupRevealAnimations();
}


// --- SCROLL ANIMATIONS (Intersection Observer) ---
function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal, .scale-reveal");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });
  
  revealElements.forEach(el => {
    observer.observe(el);
  });
}


// --- CONTACT FORM SUBMISSION ---
leadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const submitBtn = leadForm.querySelector("button[type='submit']");
  const origBtnHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}`;
  
  // Collect data
  const leadData = {
    name: document.getElementById("form-name").value.trim(),
    phone: document.getElementById("form-phone").value.trim(),
    business: document.getElementById("form-business").value,
    description: document.getElementById("form-desc").value.trim(),
    submittedAt: new Date().toISOString()
  };
  
  const showSuccess = () => {
    leadForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = origBtnHtml;
    successModal.classList.add("active");
  };
  
  if (LEADS_WEBHOOK_URL) {
    // Send data to Make / Zapier / n8n Webhook
    fetch(LEADS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadData)
    })
    .then(response => {
      console.log("Lead successfully sent to webhook", response);
      showSuccess();
    })
    .catch(err => {
      console.error("Error sending lead to webhook, showing fallback success", err);
      // Even if webhook fails, we show success modal so customer experience isn't broken,
      // but we log the error.
      showSuccess();
    });
  } else {
    // Demo Mode
    console.log("Saving lead information (Demo Mode):", leadData);
    setTimeout(() => {
      showSuccess();
    }, 800);
  }
});

// Close success modal
successModalClose.addEventListener("click", () => {
  successModal.classList.remove("active");
});

// Close modal when clicking outside modal box
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.classList.remove("active");
  }
});


// --- PORTFOLIO ADMIN PANEL LOGIC ---

// Open Modal & reset Gate
adminTriggerBtn.addEventListener("click", () => {
  adminModal.classList.add("active");
  adminGate.style.display = "flex";
  adminDashboard.style.display = "none";
  adminPasswordInput.value = "";
  adminPasswordInput.focus();
});

// Login validation
adminLoginBtn.addEventListener("click", validateAdminLogin);
adminPasswordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") validateAdminLogin();
});

function validateAdminLogin() {
  const password = adminPasswordInput.value.trim();
  if (password === "admin123") {
    // Authenticated
    adminGate.style.display = "none";
    adminDashboard.style.display = "flex";
    renderAdminProjects();
  } else {
    alert(translations[currentLang].invalidPassword);
    adminPasswordInput.value = "";
    adminPasswordInput.focus();
  }
}

// Close Admin Gate
adminGateClose.addEventListener("click", () => {
  adminModal.classList.remove("active");
});

// Close Admin Dashboard
adminPanelClose.addEventListener("click", () => adminModal.classList.remove("active"));
adminCancelBtn.addEventListener("click", () => adminModal.classList.remove("active"));

// Render project inputs list in the admin panel
function renderAdminProjects() {
  adminProjectList.innerHTML = "";
  
  activeProjects.forEach((proj, idx) => {
    const projectItem = document.createElement("div");
    projectItem.className = "admin-project-item";
    projectItem.setAttribute("data-index", idx);
    
    projectItem.innerHTML = `
      <div class="admin-project-item-header">
        <span class="admin-project-num">#${idx + 1}</span>
        <button class="btn-delete-project" onclick="deleteProjectFromAdmin(${idx})">
          <i class="fa-solid fa-trash-can"></i>
          <span>Delete</span>
        </button>
      </div>
      
      <div class="field-grid">
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldTitleAr}</label>
          <input type="text" class="edit-title-ar" value="${proj.titleAr || ''}" required>
        </div>
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldTitleEn}</label>
          <input type="text" class="edit-title-en" value="${proj.titleEn || ''}" required>
        </div>
      </div>
      
      <div class="field-grid">
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldProblemAr}</label>
          <textarea class="edit-prob-ar" required>${proj.problemAr || ''}</textarea>
        </div>
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldProblemEn}</label>
          <textarea class="edit-prob-en" required>${proj.problemEn || ''}</textarea>
        </div>
      </div>
      
      <div class="field-grid">
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldSolutionAr}</label>
          <textarea class="edit-sol-ar" required>${proj.solutionAr || ''}</textarea>
        </div>
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldSolutionEn}</label>
          <textarea class="edit-sol-en" required>${proj.solutionEn || ''}</textarea>
        </div>
      </div>
      
      <div class="field-grid">
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldResultAr}</label>
          <textarea class="edit-res-ar" required>${proj.resultAr || ''}</textarea>
        </div>
        <div class="admin-form-group">
          <label>${translations[currentLang].fieldResultEn}</label>
          <textarea class="edit-res-en" required>${proj.resultEn || ''}</textarea>
        </div>
      </div>
      
      <div class="admin-form-group" style="grid-column: 1 / -1; margin-top: 10px;">
        <label style="font-weight: 700; color: var(--accent-cyan); display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-photo-film"></i>
          <span>${translations[currentLang].fieldMediaItemsTitle}</span>
        </label>
        
        <div class="admin-media-items-list" id="media-list-${idx}" style="margin-top: 12px; display: flex; flex-direction: column; gap: 12px;">
          <!-- Loaded dynamically -->
        </div>
        
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px;">
          <button type="button" class="btn btn-secondary" style="padding: 10px 14px; display: inline-flex; align-items: center; gap: 6px;" onclick="addMediaItemRow(${idx})">
            <i class="fa-solid fa-plus"></i>
            <span>${translations[currentLang].addMediaItemBtn}</span>
          </button>
          
          <button type="button" class="btn btn-secondary btn-bulk-upload" style="padding: 10px 14px; display: inline-flex; align-items: center; gap: 6px;" onclick="triggerBulkFileInput(this)">
            <i class="fa-solid fa-images"></i>
            <span>${currentLang === 'ar' ? 'رفع عدة صور معاً' : 'Upload Multiple Images'}</span>
          </button>
          
          <input type="file" class="edit-media-bulk-input" accept="image/*" multiple style="display: none;" onchange="handleBulkImageUpload(this, ${idx})">
        </div>
      </div>
    `;
    
    adminProjectList.appendChild(projectItem);
    renderAdminMediaRows(idx);
  });
}

// Add Project Action
adminAddProjectBtn.addEventListener("click", () => {
  const newProj = {
    id: `custom-project-${Date.now()}`,
    titleAr: "مشروع أتمتة جديد",
    titleEn: "New Automation Project",
    problemAr: "المشكلة التي كان يواجهها العميل هنا...",
    problemEn: "The problem that the client was facing here...",
    solutionAr: "الحل التقني الذي تم تنفيذه...",
    solutionEn: "The technical solution that was implemented...",
    resultAr: "النتيجة الرقمية/العملية المحققة...",
    resultEn: "The digital/practical result achieved...",
    mediaItems: []
  };
  
  activeProjects.push(newProj);
  renderAdminProjects();
  
  // Scroll to bottom of admin panel body
  const adminBody = document.querySelector(".admin-body");
  adminBody.scrollTop = adminBody.scrollHeight;
});

// Delete Project helper (exposed to onclick global context)
window.deleteProjectFromAdmin = function(index) {
  if (confirm(translations[currentLang].deleteConfirm)) {
    activeProjects.splice(index, 1);
    renderAdminProjects();
  }
};

// Save Project edits to LocalStorage
adminSaveBtn.addEventListener("click", () => {
  const items = adminProjectList.querySelectorAll(".admin-project-item");
  
  items.forEach(item => {
    const idx = parseInt(item.getAttribute("data-index"));
    
    // Sync text inputs back into activeProjects array (mediaItems is modified in place)
    activeProjects[idx].titleAr = item.querySelector(".edit-title-ar").value.trim();
    activeProjects[idx].titleEn = item.querySelector(".edit-title-en").value.trim();
    activeProjects[idx].problemAr = item.querySelector(".edit-prob-ar").value.trim();
    activeProjects[idx].problemEn = item.querySelector(".edit-prob-en").value.trim();
    activeProjects[idx].solutionAr = item.querySelector(".edit-sol-ar").value.trim();
    activeProjects[idx].solutionEn = item.querySelector(".edit-sol-en").value.trim();
    activeProjects[idx].resultAr = item.querySelector(".edit-res-ar").value.trim();
    activeProjects[idx].resultEn = item.querySelector(".edit-res-en").value.trim();
  });
  
  saveProjects(activeProjects);
  renderPortfolio();
  
  alert(translations[currentLang].successSaved);
  adminModal.classList.remove("active");
});

// Reset projects to Defaults
adminResetBtn.addEventListener("click", () => {
  if (confirm(currentLang === "ar" ? "هل تود استعادة الإعدادات الافتراضية؟" : "Reset portfolio projects to system defaults?")) {
    activeProjects = resetProjects();
    renderAdminProjects();
    renderPortfolio();
    adminModal.classList.remove("active");
  }
});

// Export code snippet to Clipboard
adminExportBtn.addEventListener("click", () => {
  const codeSnippet = exportProjectsCode(activeProjects);
  
  // Copy to clipboard
  navigator.clipboard.writeText(codeSnippet).then(() => {
    // Show copy feedback toast
    copyFeedback.classList.add("active");
    
    // Hide toast after 4 seconds
    setTimeout(() => {
      copyFeedback.classList.remove("active");
    }, 4000);
  }).catch(err => {
    console.error("Could not copy code snippet to clipboard", err);
    alert("Export Snippet:\n\n" + codeSnippet);
  });
});

// --- ADMIN MULTIPLE MEDIA ITEMS MANAGER HELPERS ---

window.renderAdminMediaRows = function(projectIdx) {
  const container = document.getElementById(`media-list-${projectIdx}`);
  if (!container) return;
  
  container.innerHTML = "";
  const proj = activeProjects[projectIdx];
  const items = proj.mediaItems || [];
  
  if (items.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic; grid-column: 1/-1;">لا يوجد صور أو فيديوهات مضافة بعد. (No images or videos added yet)</p>`;
    return;
  }
  
  items.forEach((item, itemIdx) => {
    const row = document.createElement("div");
    row.className = "admin-media-item-row";
    row.style = "display: flex; gap: 12px; align-items: center; background: rgba(0, 0, 0, 0.2); padding: 12px; border-radius: var(--radius-sm); border: 1px dashed var(--border-color); width: 100%; flex-wrap: wrap;";
    
    row.innerHTML = `
      <select class="edit-item-type" style="width: 120px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: var(--text-primary); padding: 8px 10px; border-radius: var(--radius-sm);" onchange="updateMediaItemType(this, ${projectIdx}, ${itemIdx})">
        <option value="image" ${item.type === 'image' ? 'selected' : ''}>Image / صورة</option>
        <option value="video" ${item.type === 'video' ? 'selected' : ''}>Video / فيديو</option>
      </select>
      
      <div class="media-input-wrapper" style="display: flex; gap: 8px; align-items: center; flex-grow: 1; min-width: 250px;">
        <input type="text" class="edit-item-url" value="${item.url || ''}" placeholder="${item.type === 'video' ? 'e.g. YouTube or direct MP4 URL...' : 'URL link / رابط...'}" style="flex-grow: 1; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: var(--text-primary); padding: 8px 10px; border-radius: var(--radius-sm);" onchange="updateMediaItemUrl(this, ${projectIdx}, ${itemIdx})">
        
        <input type="file" class="edit-item-file-input" accept="${item.type === 'video' ? 'video/*' : 'image/*'}" style="display: none;" onchange="handleMediaItemUpload(this, ${projectIdx}, ${itemIdx})">
        
        <button type="button" class="btn btn-secondary btn-upload-media-item" style="padding: 8px 12px; flex-shrink: 0;" onclick="triggerMediaItemFileInput(this)" title="${item.type === 'video' ? 'Upload Video' : 'Upload Image'}">
          <i class="fa-solid fa-cloud-arrow-up"></i>
        </button>
      </div>
      
      <button type="button" class="btn-delete-project" style="background: none; border: none; color: #ef4444; font-size: 1rem; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; gap: 4px;" onclick="deleteMediaItemRow(${projectIdx}, ${itemIdx})" title="Delete Media">
        <i class="fa-solid fa-trash-can"></i>
      </button>
      
      <div class="admin-item-preview" style="width: 50px; height: 35px; overflow: hidden; border-radius: 4px; border: 1px solid var(--border-color); flex-shrink: 0; display: ${item.url ? 'block' : 'none'};">
        ${item.type === 'image' && item.url ? `<img src="${item.url}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
        ${item.type === 'video' && item.url ? `<span style="font-size: 0.65rem; display: block; text-align: center; color: var(--accent-cyan); line-height: 35px;">Video</span>` : ''}
      </div>
    `;
    
    container.appendChild(row);
  });
};

window.triggerMediaItemFileInput = function(btn) {
  const input = btn.closest(".media-input-wrapper").querySelector(".edit-item-file-input");
  input.click();
};

window.addMediaItemRow = function(projectIdx) {
  if (!activeProjects[projectIdx].mediaItems) {
    activeProjects[projectIdx].mediaItems = [];
  }
  activeProjects[projectIdx].mediaItems.push({ type: "image", url: "" });
  renderAdminMediaRows(projectIdx);
};

window.deleteMediaItemRow = function(projectIdx, itemIdx) {
  if (confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا الملف؟' : 'Are you sure you want to delete this media asset?')) {
    activeProjects[projectIdx].mediaItems.splice(itemIdx, 1);
    renderAdminMediaRows(projectIdx);
  }
};

window.updateMediaItemType = function(select, projectIdx, itemIdx) {
  activeProjects[projectIdx].mediaItems[itemIdx].type = select.value;
  
  const parentRow = select.closest(".admin-media-item-row");
  const inputUrl = parentRow.querySelector(".edit-item-url");
  
  if (select.value === "video") {
    inputUrl.placeholder = "e.g. YouTube or direct MP4 URL...";
  } else {
    inputUrl.placeholder = "URL link / رابط...";
  }
  
  renderAdminMediaRows(projectIdx);
};

window.updateMediaItemUrl = function(input, projectIdx, itemIdx) {
  activeProjects[projectIdx].mediaItems[itemIdx].url = input.value.trim();
  renderAdminMediaRows(projectIdx);
};

window.handleMediaItemUpload = function(input, projectIdx, itemIdx) {
  const file = input.files[0];
  if (!file) return;
  
  const btn = input.closest(".media-input-wrapper").querySelector(".btn-upload-media-item");
  const origHtml = btn.innerHTML;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  btn.disabled = true;
  
  const itemType = activeProjects[projectIdx].mediaItems[itemIdx].type;
  
  if (itemType === "video") {
    // 3MB video size limit check for LocalStorage safety
    const MAX_VIDEO_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_VIDEO_SIZE) {
      const msg = currentLang === "ar" 
        ? "حجم الفيديو كبير جداً! الحد الأقصى للرفع المباشر هو 3 ميجابايت لتجنب تجاوز مساحة تخزين المتصفح. يرجى استخدام رابط فيديو خارجي (مثل يوتيوب)." 
        : "Video file is too large! Maximum size for direct upload is 3MB to avoid browser storage limits. Please use an external video URL (like YouTube).";
      alert(msg);
      btn.innerHTML = origHtml;
      btn.disabled = false;
      input.value = "";
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      activeProjects[projectIdx].mediaItems[itemIdx].url = e.target.result;
      renderAdminMediaRows(projectIdx);
      btn.innerHTML = origHtml;
      btn.disabled = false;
    };
    reader.onerror = function() {
      console.error("Error reading video file");
      alert(currentLang === "ar" ? "فشل قراءة ملف الفيديو!" : "Failed to read video file!");
      btn.innerHTML = origHtml;
      btn.disabled = false;
    };
    reader.readAsDataURL(file);
  } else {
    window.compressImage(file, function(compressedBase64) {
      activeProjects[projectIdx].mediaItems[itemIdx].url = compressedBase64;
      renderAdminMediaRows(projectIdx);
      btn.innerHTML = origHtml;
      btn.disabled = false;
    });
  }
};

// --- CAROUSEL NAVIGATION DOTS HELPER ---

window.selectCarouselSlide = function(dotEl, slideIdx) {
  const carousel = dotEl.closest(".portfolio-carousel");
  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");
  
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  
  slides[slideIdx].classList.add("active");
  dots[slideIdx].classList.add("active");
};

// --- GLOBAL CAROUSEL ARROW CLICK LISTENER ---

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".carousel-nav");
  if (!btn) return;
  
  const carousel = btn.closest(".portfolio-carousel");
  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");
  if (slides.length <= 1) return;
  
  let activeIdx = Array.from(slides).findIndex(s => s.classList.contains("active"));
  if (activeIdx === -1) activeIdx = 0;
  
  slides[activeIdx].classList.remove("active");
  if (dots[activeIdx]) dots[activeIdx].classList.remove("active");
  
  const goNext = btn.classList.contains("next");
  
  if (goNext) {
    activeIdx = (activeIdx + 1) % slides.length;
  } else {
    activeIdx = (activeIdx - 1 + slides.length) % slides.length;
  }
  
  slides[activeIdx].classList.add("active");
  if (dots[activeIdx]) dots[activeIdx].classList.add("active");
});

// --- ADMIN BULK UPLOAD & COMPRESSION CORE ---

window.compressImage = function(file, callback) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    // CRITICAL: Bind onload BEFORE setting src for synchronous/cached loads
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      callback(dataUrl);
    };
    img.onerror = function() {
      console.error("Error loading image object");
      callback(event.target.result); // Fallback to raw base64 if canvas processing fails
    };
    img.src = event.target.result;
  };
  reader.onerror = function() {
    console.error("Error reading file reader");
  };
  reader.readAsDataURL(file);
};

window.compressImagePromise = function(file) {
  return new Promise((resolve) => {
    window.compressImage(file, (base64) => {
      resolve(base64);
    });
  });
};

window.triggerBulkFileInput = function(btn) {
  const input = btn.closest("div").querySelector(".edit-media-bulk-input");
  input.click();
};

window.handleBulkImageUpload = async function(input, projectIdx) {
  const files = Array.from(input.files);
  if (files.length === 0) return;
  
  const btn = input.closest("div").querySelector(".btn-bulk-upload");
  const origHtml = btn.innerHTML;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  btn.disabled = true;
  
  if (!activeProjects[projectIdx].mediaItems) {
    activeProjects[projectIdx].mediaItems = [];
  }
  
  for (const file of files) {
    try {
      const base64 = await window.compressImagePromise(file);
      activeProjects[projectIdx].mediaItems.push({ type: "image", url: base64 });
    } catch (e) {
      console.error("Error compressing file in bulk upload", e);
    }
  }
  
  // Refresh media list rendering
  renderAdminMediaRows(projectIdx);
  
  btn.innerHTML = origHtml;
  btn.disabled = false;
  input.value = ""; // Clear file selector
};

// --- CAROUSEL/GALLERY LIGHTBOX HELPERS ---

window.setupLightbox = function() {
  const lightboxModal = document.getElementById("lightbox-modal");
  if (!lightboxModal) return;
  
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.navigateLightbox(-1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.navigateLightbox(1);
    });
  }
  
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal || e.target.closest("#lightbox-close")) {
      window.closeLightbox();
    }
  });
  
  document.addEventListener("keydown", (e) => {
    if (!lightboxModal.classList.contains("active")) return;
    if (e.key === "Escape") window.closeLightbox();
    if (e.key === "ArrowLeft") window.navigateLightbox(-1);
    if (e.key === "ArrowRight") window.navigateLightbox(1);
  });
};

window.openLightbox = function(projectIdx, itemIdx) {
  lightboxProjectIdx = projectIdx;
  lightboxItemIdx = itemIdx;
  
  const lightboxModal = document.getElementById("lightbox-modal");
  lightboxModal.classList.add("active");
  
  window.renderLightboxMedia();
};

window.closeLightbox = function() {
  const lightboxModal = document.getElementById("lightbox-modal");
  const content = document.getElementById("lightbox-content");
  lightboxModal.classList.remove("active");
  
  // Clear content so videos/iframes stop playing immediately
  content.innerHTML = "";
};

window.navigateLightbox = function(direction) {
  const proj = activeProjects[lightboxProjectIdx];
  if (!proj || !proj.mediaItems || proj.mediaItems.length <= 1) return;
  
  const total = proj.mediaItems.length;
  // If RTL direction, left arrow (direction -1) should logically navigate to the NEXT item
  const isRTL = document.documentElement.dir === "rtl";
  const step = isRTL ? -direction : direction;
  
  lightboxItemIdx = (lightboxItemIdx + step + total) % total;
  window.renderLightboxMedia();
};

window.renderLightboxMedia = function() {
  const content = document.getElementById("lightbox-content");
  const caption = document.getElementById("lightbox-caption");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  
  const proj = activeProjects[lightboxProjectIdx];
  if (!proj || !proj.mediaItems || proj.mediaItems.length === 0) return;
  
  const item = proj.mediaItems[lightboxItemIdx];
  const total = proj.mediaItems.length;
  
  // Hide prev/next if only 1 item
  if (total <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
  }
  
  content.innerHTML = window.getMediaMarkup(item, { autoplay: true, muted: false, controls: true });
  
  // If it's an iframe (YouTube/Vimeo/Embed), apply styles so it expands nicely in the lightbox
  const iframeEl = content.querySelector("iframe");
  if (iframeEl) {
    iframeEl.style.width = "75vw";
    iframeEl.style.height = "42.18vw";
    iframeEl.style.maxHeight = "70vh";
    iframeEl.style.maxWidth = "1100px";
    iframeEl.style.border = "none";
    iframeEl.style.borderRadius = "var(--radius-md)";
    iframeEl.style.boxShadow = "0 15px 50px rgba(0, 0, 0, 0.8)";
  }
  
  // Render caption counts
  const captionText = currentLang === "ar" 
    ? `ملف ${lightboxItemIdx + 1} من ${total}` 
    : `Media ${lightboxItemIdx + 1} of ${total}`;
  caption.textContent = captionText;
};
