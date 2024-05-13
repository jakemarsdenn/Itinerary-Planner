window.addEventListener("DOMContentLoaded", function() {
    loadChecklist();
});


window.addEventListener("beforeunload", function() {
    saveChecklist();
});


class ChecklistMemento {
    constructor(checklistState) {
        this.checklistState = checklistState;
    }
}


function saveChecklist() {
    const checklistState = [];
    const checkboxes = document.querySelectorAll('.checkbox-wrapper');

    checkboxes.forEach(checkbox => {
        const checkboxInput = checkbox.querySelector('.inp-cbx');
        const checkboxLabel = checkbox.querySelector('.user-label-input');

        checklistState.push({
            checked: checkboxInput.checked,
            label: checkboxLabel.value
        });
    });

    const checklistMemento = new ChecklistMemento(checklistState);
    localStorage.setItem('checklistMemento', JSON.stringify(checklistMemento));
}


function loadChecklist() {
    const checklistMementoJson = localStorage.getItem('checklistMemento');

    if (checklistMementoJson) {
        const checklistMemento = JSON.parse(checklistMementoJson);
        const checklistState = checklistMemento.checklistState;

        const checklistContainer = document.querySelector('.checklist-container');
        checklistContainer.innerHTML = '';

        checklistState.forEach(item => {
            createCheckbox(item.checked, item.label);
        });
    }
}