// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
});

siteNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Menü öffnen');
  });
});

// Project detail modal
const projects = [
  {
    eyebrow: 'Aktuelles Projekt',
    title: 'Wahl der neuen Schülersprecher*innen',
    text: 'Die nächste Schülersprecherwahl steht an. Hier findet ihr später alle wichtigen Informationen zur Kandidatur, zum Ablauf und zum Wahltermin. So wird die Wahl transparent und für alle Schüler*innen leicht zugänglich.',
    date: 'Termin: wird ergänzt',
    responsible: 'Verantwortlich: Schülersprecher*innen / SMV-AK'
  },
  {
    eyebrow: 'Projekttag · 23.12.',
    title: 'Weihnachtsprojekttag',
    text: 'Am 23.12. organisiert die SMV gemeinsam mit den Arbeitskreisen einen Projekttag. Die konkreten Angebote, Räume und Zeiten werden rechtzeitig veröffentlicht.',
    date: '23.12.',
    responsible: 'Verantwortlich: SMV + SMV-AK'
  },
  {
    eyebrow: 'Projekttag',
    title: 'Anti-Rassismus-Tag',
    text: 'Ein Projekttag rund um Respekt, Vielfalt und ein faires Miteinander. Das genaue Datum ist noch nicht sicher und wird ergänzt, sobald es feststeht.',
    date: 'Termin: folgt',
    responsible: 'Verantwortlich: SMV + SMV-AK'
  },
  {
    eyebrow: 'Projekttag · 27.07.',
    title: 'SMV-Sommerprojekttag',
    text: 'Zum Schuljahresende steht am 27.07. der SMV-Sommerprojekttag an. Geplant sind gemeinsame Aktionen und Projekte der Schülerschaft.',
    date: '27.07.',
    responsible: 'Verantwortlich: SMV + SMV-AK'
  }
];

const dialog = document.getElementById('projectDialog');
const dialogEyebrow = document.getElementById('dialogEyebrow');
const dialogTitle = document.getElementById('dialogTitle');
const dialogText = document.getElementById('dialogText');
const dialogDate = document.getElementById('dialogDate');
const dialogResponsible = document.getElementById('dialogResponsible');
const dialogCounter = document.getElementById('dialogCounter');

let currentProject = 0;

function renderProject(index) {
  currentProject = (index + projects.length) % projects.length;
  const project = projects[currentProject];
  dialogEyebrow.textContent = project.eyebrow;
  dialogTitle.textContent = project.title;
  dialogText.textContent = project.text;
  dialogDate.textContent = project.date;
  dialogResponsible.textContent = project.responsible;
  dialogCounter.textContent = `${currentProject + 1} / ${projects.length}`;
}

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    renderProject(Number(button.dataset.project));
    dialog.showModal();
  });
});

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
document.getElementById('dialogPrev')?.addEventListener('click', () => renderProject(currentProject - 1));
document.getElementById('dialogNext')?.addEventListener('click', () => renderProject(currentProject + 1));

dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

// ========================================
// 1. EMAILJS INITIALISIERUNG
// ========================================
// Ersetze 'YOUR_PUBLIC_KEY' mit deinem echten EmailJS Public Key
emailjs.init('YOUR_PUBLIC_KEY');


// ========================================
// 2. KONTAKTFORMULAR LOGIK
// ========================================
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const successBanner = document.getElementById('contactSuccess');
    const errorBanner = document.getElementById('contactError');
    const errorText = document.getElementById('contactErrorText');
    const submitBtn = document.getElementById('contactSubmitBtn');

    // Reset von Fehlermeldungen / Erfolgsmeldungen
    successBanner.style.display = 'none';
    errorBanner.style.display = 'none';

    // Werte auslesen
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // 1. Validierung: Pflichtfelder
    if (!name || !email || !message) {
        errorText.textContent = 'Bitte füllen Sie alle Pflichtfelder aus!';
        errorBanner.style.display = 'block';
        return;
    }

    // 2. Validierung: E-Mail Format Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorText.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein!';
        errorBanner.style.display = 'block';
        return;
    }

    // 3. UI Status: Button sperren & Ladezustand anzeigen
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Wird gesendet...';

    try {
        // Parameter für das EmailJS Template
        const templateParams = {
            contact_name: name,
            contact_email: email,
            contact_message: message
        };

        // 4. E-Mail senden via EmailJS
        await emailjs.send('service_yoijryh', 'template_97efex7', templateParams);

        // Erfolg: Banner anzeigen & Formular leeren
        successBanner.style.display = 'block';
        this.reset();

        // Erfolgsmeldung nach 8 Sekunden ausblenden
        setTimeout(() => {
            successBanner.style.display = 'none';
        }, 8000);

    } catch (error) {
        console.error('❌ FEHLER beim Senden des Kontaktformulars:', error);
        errorText.textContent = 'Fehler beim Senden. Bitte versuchen Sie es später erneut.';
        errorBanner.style.display = 'block';

        // Fehlermeldung nach 10 Sekunden ausblenden
        setTimeout(() => {
            errorBanner.style.display = 'none';
        }, 10000);

    } finally {
        // UI Status zurücksetzen
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});
