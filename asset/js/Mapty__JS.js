'use strict';

// Variables for DOM 
const containerWorkouts = document.querySelector('.workouts');
const workoutContainer__NEW = document.querySelector('.workout');
const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputButton = document.querySelector('.form__btn');

const message = document.querySelector('.form__messages');

const Close__btn = document.querySelector('.Close__btn');


// Making Class for APP --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Class Workout
class workout {
    date = new Date();
    id = (Date.now() + " ").slice(-5).trim(" ");

    constructor(coords, distance, duration){
        this.coords = coords;       //[lat, lng]
        this.distance = distance;       //In KM
        this.duration = duration;       //In MIN 
    }

    _setDescription() {
        // Months log
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.workoutType[0].toUpperCase()}${this.workoutType.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}

// Class Running
class running extends workout {
    workoutType = 'running';

    constructor(coords, distance, duration){
        super(coords, distance, duration);
        this.calcRunningPace();
        this._setDescription();
    }

    calcRunningPace() {
        this.pace = Math.round(this.distance/(this.duration/60))*100/100;
        return this.pace;
    }
}

// Class Cycling
class cycling extends workout{
    workoutType = 'cycling';
    constructor(coords, distance, duration){
        super(coords, distance, duration);
        this.calcCyclingSpeed();
        this._setDescription();
    }

    calcCyclingSpeed() {
        this.speed = Math.round(this.distance/(this.duration/60))*100/100;
        return this.speed;
    }
}

//Class Walking
class walking extends workout{
    workoutType = 'walking';
    constructor(coords, distance, duration){
        super(coords, distance, duration);
        this.calcWalkingPace(); 
        this._setDescription();
    }

    calcWalkingPace() {
        this.walkingPace = Math.round(this.distance/(this.duration/60))*100/100;
        return this.walkingPace;
    }
} 

// Class Swimming
class swimming extends workout{
    workoutType = 'swimming';
    constructor(coords, distance, duration){
        super(coords, distance, duration);
        this.calcSwimmingPace();
        this._setDescription();
    }

    calcSwimmingPace() {
        this.swimmingPace = Math.round((this.distance/1.609)/(this.duration/60)*100)/100;
        return this.swimmingPace;
    }
}

// Making classes objects:

const run = new running();
const cycle = new cycling();
const walk = new walking();
const swim = new swimming();

// //////////////////////////////////////////////////////////////////////////////////////MAKING CLASS APP///////////////////////////////////////////////////////////////////////////////////////

// Using (_) => underscore for protected/private classes
// Class App
class App{
    #map;
    #mapEvent;
    #workouts = [];
    #workout;
    #mapZoomLevel = 15;

    constructor() {
        // Get local storage data
        this._getLocalStorage();

        // Event Handlers
        inputButton.addEventListener('click', this._newWorkout.bind(this));        
        containerWorkouts.addEventListener('click', this._moveToPopUp.bind(this));
    }

    // Getting User position

