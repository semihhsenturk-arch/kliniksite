document.addEventListener('DOMContentLoaded', () => {
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

  // 3. Select All Interactive Elements
  const treatmentDrawer = document.getElementById('treatmentDrawer');
  const treatmentOverlay = document.getElementById('treatmentOverlay');
  const treatmentClose = document.getElementById('treatmentClose');
  const treatmentTitle = document.getElementById('treatmentTitle');
  const treatmentBody = document.getElementById('treatmentBody');

  const bookingDrawer = document.getElementById('bookingDrawer');
  const bookingOverlay = document.getElementById('bookingOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawer');
  const bookingForm = document.getElementById('bookingForm');

  const contactHubModal = document.getElementById('contactHubModal');
  const hubClose = document.getElementById('hubClose');

  const kvkkOverlay = document.getElementById('kvkkOverlay');
  const kvkkClose = document.getElementById('kvkkClose');
  const openKVKK = document.getElementById('openKVKK');

  const cookieOverlay = document.getElementById('cookieOverlay');
  const cookieClose = document.getElementById('cookieClose');
  const footerCookie = document.getElementById('footerCookie');

  const legalOverlay = document.getElementById('legalOverlay');
  const legalClose = document.getElementById('legalClose');
  const footerLegal = document.getElementById('footerLegal');

  // 4. Shared Actions (Consolidated)
  const closeAll = () => {
    // Close Treatment Detail
    if (treatmentDrawer) treatmentDrawer.classList.remove('active');
    if (treatmentOverlay) treatmentOverlay.classList.remove('active');

    // Close Booking Drawer
    if (bookingDrawer) {
      bookingDrawer.classList.remove('active');
      
      // Formu Sıfırla (Kapanınca Refresh Hissi)
      if (typeof bookingForm !== 'undefined' && bookingForm) {
        bookingForm.reset();
      }
      
      const timeGroup = document.getElementById('timeSlotGroup');
      if (timeGroup) timeGroup.style.display = 'none';
      
      const bDate = document.getElementById('bDate');
      if (bDate && bDate._flatpickr) {
        bDate._flatpickr.clear();
      }
      
      const treatmentSelect = document.getElementById('bTreatment');
      const manualInputArea = document.getElementById('manualInputArea');
      if (treatmentSelect && manualInputArea) {
        treatmentSelect.style.display = 'block';
        manualInputArea.style.display = 'none';
        const manualNote = document.getElementById('bManualNote');
        if (manualNote) manualNote.required = false;
      }
    }
    if (bookingOverlay) bookingOverlay.classList.remove('active');

    // Close Contact Hub
    if (contactHubModal) contactHubModal.classList.remove('active');

    // Close KVKK
    if (kvkkOverlay) kvkkOverlay.classList.remove('active');

    // Close Cookie
    if (cookieOverlay) cookieOverlay.classList.remove('active');

    // Close Legal
    if (legalOverlay) legalOverlay.classList.remove('active');

    document.body.style.overflow = '';
  };

  const openTreatmentDetail = (id, titleText) => {
    if (!treatmentTitle || !treatmentBody || !treatmentDrawer || !treatmentOverlay) return;
    treatmentTitle.textContent = titleText;

    const content = (window.treatmentsData && window.treatmentsData[id])
      ? window.treatmentsData[id]
      : '<p>Detaylı bilgi için lütfen kliniğimizle iletişime geçin.</p>';

    treatmentBody.innerHTML = content;

    const imageUrl = (window.treatmentImages && window.treatmentImages[id])
      ? window.treatmentImages[id]
      : null;

    if (imageUrl) {
      treatmentBody.innerHTML += `
        <div class="treatment-image" style="margin-top: 1rem; text-align: center;">
          <img src="${imageUrl}" alt="${titleText}" onerror="this.onerror=null;this.src='https://picsum.photos/1200/800?grayscale&blur=2'" style="max-width: 100%; border-radius: 10px; object-fit: cover; box-shadow: 0 8px 20px rgba(0,0,0,0.12);">
        </div>
      `;
    }

    closeAll(); // Ensure nothing else is open
    treatmentDrawer.classList.add('active');
    treatmentOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const openBooking = () => {
    if (!bookingDrawer || !bookingOverlay) return;
    closeAll(); // Ensure nothing else is open
    bookingDrawer.classList.add('active');
    bookingOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const openHub = () => {
    if (!contactHubModal) return;
    closeAll(); // Ensure nothing else is open
    contactHubModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // 5. Event Listeners
  // Treatment Clicks
  document.querySelectorAll('.treatment-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const id = item.getAttribute('data-id');
      const title = item.textContent;
      if (id) openTreatmentDetail(id, title);
    });
  });

  // Global "Open Booking" Action
  document.querySelectorAll('[data-action="open-booking"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Slight delay for smoother transition if another drawer is closing
      const isAnyActive = document.querySelector('.active');
      if (isAnyActive) {
        closeAll();
        setTimeout(openBooking, 350);
      } else {
        openBooking();
      }
    });
  });

  // Global "Open Contact Hub" Action
  document.querySelectorAll('[data-action="open-contact-hub"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openHub();
    });
  });

  // Close Button Listeners
  if (treatmentClose) treatmentClose.addEventListener('click', closeAll);
  if (treatmentOverlay) treatmentOverlay.addEventListener('click', closeAll);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeAll);
  if (bookingOverlay) bookingOverlay.addEventListener('click', closeAll);

  // Open KVKK Modal
  if (openKVKK) {
    openKVKK.addEventListener('click', (e) => {
      e.preventDefault();
      if (kvkkOverlay) kvkkOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  const footerKVKK = document.getElementById('footerKVKK');
  if (footerKVKK) {
    footerKVKK.addEventListener('click', (e) => {
      e.preventDefault();
      if (kvkkOverlay) kvkkOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Open Cookie Modal
  if (footerCookie) {
    footerCookie.addEventListener('click', (e) => {
      e.preventDefault();
      if (cookieOverlay) cookieOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Open Legal Modal
  if (footerLegal) {
    footerLegal.addEventListener('click', (e) => {
      e.preventDefault();
      if (legalOverlay) legalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close Modals
  if (kvkkClose) kvkkClose.addEventListener('click', closeAll);
  if (cookieClose) cookieClose.addEventListener('click', closeAll);
  if (legalClose) legalClose.addEventListener('click', closeAll);
  if (hubClose) hubClose.addEventListener('click', closeAll);

// ── Google Apps Script Web App URL ───────────────────────
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPSOfJE332q-Ci1XOAfLtY6CBY0IzyB_HmpAJUgtPMoGzrFM_ND5RpHtzpzLX12-dM/exec';

  // 6. Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('bSubmitBtn');
      const statusDiv = document.getElementById('bookingStatus');

      // ── Veri toplama ──────────────────────────────────────────
      const name = document.getElementById('bName').value.trim();
      const phone = document.getElementById('bPhone').value.trim();
      const date = document.getElementById('bDate').value || 'Belirtilmedi';
      const time = document.getElementById('bTime').value || '';
      
      if (!time && date !== 'Belirtilmedi') {
        alert('Lütfen randevu saati seçiniz.');
        return;
      }

      // "Diğer/Manuel" seçilmişse textarea değerini al
      const treatmentSelect = document.getElementById('bTreatment');
      const manualNote = document.getElementById('bManualNote');
      const isManual = treatmentSelect.style.display === 'none';
      const treatment = isManual
        ? ('Manuel Not: ' + (manualNote ? manualNote.value.trim() : ''))
        : treatmentSelect.value;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Gönderiliyor...';
      statusDiv.style.display = 'none';

      try {
        // n8n/Script'in okuyacağı tüm alanlar burada gönderiliyor
        const payload = {
          name,
          phone,
          treatment,
          date,
          time, // Yeni eklenen saat parametresi
          source: 'web-form' // n8n'de filtreleme için
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.status === 'success') {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#dcfce3';
          statusDiv.style.color = '#166534';
          statusDiv.textContent = 'Talebiniz başarıyla alındı. Sizinle en kısa sürede iletişime geçeceğiz.';
          bookingForm.reset();

          // "Diğer" alanı açıksa gizle, select'i geri getir
          if (isManual) {
            treatmentSelect.style.display = 'block';
            if (manualNote) {
              manualNote.closest('#manualInputArea').style.display = 'none';
              manualNote.value = '';
            }
          }

          setTimeout(() => {
            closeAll();
            statusDiv.style.display = 'none';
          }, 3500);
        } else {
          throw new Error(result.message || 'Sunucu hatası');
        }
      } catch (err) {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#fee2e2';
        statusDiv.style.color = '#991b1b';
        statusDiv.textContent = 'Bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Randevu Talebini Gönder';
      }
    });
  }

  // 7. Accessibility: Escape Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  // 8. Flatpickr Initialization (Premium Immersive Calendar)
  if (typeof flatpickr !== 'undefined') {
    const thisYear = new Date().getFullYear();
    const nextYear = thisYear + 1;

    flatpickr("#bDate", {
      locale: "tr", // Load first for day names
      dateFormat: "d.m.Y",
      minDate: `01.01.${thisYear}`,
      disable: [
        function (date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today;
        }
      ],
      monthSelectorType: "dropdown",
      disableMobile: "true",
      animate: true,
      static: false,
      appendTo: document.body,
      onReady: function (selectedDates, dateStr, instance) {
        // Double check firstDayOfWeek to be 1 (Monday) to match Turkish standard and grid
        instance.set("locale", { firstDayOfWeek: 1 });

        const yearInput = instance.currentYearElement;
        if (yearInput) {
          const yearSelect = document.createElement("select");
          yearSelect.className = "flatpickr-monthDropdown-months custom-year-select";
          [thisYear, nextYear].forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.text = year;
            if (year === instance.currentYear) option.selected = true;
            yearSelect.appendChild(option);
          });
          yearSelect.addEventListener("change", (e) => instance.changeYear(parseInt(e.target.value)));
          yearInput.parentNode.replaceChild(yearSelect, yearInput);
        }
      },
      onOpen: function (selectedDates, dateStr, instance) {
        document.body.classList.add('date-picker-open');
      },
      onClose: function (selectedDates, dateStr, instance) {
        document.body.classList.remove('date-picker-open');
      },
      onChange: async function (selectedDates, dateStr, instance) {
        if (!dateStr) return;
        
        const timeGroup = document.getElementById('timeSlotGroup');
        const timeLoading = document.getElementById('timeSlotLoading');
        const timeSlotsDiv = document.getElementById('timeSlots');
        const bTimeInput = document.getElementById('bTime');
        
        if (!timeGroup) return;
        
        timeGroup.style.display = 'block';
        timeLoading.style.display = 'inline';
        timeSlotsDiv.innerHTML = '';
        bTimeInput.value = '';
        
        try {
          const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_booked_slots&date=${encodeURIComponent(dateStr)}`);
          if (!res.ok) throw new Error('Ağ hatası');
          const bookedSlots = await res.json();
          renderTimeSlots(bookedSlots, timeSlotsDiv, bTimeInput);
        } catch (error) {
          console.error("Saatler çekilirken hata:", error);
          // Hata durumunda tüm slotları açık göster ki kullanıcı mağdur olmasın
          renderTimeSlots([], timeSlotsDiv, bTimeInput);
        } finally {
          timeLoading.style.display = 'none';
        }
      }
    });

    function renderTimeSlots(bookedSlots, container, hiddenInput) {
      const allSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
      container.innerHTML = '';
      
      allSlots.forEach(slot => {
        const btn = document.createElement('div');
        btn.className = 'time-slot';
        btn.textContent = slot;
        
        if (bookedSlots.includes(slot)) {
          btn.classList.add('disabled');
        } else {
          btn.addEventListener('click', () => {
            // Remove selected class from all
            container.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
            // Add selected to this
            btn.classList.add('selected');
            hiddenInput.value = slot;
          });
        }
        
        container.appendChild(btn);
      });
    }
  }

  // 9. Dynamic "Other" Treatment Logic (Visual Transformation)
  const treatmentSelect = document.getElementById('bTreatment');
  const manualInputArea = document.getElementById('manualInputArea');
  const backBtn = document.getElementById('btnBackToList');
  const bManualNote = document.getElementById('bManualNote');

  if (treatmentSelect && manualInputArea && bManualNote && backBtn) {
    treatmentSelect.addEventListener('change', function () {
      if (this.value === 'Diger') {
        // Transform: Hide select, show manual area
        treatmentSelect.style.display = 'none';
        manualInputArea.style.display = 'block';
        bManualNote.required = true;
        bManualNote.focus();
      }
    });

    backBtn.addEventListener('click', function () {
      // Revert: Show select, hide manual area
      treatmentSelect.style.display = 'block';
      manualInputArea.style.display = 'none';
      treatmentSelect.value = ''; // Reset to placeholder
      bManualNote.required = false;
      bManualNote.value = ''; // Clear note
    });
  }

  // Close buttons and overlay interaction for all drawers
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeAll);
  if (bookingOverlay) bookingOverlay.addEventListener('click', closeAll);

  // Booking form is already handled by the rich submission codeblock above.
  // If fallback behavior needed, can be added here explicitly.


});
