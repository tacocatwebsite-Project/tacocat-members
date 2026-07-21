const profileForm =
    document.getElementById("profileForm");

const profileLogoutButton =
    document.getElementById("logoutButton");

if (profileForm) {
    const profileUsername =
        document.getElementById(
            "profileUsername"
        );

    const profileBio =
        document.getElementById(
            "profileBio"
        );

    const profileCountry =
        document.getElementById(
            "profileCountry"
        );

    const profileX =
        document.getElementById(
            "profileX"
        );

    const profileTelegram =
        document.getElementById(
            "profileTelegram"
        );

    const profileMessage =
        document.getElementById(
            "profileMessage"
        );

    const saveProfileButton =
        document.getElementById(
            "saveProfileButton"
        );

    const profilePreviewUsername =
        document.getElementById(
            "profilePreviewUsername"
        );

    const profilePreviewBio =
        document.getElementById(
            "profilePreviewBio"
        );

    const profilePreviewCountry =
        document.getElementById(
            "profilePreviewCountry"
        );

    const profilePreviewX =
        document.getElementById(
            "profilePreviewX"
        );

    const profilePreviewTelegram =
        document.getElementById(
            "profilePreviewTelegram"
        );

    function updateProfilePreview() {
        const username =
            profileUsername.value.trim() ||
            "Member";

        const bio =
            profileBio.value.trim() ||
            "No biography added yet.";

        const country =
            profileCountry.value.trim() ||
            "Not added";

        const xUsername =
            formatSocialUsername(
                profileX.value
            ) || "Not added";

        const telegramUsername =
            formatSocialUsername(
                profileTelegram.value
            ) || "Not added";

        const initials =
            createInitials(username);

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

        const previewImage =
            document.getElementById(
                "profilePreviewImage"
            );

        const previewInitials =
            document.getElementById(
                "profilePreviewInitials"
            );

        const currentAvatarUrl =
            previewImage
                ? previewImage.getAttribute("src")
                : "";

        if (!currentAvatarUrl) {
            if (previewInitials) {
                previewInitials.textContent =
                    initials;

                previewInitials.hidden = false;
            }

            const profileHeaderAvatar =
                document.getElementById(
                    "profileHeaderAvatar"
                );

            if (profileHeaderAvatar) {
                profileHeaderAvatar.textContent =
                    initials;
            }
        }
    }

    async function loadProfile() {
        profileMessage.textContent =
            "Loading profile...";

        const { data, error } =
            await supabaseClient.auth.getUser();

        if (error || !data.user) {
            window.location.href =
                "login.html";
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
            profileMessage.textContent =
                profileError.message;
            return;
        }

        const metadata =
            user.user_metadata || {};

        const profileData =
            profile || metadata;

        profileUsername.value =
            profileData.username || "";

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

        renderProfileAvatar(avatarUrl);

        updateProfilePreview();

        profileMessage.textContent = "";
    }

    function renderProfileAvatar(
        avatarUrl
    ) {
        const previewImage =
            document.getElementById(
                "profilePreviewImage"
            );

        const previewInitials =
            document.getElementById(
                "profilePreviewInitials"
            );

        const headerAvatar =
            document.getElementById(
                "profileHeaderAvatar"
            );

        if (!avatarUrl) {
            return;
        }

        if (previewImage) {
            previewImage.src =
                avatarUrl;

            previewImage.hidden =
                false;
        }

        if (previewInitials) {
            previewInitials.hidden =
                true;
        }

        if (headerAvatar) {
            headerAvatar.innerHTML = "";

            const image =
                document.createElement("img");

            image.src = avatarUrl;
            image.alt = "Profile avatar";

            headerAvatar.appendChild(image);
        }
    }

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
                data: existingProfile
            } = await supabaseClient
                .from("profiles")
                .select("avatar_url")
                .eq("id", user.id)
                .maybeSingle();

            const {
                error: saveError
            } = await supabaseClient
                .from("profiles")
                .upsert({
                    id: user.id,
                    username,
                    bio:
                        profileBio.value.trim(),
                    country:
                        profileCountry.value.trim(),
                    x_username:
                        formatSocialUsername(
                            profileX.value
                        ),
                    telegram_username:
                        formatSocialUsername(
                            profileTelegram.value
                        ),
                    avatar_url:
                        existingProfile?.avatar_url ||
                        user.user_metadata
                            ?.avatar_url ||
                        "",
                    updated_at:
                        new Date().toISOString()
                });

            if (saveError) {
                profileMessage.textContent =
                    saveError.message;

                saveProfileButton.disabled =
                    false;

                saveProfileButton.textContent =
                    "Save Profile";

                return;
            }

            updateProfilePreview();

            profileMessage.textContent =
                "Profile saved successfully ✅";

            saveProfileButton.disabled =
                false;

            saveProfileButton.textContent =
                "Save Profile";
        }
    );

    loadProfile();
}

// ----------------------
// Avatar Upload
// ----------------------

const avatarFile =
    document.getElementById("avatarFile");

const uploadAvatarButton =
    document.getElementById(
        "uploadAvatarButton"
    );

const avatarMessage =
    document.getElementById(
        "avatarMessage"
    );

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

            if (file.size > maximumSize) {
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
                        cacheControl: "3600",
                        upsert: true,
                        contentType:
                            file.type
                    }
                );

            if (uploadError) {
                avatarMessage.textContent =
                    uploadError.message;

                uploadAvatarButton.disabled =
                    false;

                uploadAvatarButton.textContent =
                    "Upload Photo";

                return;
            }

            const {
                data: publicUrlData
            } = supabaseClient.storage
                .from("avatars")
                .getPublicUrl(filePath);

            const avatarUrl =
                `${publicUrlData.publicUrl}?v=${Date.now()}`;

            const {
                error: profileUpdateError
            } = await supabaseClient
                .from("profiles")
                .upsert({
                    id: user.id,
                    avatar_url: avatarUrl,
                    updated_at:
                        new Date().toISOString()
                });

            if (profileUpdateError) {
                avatarMessage.textContent =
                    profileUpdateError.message;

                uploadAvatarButton.disabled =
                    false;

                uploadAvatarButton.textContent =
                    "Upload Photo";

                return;
            }

            await supabaseClient.auth
                .updateUser({
                    data: {
                        avatar_url:
                            avatarUrl
                    }
                });

            const previewImage =
                document.getElementById(
                    "profilePreviewImage"
                );

            const previewInitials =
                document.getElementById(
                    "profilePreviewInitials"
                );

            if (previewImage) {
                previewImage.src =
                    avatarUrl;

                previewImage.hidden =
                    false;
            }

            if (previewInitials) {
                previewInitials.hidden =
                    true;
            }

            const headerAvatar =
                document.getElementById(
                    "profileHeaderAvatar"
                );

            if (headerAvatar) {
                headerAvatar.innerHTML =
                    "";

                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    avatarUrl;

                image.alt =
                    "Profile avatar";

                headerAvatar.appendChild(
                    image
                );
            }

            avatarMessage.textContent =
                "Profile photo uploaded successfully ✅";

            avatarFile.value = "";

            uploadAvatarButton.disabled =
                false;

            uploadAvatarButton.textContent =
                "Upload Photo";
        }
    );
}

if (profileLogoutButton) {
    profileLogoutButton.addEventListener(
        "click",
        async () => {
            await supabaseClient.auth.signOut();

            window.location.href =
                "login.html";
        }
    );
}
