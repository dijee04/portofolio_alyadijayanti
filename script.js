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

    // 8. Inisialisasi Drag-and-Drop Aset Piksel Melayang
    initPixelDrag();
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
 * Mengelola efek menyembur (burst out) dari belakang tulisan ALYA DIJAYANTI dan paralaks kursor tetikus
 */
function initPixelParallax() {
    const heroSection = document.getElementById('hero');
    const heroTitleGroup = document.querySelector('.hero-title-group');
    const pixelDecors = document.querySelectorAll('.floating-pixel-decor');

    if (!heroSection || pixelDecors.length === 0) return;

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

    // Parallax kursor — hanya untuk elemen yang BELUM pernah di-drag oleh user
    heroSection.addEventListener('mousemove', (e) => {
        if (!heroSection.classList.contains('burst-active')) return;

        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        pixelDecors.forEach((decor, index) => {
            // Skip elemen yang sudah/sedang di-drag oleh user
            if (decor._wasDragged || decor.classList.contains('is-dragging')) return;
            if (decor.matches(':hover')) return;

            const speed = parseFloat(decor.getAttribute('data-speed')) || 1;
            const dir   = (index % 2 === 0) ? 1 : -1;
            decor.style.transform = `translate3d(${moveX * 32 * speed * dir}px, ${moveY * 32 * speed * dir}px, 0) scale(1)`;
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        pixelDecors.forEach(decor => {
            if (decor._wasDragged) return;
            decor.style.transform = 'translate3d(0, 0, 0) scale(1)';
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

/**
 * Drag-and-Drop aset piksel melayang.
 *
 * PENDEKATAN: Menggunakan CSS transform translate() untuk memindahkan elemen,
 * BUKAN top/left — sehingga tidak ada konflik dengan CSS !important dari burst-active.
 * Fitur hold-to-drag: user harus tahan 300ms sebelum drag aktif.
 */
function initPixelDrag() {
    const heroSection = document.getElementById('hero');
    const pixelDecors = document.querySelectorAll('.floating-pixel-decor');
    if (!heroSection || pixelDecors.length === 0) return;

    const HOLD_MS = 300; // durasi tahan sebelum drag aktif

    let activeDrag    = null;
    let holdTimer     = null;
    let pendingDecor  = null;
    let startX        = 0;
    let startY        = 0;
    let currentDeltaX = 0;
    let currentDeltaY = 0;

    pixelDecors.forEach((decor) => {
        // Akumulasi offset transform dari riwayat drag
        decor._accX = 0;
        decor._accY = 0;
        decor._wasDragged = false;

        // MOUSE
        decor.addEventListener('mousedown', (e) => {
            e.preventDefault();
            beginHold(e.clientX, e.clientY, decor);
        });

        // TOUCH
        decor.addEventListener('touchstart', (e) => {
            e.preventDefault();
            beginHold(e.touches[0].clientX, e.touches[0].clientY, decor);
        }, { passive: false });

        // Double-click → reset
        decor.addEventListener('dblclick', () => resetDecor(decor));
    });

    // Global event handlers
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup',   () => { cancelHold(); endDrag(); });
    document.addEventListener('touchmove', (e) => {
        if (!activeDrag) return;
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    document.addEventListener('touchend', () => { cancelHold(); endDrag(); });

    /* ---- Hold Logic ---- */

    function beginHold(clientX, clientY, decor) {
        cancelHold(); // bersihkan hold sebelumnya jika ada
        pendingDecor  = decor;
        startX        = clientX;
        startY        = clientY;
        currentDeltaX = 0;
        currentDeltaY = 0;

        // Tampilkan indikator "sedang menahan"
        decor.classList.add('is-holding');

        holdTimer = setTimeout(() => {
            holdTimer = null;
            activateDrag(decor, clientX, clientY);
        }, HOLD_MS);
    }

    function cancelHold() {
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
        if (pendingDecor) {
            pendingDecor.classList.remove('is-holding');
            pendingDecor = null;
        }
    }

    /* ---- Drag Logic ---- */

    function activateDrag(decor, clientX, clientY) {
        activeDrag = decor;
        decor.classList.remove('is-holding');
        decor.classList.add('is-dragging');
        decor.style.zIndex = '50';

        const img = decor.querySelector('.pixel-asset');
        if (img) {
            img.style.animation  = 'none';
            img.style.transform  = 'scale(1.3) rotate(-5deg)';
            img.style.filter     = 'drop-shadow(0 18px 40px rgba(254,93,159,0.9)) drop-shadow(0 0 24px #fe5d9f)';
            img.style.transition = 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), filter 0.15s ease';
        }
    }

    function onMove(clientX, clientY) {
        // Batalkan hold jika mouse bergerak jauh sebelum hold selesai
        if (holdTimer && (Math.abs(clientX - startX) > 8 || Math.abs(clientY - startY) > 8)) {
            cancelHold();
        }

        if (!activeDrag) return;

        currentDeltaX = clientX - startX;
        currentDeltaY = clientY - startY;

        // Total offset = riwayat drag lama + delta saat ini
        const totalX = activeDrag._accX + currentDeltaX;
        const totalY = activeDrag._accY + currentDeltaY;

        // Gunakan transform translate — tidak konflik dengan top/left/!important CSS
        activeDrag.style.transform = `translate3d(${totalX}px, ${totalY}px, 0) scale(1.05)`;
    }

    function endDrag() {
        if (!activeDrag) return;

        const decor = activeDrag;
        activeDrag   = null;

        // Simpan offset yang terakumulasi
        decor._accX += currentDeltaX;
        decor._accY += currentDeltaY;
        currentDeltaX = 0;
        currentDeltaY = 0;
        decor._wasDragged = true;

        decor.classList.remove('is-dragging');
        decor.style.zIndex = '20';

        // Posisi akhir setelah lepas (scale kembali normal, tanpa rotate)
        decor.style.transform = `translate3d(${decor._accX}px, ${decor._accY}px, 0) scale(1)`;

        // Pulihkan animasi mengambang pada img
        const img = decor.querySelector('.pixel-asset');
        if (img) {
            img.style.transform  = 'scale(1) rotate(0deg)';
            img.style.filter     = 'drop-shadow(0 8px 16px rgba(0,0,0,0.08))';
            img.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), filter 0.35s ease';

            setTimeout(() => {
                const dur = img.classList.contains('float-anim-2') ? '5s'
                          : img.classList.contains('float-anim-3') ? '4.5s' : '4s';
                const kf  = img.classList.contains('float-anim-1') ? 'floatingBob1'
                          : img.classList.contains('float-anim-2') ? 'floatingBob2'
                          : 'floatingBob3';
                img.style.animation  = `${kf} ${dur} ease-in-out infinite alternate`;
                img.style.transition = '';
            }, 430);
        }
    }

    /* ---- Reset ---- */

    function resetDecor(decor) {
        if (!decor._wasDragged) return;

        decor._accX = 0;
        decor._accY = 0;
        decor._wasDragged = false;

        // Animasi kembali ke posisi asal dengan bounce spring
        decor.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
        decor.style.transform  = 'translate3d(0, 0, 0) scale(1)';
        setTimeout(() => { decor.style.transition = ''; }, 600);
    }
}
