document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Navigasi & Floating Widget Toggle ---
    const header = document.querySelector('.top-nav');
    const widgetToggle = document.getElementById('widget-toggle');
    const widgetDropdown = document.getElementById('widget-dropdown');

    if (widgetToggle && widgetDropdown) {
        widgetToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            widgetDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!widgetDropdown.contains(e.target) && !widgetToggle.contains(e.target)) {
                widgetDropdown.classList.add('hidden');
            }
        });
    }

    // Navigasi Scroll Shadow Effect
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 40) {
                header.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
            } else {
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // --- 2. Spring Physics Engine Loop via requestAnimationFrame ---
    const stickySections = Array.from(document.querySelectorAll('.sticky-project-section'));

    if (stickySections.length > 0) {
        // Data struktur state fisika pegas per seksi
        const springState = stickySections.map((section, idx) => ({
            element: section,
            index: idx,
            // Nilai Rendered Saat Ini
            currentScale: 1,
            currentOpacity: 1,
            currentTranslateY: 0,
            // Kecepatan (Velocity) Pegas
            velScale: 0,
            velOpacity: 0,
            velTranslateY: 0,
            // Nilai Target
            targetScale: 1,
            targetOpacity: 1,
            targetTranslateY: 0,
        }));

        // Parameter Pegas (Stiffness + Damping untuk efek overshoot/pantulan membal & mulus)
        const STIFFNESS = 0.09;
        const DAMPING = 0.81;
        const OVERLAP_DISTANCE = 380; // Jarak overlap piksel (~350–400px)

        const calculateTargets = () => {
            const viewportHeight = window.innerHeight;

            springState.forEach((state, i) => {
                const rect = state.element.getBoundingClientRect();
                const nextSection = springState[i + 1]?.element;

                if (nextSection) {
                    const nextRect = nextSection.getBoundingClientRect();
                    // Hitung jarak tumpukan seksi berikutnya terhadap batas atas seksi ini
                    const distanceToNext = nextRect.top - rect.top;

                    if (distanceToNext < viewportHeight) {
                        // Progress overlap dari 0 (belum tertimpa) hingga 1 (tertimpa penuh)
                        const overlapProgress = Math.min(1, Math.max(0, (viewportHeight - distanceToNext) / OVERLAP_DISTANCE));

                        state.targetScale = 1 - (overlapProgress * 0.08); // Mengecil hingga 0.92
                        state.targetOpacity = 1 - (overlapProgress * 0.7); // Memudar secara halus tanpa hilangnya kontras
                        state.targetTranslateY = -overlapProgress * 45; // Terangkat -45px
                    } else {
                        state.targetScale = 1;
                        state.targetOpacity = 1;
                        state.targetTranslateY = 0;
                    }
                } else {
                    // Seksi terakhir tidak tertimpa
                    state.targetScale = 1;
                    state.targetOpacity = 1;
                    state.targetTranslateY = 0;
                }
            });
        };

        // Animasi Loop requestAnimationFrame Pegas
        const physicsLoop = () => {
            calculateTargets();

            springState.forEach(state => {
                // Formula Fisika Pegas: Force = (Target - Current) * Stiffness
                const forceScale = (state.targetScale - state.currentScale) * STIFFNESS;
                state.velScale = (state.velScale + forceScale) * DAMPING;
                state.currentScale += state.velScale;

                const forceOpacity = (state.targetOpacity - state.currentOpacity) * STIFFNESS;
                state.velOpacity = (state.velOpacity + forceOpacity) * DAMPING;
                state.currentOpacity += state.velOpacity;

                const forceY = (state.targetTranslateY - state.currentTranslateY) * STIFFNESS;
                state.velTranslateY = (state.velTranslateY + forceY) * DAMPING;
                state.currentTranslateY += state.velTranslateY;

                // Terapkan nilai ke gaya CSS elemen
                state.element.style.transform = `scale(${state.currentScale.toFixed(4)}) translateY(${state.currentTranslateY.toFixed(2)}px)`;
                state.element.style.opacity = Math.max(0, state.currentOpacity).toFixed(4);

                // Matikan pointer-events saat seksi hampir tak terlihat agar tombol seksi di atasnya dapat diklik
                if (state.currentOpacity < 0.15) {
                    state.element.style.pointerEvents = 'none';
                } else {
                    state.element.style.pointerEvents = 'auto';
                }
            });

            requestAnimationFrame(physicsLoop);
        };

        // Jalankan loop fisika pegas
        requestAnimationFrame(physicsLoop);
    }

    // --- 3. Segmented Pill Nav Interaktif ---
    const pillNavItems = document.querySelectorAll('.pill-nav-item');
    pillNavItems.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const parentNav = pill.closest('.segmented-pill-nav');
            if (parentNav) {
                parentNav.querySelectorAll('.pill-nav-item').forEach(item => item.classList.remove('active'));
                pill.classList.add('active');
            }
        });
    });

    // --- 4. Glass Modal Detail Proyek Interaktif ---
    const modalBackdrop = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCat = document.getElementById('modal-cat');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');
    const modalClose = document.getElementById('modal-close');
    const modalCloseAction = document.getElementById('modal-close-action');
    const modalOpenBtns = document.querySelectorAll('.open-project-modal-btn');

    const openModal = (btn) => {
        const title = btn.getAttribute('data-title') || 'Detail Proyek';
        const cat = btn.getAttribute('data-cat') || 'PORTFOLIO';
        const desc = btn.getAttribute('data-desc') || 'Deskripsi proyek belum tersedia.';
        const img = btn.getAttribute('data-img') || '';
        const tags = (btn.getAttribute('data-tags') || '').split(',');

        if (modalTitle) modalTitle.textContent = title;
        if (modalCat) modalCat.textContent = cat.toUpperCase();
        if (modalDesc) modalDesc.textContent = desc;
        if (modalImg) {
            modalImg.src = img;
            modalImg.alt = title;
        }

        if (modalTags) {
            modalTags.innerHTML = '';
            tags.forEach(tag => {
                if (tag.trim()) {
                    const tagSpan = document.createElement('span');
                    tagSpan.textContent = tag.trim();
                    modalTags.appendChild(tagSpan);
                }
            });
        }

        if (modalBackdrop) modalBackdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (modalBackdrop) modalBackdrop.classList.remove('is-active');
        document.body.style.overflow = '';
    };

    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(btn);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-active')) {
            closeModal();
        }
    });
});
