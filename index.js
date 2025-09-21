document.querySelector(".app").innerHTML = "<div><ul class=films></ul></div>"
let currentMovie = null;

fetch("http://localhost:3000/films")
  .then((response) => response.json())
  .then((films) => {
    const filmsList = document.querySelector(".films");
    films.forEach((film) => {
      const listItem = document.createElement("li");
      listItem.textContent = film.title;
      listItem.addEventListener("click", () => {
        currentMovie = film;
        displayMovieDetails(film);
      });
      filmsList.appendChild(listItem);
    });
  });

function displayMovieDetails(movie) {
  const movieDetails = document.getElementById('movie-details');
  movieDetails.innerHTML = `<div id="image"><img src="${movie.poster}" alt="${movie.title} Poster"></div>
      <div class=""><h2>${movie.title}</h2>
      <p><strong>Runtime</strong>: ${movie.runtime} minutes</p>     
      <p><strong>Description:</strong> ${movie.description}</p>      
      <p><strong>Showtime:</strong> ${movie.showtime}</p>
      <p><strong>Available Tickets:</strong> ${movie.capacity - movie.tickets_sold}</p></div>
    `;
  currentMovie = movie;
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/films/1')
    .then(response => response.json())
    .then(movie => {
      currentMovie = movie;
      displayMovieDetails(movie);
    });
});

document.querySelector(".app").innerHTML += "<div id=movie-details></div>"
document.querySelector(".app").innerHTML += "<button id=buy-ticket>Buy Ticket</button>"

document.getElementById('buy-ticket').addEventListener('click', () => {
  if (!currentMovie) return;

  const availableTickets = currentMovie.capacity - currentMovie.tickets_sold;
  if (availableTickets > 0) {
    currentMovie.tickets_sold += 1;
    fetch(`http://localhost:3000/films/${currentMovie.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: currentMovie.tickets_sold })
    })
      .then(response => response.json())
      .then(updatedMovie => {
        currentMovie = updatedMovie;
        displayMovieDetails(updatedMovie);
        alert('Ticket purchased successfully');
      });
  } else {
    alert('Sorry, no tickets available.');
  }
});
