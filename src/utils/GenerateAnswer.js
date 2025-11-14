export const Ans = {
    /**
     * Generates a random number within the min max range, optionally, provide a number
     * that the random number should be divisible by 
     *
     * @param {number} min of the range
     * @param {number} max of the range
     * @param {number} divNum random number should be divisible by. default to 1 if not given
     * @returns {number} random number optionally divisible by divNum
     *
     * ex: generateAnswer(0, 2000, 50)
     * output: 150, 200, 300...
     */
    generateAnswer : (min, max, divNum=1) => {
        const randNum = Math.random();
        const ans = Math.floor(randNum * (Math.floor(max/divNum) - Math.ceil(min/divNum))) + min;
        // console.log(randNum, min, max, divNum, ans)
        return (ans * divNum).toFixed(2);
    },

    generatePercentAnswer : (min, max, divNum=10) => {
        return Math.floor(Math.random() * 11.0) / divNum;
    },

    generateFixedAnswer : (ans) => {
        return parseFloat(ans.toFixed(2));
    }
};

export default Ans;