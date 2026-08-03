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

document.querySelectorAll("[data-deal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (dealSelect) dealSelect.value = btn.dataset.deal;
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
        "Takk! Bestillingen er sendt. Husk Vipps til 97 10 58 79 hvis du ikke har betalt ennå.";
      formStatus.className = "form-status success";
      form.reset();
      if (dealSelect) dealSelect.value = "2";
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
