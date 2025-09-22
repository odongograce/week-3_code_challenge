document.querySelector(".app").innerHTML = `<ul class="films"></ul>`;

let currentMovie = null;
fetch("http://localhost:3000/films")
  .then(res => res.json())
  .then(films => {
    const filmList = document.querySelector(".films");

    films.forEach(film => {
      const listItem = document.createElement("li");

      const titleSpan = document.createElement("span");
      titleSpan.textContent = film.title;
      titleSpan.style.cursor = "pointer";

      titleSpan.addEventListener("click", () => {
        currentMovie = film;
        displayMovieDetails(film);
      });

    
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", () => {
        if (confirm(`Are you sure you want to delete "${film.title}"?`)) {
          fetch(`http://localhost:3000/films/${film.id}`, { method: "DELETE" })
            .then(res => {
              if (res.ok) {
                listItem.remove();
                if (currentMovie && currentMovie.id === film.id) {
                  document.getElementById("movie-details").innerHTML = "<p>Movie deleted.</p>";
                }
              }
            });
        }
      });

      listItem.appendChild(titleSpan);
      listItem.appendChild(deleteBtn);
      filmList.appendChild(listItem);
    });
  });


function displayMovieDetails(movie) {
  const movieDetails = document.getElementById('movie-details');
  movieDetails.innerHTML = `
    <div id="image"><img src="${movie.poster}" alt="${movie.title} Poster" style="max-width:50%;"></div>
    <div>
      <h2>${movie.title}</h2>
      <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
      <p><strong>Description:</strong> ${movie.description}</p>
      <p><strong>Showtime:</strong> ${movie.showtime}</p>
      <p><strong>Available Tickets:</strong> ${movie.capacity - movie.tickets_sold}</p>
      <button id="buy-ticket">Buy Ticket</button>
    </div>
  `;

  document.getElementById('buy-ticket').addEventListener('click', () => {
    if (!movie) return;
    const availableTickets = movie.capacity - movie.tickets_sold;
    if (availableTickets > 0) {
      movie.tickets_sold += 1;
      fetch(`http://localhost:3000/films/${movie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets_sold: movie.tickets_sold })
      })
      .then(res => res.json())
      .then(updatedMovie => {
        currentMovie = updatedMovie;
        displayMovieDetails(updatedMovie);
        alert('Ticket purchased successfully');
      });
    } else {
      alert('Sorry, no tickets available.');
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/films/1')
    .then(res => res.json())
    .then(movie => {
      currentMovie = movie;
      displayMovieDetails(movie);
    });
});
