document.addEventListener("DOMContentLoaded", function() {
    animateText();
});


document.addEventListener("DOMContentLoaded", function() {
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

document.addEventListener("DOMContentLoaded", function() {
    const checklistContainer = document.querySelector(".checklist-container");

    document.addEventListener("keyup", function(event) {
        const userLabelInput = event.target.closest(".user-label-input");
        if (!userLabelInput) return;

        if (event.key === "Enter") createNewCheckbox();
        else if ((event.key === "Delete" || event.key === "Backspace") && userLabelInput.value === "") deleteCurrentCheckbox(userLabelInput);
    });

    function createNewCheckbox() {
        const newCheckboxWrapper = document.createElement("div");
        newCheckboxWrapper.classList.add("checkbox-wrapper");

        const newCheckbox = document.createElement("input");
        newCheckbox.setAttribute("type", "checkbox");
        newCheckbox.classList.add("inp-cbx");
        newCheckbox.setAttribute("id", `cbx-${document.querySelectorAll(".checkbox-wrapper").length + 1}`);

        const newLabel = document.createElement("label");
        newLabel.setAttribute("for", `cbx-${document.querySelectorAll(".checkbox-wrapper").length + 1}`);
        newLabel.classList.add("cbx");

        const newLabelSpan1 = document.createElement("span");
        newLabelSpan1.innerHTML = `<svg viewBox="0 0 12 10" height="10px" width="12px"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg>`;

        const newLabelSpan2 = document.createElement("span");
        const newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("class", "user-label-input");
        newInput.setAttribute("placeholder", " ");
        newLabelSpan2.appendChild(newInput);

        newLabel.appendChild(newLabelSpan1);
        newLabel.appendChild(newLabelSpan2);

        newCheckboxWrapper.appendChild(newCheckbox);
        newCheckboxWrapper.appendChild(newLabel);

        checklistContainer.appendChild(newCheckboxWrapper);

        newInput.focus();

        newCheckbox.addEventListener("change", function() {
            console.log(this.checked ? "Checkbox checked" : "Checkbox unchecked");
        });
    }

    function deleteCurrentCheckbox(userLabelInput) {
        const currentCheckboxWrapper = userLabelInput.closest('.checkbox-wrapper');
        const originalCheckboxWrapper = document.querySelector('.checkbox-wrapper');

        if (currentCheckboxWrapper && currentCheckboxWrapper !== originalCheckboxWrapper) currentCheckboxWrapper.remove();
    }
});