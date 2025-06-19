// static/js/main.js

// Declare carbonChart globally for the chart instance
let carbonChart = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded event fired.");

    // ----------------------------------------------------------------------
    // 1. Custom Page Loader Animation - GUARANTEED HIDING
    // ----------------------------------------------------------------------
    const pageLoader = document.getElementById('page-loader');

    if (pageLoader) {
        console.log("Loader element found. Hiding after delay.");

        // Simple hiding mechanism: fade out and remove after a fixed time
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                if (pageLoader.parentNode) {
                    pageLoader.parentNode.removeChild(pageLoader);
                }
                document.body.style.overflow = ''; // Restore scroll
            }, 700); // Duration of CSS opacity transition
        }, 1500); // Hide after 1.5 seconds regardless of anything else

        document.body.style.overflow = 'hidden'; // Prevent scrolling while loader is visible

    } else {
        console.log("Loader element NOT found. Ensuring content is visible.");
        document.body.style.overflow = ''; // Ensure body scroll is enabled
    }

    // ----------------------------------------------------------------------
    // 2. No Light/Dark Mode Toggle (Temporarily Removed for Stability)
    // ----------------------------------------------------------------------
    // Removed all JavaScript related to theme toggling for guaranteed stability.
    // The site will display in its default (light) mode.

    // ----------------------------------------------------------------------
    // 3. Ripple Effect on Buttons and Cards
    // ----------------------------------------------------------------------
    function createRipple(event) {
        const button = event.currentTarget;

        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';

        button.appendChild(circle);

        circle.addEventListener('animationend', () => {
            circle.remove();
        });
    }

    document.querySelectorAll('.ripple-effect').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // ----------------------------------------------------------------------
    // 4. Scroll Animation (Animate on Scroll)
    // ----------------------------------------------------------------------
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(el => {
        observer.observe(el);
    });

    // ----------------------------------------------------------------------
    // 5. Popup Modal
    // ----------------------------------------------------------------------
    const openModalBtn = document.getElementById('open-modal-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const openModalBtnBottom = document.getElementById('open-modal-btn-bottom');

    if (contactModal && closeModalBtn) { // Check for core modal elements
        const openModal = () => contactModal.classList.add('show');
        const closeModal = () => contactModal.classList.remove('show');

        if (openModalBtn) {
            openModalBtn.addEventListener('click', openModal);
        }
        if (openModalBtnBottom) {
            openModalBtnBottom.addEventListener('click', openModal);
        }
        closeModalBtn.addEventListener('click', closeModal);

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }


    // ----------------------------------------------------------------------
    // 6. Testimonials Carousel
    // ----------------------------------------------------------------------
    const testimonialsContainer = document.querySelector('.testimonials-carousel-inner');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentIndex = 0;

    if (testimonialsContainer && prevBtn && nextBtn) {
        const testimonials = Array.from(testimonialsContainer.children);
        const totalTestimonials = testimonials.length;

        function updateCarousel() {
            const firstTestimonial = testimonials[0];
            if (!firstTestimonial) {
                console.warn("No testimonials found in carousel to calculate width.");
                return;
            }

            const itemWidth = firstTestimonial.offsetWidth + 32;

            if (currentIndex >= totalTestimonials) {
                currentIndex = 0;
            } else if (currentIndex < 0) {
                currentIndex = totalTestimonials - 1;
            }

            testimonialsContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            testimonialsContainer.style.transition = 'transform 0.5s ease-in-out';
        }

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
        });

        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }


    // ----------------------------------------------------------------------
    // 7. Interactive Graph/Chart (Chart.js)
    // ----------------------------------------------------------------------
    const ctx = document.getElementById('carbonEmissionsChart');
    if (ctx) {
        const data = {
            labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
            datasets: [
                {
                    label: 'Refurbishment',
                    data: [549, 278, 825, 617, 289, 105, 122],
                    backgroundColor: 'rgba(216, 178, 178, 0.8)', // Static color
                    borderColor: 'rgba(216, 178, 178, 1)',
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.7
                },
                {
                    label: 'New Build',
                    data: [0, 0, 0, 0, 881, 539, 109],
                    backgroundColor: 'rgba(150, 90, 90, 0.8)', // Static color
                    borderColor: 'rgba(150, 90, 90, 1)',
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.7
                }
            ]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: false },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { family: 'Inter', size: 14 },
                            color: '#1f2937' // Static color for light mode
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        titleFont: { family: 'Inter' },
                        bodyFont: { family: 'Inter' },
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' kgCO2e/m²';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Inter' }, color: '#1f2937' }, // Static color
                        barThickness: 'flex', maxBarThickness: 50
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Embodied Carbon Intensity (kgCO2e/m²)',
                            font: { family: 'Inter', size: 14 },
                            color: '#1f2937' // Static color
                        },
                        grid: { color: 'rgba(200, 200, 200, 0.2)' }, // Static color
                        ticks: {
                            font: { family: 'Inter' },
                            color: '#1f2937', // Static color
                            callback: function(value) { return value + ' '; }
                        }
                    }
                }
            }
        };

        carbonChart = new Chart(ctx, config);
    }


    // ----------------------------------------------------------------------
    // 8. Highlighted Striking Single Object (Basic 3D Cube with Three.js)
    // ----------------------------------------------------------------------
    const threeJsContainer = document.getElementById('threejs-object-container');
    if (threeJsContainer) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, threeJsContainer.clientWidth / threeJsContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
        threeJsContainer.appendChild(renderer.domElement);

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === threeJsContainer) {
                    const width = entry.contentRect.width;
                    const height = entry.contentRect.height;
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                }
            }
        });
        resizeObserver.observe(threeJsContainer);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x007bff, specular: 0x050505, shininess: 100 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        camera.position.z = 2;

        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        threeJsContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        threeJsContainer.addEventListener('mouseup', () => { isDragging = false; });
        threeJsContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            cube.rotation.y += deltaX * 0.005;
            cube.rotation.x += deltaY * 0.005;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        threeJsContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.touches.length > 0) { previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
        });
        threeJsContainer.addEventListener('touchend', () => { isDragging = false; });
        threeJsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length === 0) return;
            e.preventDefault();
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;
            cube.rotation.y += deltaX * 0.005;
            cube.rotation.x += deltaY * 0.005;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });
    }

    // ----------------------------------------------------------------------
    // 9. Responsive Navbar (Hamburger Menu)
    // ----------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#mobile-menu a');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
        navLinks.forEach(link => { link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); }); });
    }

    // ----------------------------------------------------------------------
    // 10. Parallax Effect (Homepage Hero) - Simple Background-Position change
    // ----------------------------------------------------------------------
    // Note: Parallax on background-image is handled directly in HTML now (removed, using solid color).
    // This JS snippet is for scroll-based background repositioning if an image were used.
    // Keeping it here for future flexibility, but it won't have an effect on a solid background.
    const heroSection = document.querySelector('.hero-parallax');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${-scrollPosition * 0.2}px`;
        });
    }

}); // End DOMContentLoaded
