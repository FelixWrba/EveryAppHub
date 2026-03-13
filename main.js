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
    let listHTML = workouts.map(workout => `<li>${workout.sets}x ${x(workout.name)} - <button onclick="renderPage(getWorkoutView(${workout.id}))">View</button></li>`).join('');

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

    let listHTML = current.exercises.map(exercise => `<li>${exercise.reps}x ${x(exercise.name)} - <button>Done</button><button onclick="handleExerciseRemove(${id}, ${exercise.id})">Remove</button></li>`).join('');


    if (!listHTML) {
        listHTML = '--- No exercises yet ---';
    }

    return `<h2>${current.sets}x ${x(current.name)}</h2>
    <button onclick="renderPage(getDashboardView())">Back</button>
    <button onclick="handleWorkoutDelete(${current.id})">Delete</button>
    <ul>${listHTML}</ul>
    <form onsubmit="handleExerciseAdd(${current.id}); return false" >
    <input id="e-name" placeholder="exercise name" autocomplete="off" required />
    <input id="e-reps" placeholder="exercise name" autocomplete="off" required />
    <button>Add</button>
    </form>`;
}

function handleWorkoutDelete(id) {
    if(!window.confirm('Should this workout be deleted?')) {
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

function renderPage(html) {
    $('#app').innerHTML = html;
}

(function init() {

    renderPage(getDashboardView());

})();