    _getPosition() {
        // Accessing Geolocation
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert("Allow Mapty to know your location");}),
                {
                    maximumAge:15000, 
                    timeout: 10000, 
                    enableHighAccuracy: true,
                    maxZoom: Infinity,
                }
        }
        else {
            alert("Geolocation API is not supported in your browser");
        }
    }

    // Loading Maps

    _loadMap(position) {
        const {latitude} = position.coords;
        const {longitude} = position.coords;

        const coords = [latitude, longitude];

        // Adding Leaflet Maps with popup action here

        this.#map = L.map('map').setView(coords, 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        L.marker(coords).addTo(this.#map).bindPopup('Your Current Location').openPopup();

        this.#map.on('click', this._onClickMapEvent.bind(this), function (){
            alert("Could not get your position");
        } );
    }

    // Method for map marker
    _renderWorkoutMarker(workout) {
        // Making Marker
        const {lat, lng} = this.#mapEvent.latlng;
        L.marker([lat, lng]).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 50,
            autoClose: true,
            closeOnClick: true,
            className: `${workout.workoutType}-popup`, 
            })).setPopupContent(`
                ${this._workoutTypeDecisions(workout)} ${workout.description}
            `).openPopup();
    }

    // Marking Maps location
    _onClickMapEvent(mapEvent__new) {
        this.#mapEvent = mapEvent__new;
        inputDistance.focus();
        const {lat, lng} =  this.#mapEvent.latlng;

        // Making Marker to locate latitude and longitude
        L.marker([lat, lng]).addTo(this.#map).openPopup();
    }

    // Adding Workouts in Workout Section

    _newWorkout(e) {
        e.preventDefault();

        // Getting data from user
        const workoutType = inputType.value;
        const distance = inputDistance.value;
        const duration = inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
        let workout;

        // function setMessageOFF (){
        //     message.innerHTML = " ";
        // }

        // Validating Inputs
        // if(distance === Number || duration === Number) {
        //     message.innerHTML = "";
        // } 

        // if(distance > 0 || duration > 0){
        //     message.textContent = "";
        // }

        // if(distance !== Number || duration !== Number){
        //     message.innerHTML = "Please enter a valid positive number input";
        //     setTimeout(setMessageOFF, 4000);
        //     inputButton.removeEventListener('click', this._newWorkout.bind(this));
        // }

        // if(distance < 0 || duration < 0){
        //     message.innerHTML = "Please enter a valid positive number input";
        //     setTimeout(setMessageOFF, 4000);
        // }

        if(workoutType === "running"){
            workout = new running([lat, lng], distance, duration);
            this.#workouts.push(workout);
        }
       
        if(workoutType === "cycling"){
            workout = new cycling([lat, lng], distance, duration);
            this.#workouts.push(workout);
        }

        if(workoutType === "walking"){
            workout = new walking([lat, lng], distance, duration);
            this.#workouts.push(workout);
        }

        if(workoutType === "swimming"){
            workout = new swimming([lat, lng], distance, duration);
            this.#workouts.push(workout);
        }
        this._renderWorkoutMarker(workout);
        
        this._renderWorkout(workout);

        this._setLocalStorage();
            
        function clearInput(){
            inputDistance.value = inputDuration.value = "";
        }

        setTimeout(clearInput, 1000);
    }

    _workoutTypeDecisions(workout){
        if(workout.workoutType === 'running'){
            return '🏃‍♂️' ;
        }
        if(workout.workoutType === 'cycling'){
            return '🚴‍♀️' ;
        }
        if(workout.workoutType === 'walking'){
            return '🚶' ;
        }
        if(workout.workoutType === 'swimming'){
            return '🏊' ;
        }
    }

    // ${workout.workoutType === 'running' ? '🏃‍♂️' : ' ' || workout.workoutType === 'cycling' ? '🚴‍♀️' : ' ' || workout.workoutType === 'walking' ? '🚶' : ' '  || workout.workoutType === 'swimming' ? '🏊' : ' '} ${workout.description}

    // Adds workout description to the workouts section
    _renderWorkout(workout) {
        let html = `
            <li class="workout workout--${workout.workoutType}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                    <span class="workout__icon">${this._workoutTypeDecisions(workout)}</span>
                    <span class="workout__value">${workout.distance}</span> 
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
        `;

        // Adding workout descriptions

        // For running
        if(workout.workoutType === 'running'){
            html += `
                        <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.pace}</span>
                        <span class="workout__unit">km/h</span>
                    </div>
                </li> 
            `;
        }

        // For cycling
        if(workout.workoutType === 'cycling'){
            html += `
                        <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.speed}</span>
                        <span class="workout__unit">km/h</span>
                    </div>
                </li>
            `;
        }

        // For walking
        if(workout.workoutType === 'walking'){
            html += `
                        <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.walkingPace}</span>
                        <span class="workout__unit">km/h</span>
                    </div>
                </li>
            `;
        }

        // For swimming
        if(workout.workoutType === 'swimming'){
            html += `
                        <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.swimmingPace}</span>
                        <span class="workout__unit">m/h</span>
                    </div>
                </li>
            `;
        }

        // Adding workout descriptions as an sibling element of the form component/node
        form.insertAdjacentHTML('afterend', html);
    }

    _moveToPopUp(e) {

        if (!this.#map) {return};

        const workoutElement = e.target.closest('.workout');

        if(!workoutElement) {
            return;
        }

        this.#workout = this.#workouts.find(
            ele => ele.id === workoutElement.dataset.id
        );

        this.#map.setView(this.#workout.coords, this.#mapZoomLevel, {animate: true, pan: {
            duration: 1,
        }});
    }

    // Using Local Storage to save workouts log
    _setLocalStorage(){
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
        console.log(JSON.stringify(this.#workouts));
    }

    // Getting local storage data
    _getLocalStorage(){
        const workoutData = JSON.parse(localStorage.getItem('workouts'));

        if(!workoutData){
            return;
        }

        // Setting data to workouts class for local storage
        this.#workouts = workoutData;

        this.#workouts.forEach(work => {
            this._renderWorkout(work);
        });
    }

    reset(){
        localStorage.removeItem('workouts');
        location.reload();
    }
}

const app = new App();
app._getPosition();