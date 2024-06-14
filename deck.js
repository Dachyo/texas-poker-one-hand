import Card from "./card.js";

const SUITS = ["S", "C", "D", "H"];
const FACE_VALUES = [
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
];

export default class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
    this.disardPile = [];
  }

  get numberOfCards() {
    return this.cards.length;
  }

// предварительное кэширование всех изображений для колоды. работает не в каждом браузере
  preloadImages() {
    let precacheImages = [];
    SUITS.forEach((suit) => {
      FACE_VALUES.forEach((value) => {
        const img = (new Image().src = `images/${value}${suit}.svg`);
        precacheImages.push(img);
      });
    });
    return precacheImages;
  }

 // вместо использования Array.sort(), что предсказуемо даже при использовании Math.random(),
 // создадим свой алгоритм случайной сортировки
  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      //начиная с верха колоды, ищем любую карту меньше текущего индекса.
      const newIndex = Math.floor(Math.random() * (i + 1));
      //сохраняем значение этой карты:
      const oldValue = this.cards[newIndex];
      //затем меняем значения:
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }

  dealTable() {
    // убираем карту
    this.disardPile.push(this.cards.shift());

    // отправляем на стол три карты и удаляем их из колоды
    let tableCards = this.cards.slice(0, 3);
    this.cards.splice(0, 3);

    return tableCards;
  }

  dealPlayer() {
    // убираем карту
    this.disardPile.push(this.cards.shift());

    // сдаем две карты лицевой стороной вверх
    let playerCards = this.cards.slice(0, 2);
    this.cards.splice(0, 2);
    return playerCards;
  }

  dealCard() {
    // убираем карту
    this.disardPile.push(this.cards.shift());

    return this.cards.shift();
  }
}

function freshDeck() {
  return SUITS.flatMap((suit) => {
    return FACE_VALUES.map((value) => {
      return new Card(suit, value);
    });
  });
}
