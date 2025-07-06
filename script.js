document.addEventListener('DOMContentLoaded', () => {

    // EFEITO INTERATIVO 1: MENU HAMBÚRGUER PARA DISPOSITIVOS MÓVEIS
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // EFEITO INTERATIVO 2: VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO PARA O NETLIFY
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            
            let isValid = true;

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const messageError = document.getElementById('messageError');
            const formSuccess = document.getElementById('formSuccess');

            // Reseta erros e mensagens de sucesso
            nameError.textContent = '';
            emailError.textContent = '';
            messageError.textContent = '';
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            messageError.style.display = 'none';
            formSuccess.style.display = 'none';
            
            // Validações (seu código original, que está ótimo)
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

            //Bloco de envio para o Netlify
            if (isValid) {
                //Exibe uma mensagem de "enviando" para o usuário
                formSuccess.textContent = 'Enviando...';
                formSuccess.style.color = 'black';
                formSuccess.style.display = 'block';

                const formData = new FormData(contactForm);

                try {
                    //Faz a requisição POST para o Netlify
                    const response = await fetch('/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(formData).toString()
                    });

                    //Verifica se o Netlify respondeu com sucesso
                    if (response.ok) {
                        formSuccess.textContent = 'Mensagem enviada com sucesso! Obrigado por entrar em contato.';
                        formSuccess.style.color = 'green';
                        contactForm.reset(); // Limpa o formulário
                    } else {
                        //Se houve um erro no servidor do Netlify
                        throw new Error('Falha no envio do formulário.');
                    }
                } catch (error) {
                    //Se houve um erro de rede ou outro problema
                    console.error('Erro ao enviar formulário:', error);
                    formSuccess.textContent = 'Ocorreu um erro ao enviar. Tente novamente mais tarde.';
                    formSuccess.style.color = 'red';
                }
            }
        });
    }
});