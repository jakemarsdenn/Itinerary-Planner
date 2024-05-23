document.addEventListener('DOMContentLoaded', function() {
    try {
        initChecklist();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

function initChecklist() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && document.activeElement.classList.contains('user-label-input')) {
            event.preventDefault();
            addTask();
        } else if ((event.key === 'Delete' || event.key === 'Backspace') && document.activeElement.classList.contains('user-label-input')) {
            if (document.activeElement.value === '') {
                event.preventDefault();
                deleteCheckbox();
            }
        }
    });
}

function createCheckbox(checked = false, label = '') {
    const checklistContainer = document.querySelector('.checklist-container');
    const newCheckboxWrapper = document.createElement('div');
    newCheckboxWrapper.classList.add('checkbox-wrapper');
    newCheckboxWrapper.innerHTML = `
        <input type="checkbox" id="cbx-${Date.now()}" class="inp-cbx" ${checked ? 'checked' : ''} />
        <label for="cbx-${Date.now()}" class="cbx">
            <span><svg viewBox="0 0 12 10" height="10px" width="12px"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span>
            <input type="text" class="user-label-input" value="${label}" placeholder="activity" />
        </label>
        <button type="button" class="delete-task-button">Delete</button>
    `;

    checklistContainer.appendChild(newCheckboxWrapper);

    const newLabelInput = newCheckboxWrapper.querySelector('.user-label-input');
    newLabelInput.focus();
    newLabelInput.setSelectionRange(newLabelInput.value.length, newLabelInput.value.length);

    // Add event listener for delete button
    newCheckboxWrapper.querySelector('.delete-task-button').addEventListener('click', function() {
        newCheckboxWrapper.remove();
    });
}

function deleteCheckbox() {
    const focusedCheckbox = document.activeElement.closest('.checkbox-wrapper');
    if (focusedCheckbox) {
        focusedCheckbox.remove();
    }
}

function addTask(task = '', location = '') {
    const taskContainer = document.getElementById('tasks-container');
    const taskEntry = document.createElement('div');
    taskEntry.classList.add('task-entry');
    taskEntry.innerHTML = `
    <label class="task-label">Task:</label>
    <input type="text" class="user-label-input" placeholder="Task" name="task" value="" required />
    <label class="location-label">Location:</label>
    <input type="text" class="user-label-input" placeholder="Location" name="location" value="" required />
    <input type="checkbox" class="task-checkbox">
    <button type="button" class="recommendations-button">Recommendations</button>
    <button type="button" class="delete-task-button">Delete</button>
    `;

    taskContainer.appendChild(taskEntry);

    // Add event listener for delete button
    taskEntry.querySelector('.delete-task-button').addEventListener('click', function() {
        taskEntry.remove();
    });

    // Add event listener for recommendations button
    taskEntry.querySelector('.recommendations-button').addEventListener('click', function() {
        const taskValue = taskEntry.querySelector('input[name="task"]').value;
        const locationValue = taskEntry.querySelector('input[name="location"]').value;
        if (taskValue && locationValue) {
            window.location.href = `/recommendations?task=${encodeURIComponent(taskValue)}&location=${encodeURIComponent(locationValue)}`;
        } else {
            alert('Please enter both task and location.');
        }
    });


    // Add event listener for task checkbox
  taskEntry.querySelector('.task-checkbox').addEventListener('change', function() {
    if (this.checked) {
        taskEntry.classList.add('completed');
        setTimeout(() => {
            taskEntry.remove();
        }, 1000);
    }
});


}




window.onload = function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTask(task.task, task.location));
};

window.onbeforeunload = function() {
    const tasks = [];
    document.querySelectorAll('.task-entry').forEach(taskEntry => {
        const task = taskEntry.querySelector('input[name="task"]').value;
        const location = taskEntry.querySelector('input[name="location"]').value;
        tasks.push({ task, location });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
