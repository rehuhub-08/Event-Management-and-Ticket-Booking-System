// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Page Entrance (GSAP)
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const tl = gsap.timeline();
        tl.to('#loader-overlay', { opacity: 0, duration: 1, delay: 0.5, onComplete: () => {
            const loader = document.getElementById('loader-overlay');
            if(loader) loader.style.display = 'none';
        }})
        .from('.reveal-text', { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out" }, "-=0.5")
        .from('.glass-nav', { y: -100, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8");

        // Stitched Scroll Animations
        gsap.utils.toArray('.stitched').forEach(section => {
            gsap.from(section.querySelectorAll('.container > *'), {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out"
            });
        });
    }

    // 2. Initialize App Functionality after skeleton loader
    setTimeout(() => {
        replaceSkeletons();
        initAnimations();
    }, 2000); // 2 second skeleton simulation

    // Local Storage Init
    const navBtn = document.querySelector('.nav-links .btn-primary');
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
        if(navBtn) {
            navBtn.innerText = "My Profile";
            navBtn.onclick = window.openProfilePanel;
        }
        const savedName = localStorage.getItem('profileName');
        const savedEmail = localStorage.getItem('profileEmail');
        const savedOrders = localStorage.getItem('recentOrders');
        
        if (savedName) {
            document.getElementById('profile-name').innerText = savedName;
            document.getElementById('edit-name').value = savedName;
        }
        if (savedEmail) {
            document.getElementById('profile-email').innerText = savedEmail;
            document.getElementById('edit-email').value = savedEmail;
        }
        if (savedOrders) {
            document.getElementById('recent-orders').innerHTML = savedOrders;
        }
    }

    // 3. Booking Panel Logic
    const panel = document.getElementById('booking-panel');
    const closeBtn = document.querySelector('.close-panel');

    // Make it globally accessible for inline onclick handlers
    window.openBooking = () => {
        if(panel) panel.classList.add('active');
    };

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('active');
        });
    }

    // Checkout / Cart Modal Logic
    const checkoutModal = document.getElementById('checkout-modal');
    window.closeCheckout = () => {
        if(checkoutModal) checkoutModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    };

    const bookingCheckoutBtn = document.querySelector('#booking-panel .btn-checkout');
    if(bookingCheckoutBtn) {
        bookingCheckoutBtn.addEventListener('click', () => {
            const count = parseInt(document.querySelector('.counter span').innerText);
            if(count > 0) {
                // Update Checkout Modal Details
                document.getElementById('checkout-item-qty').innerText = `x${count}`;
                document.getElementById('checkout-total-price').innerText = `$${count * 120}`;
                // Close booking panel, open checkout
                panel.classList.remove('active');
                checkoutModal.classList.add('active');
                document.body.classList.add('modal-open');
            } else {
                alert("Please select at least one ticket to book.");
            }
        });
    }

    // Payment Selection
    window.selectPayment = (method) => {
        document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-${method}`).classList.add('active');
        
        document.getElementById('payment-card-details').style.display = 'none';
        document.getElementById('payment-upi-details').style.display = 'none';
        document.getElementById('payment-net-details').style.display = 'none';
        
        document.getElementById(`payment-${method}-details`).style.display = 'block';
    };

    // Process Payment
    window.processPayment = () => {
        const payBtn = document.getElementById('pay-now-btn');
        payBtn.innerText = "Processing Securely...";
        setTimeout(() => {
            payBtn.innerText = "Payment Successful!";
            payBtn.style.background = "#10B981"; // Green
            
            // Add to recent orders in profile
            const count = document.getElementById('checkout-item-qty').innerText;
            const recentOrders = document.getElementById('recent-orders');
            if(recentOrders.innerText === "No recent orders yet.") recentOrders.innerHTML = "";
            recentOrders.innerHTML += `<div style="margin-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">Standard Access <span class="accent-text">${count}</span></div>`;

            // Save to Local Storage
            localStorage.setItem('recentOrders', recentOrders.innerHTML);

            // Trigger SMS Notification
            const smsNotification = document.getElementById('sms-notification');
            const smsItemName = document.getElementById('sms-item-name');
            if(smsNotification && smsItemName) {
                smsItemName.innerText = `Standard Access (${count})`;
                smsNotification.classList.add('show');
                setTimeout(() => {
                    smsNotification.classList.remove('show');
                }, 5000); // Hide after 5 seconds
            }

            setTimeout(() => {
                closeCheckout();
                // Reset checkout button
                setTimeout(() => {
                    payBtn.innerText = "Pay Securely";
                    payBtn.style.background = "var(--primary-grad)";
                    document.querySelector('.counter span').innerText = "0";
                }, 500);
            }, 2000);
        }, 2000);
    };

    // Select UPI App
    let selectedUpiApp = '';
    window.selectUpiApp = (button, appName) => {
        selectedUpiApp = appName;
        // Remove active from all upi buttons
        document.querySelectorAll('.payment-app-btn').forEach(btn => btn.classList.remove('active'));
        // Add active to clicked
        button.classList.add('active');
        
        // Auto-fill a dummy UPI ID if they click an app
        const upiInput = document.getElementById('upi-id-input');
        if(upiInput) {
            if(appName === 'gpay') upiInput.value = 'user@okaxis';
            else if(appName === 'phonepe') upiInput.value = 'user@ybl';
            else if(appName === 'paytm') upiInput.value = 'user@paytm';
            else if(appName === 'fampay') upiInput.value = 'user@fampay';
        }
    };

    // Profile Panel Logic
    const profilePanel = document.getElementById('profile-panel');
    window.openProfilePanel = () => {
        if(profilePanel) profilePanel.classList.add('active');
    };
    window.closeProfilePanel = () => {
        if(profilePanel) profilePanel.classList.remove('active');
    };

    window.toggleProfileEdit = () => {
        document.getElementById('profile-display-section').style.display = 'none';
        document.getElementById('profile-edit-section').style.display = 'block';
    };

    window.saveProfile = () => {
        const newName = document.getElementById('edit-name').value;
        const newEmail = document.getElementById('edit-email').value;
        
        document.getElementById('profile-name').innerText = newName;
        document.getElementById('profile-email').innerText = newEmail;
        
        // Save to Local Storage
        localStorage.setItem('profileName', newName);
        localStorage.setItem('profileEmail', newEmail);
        
        document.getElementById('profile-edit-section').style.display = 'none';
        document.getElementById('profile-display-section').style.display = 'block';
    };

    window.logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('profileName');
        localStorage.removeItem('profileEmail');
        localStorage.removeItem('recentOrders');
        window.location.reload();
    };

    // Auth Modal Logic
    const authModal = document.getElementById('auth-modal');
    window.openAuthModal = () => {
        if(authModal) authModal.classList.add('active');
    };
    window.closeAuthModal = () => {
        if(authModal) authModal.classList.remove('active');
    };
    window.submitAuth = () => {
        const btn = document.getElementById('auth-submit-btn');
        if(btn) {
            btn.innerText = "Authenticating...";
            setTimeout(() => {
                btn.innerText = "Success!";
                btn.style.background = "#10B981"; // Green
                setTimeout(() => {
                    closeAuthModal();
                    // Reset
                    setTimeout(() => {
                        btn.innerText = "Sign Up / Sign In";
                        btn.style.background = "var(--primary-grad)";
                        
                        // Set Logged In State
                        localStorage.setItem('isLoggedIn', 'true');
                        
                        // Change top nav button to Profile
                        const navBtn = document.querySelector('.nav-links .btn-primary');
                        if(navBtn) {
                            navBtn.innerText = "My Profile";
                            navBtn.onclick = window.openProfilePanel;
                        }
                    }, 500);
                }, 1000);
            }, 1500);
        }
    };

    // 4. Counter Logic
    document.querySelectorAll('.counter').forEach(counter => {
        const span = counter.querySelector('span');
        const plusBtn = counter.querySelector('.plus');
        const minusBtn = counter.querySelector('.minus');
        
        if(plusBtn) {
            plusBtn.addEventListener('click', () => {
                span.innerText = parseInt(span.innerText) + 1;
            });
        }
        if(minusBtn) {
            minusBtn.addEventListener('click', () => {
                const val = parseInt(span.innerText);
                if(val > 0) span.innerText = val - 1;
            });
        }
    });
});

function replaceSkeletons() {
    // Hero Cards
    const heroContainer = document.querySelector('.floating-cards-container');
    if(heroContainer) {
        heroContainer.innerHTML = `
            <div class="event-card glass-card" onclick="openBooking()">
                <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=500')"></div>
                <div class="card-body">
                    <span class="tag">Music</span>
                    <h4>Neon Midnight</h4>
                    <p>Digital pulses in the heart of Tokyo.</p>
                </div>
            </div>
            <div class="event-card glass-card" onclick="openBooking()">
                <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1514525253361-bee8a487409e?q=80&w=500')"></div>
                <div class="card-body">
                    <span class="tag">Tech</span>
                    <h4>Quantum Rave</h4>
                    <p>The intersection of code and bass.</p>
                </div>
            </div>
        `;
    }

    // Trending Cards
    const trendingScroll = document.getElementById('trending-scroll');
    if(trendingScroll) {
        trendingScroll.innerHTML = `
            <div class="trending-card glass-card" onclick="openBooking()">
                <div class="trend-img" style="background-image: url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600')"></div>
                <div class="trend-info">
                    <h3>Vortex Sessions</h3>
                    <p>Limited Availability • London</p>
                </div>
            </div>
            <div class="trending-card glass-card" onclick="openBooking()">
                <div class="trend-img" style="background-image: url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600')"></div>
                <div class="trend-info">
                    <h3>Echo Chamber</h3>
                    <p>Sold Out • Berlin</p>
                </div>
            </div>
            <div class="trending-card glass-card" onclick="openBooking()">
                <div class="trend-img" style="background-image: url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600')"></div>
                <div class="trend-info">
                    <h3>Solaris Festival</h3>
                    <p>Tickets Available • Sydney</p>
                </div>
            </div>
        `;
    }

    // Categories
    const catGrid = document.querySelector('.category-grid');
    if(catGrid) {
        catGrid.innerHTML = `
            <div class="cat-card glass-card" onclick="openBooking()">
                <div class="icon">🎹</div>
                <span>Music</span>
            </div>
            <div class="cat-card glass-card" onclick="openBooking()">
                <div class="icon">💻</div>
                <span>Tech</span>
            </div>
            <div class="cat-card glass-card" onclick="openBooking()">
                <div class="icon">🎨</div>
                <span>Arts</span>
            </div>
            <div class="cat-card glass-card" onclick="openBooking()">
                <div class="icon">🌙</div>
                <span>Nightlife</span>
            </div>
        `;
    }

    // Replace map skeleton
    const mapContainer = document.querySelector('.map-container.skeleton');
    if(mapContainer) {
        mapContainer.classList.remove('skeleton');
        mapContainer.style.background = "transparent";
        // Inserting a dark-themed Google Maps iframe
        mapContainer.innerHTML += `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0192842017283!2d-122.4011802!3d37.790953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085806283fc37a3%3A0x6b7720216b23a100!2sDowntown%20San%20Francisco%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style="border:0; border-radius: 20px; filter: invert(90%) hue-rotate(180deg); position: absolute; top: 0; left: 0; z-index: 0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
        const overlay = mapContainer.querySelector('.map-overlay');
        if (overlay) {
            overlay.style.position = "absolute";
            overlay.style.zIndex = "10";
            overlay.style.pointerEvents = "none";
        }
    }
}
