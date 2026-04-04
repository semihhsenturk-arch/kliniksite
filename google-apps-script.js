// ============================================================
// Google Apps Script — Randevu Formu → Google Sheets + Google Takvim
// Dr. Yelda Yaren Şentürk | Dermatoloji Muayenehanesi
// ============================================================

// ▼ Google Sheets ID ▼
const SPREADSHEET_ID = '154Mtyv_ECh1oG5SeBZK9bTWiqRxszYU1cWA8-MaY4ro';
const SHEET_NAME     = 'Randevular';

// ▼ Google Takvim ID ▼
// "primary" = hesabınızın ana takvimi.
// Başka bir takvim kullanmak istiyorsanız:
//   Google Takvim → Takvim Ayarları → "Takvim ID'si" kısmından kopyalayın.
const CALENDAR_ID = 'primary';

// ─────────────────────────────────────────────────────────────
// POST isteğini işleyen ana fonksiyon
// ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ── 1. Google Sheets'e Kaydet ─────────────────────────────
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Sayfa yoksa oluştur ve başlık satırını ekle
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Zaman Damgası',
        'Ad Soyad',
        'Telefon Numarası',
        'İlgilendiği Tedavi',
        'Tercih Edilen Tarih',
        'Durum'
      ]);

      // Başlık satırını biçimlendir (koyu yeşil)
      const header = sheet.getRange(1, 1, 1, 6);
      header.setBackground('#0a3d34');
      header.setFontColor('#ffffff');
      header.setFontWeight('bold');
      header.setFontSize(11);
      sheet.setFrozenRows(1);

      sheet.setColumnWidth(1, 180); // Zaman Damgası
      sheet.setColumnWidth(2, 160); // Ad Soyad
      sheet.setColumnWidth(3, 150); // Telefon
      sheet.setColumnWidth(4, 220); // Tedavi
      sheet.setColumnWidth(5, 160); // Tarih
      sheet.setColumnWidth(6, 130); // Durum
    }

    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'dd.MM.yyyy HH:mm:ss'
    );

    const finalDate = (data.date && data.date !== 'Belirtilmedi') 
      ? (data.date + (data.time ? ' ' + data.time : '')) 
      : 'Belirtilmedi';

    sheet.appendRow([
      timestamp,
      data.name      || '',
      data.phone     || '',
      data.treatment || '',
      finalDate,
      'Beklemede'
    ]);

    // ── 2. Google Takvim'e Ekle ───────────────────────────────
    const calendarStatus = addToCalendar(data);

    // ── 3. Başarılı Yanıt ─────────────────────────────────────
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Randevu kaydedildi.',
        calendar: calendarStatus
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────
// Google Takvim'e etkinlik ekleyen yardımcı fonksiyon
// ─────────────────────────────────────────────────────────────
function addToCalendar(data) {
  try {
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    if (!calendar) return 'takvim-bulunamadi';

    const title = '🏥 Randevu Talebi — ' + (data.name || 'Bilinmeyen Hasta');

    const description =
      'Ad Soyad: '     + (data.name      || '-') + '\n' +
      'Telefon: '      + (data.phone     || '-') + '\n' +
      'Tedavi: '       + (data.treatment || '-') + '\n' +
      'Tercih Tarihi: '+ (data.date      || 'Belirtilmedi') + '\n\n' +
      '⚠️ Bu bir randevu talebidir. Onaylamak için hastayla iletişime geçin.';

    if (data.date && data.date !== 'Belirtilmedi') {
      // "dd.mm.yyyy" → Date objesine çevir, 09:00–09:30 slotuna ekle
      let hour = 9;
      let minute = 0;
      if (data.time) {
        const timeParts = data.time.split(':');
        if (timeParts.length >= 2) {
          hour = parseInt(timeParts[0]);
          minute = parseInt(timeParts[1]);
        }
      }

      const parts     = data.date.split('.');       // ["01","04","2026"]
      const startDate = new Date(
        parseInt(parts[2]),       // yıl
        parseInt(parts[1]) - 1,  // ay (0 tabanlı)
        parseInt(parts[0]),       // gün
        hour, 
        minute, 
        0
      );
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1); // 1 saatlik blok

      calendar.createEvent(title, startDate, endDate, { description });
      return 'takvime-eklendi';

    } else {
      // Tarih belirtilmemişse → bugün, tam günlük etkinlik
      calendar.createAllDayEvent(title, new Date(), { description });
      return 'bugun-olarak-eklendi';
    }

  } catch (err) {
    // Takvim hatası Sheets kaydını engellemez
    return 'takvim-hatasi: ' + err.toString();
  }
}

// ─────────────────────────────────────────────────────────────
// GET isteği — bağlantı testi (tarayıcıdan açılabilir)
// ─────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action;
    const dateStr = e.parameter.date;

    // Dolu Slotların Çekilmesi
    if (action === 'get_booked_slots' && dateStr) {
      const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
      }
      
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) {
         return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
      }
      
      // "Tercih Edilen Tarih" formatı "04.04.2026 14:00" olacak
      const dateColumn = sheet.getRange(2, 5, lastRow - 1, 1).getValues();
      const bookedSlots = [];
      
      for (let i = 0; i < dateColumn.length; i++) {
        const val = String(dateColumn[i][0]).trim();
        if (val.startsWith(dateStr)) {
          const timePart = val.split(' ')[1];
          if (timePart) {
            bookedSlots.push(timePart);
          }
        }
      }
      
      return ContentService
        .createTextOutput(JSON.stringify(bookedSlots))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Bağlantı testi
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'active',
        message: 'Dr. Yelda Yaren Şentürk — Randevu API çalışıyor. (Sheets + Takvim)'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
