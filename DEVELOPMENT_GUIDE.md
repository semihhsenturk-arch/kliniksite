# 🏥 Dr. Yelda Yaren Şentürk | Geliştirme & Kurulum Rehberi

Bu döküman, projenin yerel geliştirme ortamına (VS Code vb.) taşınması ve sürdürülebilirliği için hazırlanan teknik el kitabıdır.

---

## 🚀 Hızlı Başlangıç (VS Code)

Projeyi bilgisayarınızda bir uzman titizliğiyle çalıştırmak için şu adımları izleyin:

1.  **VS Code'u Açın:** `Webinar` ana klasörünü VS Code ile açın.
2.  **Live Server Kurulumu:** 
    - Extensions (Eklentiler) sekmesine gidin.
    - **"Live Server"** (Ritwick Dey) eklentisini aratıp yükleyin.
3.  **Yayına Alın:** Sağ alt köşedeki **"Go Live"** butonuna basın. Site varsayılan tarayıcınızda (localhost:5500) açılacaktır.

---

## ⚙️ Fonksiyonel Yapılandırma (Kritik)

### 📨 Randevu Formu Entegrasyonu
Randevu taleplerinin e-posta veya Google Sheets'e düşmesi için şu adımı tamamlayın:
- `js/main.js` dosyasını açın.
- Satır **~184**'te bulunan `GOOGLE_SCRIPT_URL` değişkeninin karşısına Google Apps Script URL'ini girin.
- Örnek: `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';`

### 📋 Kişisel Bilgi Güncelleme (Yasal Metinler)
`index.html` içindeki KVKK, Çerez ve Yasal Uyarı bölümlerindeki aşağıdaki yer tutucuları gerçek bilgilerle doldurun:
- `[Tam Adresiniz]` → Muayenehane adresi
- `[Telefon Numaranız]` → Telefon numarası
- `[info@kliniğiniz.com]` → E-posta adresi

---

## ⚖️ Hukuksal Uyumluluk Özeti

### Tamamlanan Yasal Altyapı ✅
- **KVKK Onay Kutusu:** Randevu formu, hasta onayı olmadan gönderilemez.
- **KVKK Modal:** Resmi 6698 sayılı kanun metnini içeren bilgilendirme penceresi.
- **Çerez Politikası Modal:** Çerez türleri ve yönetim bilgisini içerir.
- **Yasal Uyarı Modal:** Tıbbi teşhis uyarısı, sorumluluk reddi ve telif hakkı.
- **Footer Yasal Linkleri:** Sayfanın altında üç yasal bağlantı mevcuttur.
- **Dil Denetimi:** "Randevu Al" → "Randevu Talebi", "En güncel" → "Güncel" revizyonları yapıldı.

> [!WARNING]
> **Bekleyen Risk:** `js/data.js` içindeki tedavi açıklamalarında hâlâ "vaat eder", "rakipsiz", "kalıcı çözüm", "tamamen temizliyoruz" gibi TTB kurallarına göre **sonuç garantisi** olarak yorumlanabilecek ifadeler mevcuttur. Canlıya geçiş öncesi mutlaka gözden geçirilmesi önerilir.

---

## 🎨 Tasarım Kimliği & Kurallar

Projenin "Premium" kalitesini korumak için aşağıdaki standartlara sadık kalınmalıdır:

### 🟢 Renk Paleti (Trust Palette)
- **Deep Emerald (Zümrüt Yeşil):** `#0a3d34` — Randevu pencereleri, yasal modaller ve butonlar.
- **Deep Gold (Koyu Altın):** `#b08d57` — Logo adı, unvan ve dekoratif detaylar.
- **Global Blue (Birincil Mavi):** `#005fbf` — İkincil istatistik ve alt bilgiler.

### 🌫️ Saydamlık & Blur Standartları
- **Global Blur Değeri:** `4px` - `10px` arası (Asla 10px'i geçmemeli).
- **Navbar Blur:** `8px`.

### ✒️ Tipografi
- **Başlıklar (Display):** `Cormorant Garamond` — Hakkında, iletişim ve modal pencereleri.
- **Gövde Metinleri (Body):** `DM Sans` — Tüm form ve içerik alanları.

---

## 📂 Dosya Yapısı

-   `index.html`: Sitenin tüm yapısı, yasal modaller ve HTML içeriği.
-   `css/style.css`: Tüm görsel tasarımlar, animasyonlar ve modal stilleri.
-   `css/variables.css`: Renk, boşluk ve gölge değişkenleri (global değişimler buradan yapılır).
-   `js/main.js`: Takvim mantığı, form gönderimi ve tüm modal/drawer kontrolleri.
-   `js/data.js`: 27 farklı tedavinin açıklama metinleri (HTML formatında).

---

## ⚠️ Dikkat Edilmesi Gerekenler

-   **Responsive Testi:** Yeni bir bölüm eklendiğinde `style.css`'teki `@media` sorguları kontrol edilmelidir.
-   **Takvim Ayarı:** `js/main.js` içindeki `firstDayOfWeek: 1` ayarı değiştirilmemelidir.
-   **Z-Index Hiyerarşisi:** Yasal modaller (`25000`), Randevu Drawer'ı (`10000`)'ın her zaman üzerinde olmalıdır.

---

> [!TIP]
> Yapılan tüm değişimlerin kronolojik geçmişi için **`PROJECT_CHANGELOG.md`** dosyasını inceleyin. Tasarımın felsefi altyapısı için **`web-design-rules.md`** dosyasını kaynak alın.
