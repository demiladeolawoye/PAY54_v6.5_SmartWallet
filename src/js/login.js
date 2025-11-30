// PAY54 v6.5 Login Handler

document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const id = document.getElementById("loginIdentifier").value.trim();
    const pin = document.getElementById("loginPin").value.trim();

    const user = JSON.parse(localStorage.getItem("pay54_user"));

    if(!user){
        alert("No PAY54 account found. Please create one.");
        window.location.href = "signup.html";
        return;
    }

    if(user.id === id && user.pin === pin){
        // Login successful
        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect login details");
    }
});
