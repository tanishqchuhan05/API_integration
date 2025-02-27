// Get userId from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

if (!userId) {
    console.error("User ID not found in URL!");
} else {
    console.log("Fetching details for User ID:", userId);

    // Fetch User Details
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("user-name").textContent = user.name;
            document.getElementById("user-email").textContent = `📧 ${user.email}`;
            document.getElementById("user-phone").textContent = `📞 ${user.phone}`;
            document.getElementById("user-website").textContent = `🌐 ${user.website}`;
            document.getElementById("user-address").textContent =
                `🏠 ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`;
            document.getElementById("user-company").textContent = `🏢 ${user.company.name}`;
        })
        .catch(error => console.error("Error fetching user details:", error));

    // Fetch User's Posts
    fetchUserPosts();
}

// Fetch User's Posts
function fetchUserPosts() {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById("posts-container");
            postsContainer.innerHTML = "";

            // Fetch comments for all posts
            const promises = posts.map(post =>
                fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                    .then(response => response.json())
                    .then(comments => ({ post, comments }))
            );

            Promise.all(promises).then(results => {
                results.forEach(({ post, comments }) => {
                    createPostElement(post, comments, postsContainer);
                });
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
}

// Function to Create and Append Post Card
function createPostElement(post, comments, container) {
    const postCard = document.createElement("div");
    postCard.className = "col-md-6 mb-4";
    postCard.innerHTML = `
        <div class="card shadow-sm p-3">
            <div class="card-body">
                <h5 class="card-title" id="post-title-${post.id}">${post.title}</h5>
                <p class="card-text" id="post-body-${post.id}">${post.body}</p>
                <button class="btn btn-outline-primary btn-sm toggle-comments" data-post-id="${post.id}">
                    💬 <span class="comment-count">${comments.length}</span> Comments
                </button>
                <button class="btn btn-warning btn-sm edit-post" data-post-id="${post.id}">✏ Edit</button>
                <button class="btn btn-danger btn-sm delete-post" data-post-id="${post.id}">🗑 Delete</button>
                <div class="comments mt-3 d-none" id="comments-${post.id}"></div>
            </div>
        </div>
    `;

    container.appendChild(postCard);

    postCard.querySelector(".toggle-comments").addEventListener("click", function () {
        const postId = this.getAttribute("data-post-id");
        const commentsContainer = document.getElementById(`comments-${postId}`);
        if (commentsContainer.classList.contains("d-none")) {
            fetchComments(postId, commentsContainer);
            commentsContainer.classList.remove("d-none");
        } else {
            commentsContainer.classList.add("d-none");
        }
    });

    postCard.querySelector(".edit-post").addEventListener("click", function () {
        openEditModal(post.id);
    });

    postCard.querySelector(".delete-post").addEventListener("click", function () {
        deletePost(post.id, postCard);
    });
}

// Fetch and Display Comments
function fetchComments(postId, container) {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            container.innerHTML = ""; // Clear previous comments

            comments.forEach(comment => {
                addCommentToUI(comment, container);
            });
        });
}

// Function to Add Comment to UI
function addCommentToUI(comment, container) {
    const commentElement = document.createElement("div");
    commentElement.className = "border p-2 mb-2 bg-light rounded";
    commentElement.innerHTML = `
        <strong>${comment.name} (${comment.email})</strong>
        <p class="comment-text">${comment.body}</p>
    `;

    container.appendChild(commentElement);
}

// Delete Post
function deletePost(postId, postElement) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            postElement.remove();
            alert("Post Deleted Successfully!");
        }
    });
}

// Open Edit Post Modal
function openEditModal(postId) {
    const postTitle = document.getElementById(`post-title-${postId}`).textContent;
    const postBody = document.getElementById(`post-body-${postId}`).textContent;

    document.getElementById("edit-post-title").value = postTitle;
    document.getElementById("edit-post-body").value = postBody;
    document.getElementById("save-edit-btn").setAttribute("data-post-id", postId);

    const editModal = new bootstrap.Modal(document.getElementById("editPostModal"));
    editModal.show();
}

// Save Edited Post
document.getElementById("save-edit-btn").addEventListener("click", function () {
    const postId = this.getAttribute("data-post-id");
    const updatedTitle = document.getElementById("edit-post-title").value;
    const updatedBody = document.getElementById("edit-post-body").value;

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, body: updatedBody })
    })
    .then(response => response.json())
    .then(updatedPost => {
        document.getElementById(`post-title-${postId}`).textContent = updatedPost.title;
        document.getElementById(`post-body-${postId}`).textContent = updatedPost.body;
        bootstrap.Modal.getInstance(document.getElementById("editPostModal")).hide();
        alert("Post Updated Successfully!");
    })
    .catch(error => console.error("Error updating post:", error));
});

// ADD NEW POST FUNCTIONALITY
document.addEventListener("DOMContentLoaded", function () {
    const addPostBtn = document.getElementById("add-post-btn");

    addPostBtn.addEventListener("click", function () {
        const postTitle = prompt("Enter Post Title:");
        const postBody = prompt("Enter Post Content:");

        if (postTitle && postBody) {
            addNewPost(postTitle, postBody);
        }
    });
});

function addNewPost(title, body) {
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title,
            body: body,
            userId: userId,
        }),
    })
    .then(response => response.json())
    .then(newPost => {
        createPostElement(newPost, [], document.getElementById("posts-container"));
        alert("Post Added Successfully!");
    })
    .catch(error => console.error("Error adding post:", error));
}
