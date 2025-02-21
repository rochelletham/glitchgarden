class Slider {
    /**
     * Create an audio effect module (its own page)
     * @constructor
     * @param {string} label - The parameter name of the slider
     * @param {float} value - The default value of the slider upon creation
     * @param {float} unit - The unit of the parameter
     * @param {list} range -  The range of the slider, given as a list of two numbers
     * @param {float} increment - How much the slider should increment by (absolute val)
     */
    constructor(label, value, unit, range, increment) {
        this.label = label;
        this.value = value;
        this.unit = unit;
        this.range = range;
        this.increment = increment;
    }
}