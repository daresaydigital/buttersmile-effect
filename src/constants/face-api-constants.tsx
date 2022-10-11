const FaceApiConstants = {
    MODEL_URL: process.env.PUBLIC_URL + "/models",

    expressionTypes: {
        angry: 'angry',
        disgusted: 'disgusted',
        fearful: 'fearful',
        happy: 'happy',
        neutral: 'neutral',
        sad: 'sad',
        surprised: 'surprised',
    }
}

export default FaceApiConstants;