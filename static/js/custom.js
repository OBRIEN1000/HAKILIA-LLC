document.addEventListener('DOMContentLoaded', () => {
    // Appliquer le thème sauvegardé depuis localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    // Bouton de switch thème
    const toggleTheme = document.createElement('button');
    toggleTheme.innerHTML = '<i class="fas fa-adjust"></i>';
    toggleTheme.className = 'fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition z-50';
    
    toggleTheme.onclick = () => {
        const html = document.documentElement;
        html.classList.toggle('dark');

        // Sauvegarder dans localStorage
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    };

    document.body.appendChild(toggleTheme);

    // Animation avec GSAP pour les éléments qui apparaissent
    
});