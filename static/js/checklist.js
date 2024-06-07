document.addEventListener('DOMContentLoaded', function() {
    initChecklist();
    loadTasksFromLocalStorage();
    addSelectPlaceListeners();
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

    newCheckboxWrapper.querySelector('.delete-task-button').addEventListener('click', function() {
        newCheckboxWrapper.remove();
        saveTasksToLocalStorage();
    });

    newCheckboxWrapper.querySelector('.inp-cbx').addEventListener('change', function() {
        if (this.checked) {
            newCheckboxWrapper.classList.add('completed');
            setTimeout(() => {
                newCheckboxWrapper.remove();
                saveTasksToLocalStorage();
            }, 1000);
        } else {
            newCheckboxWrapper.classList.remove('completed');
        }
        saveTasksToLocalStorage();
    });
}

function deleteCheckbox() {
    const focusedCheckbox = document.activeElement.closest('.checkbox-wrapper');
    if (focusedCheckbox) {
        focusedCheckbox.remove();
        saveTasksToLocalStorage();
    }
}

function addTask(task = '', location = '', checked = false) {
    const formData = new FormData();
    formData.append('task', task);
    formData.append('location', location);

    fetch('/plan', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Handle success
        // Optionally, you can redirect or do something else
    })
    .catch(error => {
        console.error('Error:', error);
    });

    
    // Rest of the function remains unchanged

    const taskContainer = document.getElementById('tasks-container');
    const taskEntry = document.createElement('div');
    taskEntry.classList.add('task-entry');
    taskEntry.innerHTML = `
        <div class="task-location-container">
            <input type="checkbox" class="task-checkbox" ${checked ? 'checked' : ''}>
            <label class="task-label">Task:</label>
            <input type="text" class="user-label-input" placeholder="Task" name="task" value="${task}" required />
            <label class="location-label">Location:</label>
            <input type="text" class="user-label-input" placeholder="Location" name="location" value="${location}" required />
            <button type="button" class="recommendations-button">Recommendations</button>
            <button type="button" class="delete-task-button">Delete</button>
        </div>
    `;

    taskContainer.appendChild(taskEntry);

    taskEntry.querySelector('.delete-task-button').addEventListener('click', function() {
        taskEntry.remove();
        saveTasksToLocalStorage();
    });

    taskEntry.querySelector('.recommendations-button').addEventListener('click', function() {
        const taskValue = taskEntry.querySelector('input[name="task"]').value;
        const locationValue = taskEntry.querySelector('input[name="location"]').value;
        if (taskValue && locationValue) {
            window.location.href = `/recommendations?task=${encodeURIComponent(taskValue)}&location=${encodeURIComponent(locationValue)}`;
        } else {
            alert('Please enter both task and location.');
        }
    });

    taskEntry.querySelector('.task-checkbox').addEventListener('change', function() {
        if (this.checked) {
            taskEntry.classList.add('completed');
            setTimeout(() => {
                taskEntry.remove();
                saveTasksToLocalStorage();
            }, 1000);
        } else {
            taskEntry.classList.remove('completed');
        }
        saveTasksToLocalStorage();
    });

    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task-entry').forEach(taskEntry => {
        const task = taskEntry.querySelector('input[name="task"]').value;
        const location = taskEntry.querySelector('input[name="location"]').value;
        const checked = taskEntry.querySelector('.task-checkbox').checked;
        tasks.push({ task, location, checked });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    document.getElementById('tasks-container').innerHTML = ''; // Clear existing tasks to prevent duplication
    savedTasks.forEach(task => addTask(task.task, task.location, task.checked));
}

function addSelectPlaceListeners() {
    document.querySelectorAll('.select-place').forEach(button => {
        button.addEventListener('click', function(event) {
            const selectedPlaceName = event.target.getAttribute('data-name');
            const selectedPlaceAddress = event.target.getAttribute('data-address');
            console.log(`Selected Place: ${selectedPlaceName}, Address: ${selectedPlaceAddress}`);  // Debugging log

            const formData = new FormData();
            formData.append('selected_place_name', selectedPlaceName);
            formData.append('selected_place_address', selectedPlaceAddress);
            
            fetch('/select_place', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // handle successful selection if needed
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
}

window.onload = function() {
    loadTasksFromLocalStorage();
};

window.onbeforeunload = function() {
    saveTasksToLocalStorage();
};
