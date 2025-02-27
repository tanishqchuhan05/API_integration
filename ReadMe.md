# **API Integration Assignment**

## **Overview**
This project integrates with the JSONPlaceholder API to fetch and display user details, posts, and comments. It also provides functionalities to add, edit, and delete posts.

## **API Endpoints**
The following API endpoints are used in this project:

### **Resources**
- **/posts** → 100 posts  
- **/comments** → 500 comments   
- **/users** → 10 users  

### **Routes**
All HTTP methods are supported. You can use HTTP or HTTPS for your requests.  

- `GET /posts`
- `GET /posts/1`
- `GET /posts/1/comments`
- `GET /comments?postId=1`
- `POST /posts`
- `PUT /posts/1`
- `PATCH /posts/1`
- `DELETE /posts/1`

## **Features**
- **Fetch All Users**: Displays all users in a card-based UI.  
- **View User Details**: Clicking on a user shows their detailed profile.  
- **Fetch and Display Posts**: Shows posts related to a particular user.  
- **Fetch and Show Comments**: Displays comments for each post.  
- **Add New Post**: Users can create a new post.  
- **Edit Post**: Users can edit the title and body of a post.  
- **Delete Post**: Users can remove a post.  

## **How It Works**
1. **Fetch All Users**: The app fetches all users from `/users` and displays them.  
2. **User Detail Page**: Clicking on a user fetches their profile and posts from `/posts?userId={id}`.  
3. **View Comments**: Clicking on "Comments" fetches comments using `/comments?postId={id}`.  
4. **Add a New Post**: Posts new data to `/posts`.  
5. **Edit a Post**: Updates an existing post using `/posts/{id}`.  
6. **Delete a Post**: Deletes a post using `/posts/{id}`.  

## **Technologies Used**
- **HTML, CSS, Bootstrap** for UI  
- **JavaScript** for API integration and interactions  
- **JSONPlaceholder API** as a mock backend  

## **Setup Instructions**
1. Clone or download the project.  
2. Open `homePage.html` in a browser.  
3. Navigate to the user list and select a user to see their details and posts.  

## **Notes**
- The API is mock data, so changes (add/edit/delete) won't persist.  
- All functionalities work without a backend, using only the API.  
