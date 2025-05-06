const vertslider = document.querySelector('.vert-slider');
const vertsliderValue = document.querySelector('#vert-slider-value');

vertslider.addEventListener('input', function () {
    var val = ((this.value - this.min) / (this.max - this.min)) * 100; // Calculate percentage)
    const percentage = Math.round(100 - (val / this.max) * 100); 
    console.log("percentage: ", percentage);
    vertslider.style.setProperty('--vert-slider-value', `${percentage}%`);
    vertsliderValue.textContent = percentage; // updates the displayed value for slider
    // Update the track's background
    this.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${percentage}%, rgba(38, 42, 45, 1) ${percentage}%)`; // Update background
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