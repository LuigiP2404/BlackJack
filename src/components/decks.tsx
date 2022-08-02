import React, { useEffect, useState } from "react";

function Decks() {
    let [remainingCards, updateRemainingCards] = useState<number>(13 * 4);

    const basicDeck: (string)[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    let [deck, updateDeck] = useState({
        D: basicDeck,
        C: basicDeck,
        S: basicDeck,
        H: basicDeck
    })

    let [currentCard, updateCurrentCard] = useState<string>('');

    let [player, updatePlayer] = useState<string[]>([]);
    let [playerTotal, updatePlayerTotal] = useState<number|string>(0);

    let [dealer, updateDealer] = useState<string[]>([]);
    let [dealerTotal, updateDealerTotal] = useState<number|string>(0);

    let [curTurn, updateTurn] = useState('p');

    const hit = () => {
        const keys = Object.keys(deck) as (keyof typeof deck)[];
        let chosenSign: keyof typeof deck = keys[keys.length * Math.random() << 0];
        if (deck[chosenSign].length > 0) {
            let chosenCard: string = deck[chosenSign][deck[chosenSign].length * Math.random() << 0];
            updateCurrentCard(chosenCard + chosenSign);
            if (curTurn === 'p') {
                updatePlayer(arr => [...arr, chosenCard + chosenSign])
                updateTurn('d');
            } else {
                updateTurn('p');
                dealerHit();
            }
            updateDeck({
                ...deck,
                [chosenSign]: deck[chosenSign].filter((c) => c !== chosenCard)
            });
            updateRemainingCards(remainingCards - 1);
        } else {
            hit();
        }
        if (remainingCards === 1) {
            shuffle();
        }
    }

    const dealerHit = () => {
        updateDealer(arr => [...arr, currentCard])
    }

    const stand = () => {
        console.log('stand');
    }

    useEffect(() => {
        let total = 0;
        /* var isA = player.some((card) => {
            card.includes('A');
        });
        if (player) {
            updatePlayerTotal('Blackjack');
        } */
        player.forEach(el => {
            let val = 0;
            if (el.includes('A')) {
                total <= 10 ? val = 11 : val = 1;
            } else if (el.includes('J') || el.includes('Q') || el.includes('K')) {
                val = 10;
            } else {
                val = Number(el.match(/\d+/));
            }
            total += val;
        })
        total <= 21 ? updatePlayerTotal(total) : updatePlayerTotal('Bust');
        if (total === 21) {
            stand();
            if (player.length === 2) {
                updatePlayerTotal('Blackjack');
            }
        }
    }, [player]);

    const shuffle = () => {
        let shufflingText = document.getElementById('shufflingText');
        shufflingText?.classList.add('db');
        setTimeout(() => {
            updateDeck({
                D: basicDeck,
                C: basicDeck,
                S: basicDeck,
                H: basicDeck
            })
            updateRemainingCards(13 * 4);
            shufflingText?.classList.remove('db');
        }, 500);

    }
    return (
        <div className="container">
            {/* <input id="decks-amount" type="number" />
            <button id="log" onClick={logDecks}>Logga i mazzi</button> */}

            <span>Remaining cards: {remainingCards}</span>
            { /* <p>Last card: {lastCard}</p> */}
            <div className="cards-row">
                <div className="player-side">
                    <h1 className="text-center">Player</h1>
                    {player.map((card) => (
                        <img src={`/assets/img/cards/${card}.svg`} alt="" key={card} className="bj-card" />
                    ))}
                    <p>Total: {playerTotal}</p>
                </div>
                <div className="dealer-side">
                    <h1 className="text-center">Dealer</h1>
                    {dealer.map((card) => (
                        <img src={`/assets/img/cards/${card}.svg`} alt="" key={card} className="bj-card" />
                    ))}
                    <p>Total: {dealerTotal}</p>
                </div>
            </div>
            <div className="buttons-row">
                <button id="pick" onClick={hit}>Hit</button>
                <button id="stand" onClick={stand}>Stand</button>
            </div>
            <div id="shufflingText" className="shuffling-text">Shuffling...</div>
        </div>
    );
}

export default Decks;