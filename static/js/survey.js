document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('survey-form');
    const progressBar = document.getElementById('progress-bar');
    const formFields = form.querySelectorAll('select');
    const totalFields = formFields.length;

    formFields.forEach(field => {
        field.addEventListener('change', updateProgress);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        let allSelected = true;
        const formData = new FormData(event.target);
        const surveyData = {};

        formData.forEach((value, key) => {
            if (!surveyData[key]) {
                surveyData[key] = value;
            } else {
                if (!Array.isArray(surveyData[key])) {
                    surveyData[key] = [surveyData[key]];
                }
                surveyData[key].push(value);
            }
            if (value === '') {
                allSelected = false;
            }
        });

        if (!allSelected) {
            alert('Please fill out all fields.');
            return;
        }

        console.log(surveyData); // Log the data for debugging purposes

        // Send the data to the server
        fetch('/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(surveyData),
        })
        .then(response => response.json())
        .then(data => {
            alert('Survey submitted! Thank you for your input.');

            // Redirect to the main page after 2 seconds
            setTimeout(() => {
                window.location.href = 'base.html'; // Replace 'base.html' with the actual main page URL of your app
            }, 2000);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    function updateProgress() {
        let filledFields = 0;
        formFields.forEach(field => {
            if (field.value) {
                filledFields++;
            }
        });

        const progress = (filledFields / totalFields) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);

        if (progress === 0) {
            progressBar.innerText = 'Select';
        } else {
            progressBar.innerText = `${Math.round(progress)}%`;
        }
    }
});
