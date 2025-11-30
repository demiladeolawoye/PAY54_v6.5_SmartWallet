// PAY54 v6.5 – main.js
// Handles login page, simple localStorage session and help toast.

(function () {
  const loginForm = document.getElementById("loginForm");
  const toast = document.getElementById("authToast");
  const helpButton = document.getElementById("helpButton");

  function showToast(message, type = "success") {
    if (!toast) return;
    toast.textContent = message;
    toast.className = "toast toast-visible " + (type === "error" ? "toast-error" : "toast-success");
    setTimeout(() => {
      toast.classList.remove("toast-visible");
    }, 2600);
  }

  if (helpButton) {
    helpButton.addEventListener("click", () => {
      showToast("For this demo: any email/phone + any 4-digit PIN will sign you in.");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("loginIdentifier").value.trim();
      const pin = document.getElementById("loginPin").value.trim();

      if (!id || pin.length !== 4) {
        showToast("Enter a valid email/phone and a 4-digit PIN.", "error");
        return;
      }

      // Very simple demo "session"
      const nameGuess = id.split("@")[0].split(" ")[0];
      const displayName =
        nameGuess && nameGuess.length > 1 ? nameGuess[0].toUpperCase() + nameGuess.slice(1) : "Demi";

      localStorage.setItem(
        "pay54_session",
        JSON.stringify({
          identifier: id,
          displayName,
          lastLogin: new Date().toISOString(),
        })
      );

      showToast("Sign-in successful. Redirecting…");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 900);
    });
  }
})();
