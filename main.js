const workoutKey = 'workouts';

let workouts = getWorkouts();
/*
Workout { name: string, sets: number, exercises: Exercise[], id: number }

Exercise: { name: string, reps: number, id: number }
*/

function getWorkouts() {
    const stored = localStorage.getItem(workoutKey);

    if (stored) {
        return JSON.parse(stored || '[]');
    }

    return [];
}

function saveWorkouts() {
    localStorage.setItem(workoutKey, JSON.stringify(workouts));
}

function createWorkout(name, sets) {
    workouts.push({ name, sets, id: Date.now(), exercises: [] });
    saveWorkouts();
}

function deleteWorkout(id) {
    workouts = workouts.filter(workout => workout.id !== id);
    saveWorkouts();
}

function addExercise(id, name, reps) {
    let index = workouts.findIndex(workout => workout.id === id);

    if (index === -1) {
        return;
    }

    workouts[index].exercises.push({ id: Date.now(), name, reps });
    saveWorkouts();
}

function removeExercise(workoutId, exerciseId) {
    let workoutIndex = workouts.findIndex(workout => workout.id === workoutId);

    if (workoutIndex === -1) {
        return;
    }

    workouts[workoutIndex].exercises = workouts[workoutIndex].exercises.filter(exercise => exercise.id !== exerciseId);

    saveWorkouts();
}

function getDashboardView() {
    let listHTML = workouts.map((workout, index) => `<li class="w-list-item">
        ${workout.sets}x ${x(workout.name)} - 
        <button onclick="renderPage(getWorkoutView(${workout.id}))">View</button>
        <button onclick="renderPage(getTrainingView(${index}, 1, ${0}))">Start</button>
        </li>`).join('');

    if (!listHTML) {
        listHTML = '--- No workouts yet ---';
    }

    return `<h2>Dashboard</h2><ul>${listHTML}</ul><form onsubmit="handleWorkoutCreate(); return false">
    <input placeholder="Workout name" id="w-name" required autocomplete="off" />
    <input placeholder="Workout sets" id="w-sets" required autocomplete="off" />
    <button type="submit">Create</button>
    </form>`;
}

function handleWorkoutCreate() {
    createWorkout($('#w-name').value, $('#w-sets').value);
    renderPage(getDashboardView());
}

function getWorkoutView(id) {
    let index = workouts.findIndex(workout => workout.id === id);

    if (index === -1) {
        return '--- Workout not found ---';
    }

    let current = workouts[index];

    let listHTML = current.exercises.map(exercise => `<li class="e-list-item">${exercise.reps}x ${x(exercise.name)} - <button>Done</button><button onclick="handleExerciseRemove(${id}, ${exercise.id})">Remove</button></li>`).join('');


    if (!listHTML) {
        listHTML = '--- No exercises yet ---';
    }

    return `<h2>${current.sets}x ${x(current.name)}</h2>
    <button onclick="renderPage(getDashboardView())">Back</button>
    <button onclick="handleWorkoutDelete(${current.id})">Delete</button>
    <ul>${listHTML}</ul>
    <form onsubmit="handleExerciseAdd(${current.id}); return false" >
    <input id="e-name" placeholder="exercise name" autocomplete="off" required />
    <input id="e-reps" placeholder="exercise reps" autocomplete="off" required />
    <button>Add</button>
    </form>`;
}

function handleWorkoutDelete(id) {
    if (!window.confirm('Should this workout be deleted?')) {
        return;
    }

    deleteWorkout(id);
    renderPage(getDashboardView());
}

function handleExerciseAdd(id) {
    addExercise(id, $('#e-name').value, $('#e-reps').value);
    renderPage(getWorkoutView(id));
}

function handleExerciseRemove(id, exerciseId) {
    removeExercise(id, exerciseId);
    renderPage(getWorkoutView(id));
}

function getTrainingView(workoutIndex, set, exerciseIndex) {
    const workout = workouts[workoutIndex];
    if (!workout) {
        return '--- workout not found ---';
    }
    const title = `<div class="training-workout-title">
    <h2>${set}/${workout.sets} ${workout.name}</h2>
    <button onclick="handleWorkoutCancel()">Cancel Workout</button>
    </div>`;

    const exercise = workout.exercises[exerciseIndex];
    if (!exercise) {
        const returnButton = `<div class="training-control-buttons"><button onclick="renderPage(getDashboardView())">Return to dashboard</button></div>`;
        if (workout.exercises.length === 0) {
            return title + '--- no exercises ---' + returnButton;
        }
        if (Number(workout.sets) === set) {
            return `<h2>Workout ${workout.name} completed!</h2> ${returnButton}`;
        }
        else {
            return `<h2>${set}/${workout.sets} sets of ${workout.name} completed!</h2>
            <p class="training-info-message">Pause for a few minutes</p>
            <div class="training-control-buttons">
            <button onclick="renderPage(getTrainingView(${workoutIndex}, ${set + 1}, 0))">Continue workout ${workout.name}</button>
            </div>`;
        }
    }
    const previosExerciseIndex = exerciseIndex < 1 ? workout.exercises.length - 1 : exerciseIndex - 1;
    const previosExerciseSet = exerciseIndex < 1 ? set - 1 : set;
    const previosButton = `<button onclick="renderPage(getTrainingView(${workoutIndex}, ${previosExerciseSet}, ${previosExerciseIndex}))">Previos</button>`;
    return `${title}
    <h3 class="training-exercise-title">${exercise.reps}x ${exercise.name}</h3>
    <div class="training-control-buttons">
    ${previosExerciseSet > 0 ? previosButton : ''}
    <button onclick="renderPage(getTrainingView(${workoutIndex}, ${set}, ${exerciseIndex + 1}))">Next</button>
    </div>`
}

function handleWorkoutCancel() {
    if (window.confirm('Should this workout be cancelled?')) {
        renderPage(getDashboardView());
    }
}

function renderPage(html) {
    $('#app').innerHTML = html;
}

(function init() {

    renderPage(getDashboardView());

})();
