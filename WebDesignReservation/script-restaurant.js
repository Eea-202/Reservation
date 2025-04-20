document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("roomBookingForm"); // Oda rezervasyon formu
    const list = document.getElementById("reservations"); // Rezervasyon listesi
    const clearAllBtn = document.getElementById("clearAll"); // Tüm rezervasyonları silme butonu

    loadReservations();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const reservation = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            checkin: document.getElementById("checkin").value,
            checkout: document.getElementById("checkout").value,
            guests: document.getElementById("guests").value,
            roomType: document.getElementById("room-type").value
        };

        saveReservation(reservation);
        addToList(reservation);
        form.reset();
    });

    function saveReservation(res) {
        let reservations = JSON.parse(localStorage.getItem("roomReservations")) || [];
        reservations.push(res);
        localStorage.setItem("roomReservations", JSON.stringify(reservations));
    }

    function loadReservations() {
        const reservations = JSON.parse(localStorage.getItem("roomReservations")) || [];
        reservations.forEach(addToList);
    }

    function addToList(res) {
        const li = document.createElement("li");
        li.textContent = `${res.name} - ${res.roomType} room from ${res.checkin} to ${res.checkout} (${res.guests} guests)`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = function () {
            deleteReservation(res);
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    function deleteReservation(toDelete) {
        let reservations = JSON.parse(localStorage.getItem("roomReservations")) || [];
        reservations = reservations.filter(res =>
            res.name !== toDelete.name ||
            res.checkin !== toDelete.checkin ||
            res.checkout !== toDelete.checkout
        );
        localStorage.setItem("roomReservations", JSON.stringify(reservations));
        list.innerHTML = "";
        loadReservations();
    }

    clearAllBtn.addEventListener("click", function () {
        if (confirm("Delete all reservations?")) {
            localStorage.removeItem("roomReservations");
            list.innerHTML = "";
        }
    });
});
