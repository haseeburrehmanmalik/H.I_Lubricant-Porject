// ====== MAIN JS ======

document.addEventListener('DOMContentLoaded', function() {

    // ---------- AOS INITIALIZATION (SCROLL ANIMATIONS) ----------
    AOS.init({
        duration: 1000,
        once: true,
        offset: 120,
        easing: 'ease-in-out'
    });
    console.log('✅ AOS initialized');

    // ---------- NAVBAR ----------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });

    // Active menu indicator
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ---------- BACK TO TOP ----------
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- HERO PARTICLES ----------
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 30 + 10;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            particlesContainer.appendChild(particle);
        }
    }

    // ---------- COUNTER ANIMATION ----------
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        statNumbers.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const increment = target / 80;
            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (target > 50 ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 25);
        });
    }

    const heroSection = document.getElementById('home');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
            }
        });
    }, { threshold: 0.5 });
    observer.observe(heroSection);

    // ---------- TESTIMONIAL SLIDER ----------
    const testimonialTrack = document.querySelector('.testimonial-track');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');
    let currentTestimonial = 0;
    let testimonialItems = [];

    const testimonialsData = [
        {
            name: 'Ahmed Khan',
            role: 'Fleet Manager, Logistics Co.',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            text: 'HI LUBRICANT provides the best quality engine oils for our fleet. Their service is exceptional and delivery is always on time.',
            rating: 5
        },
        {
            name: 'Sana Tariq',
            role: 'Maintenance Engineer, Textile Mill',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            text: 'We switched to HI LUBRICANT for industrial lubricants and saw immediate improvement in machine performance. Highly recommended!',
            rating: 5
        },
        {
            name: 'Rizwan Ali',
            role: 'Workshop Owner',
            image: 'https://randomuser.me/api/portraits/men/3.jpg',
            text: 'Genuine products at competitive prices. My customers trust me because I use HI LUBRICANT. Great partnership!',
            rating: 4
        }
    ];

    function renderTestimonials() {
        testimonialTrack.innerHTML = '';
        testimonialItems = [];
        testimonialsData.forEach(function(item, index) {
            const card = document.createElement('div');
            card.className = 'testimonial-card fade-in';
            card.style.flex = '0 0 100%';
            const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
                <h4>${item.name}</h4>
                <p class="role">${item.role}</p>
                <div class="stars">${stars}</div>
                <p>"${item.text}"</p>
            `;
            testimonialTrack.appendChild(card);
            testimonialItems.push(card);
        });
        updateTestimonial();
    }

    function updateTestimonial() {
        testimonialItems.forEach(function(item, idx) {
            item.style.transform = 'translateX(-' + (currentTestimonial * 100) + '%)';
            item.style.transition = 'transform 0.5s ease';
        });
    }

    prevBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
        updateTestimonial();
    });
    nextBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        updateTestimonial();
    });

    renderTestimonials();

    let testimonialInterval = setInterval(function() {
        nextBtn.click();
    }, 5000);

    const slider = document.getElementById('testimonialSlider');
    slider.addEventListener('mouseenter', function() {
        clearInterval(testimonialInterval);
    });
    slider.addEventListener('mouseleave', function() {
        testimonialInterval = setInterval(function() {
            nextBtn.click();
        }, 5000);
    });

    // ---------- BRAND SLIDER ----------
    const brandTrack = document.querySelector('.brand-track');
    const brandLogos = [
        { name: 'Shell', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe2YOn4YvuNoSBK_tbZ3-10GxGPR3ktxUXQfeQM0YD4A&s=10' },
        { name: 'Castrol', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXTwvaRoXCr4a99Wef0l8EVppuOKPyeB7bCqA87qIg6w&s=10' },
        { name: 'Caltex', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTdLh6Bk0GNbovQEeira5zZ8lxQRSve4r1zbtsIJdGuA&s=10' },
        { name: 'PSO', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScAlK2FehZKFB2lkfkk4vmtJTxcwZ5AfQAIqgt_CkIqw&s=10' },
        { name: 'Mobil', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSND20FOutEYvBRd5HzR-Nt4oZA7xuhF-MnslzivHX2Ew&s=10' },
        { name: 'Total', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkwnYlBE3JJjOGXECoALl_dC5wGW-n1AJwLkwx6VU_TA&s=10' },
        { name: 'ZIC', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh8ANjmpktFLYGwIBX_uoJ2GNdkLoVKDRbRCDZkRPMQA&s=10' },
        { name: 'Kixx', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzWej6sWDvQwBju9EAEWt0WD_kjaZopj-9CyjhoUz06A&s=10' },
        { name: 'Petromin', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRItjV-3A_HIc_agwVoBLQC5qvhud46P1itM18M1DfHQw&s=10' },
    ];

    const allBrands = brandLogos.concat(brandLogos);
    allBrands.forEach(function(brand) {
        const item = document.createElement('div');
        item.className = 'brand-item';
        item.innerHTML = '<img src="' + brand.img + '" alt="' + brand.name + '" loading="lazy" />';
        brandTrack.appendChild(item);
    });

    // ---------- CONTACT FORM ----------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                name: document.getElementById('contactName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                subject: document.getElementById('contactSubject').value.trim(),
                message: document.getElementById('contactMessage').value.trim()
            };
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            if (typeof window.sendContactEmail === 'function') {
                window.sendContactEmail(data).then(function() {
                    alert('Your message has been sent. We will get back to you soon!');
                    contactForm.reset();
                }).catch(function(err) {
                    alert('Error sending message. Please try again later.');
                    console.error(err);
                });
            } else {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });
    }

    // ---------- NEWSLETTER FORM ----------
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.querySelector('input').value = '';
        });
    }

    // ---------- CART ----------
    document.getElementById('navCart').addEventListener('click', function() {
        document.getElementById('cartSidebar').classList.toggle('open');
        document.getElementById('cartOverlay').classList.toggle('active');
    });
    document.getElementById('cartClose').addEventListener('click', function() {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
    });
    document.getElementById('cartOverlay').addEventListener('click', function() {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
    });

    // ---------- SCROLL REVEAL (Fallback for AOS) ----------
    const revealElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-up');
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

});