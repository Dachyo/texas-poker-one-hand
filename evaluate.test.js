import checkPlayerHand, {
  analyzeHand,
  checkRoyalFlush,
  royalFlushHelper,
  checkStraightFlush,
  checkFourOfAKind,
  checkFullHouse,
  checkFlush,
  checkStraight,
  checkThreeOfAKind,
  checkTwoPair,
  checkPair,
} from "./evaluate.js";
import Card from "./card.js";

describe("checkPlayerHand()", () => {
  const suits = ["H", "C", "S", "D"];
  const faceValues = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A",
  ];

  // Проверка всех четырех мастей флеш-рояля
  test("Check all combinations of Royal Flush", () => {
    suits.forEach((suit) => {
      const testPlayerHand = [new Card(suit, "T"), new Card(suit, "A")];
      const testTableCards = [
        new Card(suit, "2"),
        new Card(suit, "6"),
        new Card(suit, "J"),
        new Card(suit, "Q"),
        new Card(suit, "K"),
      ];

      const results = checkPlayerHand(testPlayerHand, testTableCards);
      expect(results).not.toBeNull;
      expect(results.score).toBe(900);
      expect(results.handName).toBe("Royal Flush");
    });
  });

  // Проверяем все версии стрит-флеша
  test("Check all combinations of Straight Flush", () => {
    suits.forEach((suit) => {
      for (let i = 0; i < faceValues.length - 5; i++) {
        // Чтобы имитировать игрока, которому нужна последняя карта, одна карта не масти в руке игрока
        const testPlayerHand = [
          new Card(suit === "D" ? "H" : "D", "2"),
          new Card(suit, faceValues[i]),
        ];
        // Чтобы имитировать игрока, которому нужна последняя карта, одна карта на столе не масти
        const testTableCards = [
          new Card(suit, faceValues[i + 1]),
          new Card(suit === "D" ? "H" : "D", "6"),
          new Card(suit, faceValues[i + 2]),
          new Card(suit, faceValues[i + 3]),
          new Card(suit, faceValues[i + 4]),
        ];

        const results = checkPlayerHand(testPlayerHand, testTableCards);
        expect(results.score).toBeGreaterThanOrEqual(800);
        expect(results.score).toBeLessThan(900);
        expect(results.handName).toBe("Straight Flush");
      }
    });
  });

  // Проверяем все версии каре
  test("Check all combinations of Four of a Kind", () => {
    faceValues.forEach((faceValue) => {
      // Мы симулируем игрока, у которого есть некоторые необходимые карты, а остальные лежат на столе
      const testPlayerHand = [
        new Card("H", faceValue),
        new Card("S", faceValue),
      ];
      const testTableCards = [
        new Card("S", faceValue === "2" ? "3" : "2"), // Фильтруем карты
        new Card("C", faceValue === "4" ? "3" : "4"), // Фильтруем карты
        new Card("D", faceValue === "6" ? "5" : "6"), // Фильтруем карты
        new Card("C", faceValue),
        new Card("D", faceValue),
      ];

      const results = checkPlayerHand(testPlayerHand, testTableCards);
      expect(results).not.toBeNull;
      expect(results.score).toBeGreaterThanOrEqual(700);
      expect(results.score).toBeLessThan(800);
      expect(results.handName).toBe("Four of a Kind");
    });
  });

  // Проверяем все версии фулл-хауса
  test("Check all combinations of Full House", () => {
    faceValues.forEach((tripleValue) => {
      // Мы симулируем игрока, у которого есть некоторые необходимые карты, а остальные лежат на столе
      for (let i = 1; i < faceValues.length - 1; i++) {
        if (tripleValue === faceValues[i]) {
          continue;
        }

        let fillerCard1;
        let fillerCard2;

        if (tripleValue === "2") {
          fillerCard1 = new Card("C", faceValues[i] === "3" ? "4" : "3");
        } else if (faceValues[i] === "2") {
          fillerCard1 = new Card("C", tripleValue === "3" ? "4" : "3");
        } else {
          fillerCard1 = new Card("C", "2");
        }

        if (tripleValue === "2") {
          fillerCard2 = new Card("H", faceValues[i] === "3" ? "4" : "3");
        } else if (faceValues[i] === "2") {
          fillerCard2 = new Card("H", tripleValue === "3" ? "4" : "3");
        } else {
          fillerCard2 = new Card("H", "2");
        }

        const testPlayerHand = [
          new Card("H", tripleValue),
          new Card("D", faceValues[i]),
        ];
        const testTableCards = [
          new Card("S", faceValues[i]),
          new Card("C", tripleValue),
          new Card("D", tripleValue),
          fillerCard1,
          fillerCard2,
        ];

        const results = checkPlayerHand(testPlayerHand, testTableCards);
        expect(results).not.toBeNull;
        expect(results.score).toBeGreaterThanOrEqual(600);
        expect(results.score).toBeLessThan(700);
        expect(results.handName).toBe("Full House");
      }
    });
  });
});

