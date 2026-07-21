const welcomeMessage =
    document.getElementById("welcomeMessage");

const logoutButton =
    document.getElementById("logoutButton");

async function loadDashboard() {
    if (!welcomeMessage) {
        return;
    }

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "login.html";
        return;
    }

    const user = data.user;

    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        console.error(
            "Dashboard profile error:",
            profileError
        );
    }

    const metadata =
        user.user_metadata || {};

    const username =
        profile?.username ||
        metadata.username ||
        "Member";

    const email =
        user.email || "";

    const role =
        profile?.role || "Member";

    const membership =
        profile?.membership || "Free";

    const avatarUrl =
        profile?.avatar_url ||
        metadata.avatar_url ||
        "";

    const points =
        profile?.points || 0;

    const missions =
        profile?.missions || 0;

    const badges =
        profile?.badges || 0;

    const accountId =
        user.id.substring(0, 8).toUpperCase();

    const joined =
        formatDate(
            profile?.created_at ||
            user.created_at
        );

    const verified =
        user.email_confirmed_at
            ? "Verified ✅"
            : "Pending ❌";

    welcomeMessage.innerHTML =
        `Welcome back, <strong>${username}</strong> 🚀`;

    const dashboardUsername =
        document.getElementById(
            "dashboardUsername"
        );

    const dashboardEmail =
        document.getElementById(
            "dashboardEmail"
        );

    const dashboardRole =
        document.getElementById(
            "dashboardRole"
        );

    const dashboardAccountId =
        document.getElementById(
            "dashboardAccountId"
        );

    const emailVerified =
        document.getElementById(
            "emailVerified"
        );

    const joinedDate =
        document.getElementById(
            "joinedDate"
        );

    const accountStatus =
        document.getElementById(
            "accountStatus"
        );

    if (dashboardUsername) {
        dashboardUsername.textContent =
            username;
    }

    if (dashboardEmail) {
        dashboardEmail.textContent =
            email;
    }

    if (dashboardRole) {
        dashboardRole.textContent =
            role;
    }

    if (dashboardAccountId) {
        dashboardAccountId.textContent =
            accountId;
    }

    if (emailVerified) {
        emailVerified.textContent =
            verified;
    }

    if (joinedDate) {
        joinedDate.textContent =
            joined;
    }

    if (accountStatus) {
        accountStatus.textContent =
            membership;
    }

    updateDashboardStats(
        points,
        missions,
        badges
    );

    renderDashboardAvatar(
        "headerAvatar",
        avatarUrl,
        username
    );

    renderDashboardAvatar(
        "profileAvatar",
        avatarUrl,
        username
    );
}

function renderDashboardAvatar(
    elementId,
    avatarUrl,
    username
) {
    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.innerHTML = "";

    if (avatarUrl) {
        const image =
            document.createElement("img");

        image.src = avatarUrl;
        image.alt = "Profile avatar";

        image.onerror = () => {
            element.innerHTML = "";
            element.textContent =
                createInitials(username);
        };

        element.appendChild(image);
        return;
    }

    element.textContent =
        createInitials(username);
}

function updateDashboardStats(
    points,
    missions,
    badges
) {
    const statBoxes =
        document.querySelectorAll(
            ".stats-grid .stat-box strong"
        );

    if (statBoxes.length >= 3) {
        statBoxes[0].textContent =
            points;

        statBoxes[1].textContent =
            missions;

        statBoxes[2].textContent =
            badges;
    }
}

if (logoutButton) {
    logoutButton.addEventListener(
        "click",
        async () => {
            await supabaseClient.auth.signOut();

            window.location.href =
                "login.html";
        }
    );
}

loadDashboard();
