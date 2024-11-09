const generateAnswer = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(2);
};

export default generateAnswer;