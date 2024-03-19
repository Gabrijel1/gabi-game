document.addEventListener("DOMContentLoaded", function () {
  // Add an event listener to a button with the id "startGameBtn"
  const startGameBtn = document.getElementById("startGameBtn");
  startGameBtn.addEventListener("click", function () {
    // Redirect to the game page when the button is clicked
    window.location.href = "html/game.html";
  });
});
