const defaultProjects = [
  {
    id: "lead-capture",
    titleAr: "نظام استقبال العملاء المحتملين تلقائياً",
    titleEn: "Automated Lead Capture System",
    problemAr: "كانت الشركة تتلقى طلبات العملاء من 4 منصات مختلفة يدوياً، مما تسبب في ضياع 35% من الفرص وتأخر الرد لأكثر من 6 ساعات.",
    problemEn: "The company was manually gathering leads from 4 different platforms, causing a loss of 35% of opportunities and delaying responses by over 6 hours.",
    solutionAr: "ربط إعلانات سناب شات وإنستقرام وجوجل بـ Google Sheets وجدولته لإرسال تنبيهات فورية للمبيعات على الواتساب وبدء سلسلة رسائل ترحيبية بالبريد الإلكتروني.",
    solutionEn: "Connected Snapchat, Instagram, and Google Ads to Google Sheets, scheduled instant WhatsApp alerts for the sales team, and initiated an automated welcome email sequence.",
    resultAr: "انخفض وقت الاستجابة للعميل من 6 ساعات إلى 45 ثانية، مع زيادة المبيعات بنسبة 28% في أول شهر وتوفير 12 ساعة عمل أسبوعياً.",
    resultEn: "Response time dropped from 6 hours to 45 seconds, boosting sales by 28% in the first month and saving 12 hours of manual work per week.",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  {
    id: "order-tracking",
    titleAr: "نظام متابعة ومعالجة الطلبات",
    titleEn: "Automated Order Processing & Tracking",
    problemAr: "متجر إلكتروني يواجه فوضى في نقل بيانات الطلبات يدوياً إلى شركات الشحن وإرسال أرقام التتبع لـ 150 عميل يومياً.",
    problemEn: "An e-commerce store struggled with manually transferring order details to shipping couriers and sending tracking numbers to 150 customers daily.",
    solutionAr: "ربط منصة سلة (Salla) مع نظام الشحن (Aramex) عبر Make، لإنشاء البوليصة تلقائياً وتحديث حالة الطلب وإرسال رابط التتبع فوراً عبر الرسائل النصية.",
    solutionEn: "Integrated the Salla e-commerce platform with Aramex via Make to auto-create shipping labels, update order status, and dispatch SMS tracking links instantly.",
    resultAr: "التخلص التام من الأخطاء البشرية في نقل العناوين، مع توفير ساعتين عمل يومياً وتقليل اتصالات العملاء للاستفسار عن الطلبات بنسبة 80%.",
    resultEn: "Complete elimination of human data-entry errors, saving 2 hours of daily work and reducing 'where is my order' customer support queries by 80%.",
    mediaItems: []
  },
  {
    id: "auto-notifications",
    titleAr: "نظام إرسال إشعارات تلقائية للعملاء",
    titleEn: "Auto Notifications & Reminders System",
    problemAr: "عيادة أسنان تعاني من إلغاء أو عدم حضور المرضى للمواعيد بنسبة تصل إلى 22% بسبب نسيانهم الموعد أو صعوبة التواصل السريع.",
    problemEn: "A dental clinic suffered from a 22% booking cancellation/no-show rate because patients forgot their appointments or had slow communication channels.",
    solutionAr: "ربط نظام المواعيد بالواتساب لإرسال تذكير تلقائي قبل الموعد بـ 24 ساعة ثم بـ 2 ساعة، مع تمكين المريض من التأكيد أو التأجيل بكبسة زر.",
    solutionEn: "Connected the clinic appointment database with WhatsApp API to send auto-reminders 24 hours and 2 hours prior, enabling patients to confirm or reschedule via one-tap buttons.",
    resultAr: "تراجع نسبة الغياب من 22% إلى 4% فقط، وزيادة الكفاءة التشغيلية للأطباء، وارتياح كبير لدى المرضى بفضل التذكيرات الآلية.",
    resultEn: "No-show rate plunged from 22% to just 4%, optimizing doctor scheduling and dramatically improving patient satisfaction.",
    mediaItems: []
  },
  {
    id: "ai-content",
    titleAr: "نظام إنشاء محتوى بالذكاء الاصطناعي",
    titleEn: "AI Content Creation & Publishing Pipeline",
    problemAr: "وكالة تسويق تكافح لإنشاء منشورات وبلوجات متوافقة مع SEO للعملاء بانتظام بسبب نقص الكوادر وضيق الوقت.",
    problemEn: "A marketing agency struggled to write and publish SEO-optimized blog posts and social graphics for clients due to staff shortages and tight deadlines.",
    solutionAr: "بناء نظام ذكاء اصطناعي (GPT-4) متصل بـ WordPress و Buffer، يقرأ الكلمات المفتاحية، يكتب المقالة، يصمم غلافاً رمزياً، وينشرها تلقائياً للمراجعة والموافقة بنقرة واحدة.",
    solutionEn: "Built a GPT-4 powered system connected to WordPress and Buffer that reads keyword inputs, drafts articles, generates featured image assets, and drafts them for one-click approval.",
    resultAr: "ارتفع إنتاج المحتوى بنسبة 300%، وتقلص زمن الكتابة والتدقيق من يومين للمقالة إلى 15 دقيقة فقط من المراجعة البشرية.",
    resultEn: "Content production increased by 300%, cutting writing and auditing time from two days per article to just 15 minutes of human review.",
    mediaItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  {
    id: "appointment-booking",
    titleAr: "نظام إدارة وجدولة المواعيد للشركات",
    titleEn: "Automatic Appointment Booking System",
    problemAr: "مكتب استشارات قانونية يقضي موظفوه ساعات في التنسيق الهاتفي وتحديد المواعيد المناسبة مع العملاء وتفادي التداخل.",
    problemEn: "A legal consultancy office spent hours scheduling client meetings via phone calls, causing double-bookings and massive scheduling overhead.",
    solutionAr: "تصميم صفحة جدولة ذكية عبر Calendly وربطها بـ Google Calendar وبوابة الدفع لضمان جدولة الموعد ودفع رسوم الجلسة مسبقاً تلقائياً.",
    solutionEn: "Designed a smart landing page with Calendly integrated with Google Calendar and a payment gateway, ensuring sessions are booked and paid for automatically.",
    resultAr: "أتمتة حجز 95% من الجلسات بالكامل، وتحصيل الرسوم مقدماً دون تدخل بشري، مما وفّر 18 ساعة عمل شهرياً للمكتب.",
    resultEn: "95% of client meetings are booked and paid for automatically, freeing up 18 hours of administrative time per month.",
    mediaItems: []
  },
  {
    id: "inbox-automation",
    titleAr: "نظام تنظيم رسائل العملاء والردود الذكية",
    titleEn: "Smart Inbox Organizer & Autoreply",
    problemAr: "تلقي عشرات الاستفسارات والرسائل المتكررة يومياً على بريد الشركة وحساب إنستقرام وواتساب تضيع معها الاستفسارات الهامة.",
    problemEn: "Dozens of repetitive customer queries across company email, Instagram DMs, and WhatsApp resulted in lost opportunities and cluttered inboxes.",
    solutionAr: "تطبيق نظام أتمتة الرسائل من ManyChat للمنصات الاجتماعية وربطه بـ ManyChat AI لفهم نية العميل والرد فوراً على الأسئلة الشائعة وتصنيف المهتمين.",
    solutionEn: "Implemented Facebook/Instagram automated flows using ManyChat integrated with AI to detect intent, answer FAQs instantly, and tag high-value leads.",
    resultAr: "توفير رد فوري على 75% من الأسئلة المتكررة وتوجيه الاستفسارات المعقدة مباشرة لموظف الدعم مع ملخص للمشكلة.",
    resultEn: "Instant resolution for 75% of repetitive queries, route complex cases directly to support agents with automated summaries.",
    mediaItems: [
      { type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34327-large.mp4" },
      { type: "image", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" }
    ]
  }
];

// Load projects from localStorage or use defaults
function getProjects() {
  const stored = localStorage.getItem("automation_projects");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored projects, reverting to default", e);
      return defaultProjects;
    }
  }
  // If not in storage, set default
  saveProjects(defaultProjects);
  return defaultProjects;
}

// Save projects to localStorage
function saveProjects(projects) {
  localStorage.setItem("automation_projects", JSON.stringify(projects));
}

// Reset projects to defaults
function resetProjects() {
  saveProjects(defaultProjects);
  return defaultProjects;
}

// Generate code snippet to paste inside js/projects.js for hardcoding
function exportProjectsCode(projects) {
  const jsonStr = JSON.stringify(projects, null, 2);
  return `// Paste this array in your js/projects.js to update default case studies permanently:\nconst defaultProjects = ${jsonStr};`;
}
