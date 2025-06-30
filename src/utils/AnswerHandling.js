import answers from '../assets/paramVals.json'


// console.log(answers.paramCorrectRanges.delayTime.beginner);
const withinRange = (num, ans, [min, max]) => {
    return ((num >= Number(ans) + Number(min)) && (num <= Number(ans) + Number(max)));
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


const checkAnswer = (type, userDelayDur, userFdbkGain, userWetDryVal, ansDelayDur, ansFdbkGain, ansWetDryVal, userRate=0, userDepth=0, ansRate=0, ansDepth=0
                    ) => {
    console.log("current answers: ", 
        "\nLFO Rate Ans: ", ansRate, 
        "\nLFO Depth Ans: ", ansDepth, 
        "\ndelayTime Ans: ", ansDelayDur, 
        "\nfdbk gain Ans: ", ansFdbkGain,
        "\nwetdry Ans: ", ansWetDryVal);
    // TODO: cater to the other answers
    let exerciseType;
    if (type === "phaser") {
        exerciseType = answers.phaser;
    } else if (type === "flanger") {
        exerciseType = answers.flanger;
    } else if (type === "echo") {
        exerciseType = answers.echo;
    } else if (type === "tremolo") {
        exerciseType = answers.tremolo;
    } else if (type === "chorus") {
        exerciseType = answers.chorus;
    } else if (type === "doubling") {
        exerciseType = answers.doubling;
    } else if (type === "stereoDelay") {
        exerciseType = answers.stereoDelay;
    }
    const delayScore = withinRange(userDelayDur, ansDelayDur, exerciseType.paramCorrectRanges.delayDur.beginner);
    const fdbkScore = withinRange(userFdbkGain, ansFdbkGain, exerciseType.paramCorrectRanges.fdbkGain.beginner);
    const wetDryScore = withinRange(userWetDryVal, ansWetDryVal, exerciseType.paramCorrectRanges.wetDry.beginner);
    if (type != "phaser") {
        // if no rate and depth in this exercise, then no need to check
        const overallScore = calcScore([delayScore, fdbkScore, wetDryScore]);
        return [scoreText(delayScore), scoreText(fdbkScore), scoreText(wetDryScore), overallScore];
    }
    const rateScore = withinRange(userRate, ansRate, exerciseType.paramCorrectRanges.rate.beginner);
    const depthScore = withinRange(userDepth, ansDepth, exerciseType.paramCorrectRanges.depth.beginner);
    const overallScore = calcScore([delayScore, fdbkScore, wetDryScore, rateScore, depthScore]);
    // return ["correct", "correct", "correct", "correct", Math.round(100)];
    return [scoreText(delayScore), scoreText(fdbkScore), scoreText(wetDryScore), scoreText(rateScore),
        scoreText(depthScore), overallScore];
    // const overallScore = calcScore([fdbkScore, wetDryScore]);
    // return [scoreText(fdbkScore), scoreText(wetDryScore), overallScore];
};

export default checkAnswer;
