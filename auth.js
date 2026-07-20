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

// ----------------------
// Profile Page
// ----------------------

const profileForm = document.getElementById("profileForm");

if (profileForm) {
    const profileUsername =
        document.getElementById("profileUsername");

    const profileBio =
        document.getElementById("profileBio");

    const profileCountry =
        document.getElementById("profileCountry");

    const profileX =
        document.getElementById("profileX");

    const profileTelegram =
        document.getElementById("profileTelegram");

    const profileMessage =
        document.getElementById("profileMessage");

    const saveProfileButton =
        document.getElementById("saveProfileButton");

    const profilePreviewUsername =
        document.getElementById("profilePreviewUsername");

    const profilePreviewBio =
        document.getElementById("profilePreviewBio");

    const profilePreviewCountry =
        document.getElementById("profilePreviewCountry");

    const profilePreviewX =
        document.getElementById("profilePreviewX");

    const profilePreviewTelegram =
        document.getElementById("profilePreviewTelegram");

    const profilePreviewAvatar =
        document.getElementById("profilePreviewAvatar");

    const profileHeaderAvatar =
        document.getElementById("profileHeaderAvatar");

    function formatSocialUsername(value) {
        const cleanedValue = value.trim();

        if (!cleanedValue) {
            return "";
        }

        return cleanedValue.startsWith("@")
            ? cleanedValue
            : `@${cleanedValue}`;
    }

    function createInitials(username) {
        const cleanedUsername = username.trim();

        if (!cleanedUsername) {
            return "TC";
        }

        const words = cleanedUsername
            .split(/\s+/)
            .filter(Boolean);

        if (words.length >= 2) {
            return (
                words[0].charAt(0) +
                words[1].charAt(0)
            ).toUpperCase();
        }

        return cleanedUsername
            .substring(0, 2)
            .toUpperCase();
    }

    function updateProfilePreview() {
        const username =
            profileUsername.value.trim() || "Member";

        const bio =
            profileBio.value.trim() ||
            "No biography added yet.";

        const country =
            profileCountry.value.trim() ||
            "Not added";

        const xUsername =
            formatSocialUsername(profileX.value) ||
            "Not added";

        const telegramUsername =
            formatSocialUsername(profileTelegram.value) ||
            "Not added";

        const initials =
            createInitials(username);

        profilePreviewUsername.textContent =
            username;

        profilePreviewBio.textContent =
            bio;

        profilePreviewCountry.textContent =
            country;

        profilePreviewX.textContent =
            xUsername;

        profilePreviewTelegram.textContent =
            telegramUsername;

        profilePreviewAvatar.textContent =
            initials;

        profileHeaderAvatar.textContent =
            initials;
    }

    async function loadProfile() {
        profileMessage.textContent =
            "Loading profile...";

        const { data, error } =
            await supabaseClient.auth.getUser();

        if (error || !data.user) {
            window.location.href = "login.html";
            return;
        }

        const user = data.user;
        const metadata = user.user_metadata || {};

        profileUsername.value =
            metadata.username || "";

        profileBio.value =
            metadata.bio || "";

        profileCountry.value =
            metadata.country || "";

        profileX.value =
            metadata.x_username || "";

        profileTelegram.value =
            metadata.telegram_username || "";

        updateProfilePreview();

        profileMessage.textContent = "";
    }

    const profileInputs = [
        profileUsername,
        profileBio,
        profileCountry,
        profileX,
        profileTelegram
    ];

    profileInputs.forEach((input) => {
        input.addEventListener(
            "input",
            updateProfilePreview
        );
    });

    profileForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const username =
                profileUsername.value.trim();

            if (!username) {
                profileMessage.textContent =
                    "Username is required.";
                return;
            }

            saveProfileButton.disabled = true;
            saveProfileButton.textContent =
                "Saving...";

            profileMessage.textContent =
                "Saving profile...";

            const { error } =
                await supabaseClient.auth.updateUser({
                    data: {
                        username,
                        bio: profileBio.value.trim(),
                        country:
                            profileCountry.value.trim(),
                        x_username:
                            formatSocialUsername(
                                profileX.value
                            ),
                        telegram_username:
                            formatSocialUsername(
                                profileTelegram.value
                            )
                    }
                });

            if (error) {
                profileMessage.textContent =
                    error.message;

                saveProfileButton.disabled = false;
                saveProfileButton.textContent =
                    "Save Profile";

                return;
            }

            updateProfilePreview();

            profileMessage.textContent =
                "Profile saved successfully ✅";

            saveProfileButton.disabled = false;
            saveProfileButton.textContent =
                "Save Profile";
        }
    );

    loadProfile();
}
