const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log("SERVER RESPONSE:", data);

    if (res.ok) {
    
      localStorage.setItem("token", data.token);
      
      alert("Login successful!");
      
      if (data.role === "admin") {
          window.location.href = "/admin-dashboard";
      } else {
          window.location.href = "/dashboard";
      }
    } else {
      alert(data.message || "Login failed.");
    }

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Could not connect to the server.");
  }
});