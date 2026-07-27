/**
 * Portfolio JavaScript - Simple & Clean
 */

(function() {
    'use strict';

    // ============================================================
    // THEME TOGGLE
    // ============================================================
    function initTheme() {
        const toggleButtons = document.querySelectorAll('.theme-toggle');
        if (!toggleButtons.length) return;

        // Check saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            document.body.classList.add('light-theme');
            updateIcons('light');
        } else {
            document.body.classList.remove('light-theme');
            updateIcons('dark');
        }

        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const isLight = document.body.classList.toggle('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
                updateIcons(isLight ? 'light' : 'dark');
            });
        });
    }

    function updateIcons(theme) {
        document.querySelectorAll('.theme-toggle .theme-icon').forEach(icon => {
            icon.textContent = theme === 'light' ? '☀' : '🌙';
        });
    }

    // ============================================================
    // NAVIGATION HIGHLIGHT
    // ============================================================
    function highlightCurrentPage() {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }

    // ============================================================
    // CONTACT FORM
    // ============================================================
    function initContactForm() {
        const form = document.querySelector('.contact-form form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]')?.value || '';
            const email = this.querySelector('input[type="email"]')?.value || '';
            const message = this.querySelector('textarea')?.value || '';

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            if (!email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn?.textContent || 'Send Message';
            if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                if (btn) { btn.textContent = originalText; btn.disabled = false; }
                this.reset();
                window.location.href = `mailto:kaprisuman222@gmail.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
            }, 1000);
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {
        highlightCurrentPage();
        initTheme();
        initContactForm();
    });

})();


