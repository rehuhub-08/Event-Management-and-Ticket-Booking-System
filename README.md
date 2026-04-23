# Ethereal Seam | Futuristic Event Management

Ethereal Seam is a futuristic, visually immersive event management and ticket booking platform. It features a modern **"Stitched UI"**, avoiding traditional boxy cards in favor of deep glassmorphism, seamless gradient blending, and premium scroll animations.

![Ethereal Seam](https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop) *(Demo Representation)*

## ✨ Features

- **Stitched UI Aesthetics**: Smooth curved SVG dividers, deep backdrop blurs, and neon accents creating a continuous digital fabric.
- **Skeleton Loading**: High-quality shimmer effects that act as placeholders while dynamic content "loads", preventing layout shifts.
- **GSAP Scroll Animations**: Elements fade, slide, and stagger into view smoothly as the user scrolls down the page.
- **Interactive Booking Flow**: A slide-in glassmorphic panel allows users to increment/decrement ticket counts and smoothly confirms their booking.
- **Authentication Modal**: A centered glass panel for the Sign Up / Sign In flow with simulated authentication processing.
- **Mobile First & Responsive**: Built with modern Flexbox and CSS Grid to look stunning on both mobile and desktop screens.

## 🛠️ Technology Stack

This project is built purely with standard web technologies for maximum performance without a build step:
- **HTML5**: Semantic structure.
- **CSS3**: Custom variables, flexbox, grid, glassmorphism (`backdrop-filter`), and keyframe animations.
- **Vanilla JavaScript**: DOM manipulation, event listeners, and simulated asynchronous loading.
- **GSAP (GreenSock)**: Used via CDN for high-performance scroll animations.

## 🚀 How to Run

Since this project uses no build tools or package managers (no `node_modules` required), running it is incredibly simple:

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Use the **Live Server** extension to launch `index.html`. 
   - *Alternatively, you can just double-click `index.html` to open it in any modern web browser.*
4. Enjoy the stitched experience!

## 📂 File Structure

```text
├── index.html   # Main layout, SVG dividers, and modal structures
├── style.css    # Design system, glassmorphism, media queries, and animations
├── app.js       # GSAP setup, skeleton swapping, and booking/auth logic
└── README.md    # Project documentation
```

## 🎨 Design Philosophy

Instead of cards floating randomly, sections are meant to feel **stitched together** like one continuous fabric. The design leverages:
- **Dark Mode Default**: Deep indigo and violet backgrounds (`#0a0a12`).
- **Gradients**: `linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)`.
- **Typography**: Inter (Body text) and Sora/Poppins (Headings).

---
*Stitched with Pure Light.*
