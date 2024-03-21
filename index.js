const englishWords = require("an-array-of-english-words");

const DIGIT_MAPPING = {
  2: "ABC",
  3: "DEF",
  4: "GHI",
  5: "JKL",
  6: "MNO",
  7: "PQRS",
  8: "TUV",
  9: "WXYZ",
};

const generateVanityNumbers = (phoneNumber) => {
  const vanityNumbers = [];
  const cleanedPhoneNumber = String(phoneNumber).replace(/\D/g, "");
  const digits = cleanedPhoneNumber.split("");
  const letterCombinations = digits.map(
    (digit) => DIGIT_MAPPING[digit] || digit
  );
  const product = cartesianProduct(...letterCombinations);
  for (const combination of product) {
    vanityNumbers.push(combination.join(""));
  }
  return vanityNumbers;
};

function cartesianProduct(...arrays) {
  return arrays.reduce(
    (acc, array) => {
      const result = [];
      for (const value of acc) {
        for (const item of array) {
          result.push([...value, item]);
        }
      }
      return result;
    },
    [[]]
  );
}

const vanityComputation = async (number, vanityNumbers) => {
  try {
    console.log("processing words...");

    let meaningWords = [];
    let vanities = [];

    vanityNumbers.forEach((word) => {
      const w = englishWords.includes(word.toUpperCase());
      if (w) meaningWords.push(word);
    });

    let i = 0;
    while (meaningWords.length < 5) {
      meaningWords.push(vanityNumbers[i]);
      i++;
    }

    meaningWords.forEach((element) =>
      vanities.push(number.slice(0, 6) + element)
    );

    return vanities;
  } catch (error) {
    console.error("Error processing words:", error);
    return;
  }
};

module.exports.handler = async (event) => {
  console.log("START OF FILE");

  const init = async (number) => {
    const vanity = number.substring(6).split("-").join("");
    const vanityNumbers = generateVanityNumbers(vanity);
    const numberVanities = await vanityComputation(number, vanityNumbers);
    console.log(numberVanities);
  };

  init("1-800-224-5489");
};
