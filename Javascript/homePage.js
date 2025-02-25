// Get the user container
const userContainer = document.getElementById('user-container');

fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(users => {
        users.forEach(user => {
            const card = document.createElement('div');
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
                <div class="card text-center shadow border-0 rounded-3 p-3">
                    <div class="card-body">
                        <div class="mb-3">
                            <i class="bi bi-person-circle fs-1 text-secondary"></i>
                        </div>
                        <h5 class="card-title text-primary fw-bold">${user.username}</h5>
                        <button class="btn btn-outline-primary w-100 rounded-pill" 
                            onclick="window.location.href = 'userDetail.html?userId=${user.id}'">
                            View Details
                        </button>
                    </div>
                </div>
            `;
            userContainer.appendChild(card);
        });
    })
    .catch(error => console.log("Error fetching users:", error));
