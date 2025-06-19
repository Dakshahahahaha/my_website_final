// static/js/main.js

// Declare carbonChart globally (or within the scope of DOMContentLoaded)
// and explicitly as null initially. This prevents "access before initialization" error.
let carbonChart = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded event fired.");

    // ----------------------------------------------------------------------
    // 1. Custom Page Loader Animation (loader.mp4)
    // ----------------------------------------------------------------------
    const pageLoader = document.getElementById('page-loader');
    const loaderVideo = document.getElementById('loader-video');

    if (pageLoader && loaderVideo) {
        console.log("Loader elements found: pageLoader and loaderVideo.");

        // Attempt to play the video. Browsers often block autoplay without user interaction
        // or if not muted. We've added muted and playsinline.
        // Adding a small delay to ensure the loader is visible for a moment
        setTimeout(() => {
            console.log("Attempting to play loader video.");
            loaderVideo.play().then(() => {
                console.log("Loader video started playing.");
            }).catch(error => {
                console.error("Error attempting to play loader video:", error);
                // If autoplay is blocked or video not found (404), hide loader immediately
                console.log("Autoplay blocked or error. Hiding loader immediately.");
                if (pageLoader) { // Check if pageLoader is still in DOM
                    pageLoader.classList.add('hidden');
                    setTimeout(() => { pageLoader.remove(); }, 700);
                }
            });
        }, 100); // Small delay to allow CSS transition if any

        loaderVideo.addEventListener('ended', () => {
            console.log("Loader video ended. Hiding loader.");
            if (pageLoader) { // Check if pageLoader is still in DOM
                pageLoader.classList.add('hidden');
                // Remove the loader from the DOM after transition for accessibility
                setTimeout(() => {
                    pageLoader.remove();
                }, 700); // Match transition duration in CSS
            }
        });

        // Fallback for cases where video might not autoplay or load quickly or if video tag is problematic
        window.addEventListener('load', () => {
            console.log("Window loaded event fired.");
            if (pageLoader && !pageLoader.classList.contains('hidden')) {
                console.log("Loader still visible on window load. Hiding loader as fallback.");
                pageLoader.classList.add('hidden');
                setTimeout(() => {
                    pageLoader.remove();
                }, 700);
            }
        });
    } else {
        console.log("Loader elements NOT found. Loader might be missing from HTML or IDs are incorrect. Hiding any existing loader.");
        // If loader elements are not found, ensure content is visible
        if (pageLoader) {
            pageLoader.classList.add('hidden');
            setTimeout(() => { pageLoader.remove(); }, 700);
        }
    }


    // ----------------------------------------------------------------------
    // 2. Light and Dark Mode Toggle
    // Moved initial theme setting after chart initialization,
    // or ensure it handles a non-existent chart gracefully.
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // The <html> tag

    // Function to set the theme
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode
        } else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode
        }
        // Update chart colors immediately on theme change if chart exists
        if (typeof carbonChart !== 'undefined' && carbonChart) { // Check if chart exists and is initialized
            const isDarkMode = htmlElement.classList.contains('dark');
            updateChartColors(carbonChart, isDarkMode);
        }
    }

    // Initialize theme based on localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    // Toggle theme on button click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // ----------------------------------------------------------------------
    // 3. Ripple Effect on Buttons and Cards
    // ----------------------------------------------------------------------
    function createRipple(event) {
        const button = event.currentTarget; // The element clicked (button or card)

        // Create ripple element
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        // Position the ripple at the click location relative to the button
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        // Ensure the button is a relative positioning context for the ripple
        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden'; // Hide ripples outside the button

        // Append to the button itself
        button.appendChild(circle);

        // Remove the ripple element after animation ends
        circle.addEventListener('animationend', () => {
            circle.remove();
        });
    }

    // Apply ripple effect to all elements with 'ripple-effect' class
    document.querySelectorAll('.ripple-effect').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // ----------------------------------------------------------------------
    // 4. Scroll Animation (Animate on Scroll)
    // ----------------------------------------------------------------------
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once in view
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
    const openModalBtnBottom = document.getElementById('open-modal-btn-bottom'); // New button

    if (openModalBtn && contactModal && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            contactModal.classList.add('show');
        });

        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('show');
        });

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('show');
            }
        });
    }
    // Add event listener for the bottom contact button if it exists
    if (openModalBtnBottom && contactModal && closeModalBtn) {
        openModalBtnBottom.addEventListener('click', () => {
            contactModal.classList.add('show');
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
            // Get the width of a single testimonial item, including its right margin/gap
            // Assuming space-x-8 (32px)
            const firstTestimonial = testimonials[0];
            if (!firstTestimonial) {
                console.warn("No testimonials found in carousel to calculate width.");
                return; // Exit if no testimonials
            }

            const itemWidth = firstTestimonial.offsetWidth + 32; // item width + Tailwind space-x-8 (2rem = 32px)

            // Adjust index to loop correctly
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

            // Initial update and update on resize
        updateCarousel(); // Call once on load
        window.addEventListener('resize', updateCarousel);
    }


    // ----------------------------------------------------------------------
    // 7. Interactive Graph/Chart (Chart.js)
    // ----------------------------------------------------------------------
    const ctx = document.getElementById('carbonEmissionsChart');
    if (ctx) {
        // Data derived roughly from graph.png
        const data = {
            labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
            datasets: [
                {
                    label: 'Refurbishment',
                    data: [549, 278, 825, 617, 289, 105, 122], // Adjusted values from graph.png
                    backgroundColor: 'rgba(216, 178, 178, 0.8)', // Muted red/brown
                    borderColor: 'rgba(216, 178, 178, 1)',
                    borderWidth: 1,
                    barPercentage: 0.8, // Adjust bar width
                    categoryPercentage: 0.7 // Adjust spacing between categories
                },
                {
                    label: 'New Build',
                    data: [0, 0, 0, 0, 881, 539, 109], // Values from graph.png, some zeros for earlier years if not present
                    backgroundColor: 'rgba(150, 90, 90, 0.8)', // Darker muted red/brown
                    borderColor: 'rgba(150, 90, 90, 1)',
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.7
                }
            ]
        };

        const getChartColors = (isDarkMode) => {
            // Use CSS variables if available, otherwise fallback
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color-primary') || (isDarkMode ? '#e2e8f0' : '#1a202c');
            const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--grid-color-primary') || (isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(200, 200, 200, 0.2)');
            return { textColor, gridColor };
        };


        const initialIsDarkMode = htmlElement.classList.contains('dark');
        const initialColors = getChartColors(initialIsDarkMode);

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow chart to fill container
                plugins: {
                    title: {
                        display: false, // Title is in HTML
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 14
                            },
                            color: initialColors.textColor // Set initial legend color
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
                        grid: {
                            display: false // No vertical grid lines
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            },
                            color: initialColors.textColor // Set initial X-axis ticks color
                        },
                        barThickness: 'flex',
                        maxBarThickness: 50 // Max width for bars
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Embodied Carbon Intensity (kgCO2e/m²)',
                            font: {
                                family: 'Inter',
                                size: 14
                            },
                            color: initialColors.textColor // Set initial Y-axis title color
                        },
                        grid: {
                            color: initialColors.gridColor // Set initial grid color
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            },
                            color: initialColors.textColor,
                            callback: function(value) {
                                return value + ' '; // Add space for consistency
                            }
                        }
                    }
                }
            }
        };

        carbonChart = new Chart(ctx, config); // Assign to globally declared variable

        // Observe HTML class changes for theme updates
        const observerForChart = new MutationObserver(() => {
            const isDarkMode = htmlElement.classList.contains('dark');
            updateChartColors(carbonChart, isDarkMode);
        });

        observerForChart.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });
    }


    // ----------------------------------------------------------------------
    // 8. Highlighted Striking Single Object (Basic 3D Cube with Three.js)
    // ----------------------------------------------------------------------
    const threeJsContainer = document.getElementById('threejs-object-container');
    if (threeJsContainer) {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, threeJsContainer.clientWidth / threeJsContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha:true for transparent background
        renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
        threeJsContainer.appendChild(renderer.domElement);

        // Responsive resizing for Three.js canvas
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


        // Cube creation
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x007bff, specular: 0x050505, shininess: 100 }); // Blue with some shininess
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        camera.position.z = 2;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;

            renderer.render(scene, camera);
        }
        animate(); // Start the animation loop

        // Mouse interaction for camera control (optional but good for 3D)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        threeJsContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        threeJsContainer.addEventListener('mouseup', () => {
            isDragging = false;
        });

        threeJsContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            // Rotate based on mouse movement
            cube.rotation.y += deltaX * 0.005;
            cube.rotation.x += deltaY * 0.005;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Touch events for mobile interaction
        threeJsContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.touches.length > 0) {
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        threeJsContainer.addEventListener('touchend', () => {
            isDragging = false;
        });

        threeJsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length === 0) return;

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
    const navLinks = document.querySelectorAll('#mobile-menu a'); // Links in mobile menu

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 10. Parallax Effect (Homepage Hero) - Simple Background-Position change
    // ----------------------------------------------------------------------
    const heroSection = document.querySelector('.hero-parallax');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            // Adjust the parallax speed by changing the divisor (smaller number = faster parallax)
            heroSection.style.backgroundPositionY = `${-scrollPosition * 0.2}px`;
        });
    }

    // Initialize theme based on localStorage or system preference AFTER other elements are declared
    // and after `carbonChart` is potentially initialized.
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

}); // End DOMContentLoaded
