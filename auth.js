const SUPABASE_URL = "https://ztrgdlttugiiityatvxpe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XPNsaBSY44-obehxipQ9mw_xSn0wVBN";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            alert("Password must have at least 6 characters.");
            return;
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert(
            "Account created! Please check your email to verify your account."
        );

        registerForm.reset();
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim();

        const password = document
            .getElementById("loginPassword")
            .value;

        const loginMessage =
            document.getElementById("loginMessage");

        loginMessage.textContent = "Logging in...";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            loginMessage.textContent = error.message;
            return;
        }

        if (!data.user) {
            loginMessage.textContent =
                "Login failed. Please try again.";
            return;
        }

        loginMessage.textContent = "Login successful!";

        window.location.href = "dashboard.html";
    });
}
