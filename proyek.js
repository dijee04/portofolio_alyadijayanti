document.addEventListener('DOMContentLoaded', () => {
    // --- Navigasi Scroll Effect ---
    const header = document.querySelector('.top-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.75rem 2.5rem';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.padding = '1.25rem 2.5rem';
            header.style.boxShadow = 'none';
        }
    });

    // --- Efek Animasi Scroll (Fade In Kartu Proyek) ---
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-card:not(.hide)');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            
            if (elementPosition < screenHeight * 0.85) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set style inisial untuk animasi scroll
    const initScrollAnimate = () => {
        const itemsToAnimate = document.querySelectorAll('.project-card');
        itemsToAnimate.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(25px)';
            item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    };

    initScrollAnimate();
    setTimeout(animateOnScroll, 100);
    window.addEventListener('scroll', animateOnScroll);

    // --- Logika Filter Kategori Proyek ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.getAttribute('data-category');

            // Ganti kelas aktif di tombol filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-categories').split(' ');

                if (selectedCategory === 'all' || categories.includes(selectedCategory)) {
                    // Tampilkan kembali kartu proyek
                    card.classList.remove('hide');
                    // Reset gaya agar dapat dianimasikan ulang secara instan
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Sembunyikan kartu proyek dengan efek memudar dan menyusut
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 400); // Sesuai dengan durasi transisi transisi CSS
                }
            });
        });
    });
});
