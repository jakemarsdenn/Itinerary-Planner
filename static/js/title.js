window.addEventListener("DOMContentLoaded", function() {
    console.log("Animating text and displaying local date");
    animateText();
    displayLocalDate();
});

function animateText() {
    const text = document.getElementById("title");
    const letters = text.textContent.split("");
    text.textContent = "";
    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${index * 100}ms`;
        span.classList.add("loading");
        text.appendChild(span);
    });
}

function displayLocalDate() {
    const dateElement = document.getElementById("date");
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = currentDate.toLocaleDateString(undefined, options);
    const parts = date.split(' ');
    parts[2] += ',';
    const formattedDate = parts.join(' ');
    dateElement.textContent = formattedDate;
}
