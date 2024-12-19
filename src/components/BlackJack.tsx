import React, { useEffect, useRef } from "react";
import { useState } from "react";

interface DeckType {
    D: string[],
    C: string[],
    S: string[],
    H: string[]
}

const basicDeck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const duplicateArray = (array: string[], repeat: number) => {
    const duplicatedArray = [];
    for (let i = 0; i < repeat; i++) {
        duplicatedArray.push(...array);
    }
    return duplicatedArray;
}

class Deck {
    D: string[];
    C: string[];
    S: string[];
    H: string[];



    constructor(deckNumber: number) {
        this.D = duplicateArray(basicDeck, deckNumber);
        this.C = duplicateArray(basicDeck, deckNumber);
        this.S = duplicateArray(basicDeck, deckNumber);
        this.H = duplicateArray(basicDeck, deckNumber);
    }
}

const BlackJack = () => {

    const [deck, setDeck] = useState<DeckType>(new Deck(1));

    const [deckNumber, setDeckNumber] = useState<number>(1);

    const [balance, setBalance] = useState<number>(5000);

    const totalCards = basicDeck.length * 4 * deckNumber;

    const [gameStatus, setGameStatus] = useState<boolean>(false);
    const [gameReady, setGameReady] = useState<boolean>(false);

    const [showRulesFlag, setShowRulesFlag] = useState<boolean>(false);

    const [remainingCards, setRemainingCards] = useState<number>(totalCards);
    const remainingCardsRef = useRef<number>(totalCards);
    remainingCardsRef.current = remainingCards;

    // const [currentTurn, setCurrentTurn] = useState<'P' | 'D'>('P');

    const [playerTotal, setPlayerTotal] = useState<number | 'Blackjack' | 'Bust'>(0);
    const playerTotalRef = useRef<number | 'Blackjack' | 'Bust'>(0);
    playerTotalRef.current = playerTotal;
    const [playerCards, setPlayerCards] = useState<string[]>([]);

    const [dealerTotal, setDealerTotal] = useState<number | 'Blackjack' | 'Bust'>(0);
    const dealerTotalRef = useRef<number | 'Blackjack' | 'Bust'>(0);
    dealerTotalRef.current = dealerTotal;
    const [dealerCards, setDealerCards] = useState<string[]>([]);

    const [winner, setWinner] = useState<string>('');

    useEffect(() => {
        gameSetup();
    }, []);

    useEffect(() => {
        let total = 0;
        playerCards.forEach(el => {
            let val = 0;
            if (el.includes('A')) {
                val = 11;
            } else if (el.includes('J') || el.includes('Q') || el.includes('K')) {
                val = 10;
            } else {
                val = Number(el.match(/\d+/));
            }
            total += val;
        })
        const isAcePresent = playerCards.filter((el) => {
            return el.includes('A');
        }).length > 0;
        if (total > 21 && isAcePresent) {
            total -= 10;
        }
        total <= 21 ? setPlayerTotal(total) : setPlayerTotal('Bust');
        if (total === 21) {
            playerStand();
            if (playerCards.length === 2) {
                setPlayerTotal('Blackjack');
            }
        }
    }, [playerCards]);

    useEffect(() => {
        if (playerTotal === 'Bust') {
            setWinner('Dealer');
        }
    }, [playerTotal]);

    // useEffect(() => {
    //     if (winner) {

    //     }
    // }, [winner]);

    useEffect(() => {
        let total = 0;
        dealerCards.forEach(el => {
            let val = 0;
            if (el.includes('A')) {
                val = 11;
            } else if (el.includes('J') || el.includes('Q') || el.includes('K')) {
                val = 10;
            } else {
                val = Number(el.match(/\d+/));
            }
            total += val;
        })
        const isAcePresent = dealerCards.filter((el) => {
            return el.includes('A');
        }).length > 0;
        if (total > 21 && isAcePresent) {
            total -= 10;
        }
        total <= 21 ? setDealerTotal(total) : setDealerTotal('Bust');
        if (total === 21) {
            if (dealerCards.length === 2) {
                setDealerTotal('Blackjack');
            }
        }
    }, [dealerCards]);

    // const updateDeckNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event?.target;
    //     setDeckNumber(parseInt(value));
    // };

    const genericHit = (turn: 'P' | 'D') => {
        const keys = Object.keys(deck) as (keyof typeof deck)[];
        let chosenSign: keyof typeof deck = keys[keys.length * Math.random() << 0];
        if (deck[chosenSign].length > 0) {
            let chosenCard: string = deck[chosenSign][deck[chosenSign].length * Math.random() << 0];
            const newCard = chosenCard + chosenSign;
            if (turn == 'P') {
                setPlayerCards(arr => [...arr, newCard]);
            } else {
                setDealerCards(arr => [...arr, newCard]);
            }
            setDeck({
                ...deck,
                [chosenSign]: deck[chosenSign].filter((c) => c !== chosenCard)
            });
            setRemainingCards(remainingCardsRef.current - 1);
        } else {
            playerHit();
        }
        if (remainingCardsRef.current === 1) {
            shuffle();
        }
    };

    const playerHit = () => {
        genericHit('P');
    }

    const dealerHit = () => {
        genericHit('D');
    }

    const playerStand = () => {
        async function dealerTurn() {
            while (typeof dealerTotalRef.current === 'number' && dealerTotalRef.current <= 16 || typeof dealerTotalRef.current == 'string' && (dealerTotalRef.current !== 'Bust' && dealerTotalRef.current !== 'Blackjack')) {
                dealerHit();
                await new Promise(resolve => setTimeout(resolve, 1000)); // Attendi 1 secondo tra le chiamate
            }
            setTimeout(() => {
                checkGame();
            }, 1000);
        }
        dealerTurn();
    };

    const checkGame = () => {
        if (dealerTotalRef.current == 'Bust') {
            setWinner('Player');
            return;
        }
        if (dealerTotalRef.current == 'Blackjack' && playerTotalRef.current !== 'Blackjack') {
            setWinner('Dealer');
            return;
        }
        if (dealerTotalRef.current !== 'Blackjack' && playerTotalRef.current == 'Blackjack') {
            setWinner('Player');
            return;
        }
        if (playerTotalRef.current > dealerTotalRef.current) {
            setWinner('Player');
            return;
        }
        if (playerTotalRef.current < dealerTotalRef.current) {
            setWinner('Dealer');
            return;
        }
        if (playerTotalRef.current == dealerTotalRef.current) {
            setWinner('Draw');
            return;
        }
    };

    const gameSetup = () => {
        playerHit();
        setTimeout(() => {
            dealerHit();
        }, 500);
        setTimeout(() => {
            playerHit();
            setGameReady(true);
        }, 1500);
    }

    const shuffle = () => {
        let shufflingText = document.getElementById('shufflingText');
        shufflingText?.classList.add('db');
        setTimeout(() => {
            setDeck(new Deck(deckNumber));
            setRemainingCards(totalCards);
            shufflingText?.classList.remove('db');
        }, 500);
    }

    const restart = () => {
        setDeck(new Deck(deckNumber));
        setWinner('');
        setRemainingCards(totalCards);
        setPlayerCards([]);
        setDealerCards([]);
        setGameReady(false);
        setTimeout(() => {
            gameSetup();
        }, 500);
    }

    const toggleRules = (bool: boolean) => {
        setShowRulesFlag(bool);
    }

    return (
        <React.Fragment>
            <button className="rules-button" onClick={() => toggleRules(true)}>RULES</button>
            <div className="container">
                {/* <input id="decks-amount" type="number" />
                <button id="log" onClick={logDecks}>Logga i mazzi</button> */}

                {/* <span>Remaining cards: {remainingCards}</span> */}
                { /* <p>Last card: {lastCard}</p> */}
                <div className="cards-row">
                    <div className="dealer-side user">
                        <h1 className="text-center">Dealer</h1>
                        <div className="cards-container">
                            {dealerCards.map((card: string) => (
                                <img src={`/assets/img/cards/${card}.svg`} alt="" key={card} className="bj-card" />
                            ))}
                        </div>
                        <p>{dealerTotal}</p>
                    </div>
                    <div className="player-side user">
                        <h1 className="text-center">Player</h1>
                        <div className="buttons-row">
                            <button id="pick" onClick={() => playerHit()}>HIT</button>
                            <button id="stand" onClick={() => playerStand()}>STAND</button>
                        </div>
                        <div className="cards-container">
                            {playerCards.map((card: string) => (
                                <img src={`/assets/img/cards/${card}.svg`} alt="" key={card} className="bj-card" />
                            ))}
                        </div>
                        <p>{playerTotal}</p>
                    </div>
                </div>

                <div id="shufflingText" className="shuffling-text">Shuffling...</div>
            </div>
            {winner ?
                <div className="winner-modal">
                    {winner !== 'Draw' ? <div>{winner} won</div> : <div>{winner}</div>}
                    <div className="button-bar">
                        <button onClick={restart} className="newgame-button">NEW GAME</button>
                    </div>
                </div> :
                null}

            {/* {!gameStatus ?
                <div className="winner-modal">
                    <div className="">Inserisci il numero di mazzi che vuoi utilizzare</div>
                    <div>
                        <input type="number" value={deckNumber} onChange={updateDeckNumber}></input>
                    </div>
                    <div className="button-bar">
                        <button onClick={startGame}>Inizia partita</button>
                    </div>
                </div>
                : null
            } */}
            {showRulesFlag ?
                <div className="winner-modal rules">
                    <p>
                        The purpose of blackjack is to get as close as possible and not to exceed 21.
                        The cards have the indicated value, while the figures J Q and K are worth 10 and the ace is worth 11 or 1, depending on the sum of the cards.
                        You play against the dealer, who is forced to ask for cards until he reaches at least 17, in case the dealer exceeds 21, the player automatically wins.
                        At the beginning of the game 2 cards are awarded to the player and 1 card to the dealer, once the player has finished his turn, in which he can take card or not, begins the dealer’s turn, which if he has not exceeded 17, is forced to take card.
                        If the dealer reaches or exceeds 17 (without exceeding 21), the player who has the highest value wins.
                    </p>
                    <button className="rules-button db" onClick={() => toggleRules(false)}>Close</button>
                </div> :
                null}
            {!gameReady ?
                <div className="winner-modal">
                    Giving cards...
                </div> :
                null}
        </React.Fragment>

    )
}

export default BlackJack;