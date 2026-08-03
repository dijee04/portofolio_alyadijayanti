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

    // --- Form Kontak dengan Feedback Visual ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ubah tombol ke status loading
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Mengirim...';
            submitBtn.style.opacity = '0.7';

            // Ambil data form
            const nameInput = document.getElementById('name').value.trim();
            const emailInput = document.getElementById('email').value.trim();
            const messageInput = document.getElementById('message').value.trim();

            // Simulasi proses pengiriman (1.5 detik)
            setTimeout(() => {
                // Sembunyikan pesan feedback lama jika ada
                formFeedback.className = 'form-feedback hidden';

                // Validasi sederhana
                if (!nameInput || !emailInput || !messageInput) {
                    formFeedback.textContent = 'Mohon isi semua bidang formulir.';
                    formFeedback.className = 'form-feedback error';
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.opacity = '1';
                    return;
                }

                // Sukses
                formFeedback.textContent = `Terima kasih, ${nameInput}! Pesan Anda telah berhasil terkirim. Saya akan segera menghubungi Anda kembali.`;
                formFeedback.className = 'form-feedback success';
                
                // Reset Form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.opacity = '1';
                
                // Hilangkan notifikasi sukses setelah 5 detik
                setTimeout(() => {
                    formFeedback.className = 'form-feedback hidden';
                }, 6000);

            }, 1500);
        });
    }

    // --- Animasi Scroll (Fade In Elemen) ---
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-row, .project-card, .achievement-row, .thought-card, .intro-quote-wrapper');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            
            // Jika elemen sudah masuk viewport (85%)
            if (elementPosition < screenHeight * 0.85) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set style inisial untuk animasi scroll
    const itemsToAnimate = document.querySelectorAll('.service-row, .project-card, .achievement-row, .thought-card, .intro-quote-wrapper');
    itemsToAnimate.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(25px)';
        item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    // Pemicu pertama kali halaman dimuat
    setTimeout(animateOnScroll, 100);

    // Pemicu saat halaman di-scroll
    window.addEventListener('scroll', animateOnScroll);

    // --- Efek Mengetik saat Hover Quote (Joyride Effect) ---
    const quoteWrapper = document.querySelector('.intro-quote-wrapper');
    const quoteEl = document.querySelector('.intro-quote');
    if (quoteWrapper && quoteEl) {
        // Fungsi rekursif untuk membungkus setiap karakter dalam span.tw-char
        // dengan mempertahankan struktur HTML (termasuk tag <span class="quote-highlight">)
        const prepareTypewriter = (element) => {
            const nodes = Array.from(element.childNodes);
            element.innerHTML = '';
            
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const fragment = document.createDocumentFragment();
                    for (let i = 0; i < text.length; i++) {
                        const span = document.createElement('span');
                        span.className = 'tw-char';
                        if (text[i] === ' ') {
                            span.textContent = ' ';
                        } else {
                            span.textContent = text[i];
                        }
                        fragment.appendChild(span);
                    }
                    element.appendChild(fragment);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const newElement = node.cloneNode(false); // Klon tag saja (shallow clone)
                    prepareTypewriter(node); // Rekursi untuk anak-anaknya
                    while (node.firstChild) {
                        newElement.appendChild(node.firstChild);
                    }
                    element.appendChild(newElement);
                }
            });
        };
        // Normalisasi spasi, baris baru, dan indentasi HTML pada kutipan
        quoteEl.innerHTML = quoteEl.innerHTML.trim().replace(/\s+/g, ' ');

        // Persiapkan teks dengan membungkus karakter saat halaman dimuat
        prepareTypewriter(quoteEl);
        
        // Buat semua karakter terlihat secara bawaan
        const chars = quoteEl.querySelectorAll('.tw-char');
        chars.forEach(c => c.classList.add('visible'));

        let isTyping = false;
        let typeTimeout = null;
        
        // Buat elemen kursor sekali
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';

        const triggerTypewriter = () => {
            if (isTyping) return;
            isTyping = true;

            // Hentikan pengetikan lama jika ada
            if (typeTimeout) clearTimeout(typeTimeout);

            // Sembunyikan semua karakter sebelum mulai
            chars.forEach(c => c.classList.remove('visible'));
            
            let charIndex = 0;
            
            const revealNextChar = () => {
                if (charIndex < chars.length) {
                    const char = chars[charIndex];
                    char.classList.add('visible');
                    
                    // Pindahkan kursor tepat setelah karakter yang baru muncul
                    char.parentNode.insertBefore(cursor, char.nextSibling);
                    
                    charIndex++;
                    // Kecepatan mengetik: 12ms per karakter
                    typeTimeout = setTimeout(revealNextChar, 12);
                } else {
                    // Selesai mengetik
                    if (cursor.parentNode) cursor.remove();
                    isTyping = false;
                }
            };

            revealNextChar();
        };

        const resetQuote = () => {
            if (typeTimeout) clearTimeout(typeTimeout);
            // Tampilkan kembali semua karakter secara instan
            chars.forEach(c => c.classList.add('visible'));
            if (cursor.parentNode) cursor.remove();
            isTyping = false;
        };

        quoteWrapper.addEventListener('mouseenter', triggerTypewriter);
        quoteWrapper.addEventListener('mouseleave', resetQuote);

        // Pemicu otomatis sekali saat pertama kali di-scroll ke area pandang (viewport)
        let hasTypedOnScroll = false;
        const typewriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasTypedOnScroll) {
                    hasTypedOnScroll = true;
                    // Beri sedikit jeda agar transisi fade-in selesai terlebih dahulu
                    setTimeout(triggerTypewriter, 300);
                    typewriterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        typewriterObserver.observe(quoteWrapper);
    }
});
