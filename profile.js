// ========================================
// TacoCat Members - Profile Page
// ========================================

// ----------------------------------------
// Utility functions
// ----------------------------------------

function profileFormatSocialUsername(value) {
    const cleanedValue = (value || "").trim();

    if (!cleanedValue) {
        return "";
    }

    return cleanedValue.startsWith("@")
        ? cleanedValue
        : `@${cleanedValue}`;
}

function profileCreateInitials(username) {
    const cleanedUsername = (username || "").trim();

    if (!cleanedUsername) {
        return "TC";
    }

    const words = cleanedUsername
        .split(/\s+/)
        .filter(Boolean);

    if (words.length >= 2) {
        return (
            words[0][0] +
            words[1][0]
        ).toUpperCase();
    }

    return cleanedUsername
        .substring(0, 2)
        .toUpperCase();
}

// ----------------------------------------
// Page elements
// ----------------------------------------

const profileForm =
    document.getElementById("profileForm");

const profileLogoutButton =
    document.getElementById("logoutButton");

const avatarFile =
    document.getElementById("avatarFile");

const uploadAvatarButton =
    document.getElementById("uploadAvatarButton");

const avatarMessage =
    document.getElementById("avatarMessage");

// ----------------------------------------
// Profile page
// ----------------------------------------

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

    const profilePreviewImage =
        document.getElementById("profilePreviewImage");

    const profilePreviewInitials =
        document.getElementById("profilePreviewInitials");

    const profileHeaderAvatar =
        document.getElementById("profileHeaderAvatar");

    // ----------------------------------------
    // Update profile preview
    // ----------------------------------------

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
            profileFormatSocialUsername(
                profileX.value
            ) || "Not added";

        const telegramUsername =
            profileFormatSocialUsername(
                profileTelegram.value
            ) || "Not added";

        const initials =
            profileCreateInitials(username);

        if (profilePreviewUsername) {
            profilePreviewUsername.textContent =
                username;
        }

        if (profilePreviewBio) {
            profilePreviewBio.textContent =
                bio;
        }

        if (profilePreviewCountry) {
            profilePreviewCountry.textContent =
                country;
        }

        if (profilePreviewX) {
            profilePreviewX.textContent =
                xUsername;
        }

        if (profilePreviewTelegram) {
            profilePreviewTelegram.textContent =
                telegramUsername;
        }

        const currentAvatarUrl =
            profilePreviewImage
                ? profilePreviewImage.getAttribute("src")
                : "";

        if (!currentAvatarUrl) {
            if (profilePreviewInitials) {
                profilePreviewInitials.textContent =
                    initials;

                profilePreviewInitials.hidden =
                    false;
            }

            if (profileHeaderAvatar) {
                profileHeaderAvatar.textContent =
                    initials;
            }
        }
    }

    // ----------------------------------------
    // Render profile avatar
    // ----------------------------------------

    function renderProfileAvatar(
        avatarUrl,
        username = "Member"
    ) {
        const initials =
            profileCreateInitials(username);

        if (!avatarUrl) {
            if (profilePreviewImage) {
                profilePreviewImage.removeAttribute(
                    "src"
                );

                profilePreviewImage.hidden =
                    true;
            }

            if (profilePreviewInitials) {
                profilePreviewInitials.textContent =
                    initials;

                profilePreviewInitials.hidden =
                    false;
            }

            if (profileHeaderAvatar) {
                profileHeaderAvatar.innerHTML =
                    "";

                profileHeaderAvatar.textContent =
                    initials;
            }

            return;
        }

        if (profilePreviewImage) {
            profilePreviewImage.src =
                avatarUrl;

            profilePreviewImage.hidden =
                false;

            profilePreviewImage.onerror =
                () => {
                    profilePreviewImage.hidden =
                        true;

                    profilePreviewInitials.hidden =
                        false;

                    profilePreviewInitials.textContent =
                        initials;
                };
        }

        if (profilePreviewInitials) {
            profilePreviewInitials.hidden =
                true;
        }

        if (profileHeaderAvatar) {
            profileHeaderAvatar.innerHTML =
                "";

            const image =
                document.createElement("img");

            image.src =
                avatarUrl;

            image.alt =
                "Profile avatar";

            image.onerror =
                () => {
                    profileHeaderAvatar.innerHTML =
                        "";

                    profileHeaderAvatar.textContent =
                        initials;
                };

            profileHeaderAvatar.appendChild(
                image
            );
        }
    }

    // ----------------------------------------
    // Load profile
    // ----------------------------------------

    async function loadProfile() {
        if (profileMessage) {
            profileMessage.textContent =
                "Loading profile...";
        }

        try {
            const {
                data: userData,
                error: userError
            } = await supabaseClient.auth
                .getUser();

            if (
                userError ||
                !userData.user
            ) {
                window.location.href =
                    "login.html";

                return;
            }

            const user =
                userData.user;

            const metadata =
                user.user_metadata || {};

            const {
                data: profile,
                error: profileError
            } = await supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (profileError) {
                throw profileError;
            }

            const profileData =
                profile || {};

            const username =
                profileData.username ||
                metadata.username ||
                "Member";

            profileUsername.value =
                username;

            profileBio.value =
                profileData.bio || "";

            profileCountry.value =
                profileData.country || "";

            profileX.value =
                profileData.x_username || "";

            profileTelegram.value =
                profileData.telegram_username || "";

            const avatarUrl =
                profileData.avatar_url ||
                metadata.avatar_url ||
                "";

            renderProfileAvatar(
                avatarUrl,
                username
            );

            updateProfilePreview();

            if (profileMessage) {
                profileMessage.textContent =
                    "";
            }
        } catch (error) {
            console.error(
                "Profile loading error:",
                error
            );

            if (profileMessage) {
                profileMessage.textContent =
                    error.message ||
                    "Unable to load your profile.";
            }
        }
    }

    // ----------------------------------------
    // Live preview
    // ----------------------------------------

    const profileInputs = [
        profileUsername,
        profileBio,
        profileCountry,
        profileX,
        profileTelegram
    ];

    profileInputs.forEach((input) => {
        if (input) {
            input.addEventListener(
                "input",
                updateProfilePreview
            );
        }
    });

    // ----------------------------------------
    // Save profile
    // ----------------------------------------

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

            saveProfileButton.disabled =
                true;

            saveProfileButton.textContent =
                "Saving...";

            profileMessage.textContent =
                "Saving profile...";

            try {
                const {
                    data: userData,
                    error: userError
                } = await supabaseClient.auth
                    .getUser();

                if (
                    userError ||
                    !userData.user
                ) {
                    window.location.href =
                        "login.html";

                    return;
                }

                const user =
                    userData.user;

                const {
                    data: existingProfile,
                    error: existingProfileError
                } = await supabaseClient
                    .from("profiles")
                    .select(
                        "avatar_url, role, membership, points, missions, badges"
                    )
                    .eq("id", user.id)
                    .maybeSingle();

                if (existingProfileError) {
                    throw existingProfileError;
                }

                const profileInformation = {
                    id: user.id,

                    username,

                    bio:
                        profileBio.value.trim(),

                    country:
                        profileCountry.value.trim(),

                    x_username:
                        profileFormatSocialUsername(
                            profileX.value
                        ),

                    telegram_username:
                        profileFormatSocialUsername(
                            profileTelegram.value
                        ),

                    avatar_url:
                        existingProfile?.avatar_url ||
                        user.user_metadata
                            ?.avatar_url ||
                        "",

                    role:
                        existingProfile?.role ||
                        "Member",

                    membership:
                        existingProfile?.membership ||
                        "Free",

                    points:
                        existingProfile?.points || 0,

                    missions:
                        existingProfile?.missions || 0,

                    badges:
                        existingProfile?.badges || 0,

                    updated_at:
                        new Date().toISOString()
                };

                const {
                    error: saveError
                } = await supabaseClient
                    .from("profiles")
                    .upsert(
                        profileInformation,
                        {
                            onConflict: "id"
                        }
                    );

                if (saveError) {
                    throw saveError;
                }

                const {
                    error: metadataError
                } = await supabaseClient.auth
                    .updateUser({
                        data: {
                            username
                        }
                    });

                if (metadataError) {
                    console.warn(
                        "Username metadata was not updated:",
                        metadataError
                    );
                }

                updateProfilePreview();

                profileMessage.textContent =
                    "Profile saved successfully ✅";
            } catch (error) {
                console.error(
                    "Profile saving error:",
                    error
                );

                profileMessage.textContent =
                    error.message ||
                    "Unable to save your profile.";
            } finally {
                saveProfileButton.disabled =
                    false;

                saveProfileButton.textContent =
                    "Save Profile";
            }
        }
    );

    // ----------------------------------------
    // Avatar upload
    // ----------------------------------------

    if (
        avatarFile &&
        uploadAvatarButton &&
        avatarMessage
    ) {
        uploadAvatarButton.addEventListener(
            "click",
            async (event) => {
                event.preventDefault();

                const file =
                    avatarFile.files[0];

                if (!file) {
                    avatarMessage.textContent =
                        "Please select an image first.";

                    return;
                }

                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];

                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {
                    avatarMessage.textContent =
                        "Only JPG, PNG and WEBP images are allowed.";

                    return;
                }

                const maximumSize =
                    2 * 1024 * 1024;

                if (
                    file.size >
                    maximumSize
                ) {
                    avatarMessage.textContent =
                        "The image must be smaller than 2 MB.";

                    return;
                }

                uploadAvatarButton.disabled =
                    true;

                uploadAvatarButton.textContent =
                    "Uploading...";

                avatarMessage.textContent =
                    "Uploading profile photo...";

                try {
                    const {
                        data: userData,
                        error: userError
                    } = await supabaseClient.auth
                        .getUser();

                    if (
                        userError ||
                        !userData.user
                    ) {
                        window.location.href =
                            "login.html";

                        return;
                    }

                    const user =
                        userData.user;

                    const fileExtension =
                        file.name
                            .split(".")
                            .pop()
                            .toLowerCase();

                    const filePath =
                        `${user.id}/avatar.${fileExtension}`;

                    const {
                        error: uploadError
                    } = await supabaseClient.storage
                        .from("avatars")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl:
                                    "3600",

                                upsert:
                                    true,

                                contentType:
                                    file.type
                            }
                        );

                    if (uploadError) {
                        throw uploadError;
                    }

                    const {
                        data: publicUrlData
                    } = supabaseClient.storage
                        .from("avatars")
                        .getPublicUrl(
                            filePath
                        );

                    const avatarUrl =
                        `${publicUrlData.publicUrl}?v=${Date.now()}`;

                    const {
                        data: existingProfile,
                        error: profileReadError
                    } = await supabaseClient
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .maybeSingle();

                    if (profileReadError) {
                        throw profileReadError;
                    }

                    const username =
                        existingProfile?.username ||
                        user.user_metadata
                            ?.username ||
                        profileUsername.value
                            .trim() ||
                        "Member";

                    const {
                        error: profileUpdateError
                    } = await supabaseClient
                        .from("profiles")
                        .upsert(
                            {
                                id:
                                    user.id,

                                username,

                                bio:
                                    existingProfile?.bio ||
                                    profileBio.value.trim(),

                                country:
                                    existingProfile?.country ||
                                    profileCountry.value.trim(),

                                x_username:
                                    existingProfile?.x_username ||
                                    profileFormatSocialUsername(
                                        profileX.value
                                    ),

                                telegram_username:
                                    existingProfile
                                        ?.telegram_username ||
                                    profileFormatSocialUsername(
                                        profileTelegram.value
                                    ),

                                avatar_url:
                                    avatarUrl,

                                role:
                                    existingProfile?.role ||
                                    "Member",

                                membership:
                                    existingProfile
                                        ?.membership ||
                                    "Free",

                                points:
                                    existingProfile?.points ||
                                    0,

                                missions:
                                    existingProfile?.missions ||
                                    0,

                                badges:
                                    existingProfile?.badges ||
                                    0,

                                updated_at:
                                    new Date()
                                        .toISOString()
                            },
                            {
                                onConflict: "id"
                            }
                        );

                    if (profileUpdateError) {
                        throw profileUpdateError;
                    }

                    const {
                        error: metadataError
                    } = await supabaseClient.auth
                        .updateUser({
                            data: {
                                avatar_url:
                                    avatarUrl
                            }
                        });

                    if (metadataError) {
                        console.warn(
                            "Avatar metadata was not updated:",
                            metadataError
                        );
                    }

                    renderProfileAvatar(
                        avatarUrl,
                        username
                    );

                    avatarMessage.textContent =
                        "Profile photo uploaded successfully ✅";

                    avatarFile.value =
                        "";
                } catch (error) {
                    console.error(
                        "Avatar upload error:",
                        error
                    );

                    avatarMessage.textContent =
                        error.message ||
                        "Unable to upload the profile photo.";
                } finally {
                    uploadAvatarButton.disabled =
                        false;

                    uploadAvatarButton.textContent =
                        "Upload Photo";
                }
            }
        );
    }

    loadProfile();
}

// ----------------------------------------
// Logout
// ----------------------------------------

if (profileLogoutButton) {
    profileLogoutButton.addEventListener(
        "click",
        async () => {
            await supabaseClient.auth
                .signOut();

            window.location.href =
                "login.html";
        }
    );
}
