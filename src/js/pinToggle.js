function togglePIN(id, icon) {
    const field = document.getElementById(id);

    if (field.type === "password") {
        field.type = "text";
        icon.style.opacity = "1";
    } else {
        field.type = "password";
        icon.style.opacity = "0.6";
    }
}
