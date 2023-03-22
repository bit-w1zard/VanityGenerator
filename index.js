const fs = require("fs");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "vanity_numbers";

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
    const data = fs.readFileSync("words.txt", "utf8");
    const wordsArray = data.split("\n").map((word) => word.toUpperCase());

    console.log("processing words...");

    let meaningWords = [];
    let vanities = [];

    vanityNumbers.forEach((word) => {
      const w = wordsArray.includes(word);
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
    console.error("Error reading file:", error);
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

    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: "1",
          vanity_numbers: "12323",
          numbers: numberVanities,
        },
      })
    );
  };

  init("1-800-224-5489");
};
