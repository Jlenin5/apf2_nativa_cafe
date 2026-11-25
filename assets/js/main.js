"use strict";

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  // Año automático del pie de página.
  document.querySelectorAll("[data-year]").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  // Menú responsive accesible para móviles y tablets.
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    function closeMenu() {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
      mainNav.classList.remove("is-open");
    }
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú" : "Cerrar menú",
      );
      mainNav.classList.toggle("is-open", !isOpen);
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", function (event) {
      if (!mainNav.contains(event.target) && !navToggle.contains(event.target))
        closeMenu();
    });
  }

  // Aparición progresiva de bloques al entrar en pantalla.
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );
    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = (index % 3) * 70 + "ms";
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  // Filtros de productos en la página Nuestra carta.
  var filterButtons = document.querySelectorAll("[data-filter]");
  var menuProducts = document.querySelectorAll(".menu-product[data-category]");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");
      filterButtons.forEach(function (item) {
        var selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      menuProducts.forEach(function (product) {
        var visible =
          filter === "todos" ||
          product.getAttribute("data-category") === filter;
        product.hidden = !visible;
      });
    });
  });

  // Galería ampliable mediante el elemento nativo <dialog>.
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImage = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector(".lightbox__caption");
    var lightboxClose = lightbox.querySelector(".lightbox__close");
    document.querySelectorAll("[data-lightbox]").forEach(function (tile) {
      tile.addEventListener("click", function () {
        lightboxImage.src = tile.getAttribute("data-lightbox");
        lightboxImage.alt = tile.querySelector("img")
          ? tile.querySelector("img").alt
          : "Imagen de Nativa Café";
        lightboxCaption.textContent = tile.getAttribute("data-caption") || "";
        if (typeof lightbox.showModal === "function") lightbox.showModal();
        else lightbox.setAttribute("open", "");
      });
    });
    if (lightboxClose)
      lightboxClose.addEventListener("click", function () {
        lightbox.close();
      });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) lightbox.close();
    });
  }

  // Formulario demostrativo: valida campos y prepara un correo, sin almacenar datos.
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      var formData = new FormData(contactForm);
      var subject = "Consulta desde el sitio web de Nativa Café";
      var message = [
        "Nombre: " + (formData.get("nombre") || ""),
        "Correo: " + (formData.get("correo") || ""),
        "Motivo: " + (formData.get("asunto") || ""),
        "",
        "Mensaje:",
        formData.get("mensaje") || "",
      ].join("\n");
      var mailto =
        "mailto:hola@nativacafe.pe?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(message);
      showToast(
        "Tu consulta está preparada. Se abrirá tu aplicación de correo para que puedas enviarla.",
      );
      window.location.href = mailto;
    });
  }

  // Botón volver arriba, visible al desplazarse.
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    function updateBackToTop() {
      backToTop.classList.toggle("is-visible", window.scrollY > 480);
    }
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
  }
});

function showToast(message) {
  var toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 4500);
}
