document.addEventListener("DOMContentLoaded", function() {
    animateText();
});

function animateText() {
    const text = document.getElementById("title");
    const letters = text.textContent.split("");
    text.textContent = ""; // Clear the text content
    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${index * 100}ms`; // Delay each letter's animation
        span.classList.add("loading"); // Apply the loading animation class
        text.appendChild(span);
    });
}
