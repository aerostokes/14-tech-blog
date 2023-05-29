const form = document.querySelector("#login-form");

const login = async (e) => {
  e.preventDefault();
  const response = await fetch("/api/users/login", {
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
    alert("Wrong username/password")
  }
}

form.addEventListener("submit", login);
