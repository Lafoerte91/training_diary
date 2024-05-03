"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date()
  id = Date.now().toString().slice(-10)
  constructor(coords, distanse, duration) {
    this.coords = coords
    this.distanse = distanse
    this.duration = duration
  }
}

class Running extends Workout {
  constructor(coords, distanse, duration, cadence) {
    super(coords, distanse, duration)
    this.cadence = cadence
    this.calcPace()
  }
  calcPace() {
    this.pace = this.duration / this.distanse
    return this.pace
  }
}

class Cycling extends Workout {
  constructor(coords, distanse, duration, elevation) {
    super(coords, distanse, duration)
    this.elevation = elevation
    this.calcSpeed()
  }
  calcSpeed() {
    this.speed = this.distanse / (this.duration / 60)
    return this.speed
  }
}

const run1 = new Running([39, -12], 5.2, 24, 178)
const cycling1 = new Cycling([39, -12], 27, 95, 523)

console.log(run1, cycling1)

class App {
  _map
  _mapEvent
  constructor() {
    this._getPosition()
    form.addEventListener("submit", this._newWorkout.bind(this))
    inputType.addEventListener("change", this._toggleField.bind(this))
  }
  _getPosition() {
    if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
    function() {
      alert("Вы не предоставили доступ к своей локации")
    })
  }
  _loadMap(position) {

      const {latitude} = position.coords
      const {longitude}  = position.coords
      const coords = [latitude, longitude]
      this._map = L.map('map').setView(coords, 13);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this._map);

      this._map.on('click', this._showForm.bind(this))
  }
  _showForm(mapE) {
      this._mapEvent = mapE
      form.classList.remove("hidden");
      inputDistance.focus();
  }
  _toggleField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  }
  _newWorkout(e) {
    e.preventDefault();
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
    const {lat, lng} = this._mapEvent.latlng
    L.marker([lat, lng]).addTo(this._map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'mark-popup'
    }))
    .setPopupContent('Тренировка')
    .openPopup();
  }
}

const app = new App();
