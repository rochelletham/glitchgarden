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

const checkAnswer = (userDelayDur, userFdbkGain, userWetDryVal,
                    ansDelayDur, ansFdbkGain, ansWetDryVal
                    ) => {
    console.log("current answers: ", 
        "\ndelayTime Ans: ", ansDelayDur, 
        "\nfdbk gain Ans: ", ansFdbkGain,
        "\nwetdry Ans: ", ansWetDryVal);
    
    const delayScore = withinRange(userDelayDur, ansDelayDur, answers.paramCorrectRanges.delayDur.beginner);
    const fdbkScore = withinRange(userFdbkGain, ansFdbkGain, answers.paramCorrectRanges.fdbkGain.beginner);
    const wetDryScore = withinRange(userWetDryVal, ansWetDryVal, answers.paramCorrectRanges.wetDry.beginner)
    const overallScore = calcScore([delayScore, fdbkScore, wetDryScore]);
    return [scoreText(delayScore), scoreText(fdbkScore), scoreText(wetDryScore), overallScore];
};

export default checkAnswer;
