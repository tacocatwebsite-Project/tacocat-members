function formatSocialUsername(value) {

    const cleanedValue =
        (value || "").trim();

    if (!cleanedValue) {
        return "";
    }

    return cleanedValue.startsWith("@")
        ? cleanedValue
        : `@${cleanedValue}`;
}

function createInitials(username) {

    const cleanedUsername =
        (username || "").trim();

    if (!cleanedUsername) {
        return "TC";
    }

    const words =
        cleanedUsername
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

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    return new Date(dateString)
        .toLocaleDateString();
}
