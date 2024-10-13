document.addEventListener('DOMContentLoaded', () => {
    const addExerciseButton = document.querySelector('.Add');
    const exerciseInput = document.querySelector('.first-input');
    const timeInput = document.querySelector('.time-limit-input');
    const exerciseContainer = document.createElement('div');
    document.body.appendChild(exerciseContainer);

    addExerciseButton.addEventListener('click', () => {
        const exerciseName = exerciseInput.value.trim();
        const timeValue = timeInput.value.trim();

        if (exerciseName === '' || timeValue === '') {
            alert('Please enter both exercise and time limit');
            return;
        }

     
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.style.margin = '1rem 7rem';
        exerciseItem.style.padding = '1rem';
        exerciseItem.style.backgroundColor = '#F3C623';
        exerciseItem.style.borderRadius = '0.5rem';
        exerciseItem.style.boxShadow = '0.2rem 0.2rem';

 
        const exerciseText = document.createElement('p');
        exerciseText.innerHTML = `<strong>Exercise:</strong> ${exerciseName}`;
        exerciseItem.appendChild(exerciseText);

     
        const timerText = document.createElement('p');
        timerText.innerHTML = `<strong>Time Limit:</strong> ${timeValue}`;
        exerciseItem.appendChild(timerText);

     
        exerciseContainer.appendChild(exerciseItem);

   
        exerciseInput.value = '';
        timeInput.value = '';
    });
});