test("A Flush using 2S, 4S, 6S, 8S, TS", () => {
  const testPlayerHand = [new Card("S", "8"), new Card("H", "Q")];
  const testTableCards = [
    new Card("S", "4"),
    new Card("S", "6"),
    new Card("S", "2"),
    new Card("S", "T"),
    new Card("C", "Q"),
  ];
  const handData = analyzeHand(testPlayerHand, testTableCards);
  expect(handData).not.toBeNull;
  const results = checkFlush(handData);
  expect(results).not.toBeNull;
  expect(results.score).toBeGreaterThanOrEqual(500);
  expect(results.score).toBeLessThan(600);
  expect(results.handName).toBe("Flush");
});

test("A Straight using 3S, 4H, 5C, 6D, 7S", () => {
  const testPlayerHand = [new Card("S", "Q"), new Card("S", "7")];
  const testTableCards = [
    new Card("H", "4"),
    new Card("S", "3"),
    new Card("D", "6"),
    new Card("S", "T"),
    new Card("C", "5"),
  ];
  const handData = analyzeHand(testPlayerHand, testTableCards);
  expect(handData).not.toBeNull;
  const results = checkStraight(handData);
  expect(results).not.toBeNull;
  expect(results.score).toBeGreaterThanOrEqual(400);
  expect(results.score).toBeLessThan(500);
  expect(results.handName).toBe("Straight");
});

test("A Three of a Kind using 9S, 9H, 9C", () => {
  const testPlayerHand = [new Card("H", "9"), new Card("S", "9")];
  const testTableCards = [
    new Card("H", "4"),
    new Card("S", "3"),
    new Card("D", "6"),
    new Card("C", "9"),
    new Card("C", "5"),
  ];
  const handData = analyzeHand(testPlayerHand, testTableCards);
  expect(handData).not.toBeNull;
  const results = checkThreeOfAKind(handData);
  expect(results).not.toBeNull;
  expect(results.score).toBeGreaterThanOrEqual(300);
  expect(results.score).toBeLessThan(400);
  expect(results.handName).toBe("Three of a Kind");
});

test("A Two Pair using 3S, 3H, TC, TD", () => {
  const testPlayerHand = [new Card("S", "3"), new Card("S", "7")];
  const testTableCards = [
    new Card("H", "4"),
    new Card("H", "3"),
    new Card("D", "T"),
    new Card("C", "T"),
    new Card("C", "5"),
  ];
  const handData = analyzeHand(testPlayerHand, testTableCards);
  expect(handData).not.toBeNull;
  const results = checkTwoPair(handData);
  expect(results).not.toBeNull;
  expect(results.score).toBeGreaterThanOrEqual(200);
  expect(results.score).toBeLessThan(300);
  expect(results.handName).toBe("Two Pair");
});

test("A Two Pair using KS, KH", () => {
  const testPlayerHand = [new Card("S", "K"), new Card("S", "7")];
  const testTableCards = [
    new Card("H", "K"),
    new Card("H", "3"),
    new Card("D", "T"),
    new Card("C", "2"),
    new Card("C", "5"),
  ];
  const handData = analyzeHand(testPlayerHand, testTableCards);
  expect(handData).not.toBeNull;
  const results = checkPair(handData);
  expect(results).not.toBeNull;
  expect(results.score).toBeGreaterThanOrEqual(100);
  expect(results.score).toBeLessThan(200);
  expect(results.handName).toBe("Pair");
});
