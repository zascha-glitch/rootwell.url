const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvzeezwe";
const WISE_IBAN = "GB36TRWI60486497185655";

const DEALS = {
  1: {
    title: "Rootwell 4-i-1 · 1 sett",
    price: "249 kr",
    total: "298 kr",
    note: "+ 49 kr frakt",
    line: "Du betaler <strong>298 kr</strong> via Wise (249 + 49 frakt)",
  },
  2: {
    title: "Rootwell 4-i-1 · 2 sett",
    price: "449 kr",
    total: "449 kr",
    note: "Gratis frakt",
    line: "Du betaler <strong>449 kr</strong> via Wise (gratis frakt)",
  },
  3: {
    title: "Rootwell 4-i-1 · 3 sett",
    price: "629 kr",
    total: "629 kr",
    note: "Gratis frakt",
    line: "Du betaler <strong>629 kr</strong> via Wise (gratis frakt)",
  },
};

const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

const setMenuOpen = (isOpen) => {
  nav.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Lukk meny" : "Åpne meny");
};

menuToggle?.addEventListener("click", () => {
  setMenuOpen(!nav.classList.contains("open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMenuOpen(false);
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 640 && nav.classList.contains("open")) {
    setMenuOpen(false);
  }
});

const form = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");
const dealSelect = document.getElementById("deal-select");
const summaryTitle = document.getElementById("summary-title");
const summaryNote = document.getElementById("summary-note");
const summaryPrice = document.getElementById("summary-price");
const formPriceLine = document.getElementById("form-price-line");
const mobileCta = document.getElementById("mobile-cta");
const contactSection = document.getElementById("kontakt");
const successCard = document.getElementById("success-card");
const successReset = document.getElementById("success-reset");

const updateDealSummary = (value = dealSelect?.value || "2") => {
  const deal = DEALS[value] || DEALS[2];
  if (summaryTitle) summaryTitle.textContent = deal.title;
  if (summaryNote) summaryNote.textContent = deal.note;
  if (summaryPrice) summaryPrice.textContent = deal.price;
  if (formPriceLine) formPriceLine.innerHTML = deal.line;
};

const clearFieldErrors = () => {
  form?.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
  form?.querySelectorAll(".invalid").forEach((el) => {
    el.classList.remove("invalid");
  });
};

const setFieldError = (name, message) => {
  const input = form?.querySelector(`[name="${name}"]`);
  const error = form?.querySelector(`[data-error-for="${name}"]`);
  if (input) input.classList.add("invalid");
  if (error) error.textContent = message;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8;
};

const validateForm = () => {
  clearFieldErrors();
  let ok = true;
  let firstInvalid = null;

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const quantity = form.quantity.value;

  if (!name) {
    setFieldError("name", "Skriv inn navnet ditt.");
    ok = false;
    firstInvalid ||= form.name;
  }

  if (!phone) {
    setFieldError("phone", "Skriv inn telefonnummer.");
    ok = false;
    firstInvalid ||= form.phone;
  } else if (!isValidPhone(phone)) {
    setFieldError("phone", "Bruk et gyldig norsk nummer (minst 8 siffer).");
    ok = false;
    firstInvalid ||= form.phone;
  }

  if (!email) {
    setFieldError("email", "Skriv inn e-postadressen din.");
    ok = false;
    firstInvalid ||= form.email;
  } else if (!isValidEmail(email)) {
    setFieldError("email", "Sjekk at e-postadressen er riktig.");
    ok = false;
    firstInvalid ||= form.email;
  }

  if (!quantity) {
    setFieldError("quantity", "Velg et tilbud.");
    ok = false;
    firstInvalid ||= form.quantity;
  }

  if (!message) {
    setFieldError("message", "Skriv inn leveringsadresse.");
    ok = false;
    firstInvalid ||= form.message;
  } else if (message.length < 8) {
    setFieldError("message", "Legg til gateadresse, postnummer og sted.");
    ok = false;
    firstInvalid ||= form.message;
  }

  firstInvalid?.focus();
  return ok;
};

document.querySelectorAll("[data-deal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (dealSelect) {
      dealSelect.value = btn.dataset.deal;
      updateDealSummary(btn.dataset.deal);
    }
  });
});

dealSelect?.addEventListener("change", () => {
  updateDealSummary(dealSelect.value);
});

updateDealSummary();

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy || WISE_IBAN;
    const original = btn.textContent;

    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = "Kopiert!";
      btn.classList.add("copied");
    } catch {
      btn.textContent = "Kunne ikke kopiere";
    }

    window.setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1600);
  });
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;

  if (!validateForm()) {
    formStatus.textContent = "Fyll inn feltene markert i rødt.";
    formStatus.className = "form-status error";
    return;
  }

  if (!FORMSPREE_ENDPOINT) {
    formStatus.textContent =
      "Skjemaet er klart — legg inn Formspree-ID i script.js for å motta bestillinger.";
    formStatus.className = "form-status error";
    return;
  }

  btn.textContent = "Sender...";
  btn.disabled = true;
  formStatus.textContent = "";
  formStatus.className = "form-status";

  const data = new FormData(form);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      form.reset();
      if (dealSelect) dealSelect.value = "2";
      updateDealSummary("2");
      clearFieldErrors();
      formStatus.textContent = "";
      formStatus.className = "form-status";
      form.hidden = true;
      successCard?.removeAttribute("hidden");
      successCard?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      throw new Error("Send feilet");
    }
  } catch {
    formStatus.textContent =
      "Noe gikk galt. Prøv igjen, eller send e-post direkte til oss.";
    formStatus.className = "form-status error";
  } finally {
    btn.textContent = original;
    btn.disabled = false;
  }
});

successReset?.addEventListener("click", () => {
  successCard?.setAttribute("hidden", "");
  if (form) {
    form.hidden = false;
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }
});

["input", "change", "blur"].forEach((eventName) => {
  form?.addEventListener(eventName, (e) => {
    const field = e.target?.name;
    if (!field) return;
    const error = form.querySelector(`[data-error-for="${field}"]`);
    if (error?.textContent) {
      e.target.classList.remove("invalid");
      error.textContent = "";
    }
  });
});

if (mobileCta && contactSection && "IntersectionObserver" in window) {
  const ctaObserver = new IntersectionObserver(
    ([entry]) => {
      const hide =
        entry.isIntersecting ||
        window.scrollY < 280 ||
        document.body.classList.contains("menu-open");
      mobileCta.classList.toggle("visible", !hide);
    },
    { threshold: 0.15 }
  );
  ctaObserver.observe(contactSection);

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY < 280) mobileCta.classList.remove("visible");
    },
    { passive: true }
  );
}

const scrollTopBtn = document.getElementById("scroll-top");

window.addEventListener(
  "scroll",
  () => {
    scrollTopBtn?.classList.toggle("visible", window.scrollY > 500);
  },
  { passive: true }
);

scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}
