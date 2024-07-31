let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-item");
const totalSlides = slides.length;
const carouselInner = document.querySelector(".carousel-inner");
let carouselInterval = setInterval(nextSlide, 3000);

function showSlide(index) {
  if (index >= totalSlides) index = 0;
  if (index < 0) index = totalSlides - 1;

  carouselInner.style.transform = `translateX(-${index * 100}%)`;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  currentSlide = index;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

document
  .querySelectorAll(".carousel-control-prev, .carousel-control-next")
  .forEach((button) => {
    button.addEventListener("click", () => {
      clearInterval(carouselInterval);
      carouselInterval = setInterval(nextSlide, 3000);
    });
  });

showSlide(currentSlide);

// sidebar
const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menu-button");
const closeButton = document.getElementById("close-button");

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  sidebar.classList.toggle("translate-x-0");
  menuButton.style.display = "none";
});

closeButton.addEventListener("click", () => {
  sidebar.classList.toggle("translate-x-0");
  sidebar.classList.toggle("-translate-x-full");
  menuButton.style.display = "block";
});

// untuk animasi
const observerOptions = { threshold: 0.1 };

const fadeInElements = document.querySelectorAll(".fade-in");
const slideUpElements = document.querySelectorAll(".slide-up");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible");
    }
  });
}, observerOptions);

fadeInElements.forEach((el) => observer.observe(el));
slideUpElements.forEach((el) => observer.observe(el));

// kumpulan konfigurasi untuk form
$(document).ready(function () {
  let penyewaData = [];
  let deleteIndex = null; // Tambahkan variabel untuk menyimpan indeks yang akan dihapus

  function refreshTable() {
    const tbody = $("#daftar-penyewa");
    tbody.empty();
    penyewaData.forEach((data, index) => {
      tbody.append(`
        <tr>
          <td class="py-2 px-4">${data.nama}</td>
          <td class="py-2 px-4">${data.alamat}</td>
          <td class="py-2 px-4">${data.noTelpon}</td>
          <td class="py-2 px-4">${data.noKTP}</td>
          <td class="py-2 px-4">${data.mobil}</td>
          <td class="py-2 px-4">${data.tanggalPinjam}</td>
          <td class="py-2 px-4">${data.lamaPinjam}</td>
          <td class="py-2 px-4">
            <button class="editButton bg-blue-700 hover:bg-blue-500 text-white font-bold mb-2 py-2 px-3 rounded mr-2" data-index="${index}">Edit</button>
            <button class="deleteButton bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-1 rounded mr-2" data-index="${index}">Delete</button>
          </td>
        </tr>
      `);
    });
  }

  function showModal(modalId) {
    $(modalId).removeClass("hidden").addClass("modal-active");
  }

  function hideModal(modalId) {
    $(modalId).removeClass("modal-active").addClass("hidden");
  }

  function showNotification(message) {
    $("#notificationMessage").text(message);
    showModal("#notificationModal");
  }

  $("#cancelButton").click(function () {
    $("#penyewaForm")[0].reset();
    $("#formTitle").text("Tambah Penyewa");
    $("#editIndex").val("");
    $(".error").text("");
  });

  $("#closeNotificationButton").click(function () {
    hideModal("#notificationModal");
  });

  $("#penyewaForm").submit(function (e) {
    e.preventDefault();

    let isValid = true;
    $(".error").text("");

    const penyewa = {
      nama: $("#nama").val().trim(),
      alamat: $("#alamat").val().trim(),
      noTelpon: $("#noTelpon").val().trim(),
      noKTP: $("#noKTP").val().trim(),
      mobil: $("#mobil").val().trim(),
      tanggalPinjam: $("#tanggalPinjam").val(),
      lamaPinjam: $("#lamaPinjam").val().trim(),
    };

    if (!penyewa.nama) {
      $("#namaError").text("Nama harus diisi.");
      isValid = false;
    }

    if (!penyewa.alamat) {
      $("#alamatError").text("Alamat harus diisi.");
      isValid = false;
    }

    if (
      !penyewa.noTelpon ||
      isNaN(penyewa.noTelpon) ||
      penyewa.noTelpon.length < 10 ||
      penyewa.noTelpon.length > 15
    ) {
      $("#noTelponError").text(
        "No. Telpon harus berupa angka dan panjangnya antara 10 hingga 15 digit."
      );
      isValid = false;
    }

    if (!penyewa.noKTP || isNaN(penyewa.noKTP) || penyewa.noKTP.length !== 16) {
      $("#noKTPError").text(
        "No. KTP harus berupa angka dan panjangnya 16 digit."
      );
      isValid = false;
    }

    if (!penyewa.mobil) {
      $("#mobilError").text("Mobil yang dipinjam harus diisi.");
      isValid = false;
    }

    if (!penyewa.tanggalPinjam) {
      $("#tanggalPinjamError").text("Tanggal pinjam harus diisi.");
      isValid = false;
    }

    if (!penyewa.lamaPinjam) {
      $("#lamaPinjamError").text("Lama pinjam tidak boleh kosong");
      isValid = false;
    }

    if (isValid) {
      const editIndex = $("#editIndex").val();
      if (editIndex) {
        penyewaData[editIndex] = penyewa;
        showNotification("Data berhasil diubah.");
      } else {
        penyewaData.push(penyewa);
        showNotification("Data berhasil ditambahkan.");
      }
      refreshTable();
      $("#penyewaForm")[0].reset();
      $("#formTitle").text("Tambah Penyewa");
      $("#editIndex").val("");
    }
  });

  $(document).on("click", ".editButton", function () {
    const index = $(this).data("index");
    const penyewa = penyewaData[index];
    $("#nama").val(penyewa.nama);
    $("#alamat").val(penyewa.alamat);
    $("#noTelpon").val(penyewa.noTelpon);
    $("#noKTP").val(penyewa.noKTP);
    $("#mobil").val(penyewa.mobil);
    $("#tanggalPinjam").val(penyewa.tanggalPinjam);
    $("#lamaPinjam").val(penyewa.lamaPinjam);
    $("#formTitle").text("Edit Penyewa");
    $("#editIndex").val(index);
  });

  $(document).on("click", ".deleteButton", function () {
    deleteIndex = $(this).data("index");
    showModal("#confirmDeleteModal");
  });

  $("#confirmDeleteButton").click(function () {
    if (deleteIndex !== null) {
      penyewaData.splice(deleteIndex, 1);
      refreshTable();
      showNotification("Data berhasil dihapus.");
      deleteIndex = null;
      hideModal("#confirmDeleteModal");
    }
  });

  $("#cancelDeleteButton").click(function () {
    hideModal("#confirmDeleteModal");
    deleteIndex = null;
  });

  refreshTable();
});

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}
