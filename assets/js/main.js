// Update year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for internal links (optional)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', '#' + id);
    }
  });
});
const toggleBtn = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggleBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
