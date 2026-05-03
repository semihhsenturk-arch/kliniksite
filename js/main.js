document.addEventListener('DOMContentLoaded', () => {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPSOfJE332q-Ci1XOAfLtY6CBY0IzyB_HmpAJUgtPMoGzrFM_ND5RpHtzpzLX12-dM/exec';
  
  // 0. Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // 1. Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // 2. Navbar shrink on scroll
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      if (window.scrollY > 50) {
        nav.style.padding = '12px 0';
      } else {
        nav.style.padding = '24px 0';
      }
    }
  });

  // 3. Select All Modal Elements
  const treatmentOverlay = document.getElementById('treatmentOverlay');
  const bookingV2Overlay = document.getElementById('bookingV2Overlay');
  const contactHubModal = document.getElementById('contactHubModal');
  const kvkkOverlay = document.getElementById('kvkkOverlay');
  const cookieOverlay = document.getElementById('cookieOverlay');
  const legalOverlay = document.getElementById('legalOverlay');

  const treatmentTitle = document.getElementById('treatmentTitle');
  const treatmentBody = document.getElementById('treatmentBody');
  const treatmentImage = document.getElementById('treatmentImage');
  const treatmentCategoryBadge = document.getElementById('treatmentCategoryBadge');

  // 4. Booking Multi-Step Controller
  class BookingController {
    constructor() {
      this.currentStep = 1;
      this.totalSteps = 4;
      this.data = {
        category: '',
        treatment: '',
        date: '',
        time: '',
        name: '',
        phone: ''
      };

      this.init();
    }

    init() {
      this.setupEventListeners();
      this.renderServiceStep();
    }

    setupEventListeners() {
      // Step 1: Category Selection
      document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
          this.data.category = card.getAttribute('data-category');
          document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.renderServiceStep();
          this.nextStep();
        });
      });

      // Next / Prev Buttons
      document.getElementById('btnNext').addEventListener('click', () => this.nextStep());
      document.getElementById('btnPrev').addEventListener('click', () => this.prevStep());
      document.getElementById('btnFinishBooking').addEventListener('click', () => closeAll());

      // Flatpickr Integration for V2
      if (typeof flatpickr !== 'undefined' && document.getElementById('v2Date')) {
        flatpickr("#v2Date", {
          locale: "tr",
          dateFormat: "d.m.Y",
          minDate: "today",
          onChange: (selectedDates, dateStr) => {
            this.data.date = dateStr;
            this.renderTimeSlots();
          }
        });
      }
    }

    renderServiceStep() {
      const grid = document.getElementById('serviceSelectionGrid');
      if (!grid || !this.data.category) return;

      const services = [];
      if (this.data.category === 'Klinik Dermatoloji') {
        services.push(
          "Akne Tedavisi", "Egzama Tedavisi", "Saç Hastalıkları", "Nevus (Ben) Taraması", 
          "Deri Kanserleri", "Ürtiker Tedavisi", "Vitiligo Testi", "Rozase Tedavisi", 
          "Sedef (Psoriasis)", "Siğil (Verru)", "Saçkıran (Alopesi)", "Behçet Hastalığı", 
          "Mantar Hastalıkları", "Milia Tedavisi", "Ksantelazma", "Kriyoterapi", 
          "Koter Tedavileri", "Deri Biyopsisi", "Keratozis Pilaris", "Alerji Testi"
        );
      } else {
        services.push(
          "Radyofrekans (RF)", "Lazer (Alexandrite, Nd:YAG)", "Fraksiyonel CO2 Lazer", 
          "IPL", "Q-Switch Lazer", "HIFU", "Kriyo"
        );
      }

      grid.innerHTML = services.map(s => `<div class="service-card-mini" data-value="${s}">${s}</div>`).join('');
      
      grid.querySelectorAll('.service-card-mini').forEach(card => {
        card.addEventListener('click', () => {
          this.data.treatment = card.getAttribute('data-value');
          grid.querySelectorAll('.service-card-mini').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          document.getElementById('v2Treatment').value = this.data.treatment;
          this.nextStep();
        });
      });
    }

    renderTimeSlots() {
      const container = document.getElementById('v2TimeSlots');
      const timeSlotsContainer = document.getElementById('v2TimeSlotsContainer');
      if (!container || !timeSlotsContainer) return;

      timeSlotsContainer.style.display = 'block';
      const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
      container.innerHTML = slots.map(s => `<div class="time-slot" data-slot="${s}">${s}</div>`).join('');

      container.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => {
          this.data.time = slot.getAttribute('data-slot');
          container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
          slot.classList.add('selected');
          document.getElementById('v2Time').value = this.data.time;
        });
      });
    }

    nextStep() {
      if (this.currentStep === 2 && !this.data.treatment) { alert('Lütfen bir hizmet seçin.'); return; }
      if (this.currentStep === 3 && (!this.data.date || !this.data.time)) { alert('Lütfen tarih ve saat seçin.'); return; }
      
      if (this.currentStep < this.totalSteps) {
        this.goToStep(this.currentStep + 1);
      } else if (this.currentStep === 4) {
        this.submitForm();
      }
    }

    prevStep() {
      if (this.currentStep > 1) {
        this.goToStep(this.currentStep - 1);
      }
    }

    goToStep(step) {
      document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
      document.getElementById(`step${step}`).classList.add('active');
      
      document.querySelectorAll('.step-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.getAttribute('data-step')) <= step) item.classList.add('active');
      });

      this.currentStep = step;

      const btnPrev = document.getElementById('btnPrev');
      const btnNext = document.getElementById('btnNext');
      const nav = document.getElementById('bookingNav');

      btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
      btnNext.textContent = step === 4 ? 'Randevuyu Tamamla' : 'Devam Et';
      
      if (step === 1 || step === 2) {
        btnNext.style.display = 'none'; // Auto-advance in step 1 and 2
      } else {
        btnNext.style.display = 'flex';
      }
    }

    async submitForm() {
      const name = document.getElementById('v2Name').value.trim();
      const phone = document.getElementById('v2Phone').value.trim();
      const kvkkCheck = document.getElementById('v2KvkkCheck');
      
      if (!name || !phone) { alert('Lütfen tüm zorunlu alanları doldurun.'); return; }
      if (kvkkCheck && !kvkkCheck.checked) { alert('Devam etmek için KVKK metnini onaylamanız gerekmektedir.'); return; }

      const submitBtn = document.getElementById('btnNext');
      submitBtn.disabled = true;
      submitBtn.textContent = 'İletiliyor...';

      const payload = {
        name,
        phone,
        treatment: this.data.treatment,
        date: this.data.date,
        time: this.data.time,
        source: 'web-form-v2'
      };

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.status === 'success') {
          this.showSuccess();
        } else {
          throw new Error('Sync error');
        }
      } catch (err) {
        alert('Bir hata oluştu. Lütfen tekrar deneyin veya bizi arayın.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Randevuyu Tamamla';
      }
    }

    showSuccess() {
      document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
      document.getElementById('stepSuccess').classList.add('active');
      document.getElementById('bookingNav').style.display = 'none';
      document.querySelector('.step-indicator').style.display = 'none';
    }

    reset() {
      this.currentStep = 1;
      this.data = { category: '', treatment: '', date: '', time: '', name: '', phone: '' };
      document.getElementById('bookingFormV2').reset();
      document.getElementById('v2TimeSlotsContainer').style.display = 'none';
      document.getElementById('bookingNav').style.display = 'flex';
      document.querySelector('.step-indicator').style.display = 'flex';
      this.goToStep(1);
    }
  }

  const bookingController = new BookingController();

  // 5. Shared Actions
  const closeAll = () => {
    [treatmentOverlay, bookingV2Overlay, contactHubModal, kvkkOverlay, cookieOverlay, legalOverlay].forEach(modal => {
      if (modal) modal.classList.remove('active');
    });

    if (bookingController) bookingController.reset();

    document.body.style.overflow = '';
  };

  const openTreatmentDetail = (id, titleText, category) => {
    if (!treatmentOverlay) return;
    
    if (treatmentTitle) treatmentTitle.textContent = titleText;
    if (treatmentCategoryBadge) treatmentCategoryBadge.textContent = category;
    
    const content = (window.treatmentsData && window.treatmentsData[id])
      ? window.treatmentsData[id]
      : '<p>Bilgilendirme için lütfen kliniğimizle iletişime geçin.</p>';
    if (treatmentBody) treatmentBody.innerHTML = content;

    const imageUrl = (window.treatmentImages && window.treatmentImages[id])
      ? window.treatmentImages[id]
      : 'https://picsum.photos/1200/800?grayscale&blur=2';
    if (treatmentImage) {
      treatmentImage.src = imageUrl;
    }

    closeAll();
    treatmentOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const openBooking = (treatmentId = '') => {
    if (!bookingV2Overlay) return;
    closeAll();
    
    if (treatmentId) {
      // Auto-select treatment logic if needed
      bookingController.data.treatment = treatmentId;
      // We could skip to Step 3, but let's keep the flow consistent
    }

    bookingV2Overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const openHub = () => {
    if (!contactHubModal) return;
    closeAll();
    contactHubModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // 5. Event Listeners
  // Close triggers
  document.querySelectorAll('.modal-close, .treatment-modal-overlay, .booking-v2-overlay, #hubClose, #kvkkClose, #cookieClose, #legalClose').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close') || btn.id.includes('Close')) {
        closeAll();
      }
    });
  });

  // Treatment Clicks
  document.querySelectorAll('.treatment-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const id = item.getAttribute('data-id');
      const category = item.getAttribute('data-category') || 'Dermatoloji';
      const span = item.querySelector('span');
      const title = span ? span.textContent : item.textContent;
      if (id) openTreatmentDetail(id, title, category);
    });
  });

  // Global "Open Booking" Action
  document.querySelectorAll('[data-action="open-booking"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBooking();
    });
  });

  // Global "Open Contact Hub" Action
  document.querySelectorAll('[data-action="open-contact-hub"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openHub();
    });
  });

  // KVKK / Legal / Cookie
  document.querySelectorAll('#openKVKK, #footerKVKK, #v2KvkkLink').forEach(el => el?.addEventListener('click', (e) => { e.preventDefault(); if (kvkkOverlay) kvkkOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }));
  document.getElementById('footerCookie')?.addEventListener('click', (e) => { e.preventDefault(); closeAll(); if (cookieOverlay) cookieOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; });
  document.getElementById('footerLegal')?.addEventListener('click', (e) => { e.preventDefault(); closeAll(); if (legalOverlay) legalOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
});
