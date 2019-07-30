const emotionsCategory = [
  { name: "Positive", value: ["happy"] },
  { name: "Neutral", value: ["neutral"] },
  { name: "Negative", value: ["sad", "angry"] }
];
const lowerThreshold = 0;
const upperThreshold = 1.0;

getScoreForEmotion = (expressions, n) => {
  const currentEmotion = getCurrentEmotion(expressions);
  const currentEmotionCategory = getEmotionCategory(currentEmotion);
  const weight = (upperThreshold - lowerThreshold) / (n / 2);
  let score = 0;
  const CurrentEmotionValue = expressions[currentEmotion];
  if (currentEmotionCategory === "Neutral") {
    score = n / 2;
  } else if (currentEmotionCategory === "Positive") {
    score = n / 2 + Math.ceil(CurrentEmotionValue / weight);
  } else if (currentEmotionCategory === "Negative") {
    score = Math.ceil((upperThreshold - CurrentEmotionValue) / weight);
  }
  return score;
};


getCurrentEmotion = expressions => {
  const output = Object.keys(expressions).reduce((a, b) =>
    expressions[a] > expressions[b] ? a : b
  );
  return output;
};

getEmotionCategory = currentemotion => {
  let category;
  const currentEmotionKey = currentemotion;

  for (let i = 0; i < emotionsCategory.length; i++) {
    for (let k = 0; k < emotionsCategory[i].value.length; k++) {
      if (emotionsCategory[i].value[k] === currentEmotionKey) {
        category = emotionsCategory[i].name;
      }
    }
  }

  return category;
};
