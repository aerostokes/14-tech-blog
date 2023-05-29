const form = document.querySelector("#editpost-form");
const postId = form.getAttribute("data-PostId");
const deleteBtn = document.querySelector("#delete-btn");

const editPost = async (e) => {
  e.preventDefault();
  const response = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: document.querySelector("#title-input").value,
      contents: document.querySelector("#contents-input").value,
    }),
  });
  if (response.status === 200) {
    location.reload()
  } else {
    alert("Error editing post")
  }
}

const deletePost = async () => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 200) {
    location.assign("/dashboard");
  } else {
    alert("Error deleting post")
  }
}

form.addEventListener("submit", editPost);
deleteBtn.addEventListener("click", deletePost);