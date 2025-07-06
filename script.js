// Aguarda todo o conteúdo HTML da página ser carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // EFEITO INTERATIVO 1: MENU HAMBÚRGUER PARA DISPOSITIVOS MÓVEIS
    // ===================================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Alterna a classe 'active' para mostrar/esconder o menu ao clicar no ícone
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fecha o menu ao clicar em qualquer um dos links de navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // ===================================================================
    // MARCAÇÃO DINÂMICA DO LINK DE NAVEGAÇÃO ATIVO
    // ===================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop(); // Pega o nome do arquivo atual (ex: 'sobre.html')

    navLinks.forEach(link => {
        // Pega o nome do arquivo do atributo href do link
        const linkPath = link.getAttribute('href').split('/').pop();

        // Remove a classe 'active' de todos os links para garantir um estado limpo
        link.classList.remove('active');

        // Condição para a página inicial (index.html), que pode ser representada por um caminho vazio '' ou 'index.html'
        if ((currentPath === '' || currentPath === 'index.html') && linkPath === 'index.html') {
            link.classList.add('active');
        } 
        // Condição para as outras páginas
        else if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // ===================================================================
    // EFEITO INTERATIVO 2: VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
    // ===================================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            // Impede que o formulário seja enviado da maneira tradicional
            event.preventDefault(); 
            
            let isValid = true;

            // Seleciona os campos e os elementos de erro/sucesso
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const messageError = document.getElementById('messageError');
            const formSuccess = document.getElementById('formSuccess');

            // Reseta todas as mensagens de erro e sucesso antes de uma nova validação
            nameError.textContent = '';
            emailError.textContent = '';
            messageError.textContent = '';
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            messageError.style.display = 'none';
            formSuccess.style.display = 'none';
            
            // --- Início das Validações ---
            if (name.value.trim() === '') {
                nameError.textContent = 'Por favor, insira seu nome.';
                nameError.style.display = 'block';
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                emailError.textContent = 'Por favor, insira seu e-mail.';
                emailError.style.display = 'block';
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                emailError.textContent = 'Por favor, insira um e-mail válido.';
                emailError.style.display = 'block';
                isValid = false;
            }
            
            if (message.value.trim() === '') {
                messageError.textContent = 'Por favor, escreva uma mensagem.';
                messageError.style.display = 'block';
                isValid = false;
            }
            // --- Fim das Validações ---

            // Se todos os campos forem válidos, prossegue com o envio
            if (isValid) {
                // Feedback visual para o usuário enquanto o formulário está sendo enviado
                formSuccess.textContent = 'Enviando...';
                formSuccess.style.color = 'black';
                formSuccess.style.display = 'block';

                const formData = new FormData(contactForm);

                try {
                    // Envia os dados para o Netlify usando a API Fetch com async/await
                    const response = await fetch('/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(formData).toString()
                    });

                    // Verifica se a resposta do Netlify foi bem-sucedida
                    if (response.ok) {
                        formSuccess.textContent = 'Mensagem enviada com sucesso! Obrigado por entrar em contato.';
                        formSuccess.style.color = 'green';
                        contactForm.reset(); // Limpa os campos do formulário
                    } else {
                        // Trata erros do lado do servidor do Netlify
                        throw new Error('Falha no envio do formulário. Resposta do servidor não foi OK.');
                    }
                } catch (error) {
                    // Trata erros de rede ou outros problemas na requisição
                    console.error('Erro ao enviar formulário:', error);
                    formSuccess.textContent = 'Ocorreu um erro ao enviar. Tente novamente mais tarde.';
                    formSuccess.style.color = 'red';
                }
            }
        });
    }
});
