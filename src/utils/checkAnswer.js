import answers from '../assets/paramVals.json'

// console.log(answers.paramCorrectRanges.delayTime.beginner);
const withinRange = (num, [min, max]) => {
    return (num >= min && num <= max);
};

// calculates the average of the scores
const calcScore = (scores) => {
    let sum = scores.reduce(function(x, y) { return x + y; }, 0);
    return Math.round((sum/scores.length)*100);
};

const scoreText = (state) => {
    if (state) {
        return "correct";
    } else {
        return "incorrect";
    }
}

const checkAnswer = (userDelayDur, userFdbkGain, userWetDryVal) => {
    const delayScore = withinRange(userDelayDur, answers.paramCorrectRanges.delayDur.beginner);
    const fdbkScore = withinRange(userFdbkGain, answers.paramCorrectRanges.fdbkGain.beginner);
    const wetDryScore = withinRange(userWetDryVal, answers.paramCorrectRanges.wetDry.beginner)
    console.log("user delay duration: ", delayScore);
    console.log("user feedback gain: ", fdbkScore);
    console.log("user wet dry mix: ", wetDryScore);
    const overallScore = calcScore([delayScore, fdbkScore, wetDryScore]);
    return [scoreText(delayScore), scoreText(fdbkScore), scoreText(wetDryScore), overallScore];
};

export default checkAnswer;