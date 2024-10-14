document.addEventListener('DOMContentLoaded', () => {
    const addExerciseButton = document.querySelector('.Add');
    const exerciseInput = document.querySelector('.first-input');
    const timeInput = document.querySelector('.time-limit-input');
    const exerciseContainer = document.createElement('div');
    const endWorkoutButton = document.querySelector('.stop');
    const beginWorkoutButton = document.querySelector('.button_1');
    let exercisesList = [];
    let countdownInterval;
    let currentExerciseIndex = 0;

    document.body.appendChild(exerciseContainer);

    let wait=true;
    const startCountdown = (duration, exerciseName, t1, t2, t3, nextExerciseCallback) => {
        let timeRemaining = duration;
        const startTime = timeRemaining;
        countdownInterval = setInterval(() => {
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = timeRemaining % 60;

            t1.textContent = String(hours).padStart(2, '0');
            t2.textContent = String(minutes).padStart(2, '0');
            t3.textContent = String(seconds).padStart(2, '0');
            if (timeRemaining === 0) {
                if (!wait){
                clearInterval(countdownInterval);
                saveExerciseSummary(exerciseName, startTime, startTime - timeRemaining, false);
                nextExerciseCallback(); 
                }
                else{
                    timeRemaining=30;
                    wait=false;
                }
            }
            timeRemaining--;
        }, 1000);
    };
    const saveExerciseSummary = (exerciseName, setTime, timeSpent, skipped) => {
        exercisesList.push({
            exerciseName,
            setTime: `${setTime} seconds`,
            timeSpent: `${setTime - timeSpent} seconds`,
            skipped: skipped ? 'Yes' : 'No'
        });
        localStorage.setItem('workoutSummary', JSON.stringify(exercisesList));
    };

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
        exerciseItem.style.display = 'flex';
        exerciseItem.style.alignItems = 'center';
        exerciseItem.style.justifyContent = 'space-between';

       
        const exerciseText = document.createElement('p');
        exerciseText.innerHTML = `<strong>Exercise:</strong> ${exerciseName}`;
        exerciseItem.appendChild(exerciseText);

        const timerText = document.createElement('p');
        timerText.innerHTML = `<strong>Time Limit:</strong> ${timeValue} seconds`;
        exerciseItem.appendChild(timerText);

        const timerContainer = document.createElement('div');
        timerContainer.style.display = 'flex';
        timerContainer.style.alignItems = 'center';
        timerContainer.style.gap = '0.5rem';

        const skipButton = document.createElement('button');
        skipButton.textContent = 'Skip';
        skipButton.style.padding = '0.5rem 1rem';
        skipButton.style.backgroundColor = '#dc3545';
        skipButton.style.color = '#FFF';
        skipButton.style.border = 'none';
        skipButton.style.borderRadius = '0.3rem';
        skipButton.style.cursor = 'pointer';

        const t1 = document.createElement('span');
        const t2 = document.createElement('span');
        const t3 = document.createElement('span');
        t1.textContent = '00';
        t2.textContent = '00';
        t3.textContent = '00';

        timerContainer.appendChild(skipButton);
        timerContainer.appendChild(t1);
        timerContainer.appendChild(document.createTextNode(':'));
        timerContainer.appendChild(t2);
        timerContainer.appendChild(document.createTextNode(':'));
        timerContainer.appendChild(t3);

        exerciseItem.appendChild(timerContainer);
        exerciseContainer.appendChild(exerciseItem);

      
        exercisesList.push({
            name: exerciseName,
            time: parseInt(timeValue, 10),
            element: exerciseItem,
            t1, t2, t3,
            skipButton
        });

        exerciseInput.value = '';
        timeInput.value = '';
    });

    const startNextExercise = () => {
        if (currentExerciseIndex < exercisesList.length) {
            const { name, time, t1, t2, t3, skipButton } = exercisesList[currentExerciseIndex];
            skipButton.style.display = 'block'; 

            
            skipButton.onclick = () => {
                clearInterval(countdownInterval);
                saveExerciseSummary(name, time, time, true); 
                skipButton.style.display = 'none'; 
                currentExerciseIndex++;
                startNextExercise(); 
            };

            const nextExerciseCallback = () => {
                skipButton.style.display = 'none'; 
                currentExerciseIndex++;
                if (currentExerciseIndex < exercisesList.length) {
                    startNextExercise();
                } else {
                    displaySummaryPage(); 
                }
            };
            startCountdown(time, name, t1, t2, t3, nextExerciseCallback);
        } 
        else {
            displaySummaryPage(); 
        }
    };

   
    beginWorkoutButton.addEventListener('click', () => {
        currentExerciseIndex = 0; 
        startNextExercise();
    });

   
    endWorkoutButton.addEventListener('click', () => {
        clearInterval(countdownInterval);
        displaySummaryPage();
    });

   
    const displaySummaryPage = () => {
        document.body.innerHTML = ''; 
        const summaryContainer = document.createElement('div');
        summaryContainer.style.padding = '2rem';
        summaryContainer.style.textAlign = 'center';

        const congratsMessage = document.createElement('h2');
        congratsMessage.textContent = 'Congratulations on completing your workout!';
        summaryContainer.appendChild(congratsMessage);

       
        const summaryTable = document.createElement('table');
        summaryTable.style.width = '80%';
        summaryTable.style.margin = '2rem auto';
        summaryTable.style.borderCollapse = 'collapse';
        summaryTable.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

       
        const headers = ['Exercise', 'Set Time', 'Time Spent', 'Skipped'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.style.padding = '1rem';
            header.style.backgroundColor = '#4CAF50';
            header.style.color = 'white';
            header.style.border = '1px solid #dddddd';
            headerRow.appendChild(header);
        });
        summaryTable.appendChild(headerRow);

        
        exercisesList.forEach(exercise => {
            const row = document.createElement('tr');
            const exerciseData = [exercise.exerciseName, exercise.setTime, exercise.timeSpent, exercise.skipped];

            exerciseData.forEach(data => {
                const cell = document.createElement('td');
                cell.textContent = data;
                cell.style.padding = '0.75rem';
                cell.style.border = '1px solid #dddddd';
                cell.style.textAlign = 'center';
                cell.style.backgroundColor = '#f9f9f9';
                row.appendChild(cell);
            });
            summaryTable.appendChild(row);
        });

        summaryContainer.appendChild(summaryTable);
        document.body.appendChild(summaryContainer);
    };
});
