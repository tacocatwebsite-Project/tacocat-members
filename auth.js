const SUPABASE_URL = "https://ztrgdltugiiityatvxpe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XPNsaBSY44-obehxipQ9mw_xSn0wVBN";

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
                },
                emailRedirectTo:
                      "https://tacocatwebsite-project.github.io/tacocat-members/login.html"
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

// ----------------------
// Dashboard
// ----------------------

const welcomeMessage = document.getElementById("welcomeMessage");
const logoutButton = document.getElementById("logoutButton");

if (welcomeMessage) {

    async function loadDashboard() {

        const { data, error } =
            await supabaseClient.auth.getUser();

        if (error || !data.user) {
            window.location.href = "login.html";
            return;
        }

        const user = data.user;

        const username =
            user.user_metadata?.username || "Member";

        const email =
            user.email || "";

        const role =
            user.user_metadata?.role || "Member";

        const accountId =
            user.id.substring(0, 8).toUpperCase();

        const joined =
            new Date(user.created_at).toLocaleDateString();

        const verified =
            user.email_confirmed_at
                ? "Verified ✅"
                : "Pending ❌";

        // Welcome message
        welcomeMessage.innerHTML =
            `Welcome back, <strong>${username}</strong> 🚀`;

        // Profile Card
        document.getElementById("dashboardUsername").textContent =
            username;

        document.getElementById("dashboardEmail").textContent =
            email;

        document.getElementById("dashboardRole").textContent =
            role;

        document.getElementById("dashboardAccountId").textContent =
            accountId;

        document.getElementById("emailVerified").textContent =
            verified;

        document.getElementById("joinedDate").textContent =
            joined;

        // Avatar initials
        const initials =
            username.substring(0,2).toUpperCase();

        document.getElementById("headerAvatar").textContent =
            initials;

        document.getElementById("profileAvatar").textContent =
            initials;

    }

    loadDashboard();

}

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";

    });

}
