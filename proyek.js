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
                header.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // --- 2. Filter Kategori Interaktif Proyek ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.zigzag-project-card');
    const noProjectsNotice = document.getElementById('no-projects-notice');

    const filterProjects = (targetFilter) => {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
            
            if (targetFilter === 'all' || categories.includes(targetFilter.toLowerCase())) {
                card.style.display = 'grid';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px)';
                card.style.display = 'none';
            }
        });

        // Tampilkan pesan kosong jika tidak ada proyek pada kategori yang dipilih
        if (noProjectsNotice) {
            if (visibleCount === 0) {
                noProjectsNotice.style.display = 'block';
            } else {
                noProjectsNotice.style.display = 'none';
            }
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterVal = btn.getAttribute('data-filter');
            filterProjects(filterVal);
        });
    });
});
