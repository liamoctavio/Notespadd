document.addEventListener("DOMContentLoaded", function() {
    // Limpiar los campos del formulario al cargar la página de registro
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.reset();
    }
    // Función para validar el formulario de registro
    function validateRegisterForm() {
        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");

        let isValid = true;

        // Validar nombre de usuario
        if (username.value.trim() === "") {
            username.classList.add("is-invalid");
            isValid = false;
        } else {
            username.classList.remove("is-invalid");
        }

        // Validar correo electrónico
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email.value)) {
            email.classList.add("is-invalid");
            isValid = false;
        } else {
            email.classList.remove("is-invalid");
        }

        // Validar contraseña
        const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordPattern.test(password.value)) {
            password.classList.add("is-invalid");
            isValid = false;
        } else {
            password.classList.remove("is-invalid");
        }

        // Validar confirmación de contraseña
        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add("is-invalid");
            isValid = false;
        } else {
            confirmPassword.classList.remove("is-invalid");
        }

        return isValid;

        
    }

    // Función para registrar un usuario
    registerForm?.addEventListener("submit", function(event) {
        event.preventDefault();
        
        if (validateRegisterForm()) {
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            
            // Crear un objeto de usuario
            const user = {
                username: username,
                email: email,
                password: password
            };
            
            // Guardar el usuario en localStorage
            localStorage.setItem(email, JSON.stringify(user));
            alert("Registro exitoso. Puedes iniciar sesión.");
            
            // Limpiar los campos del formulario
            registerForm.reset();
            
            // Redirigir a la página de inicio de sesión
            window.location.href = "login.html";
        }
    });

    // Función para listar usuarios
    function listarUsuarios() {
        console.log("Usuarios registrados:");
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const user = JSON.parse(localStorage.getItem(key));
                if (user && user.username) {
                    console.log(`Email: ${key}, Username: ${user.username}`);
                }
            } catch (e) {
                console.error(`Error parsing JSON for key ${key}:`, e);
            }
        }
    }

    // Llamar a la función para listar usuarios al cargar la página
    listarUsuarios();

    // Controlador de eventos para el botón "Ir a Inicio de Sesión"
    document.getElementById("login-button")?.addEventListener("click", function() {
        window.location.href = "login.html";
    });

    // Controlador de eventos para el botón "Ir a Bienvenida"
    document.getElementById("welcome-button")?.addEventListener("click", function() {
        window.location.href = "welcome.html";
    });

    // Función para iniciar sesión
    document.getElementById("login-form")?.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        
        // Obtener usuario de localStorage
        const user = JSON.parse(localStorage.getItem(email));
        
        // Verificar credenciales
        if (user && user.password === password) {
            alert("Inicio de sesión exitoso.");
            // Guardar el email del usuario en localStorage
            localStorage.setItem("loggedInUser", email);
            // Redirigir a la página principal o dashboard
            window.location.href = "index.html";
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    });

    // Controlador de eventos para el botón "Cerrar sesión"
    document.getElementById("logout-button")?.addEventListener("click", function() {
        // Eliminar el email del usuario desde localStorage
        localStorage.removeItem("loggedInUser");
        alert("Has cerrado sesión.");
        // Redirigir a la página de inicio de sesión
        window.location.href = "login.html";
    });

    // Función para cargar notas del usuario
    function loadNotes() {
        const email = localStorage.getItem("loggedInUser");
        if (email) {
            const notes = JSON.parse(localStorage.getItem(`notes_${email}`)) || [];
            const noteBoard = document.getElementById("note-board");
            noteBoard.innerHTML = "";
            notes.forEach((note, index) => {
                const noteCard = document.createElement("div");
                noteCard.className = "note-card col-md-4 mb-3";
                noteCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${note.title}</h5>
                            <p class="card-text">${note.content}</p>
                            <button class="btn btn-danger" onclick="deleteNote(${index})">Eliminar</button>
                        </div>
                    </div>
                `;
                noteBoard.appendChild(noteCard);
            });
        }
    }

    // Función para agregar una nota
    document.getElementById("add-note-form")?.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const email = localStorage.getItem("loggedInUser");
        if (email) {
            const title = document.getElementById("note-title").value;
            const content = document.getElementById("note-content").value;
            const notes = JSON.parse(localStorage.getItem(`notes_${email}`)) || [];
            notes.push({ title, content });
            localStorage.setItem(`notes_${email}`, JSON.stringify(notes));
            loadNotes();
            document.getElementById("add-note-form").reset();
            // Cerrar el modal después de agregar la nota
            const addNoteModal = bootstrap.Modal.getInstance(document.getElementById('addNoteModal'));
            addNoteModal.hide();
        }
    });

    // Función para eliminar una nota
    window.deleteNote = function(index) {
        const email = localStorage.getItem("loggedInUser");
        if (email) {
            const notes = JSON.parse(localStorage.getItem(`notes_${email}`)) || [];
            notes.splice(index, 1);
            localStorage.setItem(`notes_${email}`, JSON.stringify(notes));
            loadNotes();
        }
    };

    // Cargar notas al cargar la página
    loadNotes();
      
});



