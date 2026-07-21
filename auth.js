// ----------------------
// Register
// ----------------------

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            if (password.length < 6) {
                alert(
                    "Password must have at least 6 characters."
                );
                return;
            }

            const { data, error } =
                await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username
                        },
                        emailRedirectTo:
                            "https://tacocatwebsite-project.github.io/tacocat-members/login.html"
                    }
                });

            if (error) {
                alert(error.message);
                return;
            }

            if (data.user) {
                const {
                    error: profileError
                } = await supabaseClient
                    .from("profiles")
                    .upsert({
                        id: data.user.id,
                        username,
                        role: "Member",
                        membership: "Free",
                        points: 0,
                        missions: 0,
                        badges: 0
                    });

                if (profileError) {
                    console.error(
                        "Profile creation error:",
                        profileError
                    );
                }
            }

            alert(
                "Account created! Please check your email to verify your account."
            );

            registerForm.reset();
        }
    );
}

// ----------------------
// Login
// ----------------------

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            const loginMessage =
                document.getElementById("loginMessage");

            loginMessage.textContent =
                "Logging in...";

            const { data, error } =
                await supabaseClient.auth
                    .signInWithPassword({
                        email,
                        password
                    });

            if (error) {
                loginMessage.textContent =
                    error.message;
                return;
            }

            if (!data.user) {
                loginMessage.textContent =
                    "Login failed. Please try again.";
                return;
            }

            loginMessage.textContent =
                "Login successful!";

            window.location.href =
                "dashboard.html";
        }
    );
}
