/**
 * SPARTA FITNESS URALSK — INTERACTIVE LOGIC & APP ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Header Scroll Shadow, Reading Progress & Scroll-Spy Active Link ---
  const header = document.getElementById('siteHeader');
  const readingProgress = document.getElementById('readingProgress');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a.nav-link');

  function handleScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (readingProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
      readingProgress.style.width = `${pct}%`;
    }

    // Scroll-spy for top-level navigation links
    let currentSectionId = '';
    const scrollPos = window.scrollY + 160;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Live Club Status & Real-Time Gym Occupancy (Uralsk UTC+5) ---
  function updateLiveOccupancy() {
    const statusDot = document.getElementById('liveStatusDot');
    const statusText = document.getElementById('liveStatusText');
    const occSevBar = document.getElementById('occSevBar');
    const occSevText = document.getElementById('occSevText');
    const occKurmBar = document.getElementById('occKurmBar');
    const occKurmText = document.getElementById('occKurmText');

    if (!statusText) return;

    // Calculate current Uralsk time (UTC+5)
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const uralskDate = new Date(utcMs + (5 * 3600000));
    const day = uralskDate.getDay(); // 0 = Sun, 1..5 = Mon..Fri, 6 = Sat
    const hour = uralskDate.getHours();
    const mins = uralskDate.getMinutes();
    const timeFloat = hour + mins / 60;

    let openHour = 7;
    let closeHour = 22;
    if (day === 6) { openHour = 8; closeHour = 22; }
    if (day === 0) { openHour = 9; closeHour = 21; }

    const isOpen = timeFloat >= openHour && timeFloat < closeHour;

    let sevLoad = 32;
    let kurmLoad = 36;

    if (!isOpen) {
      statusDot.classList.add('closed');
      const nextOpen = (day === 5 && timeFloat >= closeHour) ? '08:00' : ((day === 6 && timeFloat >= closeHour) ? '09:00' : '07:00');
      statusText.innerHTML = `Сейчас клубы отдыхают • <span>Откроемся в ${nextOpen} (онлайн-запись 24/7)</span>`;
      sevLoad = 12;
      kurmLoad = 15;
    } else {
      statusDot.classList.remove('closed');
      if (hour >= 7 && hour < 11) {
        sevLoad = 28; kurmLoad = 24;
      } else if (hour >= 11 && hour < 16) {
        sevLoad = 36; kurmLoad = 34;
      } else if (hour >= 16 && hour < 18) {
        sevLoad = 48; kurmLoad = 52;
      } else if (hour >= 18 && hour < 20) {
        sevLoad = 64; kurmLoad = 68;
      } else {
        sevLoad = 34; kurmLoad = 38;
      }
      statusText.innerHTML = `Клубы открыты сейчас • <span>Комфортное время для тренировки</span>`;
    }

    if (occSevBar) occSevBar.style.width = `${sevLoad}%`;
    if (occSevText) occSevText.textContent = isOpen ? `${sevLoad}% свободно` : 'Отдых';
    if (occKurmBar) occKurmBar.style.width = `${kurmLoad}%`;
    if (occKurmText) occKurmText.textContent = isOpen ? `${kurmLoad}% свободно` : 'Отдых';
  }

  updateLiveOccupancy();

  // --- 3. Mobile Menu & Dropdown Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navDropdown = document.getElementById('navDropdown');
  const dropdownToggleBtn = document.getElementById('dropdownToggleBtn');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu on actual link click (exclude dropdown button)
    navMenu.querySelectorAll('a.nav-link, a.dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
        if (navDropdown) navDropdown.classList.remove('active');
      });
    });
  }

  // Dropdown toggle on click/touch
  if (navDropdown && dropdownToggleBtn) {
    dropdownToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navDropdown.classList.toggle('active');
      const isExpanded = navDropdown.classList.contains('active');
      dropdownToggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('active');
        dropdownToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 4. Branch Switcher Tabs ---
  const branchTabs = document.querySelectorAll('.branch-tab-btn');
  const branchContents = document.querySelectorAll('.branch-content');

  branchTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-branch');

      branchTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      branchContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `content-${target}`) {
          content.classList.add('active');
        }
      });
    });
  });

  // --- 5. Programs Category Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      programCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 6. Lightbox Modal ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      if (fullSrc && lightboxImg) {
        lightboxImg.src = fullSrc;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // --- 7. Lead Capture Booking Modal & Phone Mask ---
  const leadModal = document.getElementById('leadModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openModalBtn = document.getElementById('openModalBtn');
  const heroCtaBtn = document.getElementById('heroCtaBtn');
  const leadForm = document.getElementById('leadForm');
  const planInput = document.getElementById('planSelect');
  const branchSelect = document.getElementById('branchSelect');
  const phoneInput = document.getElementById('userPhone');

  window.openLeadModal = function(planName = 'Пробная тренировка', preferredBranch = '') {
    if (planInput) planInput.value = planName;
    if (preferredBranch && branchSelect) {
      branchSelect.value = preferredBranch;
    }
    if (leadModal) leadModal.classList.add('active');
  };

  if (openModalBtn) openModalBtn.addEventListener('click', () => openLeadModal('Пробная тренировка'));
  if (heroCtaBtn) heroCtaBtn.addEventListener('click', () => openLeadModal('Пробная тренировка'));

  // Delegate all .open-modal-btn buttons (trials, pricing cards, isometric preview, final CTA)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-modal-btn');
    if (trigger) {
      e.preventDefault();
      const planName = trigger.getAttribute('data-plan') || 'Пробная тренировка';
      const prefBranch = trigger.getAttribute('data-branch') || '';
      openLeadModal(planName, prefBranch);
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      leadModal.classList.remove('active');
    });
  }

  if (leadModal) {
    leadModal.addEventListener('click', (e) => {
      if (e.target === leadModal) {
        leadModal.classList.remove('active');
      }
    });
  }

  // Kazakhstan Phone Input Mask (+7 (7XX) XXX-XX-XX)
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      if (!digits) {
        e.target.value = '';
        return;
      }
      if (digits[0] === '8' || digits[0] === '7') {
        digits = '7' + digits.substring(1);
      } else {
        digits = '7' + digits;
      }
      digits = digits.substring(0, 11);

      let formatted = '+7';
      if (digits.length > 1) formatted += ' (' + digits.substring(1, 4);
      if (digits.length >= 5) formatted += ') ' + digits.substring(4, 7);
      if (digits.length >= 8) formatted += '-' + digits.substring(7, 9);
      if (digits.length >= 10) formatted += '-' + digits.substring(9, 11);
      e.target.value = formatted;
    });
  }

  // Handle Form Submission -> WhatsApp Direct Connect
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const branch = branchSelect ? branchSelect.value : 'Северо-Восток';
      const plan = planInput ? planInput.value : 'Абонемент';

      // Pick branch WhatsApp number
      const targetPhone = (branch === 'Курмангазы') ? '77089301878' : '77078545495';
      
      const messageText = `Здравствуйте! Меня зовут ${name}. Хочу записаться в Sparta Fitness.\n📍 Филиал: ${branch}\n📋 Программа: ${plan}\n📞 Мой номер: ${phone}`;
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;

      leadModal.classList.remove('active');
      window.open(waUrl, '_blank');
      leadForm.reset();
    });
  }

  // --- 8. Interactive Membership Calculator (with Kaspi 0-0-12) ---
  const calcState = {
    branch: 'sev-vostok',
    time: 'full',
    period: 12
  };

  const basePrices = {
    1: 15000,
    3: 38000,
    6: 68000,
    12: 120000
  };

  function updateCalculator() {
    let price = basePrices[calcState.period] || 15000;

    // Time discount
    if (calcState.time === 'day') {
      price = Math.round(price * 0.85); // 15% discount
    } else if (calcState.time === 'student') {
      price = Math.round(price * 0.80); // 20% discount
    }

    // Both branches multi-pass
    if (calcState.branch === 'both') {
      price = Math.round(price * 1.15); // +15% for all-access
    }

    // Round to 500
    price = Math.round(price / 500) * 500;

    // Standard baseline for comparison
    const monthlyBase = calcState.branch === 'both' ? 17500 : 15000;
    const monthlyEquivalent = monthlyBase * calcState.period;
    const saving = monthlyEquivalent - price;

    const priceDisplay = document.getElementById('calcPriceDisplay');
    const savingDisplay = document.getElementById('calcSavingDisplay');
    const kaspiDisplay = document.getElementById('calcKaspiDisplay');

    if (priceDisplay) {
      priceDisplay.textContent = price.toLocaleString('ru-RU') + ' ₸';
    }

    if (kaspiDisplay) {
      const kaspiMonths = calcState.period >= 6 ? 12 : 3;
      const monthlyKaspi = Math.round(price / kaspiMonths);
      kaspiDisplay.innerHTML = `Доступна рассрочка <strong>Kaspi 0-0-${kaspiMonths}</strong>: <strong>${monthlyKaspi.toLocaleString('ru-RU')} ₸ / мес</strong> без переплат`;
    }

    if (savingDisplay) {
      savingDisplay.style.display = 'block';
      if (saving > 0) {
        savingDisplay.textContent = `Ваша выгода: ${saving.toLocaleString('ru-RU')} ₸ по сравнению с помесячной оплатой!`;
      } else {
        savingDisplay.textContent = `Включено: безлимит в зал, финская сауна и вводный инструктаж тренера`;
      }
    }
  }

  // Calc Chips Click
  document.querySelectorAll('.calc-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-type');
      const val = chip.getAttribute('data-val');

      // Update active state in siblings
      chip.parentElement.querySelectorAll('.calc-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (type === 'period') {
        calcState[type] = parseInt(val, 10);
      } else {
        calcState[type] = val;
      }

      updateCalculator();
    });
  });

  // Calc WhatsApp Booking Button
  const calcOrderBtn = document.getElementById('calcOrderBtn');
  if (calcOrderBtn) {
    calcOrderBtn.addEventListener('click', () => {
      const branchName = calcState.branch === 'kurmangazy' 
        ? 'ул. Курмангазы' 
        : (calcState.branch === 'both' ? 'Оба филиала (Мультикарта)' : 'мкр. Северо-Восток');
      
      const timeName = calcState.time === 'day' 
        ? 'Дневной (до 17:00)' 
        : (calcState.time === 'student' ? 'Студенческий' : 'Полный день');

      const targetPhone = calcState.branch === 'kurmangazy' ? '77089301878' : '77078545495';
      const curPrice = document.getElementById('calcPriceDisplay').textContent;

      const text = `Здравствуйте! Рассчитал абонемент на сайте Sparta Fitness:\n📍 Филиал: ${branchName}\n⏱ Время: ${timeName}\n📅 Срок: ${calcState.period} мес.\n💰 Стоимость: ${curPrice}\nХочу забронировать карту по этой спеццене!`;
      window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  updateCalculator();

  // --- 9. Interactive Fitness Diagnostics & КБЖУ Calculator (#diagnostics) ---
  const diagState = {
    gender: 'female',
    goal: 'loss',
    age: 27,
    height: 166,
    weight: 64
  };

  function updateDiagnostics() {
    const ageInput = document.getElementById('diagAge');
    const heightInput = document.getElementById('diagHeight');
    const weightInput = document.getElementById('diagWeight');

    if (!ageInput || !heightInput || !weightInput) return;

    const age = Math.max(14, Math.min(80, parseInt(ageInput.value, 10) || 27));
    const height = Math.max(130, Math.min(220, parseInt(heightInput.value, 10) || 166));
    const weight = Math.max(35, Math.min(180, parseInt(weightInput.value, 10) || 64));

    diagState.age = age;
    diagState.height = height;
    diagState.weight = weight;

    // Mifflin-St Jeor BMR
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (diagState.gender === 'male') ? 5 : -161;

    // Moderate 3-4 workouts/week multiplier (1.48)
    let tdee = bmr * 1.48;
    let targetKcal = tdee;

    if (diagState.goal === 'loss') {
      targetKcal = tdee * 0.82; // 18% deficit
    } else if (diagState.goal === 'gain') {
      targetKcal = tdee * 1.15; // 15% surplus
    }

    targetKcal = Math.round(targetKcal / 10) * 10;

    // Macros in grams
    const proteinGrams = Math.round(weight * (diagState.goal === 'gain' ? 2.0 : 1.8));
    const fatGrams = Math.round(weight * 0.95);
    const remainingKcal = Math.max(200, targetKcal - (proteinGrams * 4) - (fatGrams * 9));
    const carbGrams = Math.round(remainingKcal / 4);

    // BMI
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    const kcalEl = document.getElementById('diagKcal');
    const protEl = document.getElementById('diagProt');
    const fatEl = document.getElementById('diagFat');
    const carbEl = document.getElementById('diagCarb');
    const bmiEl = document.getElementById('diagBmi');
    const recTitleEl = document.getElementById('diagRecTitle');
    const recDescEl = document.getElementById('diagRecDesc');

    if (kcalEl) kcalEl.innerHTML = `${targetKcal.toLocaleString('ru-RU')} <span>ккал/день</span>`;
    if (protEl) protEl.textContent = `${proteinGrams} г`;
    if (fatEl) fatEl.textContent = `${fatGrams} г`;
    if (carbEl) carbEl.textContent = `${carbGrams} г`;
    if (bmiEl) bmiEl.textContent = `Ваш ИМТ: ${bmi} • Зал + Сауна 3–4 раза в неделю`;

    if (recTitleEl && recDescEl) {
      if (diagState.goal === 'loss') {
        recTitleEl.textContent = diagState.gender === 'female'
          ? 'Проект «Перезагрузка» + Женский зал и Hot Iron'
          : 'Силовой функционал + Кардио-линия и Сауна';
        recDescEl.textContent = 'Оптимальное сочетание жиросжигающего тренинга, контроля КБЖУ с наставником и лимфодренажного восстановления в финской сауне.';
      } else if (diagState.goal === 'gain') {
        recTitleEl.textContent = 'Персональный PRO (12 занятий) + Зона свободных весов';
        recDescEl.textContent = 'Силовой прогрессивный сплит со свободными весами и базовыми упражнениями под контролем тренера + белковый коктейль в фитнес-баре.';
      } else {
        recTitleEl.textContent = diagState.gender === 'female'
          ? 'Тренажерный зал + Fly Yoga (Аэройога в гамаках)'
          : 'Безлимитный абонемент + Силовой рельеф';
        recDescEl.textContent = 'Идеальный баланс проработки рельефа мышц, укрепления кора, здоровой осанки и гибкости.';
      }
    }
  }

  document.querySelectorAll('.diag-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-diag-group');
      const val = btn.getAttribute('data-diag-val');
      btn.parentElement.querySelectorAll('.diag-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      diagState[group] = val;
      updateDiagnostics();
    });
  });

  ['diagAge', 'diagHeight', 'diagWeight'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateDiagnostics);
  });

  const diagWhatsappBtn = document.getElementById('diagWhatsappBtn');
  if (diagWhatsappBtn) {
    diagWhatsappBtn.addEventListener('click', () => {
      const kcal = document.getElementById('diagKcal')?.textContent.trim() || '';
      const prot = document.getElementById('diagProt')?.textContent.trim() || '';
      const fat = document.getElementById('diagFat')?.textContent.trim() || '';
      const carb = document.getElementById('diagCarb')?.textContent.trim() || '';
      const rec = document.getElementById('diagRecTitle')?.textContent.trim() || '';
      const goalMap = { loss: 'Сжигание жира', tone: 'Рельеф и тонус', gain: 'Набор массы' };

      const msg = `Здравствуйте! Прошел фитнес-диагностику на сайте Sparta Fitness:\n🎯 Цель: ${goalMap[diagState.goal]}\n📊 Мои параметры: ${diagState.height} см / ${diagState.weight} кг (${diagState.age} лет)\n🔥 Расчетная норма: ${kcal} (Б: ${prot}, Ж: ${fat}, У: ${carb})\n💪 Рекомендация: ${rec}\nХочу записаться на пробную тренировку и получить консультацию тренера!`;
      window.open(`https://wa.me/77078545495?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  updateDiagnostics();

  // --- 10. Schedule Dynamic Engine (All 7 Days + Auto-Select Today) ---
  const scheduleData = {
    mon: [
      { time: '08:30', name: 'Fly Yoga (Аэройога в гамаках)', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '10:00', name: 'Силовой функциональный тренинг', trainer: 'Арман Б.', hall: 'Тренажерный зал', branch: 'kurmangazy' },
      { time: '14:00', name: 'Отдельный женский фитнес (Glute & Core)', trainer: 'Динара К.', hall: 'Женский зал', branch: 'sev-vostok' },
      { time: '18:30', name: 'Hot Iron — Интенсивное жиросжигание', trainer: 'Сергей Т.', hall: 'Зал групповых программ', branch: 'kurmangazy' },
      { time: '19:30', name: 'Зумба Dance Fitness', trainer: 'Мадина Р.', hall: 'Зал №1', branch: 'sev-vostok' },
      { time: '20:30', name: 'Стретчинг & Здоровая спина', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' }
    ],
    tue: [
      { time: '09:00', name: 'Здоровая спина & Пилатес', trainer: 'Екатерина В.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '11:00', name: 'Тяжелоатлетический практикум', trainer: 'Кайрат И.', hall: 'Силовая зона', branch: 'kurmangazy' },
      { time: '16:00', name: 'Фитнес для подростков и юниоров', trainer: 'Арман Б.', hall: 'Основной зал', branch: 'kurmangazy' },
      { time: '18:30', name: 'Аэройога (Декомпрессия и гибкость)', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '19:30', name: 'Pump & Sculpt (Рельеф тела)', trainer: 'Сергей Т.', hall: 'Зал №2', branch: 'kurmangazy' }
    ],
    wed: [
      { time: '08:30', name: 'Fly Yoga (Утренний стретчинг)', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '10:30', name: 'Круговая кардио-тренировка «Перезагрузка»', trainer: 'Динара К.', hall: 'Женский зал', branch: 'sev-vostok' },
      { time: '18:00', name: 'Пауэрлифтинг & Базовые движения', trainer: 'Кайрат И.', hall: 'Помост', branch: 'kurmangazy' },
      { time: '19:15', name: 'Hot Iron 2 (Силовая выносливость)', trainer: 'Сергей Т.', hall: 'Зал групповых программ', branch: 'kurmangazy' },
      { time: '20:15', name: 'Релакс-стретчинг + Финская сауна', trainer: 'Екатерина В.', hall: 'Студия йоги', branch: 'sev-vostok' }
    ],
    thu: [
      { time: '09:30', name: 'Мягкий пилатес & МФР', trainer: 'Екатерина В.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '12:00', name: 'Силовой сплит с наставником', trainer: 'Арман Б.', hall: 'Тренажерный зал', branch: 'kurmangazy' },
      { time: '18:30', name: 'Аэройога в шелковых гамаках', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '19:30', name: 'Зумба Вечеринка', trainer: 'Мадина Р.', hall: 'Зал №1', branch: 'sev-vostok' },
      { time: '20:30', name: 'Body Sculpt & Ягодичный акцент', trainer: 'Динара К.', hall: 'Женский зал', branch: 'sev-vostok' }
    ],
    fri: [
      { time: '08:30', name: 'Fly Yoga Растяжка', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '11:00', name: 'Кардио-выносливость & Core', trainer: 'Арман Б.', hall: 'Кардио зона', branch: 'kurmangazy' },
      { time: '18:00', name: 'Силовой функционал Sparta', trainer: 'Кайрат И.', hall: 'Силовая зона', branch: 'kurmangazy' },
      { time: '19:00', name: 'Hot Iron & Пресс', trainer: 'Сергей Т.', hall: 'Зал групповых программ', branch: 'kurmangazy' },
      { time: '20:00', name: 'Продольный и поперечный шпагат', trainer: 'Екатерина В.', hall: 'Студия йоги', branch: 'sev-vostok' }
    ],
    sat: [
      { time: '10:00', name: 'Субботняя интенсивная зумба', trainer: 'Мадина Р.', hall: 'Зал №1', branch: 'sev-vostok' },
      { time: '11:30', name: 'Аэройога выходного дня', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '13:00', name: 'Открытый тренинг и жим лежа', trainer: 'Кайрат И.', hall: 'Силовая зона', branch: 'kurmangazy' },
      { time: '15:00', name: 'Женский фитнес-интенсив «Перезагрузка»', trainer: 'Динара К.', hall: 'Женский зал', branch: 'sev-vostok' }
    ],
    sun: [
      { time: '10:30', name: 'Воскресный МФР & Глубокая растяжка', trainer: 'Екатерина В.', hall: 'Студия йоги', branch: 'sev-vostok' },
      { time: '12:00', name: 'Функциональный Full-Body + Сауна', trainer: 'Арман Б.', hall: 'Тренажерный зал', branch: 'kurmangazy' },
      { time: '14:00', name: 'Восстановительная Fly Yoga + Релакс', trainer: 'Алина С.', hall: 'Студия йоги', branch: 'sev-vostok' }
    ]
  };

  const dayKeyMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey = dayKeyMap[new Date().getDay()] || 'mon';
  let currentDay = todayKey;
  let currentBranchFilter = 'all';

  function renderSchedule() {
    const tableBody = document.getElementById('scheduleTableBody');
    if (!tableBody) return;

    const items = scheduleData[currentDay] || [];
    const filtered = items.filter(item => {
      if (currentBranchFilter === 'all') return true;
      return item.branch === currentBranchFilter;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
          В этот день в выбранном филиале нет групповых программ. Тренажерный зал и сауна работают по расписанию.
        </div>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(item => {
      const branchLabel = item.branch === 'kurmangazy' ? 'Курмангазы' : 'Северо-Восток';
      return `
        <div class="schedule-row">
          <span class="sched-time">${item.time}</span>
          <span class="sched-name">${item.name}</span>
          <span class="sched-trainer">${item.trainer}</span>
          <span class="sched-hall">${item.hall} (${branchLabel})</span>
          <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="openLeadModal('${item.name} (${item.time})', '${branchLabel}')">
            Записаться
          </button>
        </div>
      `;
    }).join('');
  }

  // Highlight today's tab and wire up clicks
  const dayBtns = document.querySelectorAll('.day-btn');
  dayBtns.forEach(btn => {
    const btnDay = btn.getAttribute('data-day');
    if (btnDay === todayKey) {
      dayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (!btn.querySelector('.day-today-badge')) {
        btn.insertAdjacentHTML('beforeend', '<span class="day-today-badge" title="Сегодня"></span>');
      }
    }
    btn.addEventListener('click', () => {
      dayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDay = btnDay;
      renderSchedule();
    });
  });

  // Branch select change
  const schedBranchSelect = document.getElementById('schedBranchSelect');
  if (schedBranchSelect) {
    schedBranchSelect.addEventListener('change', (e) => {
      currentBranchFilter = e.target.value;
      renderSchedule();
    });
  }

  renderSchedule();

  // --- 11. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- 12. Hero Video Button Interaction ---
  const heroVideoBtn = document.getElementById('heroVideoBtn');
  if (heroVideoBtn) {
    heroVideoBtn.addEventListener('click', () => {
      const videoSection = document.getElementById('videoSection');
      if (videoSection) {
        videoSection.scrollIntoView({ behavior: 'smooth' });
        const bigPlay = document.getElementById('bigVideoBtn');
        if (bigPlay) {
          bigPlay.style.transform = 'scale(1.2)';
          bigPlay.style.boxShadow = '0 0 40px rgba(217, 4, 41, 0.9)';
          setTimeout(() => {
            bigPlay.style.transform = '';
            bigPlay.style.boxShadow = '';
          }, 1000);
        }
      } else {
        window.open('https://www.instagram.com/reel/C0Z18HCrff0/', '_blank');
      }
    });
  }

  // --- 13. Interactive 3D Isometric Studio Layout (#studio-layout) ---
  const isoZonesData = {
    strength: {
      badge: 'Зона 01 • Силовой тренинг',
      title: 'Силовой зал и свободные веса',
      img: 'assets/images/sparta_hero_luxury.jpg',
      desc: 'Более 80 биомеханических тренажеров и блочных рам, гантельный ряд до 60 кг, 4 олимпийских помоста и соревновательные грифы. Просторные проходы и мощная система климат-контроля.',
      tags: ['80+ тренажеров', 'Гантели до 60 кг', '4 силовые рамы', 'Без очередей'],
      ctaLabel: 'Записаться в силовой зал →',
      plan: 'Пробная тренировка (Силовой зал)'
    },
    womens: {
      badge: 'Зона 02 • Только для девушек',
      title: 'Отдельный женский фитнес-зал',
      img: 'assets/images/sparta_womens_gym_pro.jpg',
      desc: 'Приватное тренировочное пространство исключительно для девушек. Специализированные тренажеры для акцента на ягодицы, бедра и пресс, панорамные зеркала и комфортная атмосфера без посторонних взглядов.',
      tags: ['100% Приватность', 'Glute & Core акцент', 'Женские наставники', 'Перезагрузка'],
      ctaLabel: 'Записаться в женский зал →',
      plan: 'Пробная тренировка (Женский зал)'
    },
    yoga: {
      badge: 'Зона 03 • Гибкость и осанка',
      title: 'Студия Fly Yoga & Стретчинга',
      img: 'assets/images/sparta_fly_yoga_pro.jpg',
      desc: 'Просторный светлый зал с профессиональными шелковыми гамаками для аэройоги (выдерживают до 300 кг), оборудованием для пилатеса, МФР и глубокой разгрузки позвоночника.',
      tags: ['Шелковые гамаки', 'Декомпрессия спины', 'МФР и Пилатес', 'Малые группы'],
      ctaLabel: 'Записаться на Fly Yoga →',
      plan: 'Пробная тренировка (Fly Yoga)'
    },
    cardio: {
      badge: 'Зона 04 • Выносливость и жиросжигание',
      title: 'Панорамная Кардио-линия',
      img: 'assets/images/stock_program_gym.jpg',
      desc: 'Профессиональные беговые дорожки с амортизацией суставов, эллиптические кросс-тренажеры, спин-байки и гребные концепты с датчиками пульса и кардио-мониторингом.',
      tags: ['Защита суставов', 'Пульсометры', 'Беговые дорожки', 'Эллипсы & Байки'],
      ctaLabel: 'Записаться на кардио-тренировку →',
      plan: 'Пробная тренировка (Кардио + Зал)'
    },
    sauna: {
      badge: 'Зона 05 • Релакс в каждом абонементе',
      title: 'Финская сауна & SPA-раздевалки',
      img: 'assets/images/sauna_test1.jpg',
      desc: 'Натуральная кедровая парная прямо внутри мужской и женской раздевалок. Снимает мышечный спазм после нагрузки, выводит лишнюю жидкость и ускоряет восстановление. Включена во все карты без доплат.',
      tags: ['Кедровая парная', 'Включено в абонемент', 'Душевые кабины', 'Сейфовые шкафчики'],
      ctaLabel: 'Оформить абонемент с сауной →',
      plan: 'Абонемент (Зал + Сауна)'
    },
    bar: {
      badge: 'Зона 06 • Энергия и восстановление',
      title: 'Фитнес-бар & Lounge зона',
      img: 'assets/images/sparta_bar_lounge.jpg',
      desc: 'Уютная лаунж-зона на ресепшене клуба: свежесбитые протеиновые коктейли на молоке или воде, BCAA, предтренировочные комплексы, L-карнитин, зерновой кофе и полезные протеиновые батончики.',
      tags: ['Whey Isolate', 'BCAA & L-Карнитин', 'Зерновой кофе', 'Зона отдыха'],
      ctaLabel: 'Записаться на гостевой визит →',
      plan: 'Гостевой визит в клуб'
    }
  };

  let currentIsoBranch = 'sev-vostok';
  let currentIsoZone = 'strength';

  const isoZoneGroups = document.querySelectorAll('.iso-zone[data-zone]');
  const isoZoneBtns = document.querySelectorAll('.hj-zone-btn[data-zone-btn]');
  const isoBranchBtns = document.querySelectorAll('.hj-iso-branch-btn[data-iso-branch]');

  function renderIsoZone(zoneKey) {
    const data = isoZonesData[zoneKey];
    if (!data) return;
    currentIsoZone = zoneKey;

    // Update SVG active group
    isoZoneGroups.forEach(g => {
      g.classList.toggle('active', g.getAttribute('data-zone') === zoneKey);
    });

    // Update bottom pills
    isoZoneBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-zone-btn') === zoneKey);
    });

    // Update preview card
    const imgEl = document.getElementById('zonePreviewImg');
    const badgeEl = document.getElementById('zonePreviewBadge');
    const titleEl = document.getElementById('zonePreviewTitle');
    const descEl = document.getElementById('zonePreviewDesc');
    const tagsEl = document.getElementById('zonePreviewTags');
    const ctaEl = document.getElementById('zonePreviewCta');

    const branchSuffix = currentIsoBranch === 'kurmangazy' ? 'Курмангазы' : 'Северо-Восток';

    if (imgEl) {
      imgEl.style.opacity = '0.4';
      setTimeout(() => {
        imgEl.src = data.img;
        imgEl.alt = data.title;
        imgEl.style.opacity = '1';
      }, 120);
    }
    if (badgeEl) badgeEl.textContent = `${data.badge} (${branchSuffix})`;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (tagsEl) {
      tagsEl.innerHTML = data.tags.map(t => `<span class="hj-zone-tag">${t}</span>`).join('');
    }
    if (ctaEl) {
      ctaEl.textContent = data.ctaLabel;
      ctaEl.setAttribute('data-plan', data.plan);
      ctaEl.setAttribute('data-branch', branchSuffix);
    }
  }

  isoZoneGroups.forEach(g => {
    g.addEventListener('click', () => {
      renderIsoZone(g.getAttribute('data-zone'));
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        renderIsoZone(g.getAttribute('data-zone'));
      }
    });
  });

  isoZoneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderIsoZone(btn.getAttribute('data-zone-btn'));
    });
  });

  isoBranchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      isoBranchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentIsoBranch = btn.getAttribute('data-iso-branch') || 'sev-vostok';
      const footerLabel = document.getElementById('isoFooterBranchLabel');
      if (footerLabel) {
        footerLabel.textContent = currentIsoBranch === 'kurmangazy'
          ? '📍 Выбран: ул. Курмангазы, 150 (Центр)'
          : '📍 Выбран: мкр. Северо-Восток, 29/1';
      }
      renderIsoZone(currentIsoZone);
    });
  });

  // Escape Key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (leadModal) leadModal.classList.remove('active');
      if (lightboxModal) lightboxModal.classList.remove('active');
    }
  });

});
