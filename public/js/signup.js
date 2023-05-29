const form = document.querySelector("#signup-form");
const password = document.querySelector("#password-input");
const confirm = document.querySelector("#confirm-input");


const login = async (e) => {
  e.preventDefault();
  if (password.value !== confirm.value) {
    alert("Passwords must match")
  } else {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: document.querySelector("#username-input").value,
        password: document.querySelector("#password-input").value,
      }),
    });
    if (response.status === 200) {
      window.location.assign("/dashboard")
    } else {
      alert("Error signing up")
    }
  }
}

form.addEventListener("submit", login);
