document.addEventListener("DOMContentLoaded", function() {
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


document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        createCheckbox();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteCheckbox();
    }
});


function createCheckbox() {
    const checklistContainer = document.querySelector('.checklist-container');
    const focusedCheckbox = document.activeElement.closest('.checkbox-wrapper');
    const newCheckboxWrapper = document.createElement('div');

    newCheckboxWrapper.classList.add('checkbox-wrapper');

    newCheckboxWrapper.innerHTML = `
        <input type="checkbox" id="cbx-${Date.now()}" class="inp-cbx" />
        <label for="cbx-${Date.now()}" class="cbx">
            <span><svg viewBox="0 0 12 10" height="10px" width="12px"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span>
            <input type="text" class="user-label-input" value="" placeholder="activity" />
        </label>
    `;

    if (focusedCheckbox) {
        checklistContainer.insertBefore(newCheckboxWrapper, focusedCheckbox.nextSibling);
    } else {
        checklistContainer.appendChild(newCheckboxWrapper);
    }

    const newLabelInput = newCheckboxWrapper.querySelector('.user-label-input');
    newLabelInput.focus();
}


function deleteCheckbox() {
    const focusedCheckbox = document.activeElement.closest('.checkbox-wrapper');

    if (focusedCheckbox && !focusedCheckbox.isSameNode(document.querySelector('.checkbox-wrapper'))) {
        const previousCheckbox = focusedCheckbox.previousElementSibling;
        focusedCheckbox.remove();

        if (previousCheckbox) {
            const inputLabel = previousCheckbox.querySelector('.user-label-input');
            inputLabel.focus();
        }
    }
}






