// Sett inn din Formspree-ID etter registrering på https://formspree.io
// Eksempel: "https://formspree.io/f/abcxyzab"
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvzeezwe";

const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const form = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");
const dealSelect = document.getElementById("deal-select");

document.querySelectorAll(".deal-card .btn").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (dealSelect) dealSelect.value = String(index + 1);
  });
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;

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
      formStatus.textContent =
        "Takk! Bestillingen er sendt. Vi tar kontakt snart med betalingsinfo.";
      formStatus.className = "form-status success";
      form.reset();
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
