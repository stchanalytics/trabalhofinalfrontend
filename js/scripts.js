/**
 * scripts.js
 * Funcionalidades: Smooth Scroll, Leia Mais, Favoritos e Validação de Formulário.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Smooth Scroll (Rolagem Suave) --- */
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    /* --- 2. Funcionalidade "Leia Mais / Leia Menos" --- */
    const expandButtons = document.querySelectorAll('.btn-expandir');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('aria-controls');
            const content = document.getElementById(targetId);
            
            if (!content) return;

            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                content.classList.remove('is-open');
                this.setAttribute('aria-expanded', 'false');
                this.textContent = 'Leia Mais';
            } else {
                content.classList.add('is-open');
                this.setAttribute('aria-expanded', 'true');
                this.textContent = 'Leia Menos';
            }
        });
    });

    /* --- 3. Favoritar com LocalStorage --- */
    const favoritoKey = 'capitulosFavoritosIA';
    const favoriteButtons = document.querySelectorAll('.btn-favoritar');
    
    function updateFavoriteButtons() {
        let favoritos = [];
        try {
            favoritos = JSON.parse(localStorage.getItem(favoritoKey) || '[]');
        } catch (e) {
            localStorage.removeItem(favoritoKey); 
            favoritos = [];
        }
        
        favoriteButtons.forEach(button => {
            const capituloId = button.dataset.id;
            
            if (favoritos.includes(capituloId)) {
                button.textContent = 'Salvo! Remover?';
                button.classList.add('is-favorited');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.textContent = 'Salvar para depois';
                button.classList.remove('is-favorited');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const capituloId = this.dataset.id;
            let favoritos = JSON.parse(localStorage.getItem(favoritoKey) || '[]');

            if (favoritos.includes(capituloId)) {
                favoritos = favoritos.filter(id => id !== capituloId);
            } else {
                favoritos.push(capituloId);
            }

            localStorage.setItem(favoritoKey, JSON.stringify(favoritos));
            updateFavoriteButtons();
        });
    });

    // Carrega estado inicial
    if (favoriteButtons.length > 0) {
        updateFavoriteButtons();
    }

    /* --- 4. Validação de Formulário --- */
    const contactForm = document.getElementById('form-contato');

    if (contactForm) {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const nomeInput = document.getElementById('nome');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        function showMessage(message, isSuccess = false) {
            emailError.textContent = message;
            emailError.style.display = 'block';
            emailError.style.color = isSuccess ? 'green' : '#dc3545';
        }

        function validateEmail() {
            const emailValue = emailInput.value.trim();
            
            if (emailValue === "") {
                showMessage("O campo E-mail é obrigatório.");
                return false;
            } else if (!emailRegex.test(emailValue)) {
                showMessage("Por favor, insira um e-mail válido.");
                return false;
            }
            
            emailError.style.display = 'none';
            return true;
        }
        
        function validateName() {
             return !(nomeInput && nomeInput.value.trim() === "");
         }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const isEmailValid = validateEmail();
            const isNameValid = validateName();
            
            if (isEmailValid && isNameValid) {
                showMessage('Mensagem Enviada com Sucesso!', true);
                contactForm.reset();
                setTimeout(() => emailError.style.display = 'none', 4000); 
            } else if (!isNameValid) {
                 showMessage('O campo Nome é obrigatório.', false); 
            }
        });

        emailInput.addEventListener('blur', validateEmail);
    }
});