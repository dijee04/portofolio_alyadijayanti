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
                header.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)';
            } else {
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.04)';
            }
        }
    });

    // --- 2. Filter & Pencarian Kata Kunci Real-Time ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('project-search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const resultsCountText = document.getElementById('results-count-text');
    const noProjectsMsg = document.getElementById('no-projects-msg');
    const resetFilterBtn = document.getElementById('reset-filter-btn');

    let activeCategory = 'all';
    let searchQuery = '';

    const updateGalleryView = () => {
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const categories = (card.getAttribute('data-categories') || '').split(' ');
            const searchData = (card.getAttribute('data-search') || '').toLowerCase();
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const desc = (card.getAttribute('data-desc') || '').toLowerCase();

            const matchCategory = activeCategory === 'all' || categories.includes(activeCategory);
            const matchSearch = !searchQuery || 
                                searchData.includes(searchQuery) || 
                                title.includes(searchQuery) || 
                                desc.includes(searchQuery);

            if (matchCategory && matchSearch) {
                card.classList.remove('hide');
                card.style.opacity = '0';
                card.style.transform = 'translateY(18px)';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 40 + (visibleCount * 50));

                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    card.classList.add('hide');
                }, 250);
            }
        });

        // Update teks jumlah hasil pencarian
        if (resultsCountText) {
            resultsCountText.innerHTML = `Menampilkan <strong class="results-highlight">${visibleCount}</strong> dari <strong class="results-highlight">${projectCards.length}</strong> karya proyek`;
        }

        // Tampilkan pesan kosong jika tidak ada hasil
        if (noProjectsMsg) {
            if (visibleCount === 0) {
                noProjectsMsg.classList.remove('hidden');
                setTimeout(() => {
                    noProjectsMsg.style.opacity = '1';
                }, 50);
            } else {
                noProjectsMsg.classList.add('hidden');
                noProjectsMsg.style.opacity = '0';
            }
        }
    };

    // Listener Tombol Filter Kategori
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            activeCategory = button.getAttribute('data-category');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            updateGalleryView();
        });
    });

    // Listener Input Pencarian
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            updateGalleryView();
        });
    }

    // Listener Tombol Clear Search
    if (searchClearBtn && searchInput) {
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            searchInput.focus();
            updateGalleryView();
        });
    }

    // Listener Tombol Reset Filter & Search
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            activeCategory = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';

            filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
            });

            updateGalleryView();
        });
    }

    // --- 3. Efek Interaktif Kursor Mouse 3D Tilt & Glass Reflection ---
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4; // Maksimal 4 deg tilt
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg)';
        });
    });

    // --- 4. Glass Modal Detail Proyek Interaktif ---
    const modalBackdrop = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCat = document.getElementById('modal-cat');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');
    const modalDemoLink = document.getElementById('modal-demo-link');
    const modalClose = document.getElementById('modal-close');
    const modalCloseAction = document.getElementById('modal-close-action');

    const openModal = (card) => {
        const title = card.getAttribute('data-title') || 'Detail Proyek';
        const cat = card.getAttribute('data-cat') || 'PORTFOLIO';
        const desc = card.getAttribute('data-desc') || 'Deskripsi proyek belum tersedia.';
        const img = card.getAttribute('data-img') || '';
        const tags = (card.getAttribute('data-tags') || '').split(',');
        const link = card.getAttribute('data-link') || 'index.html#kontak';

        if (modalTitle) modalTitle.textContent = title;
        if (modalCat) modalCat.textContent = cat.toUpperCase();
        if (modalDesc) modalDesc.textContent = desc;
        if (modalImg) {
            modalImg.src = img;
            modalImg.alt = title;
        }
        if (modalDemoLink) modalDemoLink.href = link;

        // Render tag teknologi di modal
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

        modalBackdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Kunci scroll latar belakang
    };

    const closeModal = () => {
        if (modalBackdrop) modalBackdrop.classList.remove('is-active');
        document.body.style.overflow = ''; // Buka kunci scroll
    };

    // Pasang listener pada setiap kartu proyek
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Hindari pemicu jika mengeklik tombol di dalam kartu
            openModal(card);
        });
    });

    // Listener tombol tutup modal
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);

    // Tutup saat mengklik area luar modal (backdrop)
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
    }

    // Tutup saat menekan tombol ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-active')) {
            closeModal();
        }
    });

    // Animasi masuk awal kartu
    projectCards.forEach((card, idx) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(25px)';
        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 80 + (idx * 70));
    });
});

