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

    // 7. Inisialisasi 3D Card Flip Kartu Foto Profil
    initPhotoCardFlip();
});

/**
 * Mengelola interaksi klik balik kartu 3D Card Flip pada kartu foto profil
 */
function initPhotoCardFlip() {
    const flipCard = document.getElementById('photo-flip-card');
    if (!flipCard) return;

    flipCard.addEventListener('click', () => {
        flipCard.classList.toggle('is-flipped');
    });
}

/**
 * Mengelola efek menyembur (burst out), penarikan interaktif (Draggable Physics), dan paralaks kursor
 */
function initPixelParallax() {
    const heroSection = document.getElementById('hero');
    const heroTitleGroup = document.querySelector('.hero-title-group');
    const floatingAssets = document.querySelectorAll('.floating-interactive-asset');

    if (!heroSection || floatingAssets.length === 0) return;

    // Pemicu animasi menyembur otomatis saat halaman dimuat (setelah 250ms)
    setTimeout(() => {
        heroSection.classList.add('burst-active');
    }, 250);

    // Memicu ulang efek menyembur saat kursor disorot pada tulisan ALYA DIJAYANTI
    if (heroTitleGroup) {
        heroTitleGroup.addEventListener('mouseenter', () => {
            heroSection.classList.remove('burst-active');
            void heroSection.offsetWidth; // Force reflow
            heroSection.classList.add('burst-active');
        });
    }

    // Penanganan Fitur Tarik Elemen (Draggable Physics Interaktif)
    floatingAssets.forEach(asset => {
        let isDragging = false;
        let startX, startY, initialTranslateX = 0, initialTranslateY = 0;

        asset.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            asset.style.transition = 'none';
            asset.style.zIndex = '100';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            asset.style.transform = `translate3d(${initialTranslateX + dx}px, ${initialTranslateY + dy}px, 0) scale(1.1)`;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            asset.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            asset.style.transform = `translate3d(0, 0, 0) scale(1)`;
        });

        // Tautan klik cepat untuk kartu proyek melayang
        const cardPill = asset.querySelector('.float-card-pill');
        if (cardPill) {
            cardPill.addEventListener('click', (e) => {
                const proyekSection = document.getElementById('proyek');
                if (proyekSection) {
                    proyekSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Efek pergerakan kursor interaktif & dorongan magnetik saat kursor bergerak
    heroSection.addEventListener('mousemove', (e) => {
        if (!heroSection.classList.contains('burst-active')) return;

        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        floatingAssets.forEach((asset, index) => {
            if (asset.matches(':hover')) return;

            const speed = parseFloat(asset.getAttribute('data-speed')) || 1;
            const dir = (index % 2 === 0) ? 1 : -1;
            const offsetX = moveX * 36 * speed * dir;
            const offsetY = moveY * 36 * speed * dir;

            asset.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1)`;
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        floatingAssets.forEach(asset => {
            asset.style.transform = `translate3d(0, 0, 0) scale(1)`;
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
