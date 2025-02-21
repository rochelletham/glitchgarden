import AudioGraph from '@/AudioGraph'
import Slider from '@/Slider'
import Button from '@/Button'
/**
 * The Module class will parse an input json to create an audio effect
 * module in the web application. 
 */
class Module {
    /**
     * Create an audio effect module (its own page)
     * TODO: change so that Module constructor takes in a json and parse
     * to assign to member variables
     * @constructor
     * @param {json} info - A json that includes all the necessary information to create a basic template
    //  * @param {string} title - The title of the module.
    //  * @param {string} difficulty - The difficulty of the module (easy, medium, hard)
    //  * @param {string} exerciseNum - The exercise number of the module, starts from 1
    //  * @param {} audioGraph - The audio graph for the module, where all the audio processing happens
    //  * @param {array} sliderParams - json slider parameters that will be used to control the 
    //  *                          audio processing in this module. 
     */
    constructor(title, difficulty, exerciseNum='1', audioGraph=None,
                sliderParams, 
    ) {
        this.title = title;
        this.difficulty = difficulty;
        this.audioGraph = new AudioGraph();
        this.playButton = new Button();
        this.loopButton = new Button();
        this.muteButton = new Button();
        this.numParams = Object.keys( sliders ).length
        this.exerciseNum = exerciseNum;
        this.sliders = []
        for (let i = 0; i < this.numParams; i++) {
            let slider = new Slider();
            this.sliders.push(slider);
        }
    }

}
