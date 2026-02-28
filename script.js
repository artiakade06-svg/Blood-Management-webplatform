const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

function scrollToSection(id) {
    document.getElementById(id) ? .scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitForm(event, formEl, successMessage) {
    event.preventDefault();
    const form = (typeof formEl === 'string') ? document.getElementById(formEl) : formEl;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => {
        input.style.borderColor = '';
        if (!input.value.trim()) { input.style.borderColor = '#ff3354';
            valid = false; }
    });
    if (!valid) { showToast('⚠ Please fill in all required fields.', true); return; }
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '';
        showToast('✓ ' + successMessage);
    }, 1000);
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.borderLeftColor = isError ? '#ff9900' : '#c0001a';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function openModal(id) { document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden'; }

function closeModal(id) { document.getElementById(id).classList.remove('active');
    document.body.style.overflow = ''; }

function closeModalOutside(event) {
    if (event.target.classList.contains('modal-overlay')) { event.target.classList.remove('active');
        document.body.style.overflow = ''; }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = ''; }
});

function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .blood, .bbform, h2, .section-sub, .section-label').forEach(el => { el.classList.add('reveal');
        observer.observe(el); });
}

function initBloodGroupClick() {
    document.querySelectorAll('.blood').forEach(el => {
        el.addEventListener('click', () => {
            const group = el.dataset.group;
            const status = el.querySelector('small').textContent;
            showToast(`Blood Group ${group} — Status: ${status}`);
        });
    });
}

function initBloodCounter() {
    const stocks = { 'A+': 245, 'A-': 32, 'B+': 178, 'B-': 11, 'O+': 310, 'O-': 8, 'AB+': 95, 'AB-': 27 };
    document.querySelectorAll('.blood').forEach(el => {
        const group = el.dataset.group;
        const units = stocks[group];
        const small = el.querySelector('small');
        el.classList.remove('low', 'critical');
        if (units < 15) { small.textContent = 'Critical';
            el.classList.add('critical'); } else if (units < 50) { small.textContent = 'Low';
            el.classList.add('low'); } else { small.textContent = 'Available'; }
        el.title = `${group}: ${units} units available`;
    });
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => { input.value = today; });
}

function initInputEffects() {
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
        el.addEventListener('focus', () => { el.closest('.form-group').querySelector('label').style.color = '#c0001a'; });
        el.addEventListener('blur', () => { el.closest('.form-group').querySelector('label').style.color = ''; });
    });
}

function animateCounters() {
    document.querySelectorAll('.stat span').forEach(span => {
        const text = span.textContent;
        const num = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d,]/g, '');
        let current = 0;
        const step = num / 60;
        const interval = setInterval(() => {
            current += step;
            if (current >= num) { current = num;
                clearInterval(interval); }
            span.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 25);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initBloodGroupClick();
    initBloodCounter();
    setDefaultDates();
    initInputEffects();
    setTimeout(animateCounters, 600);
});