document.addEventListener("DOMContentLoaded", function () {
  // SAYFA YÜKLENDİKTEN SONRA TÜM KODLAR AKTİF HALE GELİR

  // --- REZERVASYON SİSTEMİ ---

  const form = document.getElementById("restaurantForm"); // Formu seç
  const list = document.getElementById("reservations");   // Rezervasyon listesini seç
  const clearAllBtn = document.getElementById("clearAll"); // Tümünü sil butonunu seç

  // Form gönderildiğinde çalışacak
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller

    // Formdan alınan bilgilerle rezervasyon objesi oluştur
    const reservation = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      guests: document.getElementById("guests").value,
      table: document.getElementById("table").value
    };

    saveReservation(reservation); // Bilgiyi localStorage'a kaydet
    addToList(reservation);       // Sayfada listeye ekle
    form.reset();                 // Formu temizle
  });

  // localStorage'a kayıt ekler
  function saveReservation(res) {
    let reservations = JSON.parse(localStorage.getItem("restaurantReservations")) || [];
    reservations.push(res); // Yeni rezervasyonu ekle
    localStorage.setItem("restaurantReservations", JSON.stringify(reservations)); // Kaydet
  }

  // Sayfa yüklendiğinde tüm rezervasyonları ekrana getirir
  function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem("restaurantReservations")) || [];
    reservations.forEach(addToList);
  }

  // Listeye yeni bir rezervasyon elemanı ekler
  function addToList(res) {
    const li = document.createElement("li");
    li.textContent = `${res.name} - ${res.table} table on ${res.date} at ${res.time} (${res.guests} guests)`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteReservation(res); // Silme fonksiyonunu bağla

    li.appendChild(deleteBtn);
    list.appendChild(li);
  }

  // Belirli bir rezervasyonu siler
  function deleteReservation(toDelete) {
    let reservations = JSON.parse(localStorage.getItem("restaurantReservations")) || [];

    // Silinmek istenen rezervasyonu filtrele (eşleşmeyenler kalır)
    reservations = reservations.filter(res =>
      res.name !== toDelete.name ||
      res.date !== toDelete.date ||
      res.time !== toDelete.time
    );

    localStorage.setItem("restaurantReservations", JSON.stringify(reservations)); // Güncel listeyi kaydet
    list.innerHTML = ""; // Listeyi temizle
    loadReservations();  // Tekrar yükle
  }

  // Tüm rezervasyonları temizler
  clearAllBtn.addEventListener("click", function () {
    if (confirm("Delete all restaurant reservations?")) {
      localStorage.removeItem("restaurantReservations"); // Tamamı silinir
      list.innerHTML = ""; // Ekrandan da temizlenir
    }
  });

  loadReservations(); // Sayfa yüklendiğinde kayıtlı rezervasyonları getirir

  // --- SLIDESHOW (GEÇİŞLİ GÖRSEL) ---

  const carouselImages = document.querySelectorAll('.carousel-img'); // Tüm slayt görselleri
  let currentSlide = 0; // Şu anda gösterilen slaytın indexi

  // Slaytı gösteren fonksiyon
  function showSlide(index) {
    carouselImages.forEach((img, i) => {
      img.classList.remove('active');  // Hepsinden active sınıfı kaldırılır
      if (i === index) img.classList.add('active'); // Sadece belirtilen index aktif olur
    });
  }

  // Sonraki slayta geçiş
  function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselImages.length;
    showSlide(currentSlide);
  }

  // Eğer görsel varsa slaytı başlat
  if (carouselImages.length > 0) {
    showSlide(currentSlide);           // İlk görsel göster
    setInterval(nextSlide, 3000);      // 3 saniyede bir geçiş yap
  }

  // --- LIGHTBOX (BÜYÜK GÖRSEL GÖSTERİMİ) ---

  const lightbox = document.getElementById('lightbox');        // Lightbox kutusu
  const lightboxImg = document.getElementById('lightbox-img'); // Büyük görsel
  const closeBtn = document.querySelector('.close-btn');       // Kapatma tuşu
  const leftBtn = document.querySelector('.nav-btn.left');     // Önceki görsel tuşu
  const rightBtn = document.querySelector('.nav-btn.right');   // Sonraki görsel tuşu

  // Her görsele tıklandığında lightbox açılır
  carouselImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentSlide = index;
      lightboxImg.src = img.src;
      lightbox.classList.remove('hidden'); // Lightbox görünür hale gelir
    });
  });

  // Kapatma tuşuna basıldığında lightbox kapanır
  closeBtn.addEventListener('click', () => {
    lightbox.classList.add('hidden');
  });

  // Lightbox içindeki sol yön butonu
  leftBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Event bubble'ı engelle
    currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
    lightboxImg.src = carouselImages[currentSlide].src;
  });

  // Sağ yön butonu
  rightBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSlide = (currentSlide + 1) % carouselImages.length;
    lightboxImg.src = carouselImages[currentSlide].src;
  });

  // Lightbox dışına tıklanırsa kapat
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
    }
  });
});
