const form = document.querySelector("#comment-form");

const addComment = async (e) => {
  e.preventDefault();
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      PostId: form.getAttribute("data-PostId"),
      contents: document.querySelector("#comment-input").value,
    }),
  });
  if (response.status === 200) {
    location.reload()
  } else {
    alert("Error posting comment")
  }
}

form.addEventListener("submit", addComment);
