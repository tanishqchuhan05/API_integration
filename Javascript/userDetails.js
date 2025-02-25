// Get userId from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

if (!userId) {
    console.error("User ID not found in URL!");
} else {
    console.log("Fetching details for User ID:", userId);

    // Fetch User Details
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = `📧 ${user.email}`;
            document.getElementById('user-phone').textContent = `📞 ${user.phone}`;
            document.getElementById('user-website').textContent = `🌐 ${user.website}`;
            document.getElementById('user-address').textContent =
                `🏠 ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`;
            document.getElementById('user-company').textContent = `🏢 ${user.company.name}`;
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
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = '';

            posts.forEach(post => {
                fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                    .then(response => response.json())
                    .then(comments => {
                        createPostElement(post, comments, postsContainer);
                    });
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
}

// Function to Create and Append Post Card
function createPostElement(post, comments, container) {
    const postCard = document.createElement('div');
    postCard.className = "col-md-6 mb-4";
    postCard.innerHTML = `
        <div class="card shadow-sm p-3">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
                <button class="btn btn-outline-primary btn-sm toggle-comments" data-post-id="${post.id}">
                    💬 <span class="comment-count">${comments.length}</span> Comments
                </button>
                <button class="btn btn-danger btn-sm delete-post" data-post-id="${post.id}">🗑 Delete Post</button>
                <div class="comments mt-3 d-none" id="comments-${post.id}"></div>
            </div>
        </div>
    `;

    container.appendChild(postCard);

    postCard.querySelector('.toggle-comments').addEventListener('click', function () {
        const postId = this.getAttribute('data-post-id');
        const commentsContainer = document.getElementById(`comments-${postId}`);
        if (commentsContainer.classList.contains('d-none')) {
            fetchComments(postId, commentsContainer);
            commentsContainer.classList.remove('d-none');
        } else {
            commentsContainer.classList.add('d-none');
        }
    });

    postCard.querySelector('.delete-post').addEventListener('click', function () {
        deletePost(post.id, postCard);
    });
}

// Fetch and Display Comments
function fetchComments(postId, container) {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            container.innerHTML = `
                <input type="text" id="new-comment-${postId}" class="form-control mb-2" placeholder="Add a comment">
                <button class="btn btn-success btn-sm add-comment" data-post-id="${postId}">➕ Add Comment</button>
            `;

            comments.forEach(comment => {
                addCommentToUI(comment, container);
            });

            container.querySelector('.add-comment').addEventListener('click', function () {
                const commentInput = document.getElementById(`new-comment-${postId}`);
                addComment(postId, commentInput.value, container);
            });
        });
}

// Add New Comment
function addComment(postId, commentBody, container) {
    if (!commentBody.trim()) {
        alert("Comment cannot be empty!");
        return;
    }

    fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify({
            postId: postId,
            body: commentBody,
            email: "user@example.com",
            name: "New User"
        }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.json())
    .then(comment => {
        addCommentToUI(comment, container);
        document.getElementById(`new-comment-${postId}`).value = '';

        // 🆕 Update comment count dynamically
        const commentCountElement = document.querySelector(`.toggle-comments[data-post-id="${postId}"] .comment-count`);
        if (commentCountElement) {
            commentCountElement.textContent = parseInt(commentCountElement.textContent) + 1;
        }
    });
}

// Function to Add Comment to UI
function addCommentToUI(comment, container) {
    const commentElement = document.createElement('div');
    commentElement.className = "border p-2 mb-2 bg-light rounded";
    commentElement.innerHTML = `
        <strong>${comment.name} (${comment.email})</strong>
        <p class="comment-text">${comment.body}</p>
        <button class="btn btn-warning btn-sm edit-comment" data-comment-id="${comment.id}">✏ Edit</button>
        <button class="btn btn-danger btn-sm delete-comment" data-comment-id="${comment.id}">🗑 Delete</button>
    `;

    container.appendChild(commentElement);

    commentElement.querySelector('.edit-comment').addEventListener('click', function () {
        editComment(comment.id, commentElement);
    });

    commentElement.querySelector('.delete-comment').addEventListener('click', function () {
        deleteComment(comment.id, commentElement);
    });
}

// Edit Comment
function editComment(commentId, commentElement) {
    const newComment = prompt("Edit your comment:", commentElement.querySelector('.comment-text').textContent);
    if (newComment) {
        fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify({ body: newComment }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        })
        .then(() => {
            commentElement.querySelector('.comment-text').textContent = newComment;
            console.log("Comment Updated:", newComment);
        });
    }
}

// Delete Comment
function deleteComment(commentId, commentElement) {
    fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            commentElement.remove();
            console.log("Comment Deleted:", commentId);

            // 🆕 Update comment count dynamically
            const postId = commentElement.closest('.comments').id.split('-')[1];
            const commentCountElement = document.querySelector(`.toggle-comments[data-post-id="${postId}"] .comment-count`);
            if (commentCountElement) {
                commentCountElement.textContent = Math.max(0, parseInt(commentCountElement.textContent) - 1);
            }
        }
    })
    .catch(error => console.error("Error deleting comment:", error));
}

// Delete Post
function deletePost(postId, postElement) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            postElement.remove();
            console.log("Post Deleted:", postId);
        }
    })
    .catch(error => console.error("Error deleting post:", error));
}

// Add New Post Functionality
document.getElementById('add-post-btn').addEventListener('click', function () {
    const postTitle = prompt("Enter Post Title:");
    const postBody = prompt("Enter Post Content:");

    if (!postTitle || !postBody) {
        alert("Title and Content cannot be empty!");
        return;
    }

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ userId, title: postTitle, body: postBody }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    .then(response => response.json())
    .then(post => {
        createPostElement(post, [], document.getElementById('posts-container'));
    });
});
