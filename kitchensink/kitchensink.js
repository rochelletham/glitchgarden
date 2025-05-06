const vertSlider = document.querySelector('#vertical-slider');
const vertSliderValue = document.querySelector('#vert-slider-value');

vertSlider.addEventListener('input', function () {
    // Synchronize input number with slider value
    vertSliderValue.value = vertSlider.value; 
    this.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${vertSlider.value}%,
     rgba(38, 42, 45, 1) ${vertSlider.value}%)`;
});


// Update the slider when the number input changes
vertSliderValue.addEventListener('input', function () {
    let value = parseInt(vertSliderValue.value, 10);
      if (value >= 0 && value <= 100) {
        vertSlider.value = value;
        vertSliderValue.value = vertSlider.value;
        vertSlider.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${vertSlider.value}%,
     rgba(38, 42, 45, 1) ${vertSlider.value}%)`;
      }
});

const horislider = document.querySelector('.hori-slider');
const horisliderValue = document.querySelector('#hori-slider-value');

horislider.addEventListener('input', function () {
    var val = ((this.value - this.min) / (this.max - this.min)) * 100; // Calculate percentage)
    const percentage = Math.round((val / this.max) * 100); // Reverse the percentage calculation
    console.log("percentage: ", percentage);
    horislider.style.setProperty('--hori-slider-value', `${percentage}%`);
    horisliderValue.textContent = percentage; // updates the displayed value for slider
    // Update the track's background
    this.style.background = `linear-gradient(to right, rgba(7, 235, 123, 1) ${percentage}%, rgba(38, 42, 45, 1) ${percentage}%)`; // Update background
});