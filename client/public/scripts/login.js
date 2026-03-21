window.onload = function () {
  const form = document.getElementById("loginForm");

  form.onsubmit = async function (e) {
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

      console.log("RESPONSE:", data);

      if (res.ok) {
        alert("Login successful!");
        window.location.href = "/dashboard";
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };
};