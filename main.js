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
        listHTML = '<p class="message">No Workouts yet</p>';
    }

    return `<h2>Overview</h2><ul>${listHTML}</ul>
    <form onsubmit="handleWorkoutCreate(); return false" class="workout-create-form">
    <input placeholder="Reps" type="number" id="w-sets" autocomplete="off" />
    <input placeholder="Workout" id="w-name" required autocomplete="off" />
    <button type="submit">Create</button>
    </form>`;
}

function handleWorkoutCreate() {
    createWorkout($('#w-name').value.trim(), serialize(Number($('#w-sets').value) || 3));
    renderPage(getDashboardView());
}

function getWorkoutView(id) {
    let index = workouts.findIndex(workout => workout.id === id);

    if (index === -1) {
        return '<p class="message">Workout not found</p>';
    }

    let current = workouts[index];

    let listHTML = current.exercises.map(exercise => `<li class="e-list-item">
        ${exercise.reps}x ${x(exercise.name)} - 
        <button onclick="handleExerciseRemove(${id}, ${exercise.id})" aria-label="Remove">X</button>
        <button onclick="handleExerciseSwap(${index}, ${exercise.id}, -1)" aria-label="Move up">&uarr;</button>
        <button onclick="handleExerciseSwap(${index}, ${exercise.id}, 1)" aria-label="Move down">&darr;</button>
        </li>`).join('');


    if (!listHTML) {
        listHTML = '<p class="message">No Exercises yet</p>';
    }

    return `<h2>${current.sets}x ${x(current.name)}</h2>
    <div class="workout-options">
    <button onclick="renderPage(getDashboardView())">Back</button>
    <button onclick="handleWorkoutRename(${index}, ${id})">Rename</button>
    <button onclick="handleWorkoutSetsChange(${index}, ${id})">Change Sets</button>
    <button onclick="handleWorkoutDelete(${current.id})">Delete</button>
    </div>
    <ul>${listHTML}</ul>
    <form onsubmit="handleExerciseAdd(${current.id}); return false" class="exercise-create-form" >
    <input id="e-reps" placeholder="8-12" autocomplete="off" required />
    <input id="e-name" placeholder="Exercise" autocomplete="off" required />
    <button>Add</button>
    </form>`;
}

function handleWorkoutDelete(id) {
    if (!window.confirm('Should this Workout be deleted?')) {
        return;
    }

    deleteWorkout(id);
    renderPage(getDashboardView());
}

function handleWorkoutRename(workoutIndex, workoutId) {
    if (!workouts[workoutIndex]) {
        return;
    }

    const newName = window.prompt('Enter a new name for this Workout:', workouts[workoutIndex].name);
    if (!newName || !newName.trim()) {
        return;
    }
    workouts[workoutIndex].name = newName.trim();

    saveWorkouts();
    renderPage(getWorkoutView(workoutId));
}

function handleWorkoutSetsChange(workoutIndex, workoutId) {
    if (!workouts[workoutIndex]) {
        return;
    }

    const newSets = window.prompt('Enter a new sets count for this Workout:', workouts[workoutIndex].sets);
    if (!newSets || isNaN(Number(newSets))) {
        return;
    }
    workouts[workoutIndex].sets = serialize(Number(newSets));

    saveWorkouts();
    renderPage(getWorkoutView(workoutId));
}

function handleExerciseAdd(id) {
    addExercise(id, $('#e-name').value, $('#e-reps').value);
    renderPage(getWorkoutView(id));
}

function handleExerciseRemove(id, exerciseId) {
    if(!window.confirm('Should this Exercise be removed?')) {
        return;
    }

    removeExercise(id, exerciseId);
    renderPage(getWorkoutView(id));
}

function handleExerciseSwap(workoutIndex, id, relative) {
    if (!workouts[workoutIndex]) {
        return;
    }

    const exercises = workouts[workoutIndex].exercises;
    const index = exercises.findIndex(exercise => exercise.id === id);

    if (!exercises[index] || !exercises[index + relative]) {
        return;
    }

    const targetExercise = { ...exercises[index] };

    exercises[index] = exercises[index + relative];
    exercises[index + relative] = targetExercise;

    renderPage(getWorkoutView(workouts[workoutIndex].id));
    saveWorkouts();
}

function getTrainingView(workoutIndex, set, exerciseIndex) {
    const workout = workouts[workoutIndex];
    if (!workout) {
        return '<p class="message">Workout not found</p>';
    }
    const title = `<div class="training-workout-title">
    <h2>${set}/${workout.sets} ${workout.name}</h2>
    <button onclick="handleWorkoutCancel()">Cancel</button>
    </div>`;

    const exercise = workout.exercises[exerciseIndex];
    if (!exercise) {
        const returnButton = `<div class="training-control-buttons"><button onclick="renderPage(getDashboardView())">Return to Overview</button></div>`;
        if (workout.exercises.length === 0) {
            return title + '<p class="message">No Exercises yet</p>' + returnButton;
        }
        if (Number(workout.sets) === set) {
            return `<h2>Workout ${workout.name} completed!</h2> ${returnButton}`;
        }
        else {
            return `<h2>${set}/${workout.sets} sets of ${workout.name} completed!</h2>
            <p class="training-info-message">Pause for a few minutes.</p>
            <div class="training-control-buttons">
            <button onclick="renderPage(getTrainingView(${workoutIndex}, ${set + 1}, 0))">Continue Workout ${workout.name}</button>
            </div>`;
        }
    }
    const previosExerciseIndex = exerciseIndex < 1 ? workout.exercises.length - 1 : exerciseIndex - 1;
    const previosExerciseSet = exerciseIndex < 1 ? set - 1 : set;
    const previosButton = `<button onclick="renderPage(getTrainingView(${workoutIndex}, ${previosExerciseSet}, ${previosExerciseIndex}))">Previos</button>`;

    const prevExercise = workout.exercises[exerciseIndex - 1];
    const nextExercise = workout.exercises[exerciseIndex + 1];

    return `${title}
    ${prevExercise ? `<h3 class="training-exercise-title fade">${prevExercise.reps}x ${prevExercise.name}</h3>` : '<h3 class="training-exercise-title fade">&nbsp;</h3>'}
    <h3 class="training-exercise-title">${exercise.reps}x ${exercise.name}</h3>
    ${nextExercise ? `<h3 class="training-exercise-title fade">${nextExercise.reps}x ${nextExercise.name}</h3>` : '<h3 class="training-exercise-title fade">&nbsp;</h3>'}
    <div class="training-control-buttons">
    ${previosExerciseSet > 0 ? previosButton : ''}
    <button onclick="renderPage(getTrainingView(${workoutIndex}, ${set}, ${exerciseIndex + 1}))">Next</button>
    </div>`
}

function handleWorkoutCancel() {
    if (window.confirm('Should this Workout be cancelled?')) {
        renderPage(getDashboardView());
    }
}

function renderPage(html) {
    $('#app').innerHTML = html;
}

(function init() {

    renderPage(getDashboardView());

})();
