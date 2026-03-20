const form = document.getElementById("loginForm");
const errorText = document.getElementById("errorText");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  errorText.innerText = "";

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
        console.log("Login successful!");
        // Saving JWT token to browser
        localStorage.setItem("token", data.token);

        //Checking user role to send them to right dashboard
        if (data.role === "admin") {
            window.location.href = "/admin-dashboard";
        } else {
            window.location.href = "/dashboard";
        }
        
        } else {
        errorText.innerText = data.message || data.error || "Login failed. Please try again.";
        }
  } catch (error) {
    console.error("Something went wrong", error);
    errorText.innerText = "Could not connect to the server.";
  }
});