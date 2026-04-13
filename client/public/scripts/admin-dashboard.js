document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("No token found");
    window.location.href = "/index.html";
    return;
  }

  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    if (!res.ok) {
      alert("Not authorized");
      return;
    }

    if (user.role !== "admin") {
      alert("Access denied. Admins only.");
      window.location.href = "/dashboard.html";
      return;
    }

    document.getElementById("welcomeName").textContent = user.username;
    document.getElementById("displayName").textContent = user.username;
    document.getElementById("displayEmail").textContent = user.email || "";
    document.getElementById("displayRole").textContent = user.role;

    document.getElementById("updateName").value = user.username;
    document.getElementById("updateEmail").value = user.email || "";

  } catch (err) {
    console.error("Error loading admin details:", err);
  }

  const profileForm = document.getElementById("profileForm");

  // Update the profile without refreshing the page

  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentToken = localStorage.getItem("token");

      const updatedData = {
        username: document.getElementById("updateName").value,
        email: document.getElementById("updateEmail").value,
        bio: "" 
      };

      try {
        const res = await fetch("/api/auth/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`
          },
          body: JSON.stringify(updatedData)
        });

        const data = await res.json();

        if (res.ok) {
          alert("Admin Profile updated!");

          document.getElementById("displayName").textContent = updatedData.username;
          document.getElementById("displayEmail").textContent = updatedData.email;
          document.getElementById("welcomeName").textContent = updatedData.username;
        } else {
          alert(data.message || "Update failed");
        }
      } catch (err) {
        console.error("Update Error:", err);
        alert("Server error. Check the console.");
      }
    });
  }
});