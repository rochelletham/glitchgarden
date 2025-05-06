import AudioGraph from '@/AudioGraph'
import Slider from '@/Slider'
import Button from '@/Button'
import TutorialJson from '@/e'
const TutorialOptions = {
    // json file content
    "title": "Flanger",
    "buttons": [
        "playButton",
        "loopButton",
        "muteButton"
    ],
    "sliders": {
        "delayDuration": {
            "default": 5,
            "range": [0,10],
            "increment": 1, 
            "unit": "ms",
            "answer range": {
                "easy": [0,10],
                "medium": [0,10],
                "hard": [0,10]
            }
        },
        "feedbackGain": {
            "default": 0.7,
            "range": [0,1],
            "increment": 0.1,
            "unit": "",
            "answer range": {
                "easy": [0,10],
                "medium": [0,10],
                "hard": [0,10]
            }
        },
        "dry/wet mix": {
            "default": 50,
            "range": [0,100],
            "increment": 10,
            "unit": "%",
            "answer range": {
                "easy": [0,10],
                "medium": [0,10],
                "hard": [0,10]
            }
        }
    }
};

/**
 * The GlitchGardenModule class will parse an input json to create an audio effect
 * module in the web application. 
 */
class GlitchGardenModule {
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
    constructor(TutorialOptions) {
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
    getData() {
        data();
    };
    getMounted() {
        onMounted();
    }
}
