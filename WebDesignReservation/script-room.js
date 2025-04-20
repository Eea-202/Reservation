document.addEventListener("DOMContentLoaded", function () {
    // Bu olay, sayfa tamamen yüklendiğinde çalışacak fonksiyonu başlatır.
    const form = document.getElementById("roomBookingForm"); // Oda rezervasyon formu
    const list = document.getElementById("reservations"); // Rezervasyon listesi
    const clearAllBtn = document.getElementById("clearAll"); // Tüm rezervasyonları silme butonu

    loadReservations(); // Sayfa yüklendiğinde daha önce kaydedilen rezervasyonları yükler.

    form.addEventListener("submit", function (e) {
        // Rezervasyon formu gönderildiğinde bu işlev çalışır.
        e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller.

        const reservation = {
            name: document.getElementById("name").value, 
            email: document.getElementById("email").value, 
            checkin: document.getElementById("checkin").value, 
            checkout: document.getElementById("checkout").value, 
            guests: document.getElementById("guests").value, 
            roomType: document.getElementById("room-type").value 
        };

        saveReservation(reservation); // Yeni rezervasyonu localStorage'a kaydeder.
        addToList(reservation); 
        form.reset(); // Formu sıfırlayarak temizler.
    });

    function saveReservation(res) {
        // Yeni rezervasyonu yerel depolamaya kaydeder.
        let reservations = JSON.parse(localStorage.getItem("roomReservations")) || []; // Önceden var olan rezervasyonları alır veya boş bir dizi oluşturur.
        reservations.push(res); // Yeni rezervasyonu ekler.
        localStorage.setItem("roomReservations", JSON.stringify(reservations)); // Güncellenmiş rezervasyon listesini localStorage'a kaydeder.
    }

    function loadReservations() {
        // Sayfa yüklendiğinde kaydedilmiş rezervasyonları yükler.
        const reservations = JSON.parse(localStorage.getItem("roomReservations")) || []; // Kaydedilen rezervasyonları alır.
        reservations.forEach(addToList); // Her bir rezervasyonu listeye ekler.
    }

    function addToList(res) {
        // Rezervasyonu listeye ekler.
        const li = document.createElement("li"); // Yeni bir liste öğesi oluşturur.
        li.textContent = `${res.name} - ${res.roomType} room from ${res.checkin} to ${res.checkout} (${res.guests} guests)`; 
        // Liste öğesinin içeriğini, rezervasyonun bilgileri ile doldurur.

        const deleteBtn = document.createElement("button"); // Silme butonunu oluşturur.
        deleteBtn.textContent = "Delete"; // Butonun metni "Delete" olarak ayarlanır.
        deleteBtn.classList.add("delete-btn"); // Butona stil ekler.
        deleteBtn.onclick = function () { 
            deleteReservation(res); // Silme butonuna tıklandığında deleteReservation fonksiyonunu çalıştırır.
        };

        li.appendChild(deleteBtn); // Silme butonunu liste öğesine ekler.
        list.appendChild(li); // Liste öğesini listeye (HTML'deki ul veya ol) ekler.
    }

    function deleteReservation(toDelete) {
        // Belirli bir rezervasyonu siler.
        let reservations = JSON.parse(localStorage.getItem("roomReservations")) || []; // Kaydedilen rezervasyonları alır.
        reservations = reservations.filter(res =>
            res.name !== toDelete.name ||
            res.checkin !== toDelete.checkin ||
            res.checkout !== toDelete.checkout
        ); // Silinmesi gereken rezervasyonu filtreler.

        localStorage.setItem("roomReservations", JSON.stringify(reservations)); // Güncellenmiş rezervasyon listesini kaydeder.
        list.innerHTML = ""; // Listeden tüm öğeleri siler.
        loadReservations(); // Yeniden kaydedilen rezervasyonları yükler ve listeyi günceller.
    }

    clearAllBtn.addEventListener("click", function () {
        // Tüm rezervasyonları silme butonuna tıklandığında bu işlev çalışır.
        if (confirm("Delete all reservations?")) {
            // Kullanıcıya tüm rezervasyonları silip silmek istemediği sorulur.
            localStorage.removeItem("roomReservations"); // Tüm rezervasyonları localStorage'dan siler.
            list.innerHTML = ""; // Listeyi boşaltır.
        }
    });
});
