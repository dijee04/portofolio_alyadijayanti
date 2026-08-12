/**
 * Alya Dijayanti - Portfolio Interactive Scripts
 * Bahasa Indonesia
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Matriks Kontribusi GitHub (Heatmap Grid)
    initGithubHeatmap();

    // 2. Inisialisasi Akordeon Seksi tentang & Pengalaman
    initAccordions();

    // 3. Inisialisasi Floating Contact Widget
    initFloatingWidget();

    // 4. Inisialisasi Penanganan Formulir Kontak
    initContactForm();

    // 5. Smooth Scroll Navigasi
    initSmoothScroll();

    // 6. Inisialisasi Efek Paralaks Aset Piksel Melayang
    initPixelParallax();
});

/**
 * Membuat efek paralaks halus pada aset piksel melayang berdasarkan gerak tetikus
 */
function initPixelParallax() {
    const heroSection = document.getElementById('hero');
    const pixelDecors = document.querySelectorAll('.floating-pixel-decor');

    if (!heroSection || pixelDecors.length === 0) return;

    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        pixelDecors.forEach(decor => {
            const speed = parseFloat(decor.getAttribute('data-speed')) || 1;
            const offsetX = moveX * 25 * speed;
            const offsetY = moveY * 25 * speed;
            decor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        pixelDecors.forEach(decor => {
            decor.style.transform = `translate3d(0, 0, 0)`;
        });
    });
}

/**
 * Membuat sel-sel matriks heatmap GitHub secara dinamis (52 minggu x 7 hari disederhanakan)
 */
function initGithubHeatmap() {
    const matrixContainer = document.getElementById('github-matrix');
    if (!matrixContainer) return;

    matrixContainer.innerHTML = '';
    const totalCells = 112; // 28 kolom x 4 baris grid responsif

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('heatmap-cell');

        // Mengatur distribusi level kontribusi yang realistis
        const rand = Math.random();
        let level = 0;
        if (rand > 0.85) level = 4;
        else if (rand > 0.65) level = 3;
        else if (rand > 0.45) level = 2;
        else if (rand > 0.25) level = 1;

        cell.classList.add(`level-${level}`);
        cell.title = `Hari ke-${i + 1}: ${level * 3} komit`;
        matrixContainer.appendChild(cell);
    }
}

/**
 * Mengelola fungsionalitas akordeon yang dapat dibuka/ditutup
 */
function initAccordions() {
    // Akordeon Seksi Tentang Saya
    const aboutItems = document.querySelectorAll('.about-accordion-list .accordion-item');
    aboutItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Tutup semua item lain
            aboutItems.forEach(i => {
                i.classList.remove('active');
                const icon = i.querySelector('.acc-toggle-icon');
                if (icon) icon.textContent = '+';
            });

            // Toggle item saat ini
            if (!isActive) {
                item.classList.add('active');
                const icon = item.querySelector('.acc-toggle-icon');
                if (icon) icon.textContent = '−';
            }
        });
    });

    // Akordeon Seksi Pengalaman Profesional
    const expItems = document.querySelectorAll('.experience-list .exp-card-item');
    expItems.forEach(item => {
        const header = item.querySelector('.exp-card-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            expItems.forEach(i => {
                i.classList.remove('active');
                const btn = i.querySelector('.exp-expand-btn');
                if (btn) btn.textContent = '+';
            });

            if (!isActive) {
                item.classList.add('active');
                const btn = item.querySelector('.exp-expand-btn');
                if (btn) btn.textContent = '−';
            }
        });
    });
}

/**
 * Mengelola widget melayang di sudut kanan bawah
 */
function initFloatingWidget() {
    const widgetBtn = document.getElementById('widget-toggle');
    const widgetDropdown = document.getElementById('widget-dropdown');

    if (widgetBtn && widgetDropdown) {
        widgetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            widgetDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!widgetDropdown.contains(e.target) && !widgetBtn.contains(e.target)) {
                widgetDropdown.classList.add('hidden');
            }
        });
    }
}

/**
 * Mengirim formulir kontak dengan umpan balik pengguna
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (form && feedback && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ubah keadaan tombol saat mengirim
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'MENGIRIM PESAN...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Tampilkan umpan balik sukses
                feedback.classList.remove('hidden');
                feedback.className = 'form-feedback success';
                feedback.textContent = '✓ Pesan Anda berhasil terkirim! Saya akan segera merespons via surel.';

                form.reset();

                // Sembunyikan pesan setelah 6 detik
                setTimeout(() => {
                    feedback.classList.add('hidden');
                }, 6000);
            }, 1200);
        });
    }
}

/**
 * Mengatur navigasi scroll halus untuk tautan dengan jangkar '#'
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
