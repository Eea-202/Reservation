document.addEventListener("DOMContentLoaded", function () {
    // Slideshow
    const images = document.querySelectorAll(".carousel-img"); 
    // .carousel-img sınıfına sahip tüm resimleri seç

    let currentIndex = 0; 
    // Başlangıçta ilk resim gösterilsin

    function showSlide(index) {
        // Tüm resimleri gizle, sadece seçilen index'teki resmi göster
        images.forEach((img, i) => {
            img.classList.remove("active"); // Hepsinden active sınıfını kaldır
            if (i === index) img.classList.add("active"); // Sadece o anki resmi aktif yap
        });
    }

    function nextSlide() {
        // Bir sonraki resmi göster
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }

    if (images.length > 0) {
        // Eğer en az bir resim varsa slideshow başlasın
        showSlide(currentIndex); // İlk resmi göster
        setInterval(nextSlide, 3000); // Her 3 saniyede bir geçiş yap
    }


    // Lightbox
    const lightbox = document.getElementById("lightbox"); // Işık kutusu div
    const lightboxImg = document.getElementById("lightbox-img"); // Büyük resim gösterilecek alan
    const closeBtn = document.querySelector(".close-btn"); // Kapatma butonu
    const prevBtn = document.querySelector(".nav-btn.left"); // Sol yön tuşu
    const nextBtn = document.querySelector(".nav-btn.right"); // Sağ yön tuşu

    images.forEach((img, index) => {
        // Her bir resme tıklanınca lightbox açılır
        img.addEventListener("click", () => {
            currentIndex = index;
            lightboxImg.src = images[currentIndex].src;
            lightbox.classList.remove("hidden");
        });
    });

    closeBtn.addEventListener("click", () => {
        // Kapat butonuna basılınca lightbox kapanır
        lightbox.classList.add("hidden");
    });

    lightbox.addEventListener("click", (e) => {
        // Boş alana tıklanınca da lightbox kapanır
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
        }
    });

    if (prevBtn && nextBtn) {
        // Lightbox içindeki yön butonları çalışır
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Diğer olaylar tetiklenmesin
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex].src;
        });

        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex].src;
        });
    }


    // Reservation System
    const form = document.getElementById("roomBookingForm"); // Form alanı
    const list = document.getElementById("reservations"); // Rezervasyon listesi
    const clearAllBtn = document.getElementById("clearAll"); // Hepsini sil butonu

    function saveReservation(res) {
        let reservations = JSON.parse(localStorage.getItem("roomReservations")) || [];
        // localStorage'dan önceki rezervasyonları al
        reservations.push(res); // Yeni rezervasyonu ekle
        localStorage.setItem("roomReservations", JSON.stringify(reservations));
        // localStorage'a geri kaydet
    }
     
    function loadReservations() {
        const reservations = JSON.parse(localStorage.getItem("roomReservations")) || [];
        reservations.forEach(addToList); // Her bir rezervasyonu listeye ekle
    }


    function addToList(res) {
        const li = document.createElement("li");
        li.textContent = `${res.name} - ${res.roomType} room from ${res.checkin} to ${res.checkout} (${res.guests} guests)`;
        // Kullanıcı bilgisi yazılır

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete"; // Sil butonu
        deleteBtn.onclick = () => deleteReservation(res); // Tıklanınca sil

        li.appendChild(deleteBtn); // Liste elemanına butonu ekle
        list.appendChild(li); // Sayfada göster
    }


    function deleteReservation(toDelete) {
        let reservations = JSON.parse(localStorage.getItem("roomReservations")) || [];
        reservations = reservations.filter(res =>
            res.name !== toDelete.name ||
            res.checkin !== toDelete.checkin ||
            res.checkout !== toDelete.checkout
        );
        // Eşleşmeyenleri filtrele (yani silmek istediğini çıkar)

        localStorage.setItem("roomReservations", JSON.stringify(reservations));
        list.innerHTML = ""; // Listeyi sıfırla
        loadReservations(); // Güncel listeyi yeniden yükle
    }


    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Sayfa yenilenmesini engelle

        const reservation = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            checkin: document.getElementById("checkin").value,
            checkout: document.getElementById("checkout").value,
            guests: document.getElementById("guests").value,
            roomType: document.getElementById("room-type").value
        };

        saveReservation(reservation); // Kaydet
        addToList(reservation); // Listeye ekle
        form.reset(); // Formu sıfırla
    });


    clearAllBtn.addEventListener("click", function () {
        if (confirm("Delete all reservations?")) {
            localStorage.removeItem("roomReservations"); // localStorage'dan sil
            list.innerHTML = ""; // Ekrandan da sil
        }
    });


    loadReservations();
});