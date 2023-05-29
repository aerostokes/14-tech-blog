const form = document.querySelector("#post-form");

const addPost = async (e) => {
  e.preventDefault();
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: document.querySelector("#title-input").value,
      contents: document.querySelector("#contents-input").value,
    }),
  });
  if (response.status === 200) {
    location.reload()
  } else {
    alert("Error adding post")
  }
}

form.addEventListener("submit", addPost);
