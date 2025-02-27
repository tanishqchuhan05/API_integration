#API Integration Assignment

#Overview

This project integrates with the JSONPlaceholder API to fetch and display user details, posts, and comments. It also provides functionalities to add, edit, and delete posts.

#API Endpoints

The following API endpoints are used in this project:

#Resources:

/posts → 100 posts

/comments → 500 comments

/albums → 100 albums

/photos → 5000 photos

/users → 10 users

Features

Fetch All Users: Displays all users in a card-based UI.

View User Details: Clicking on a user shows their detailed profile.

Fetch and Display Posts: Shows posts related to a particular user.

Fetch and Show Comments: Displays comments for each post.

Add New Post: Users can create a new post.

Edit Post: Users can edit the title and body of a post.

Delete Post: Users can remove a post.

How It Works

Fetch All Users: The app fetches all users from /users and displays them.

User Detail Page: Clicking on a user fetches their profile and posts from /posts?userId={id}.

View Comments: Clicking on "Comments" fetches comments using /comments?postId={id}.

Add a New Post: Posts new data to /posts.

Edit a Post: Updates an existing post using /posts/{id}.

Delete a Post: Deletes a post using /posts/{id}.


Technologies Used:

HTML, CSS Bootstrap for UI

JavaScript for API integration and interactions

JSONPlaceholder API as a mock backend


Setup Instructions

Clone or download the project.

Open homePage.html in a browser.

Navigate to the user list and select a user to see their details and posts.


Notes

The API is mock data, so changes (add/edit/delete) won't persist.

All functionalities work without a backend, using only the API.

