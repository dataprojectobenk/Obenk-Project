import Alpine from 'alpinejs';

document.addEventListener('alpine:init', () => {
    Alpine.data('slideshow', (config = {}) => ({
        current: 0,
        total: config.total || 0,
        autoplay: config.autoplay ?? true,
        interval: config.interval || 5000,
        loop: config.loop ?? true,
        pauseOnHover: config.pauseOnHover ?? true,
        effect: config.effect || 'slide',
        timer: null,
        touchStartX: 0,
        touchEndX: 0,

        init() {
            if (this.total > 1 && this.autoplay) {
                this.startAutoplay();
            }
        },

        startAutoplay() {
            this.stopAutoplay();
            this.timer = setInterval(() => {
                this.next();
            }, this.interval);
        },

        stopAutoplay() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },

        next() {
            if (this.current < this.total - 1) {
                this.current++;
            } else if (this.loop) {
                this.current = 0;
            }
        },

        prev() {
            if (this.current > 0) {
                this.current--;
            } else if (this.loop) {
                this.current = this.total - 1;
            }
        },

        goTo(index) {
            this.current = index;
            if (this.autoplay) {
                this.startAutoplay();
            }
        },

        handleTouchStart(e) {
            this.touchStartX = e.changedTouches[0].screenX;
        },

        handleTouchEnd(e) {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        },

        handleSwipe() {
            const diff = this.touchStartX - this.touchEndX;
            const threshold = 40;
            if (diff > threshold) {
                this.next();
                if (this.autoplay) this.startAutoplay();
            } else if (diff < -threshold) {
                this.prev();
                if (this.autoplay) this.startAutoplay();
            }
        },
    }));
});

window.Alpine = Alpine;
Alpine.start();
