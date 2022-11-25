import { useEffect, useState } from 'react'
import Controls from './components/controls'
import './App.css'
import LetterData from './dataTypes/letterData'

const getData = async (puzzleId: string): Promise<any> => {
    return fetch(
        `data/${puzzleId}.json`, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    ).then(res => {
        return res.json();
    }).then(jsonData => {
        return jsonData;
    })
}

function App() {
    const [selectedPuzzled, setSelectedPuzzle] = useState<string>('1650');
    const [data, setData] = useState<LetterData>();
    const [score, setScore] = useState<number>(0);
    const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);

    useEffect(() => {
        getData(selectedPuzzled).then(res => setData(res));
        setScore(0);
        setCorrectGuesses([]);
    }, [selectedPuzzled])

    const isPangram = (word: string): boolean => {
        const charList = word.split('');

        if(!charList.includes(data!.centerLetter)) {
            return false;
        }

        let charsIncluded = data!.outerLetters.map(letter => {
            if(!charList.includes(letter)) {
                return false;
            }

            return true;
        })

        return charsIncluded.every(val => val === true);
    }

    const checkWord = (word: string) => {
        if(correctGuesses.includes(word)) {
            alert('already found');
        }
        else if(word.length < 4) {
            alert('too short');
        }
        else if(!word.includes(data!.centerLetter)) {
            alert('missing center letter');
        }
        else if(data?.words?.includes(word)) {
            if(word.length === 4) {
                setScore(score + 1);
            }
            else {
                let newScore = score + word.length;

                // if word is a pangram, add 7 points
                if(isPangram(word)) {
                    newScore += 7;
                }

                setScore(newScore);
            }

            // add to correct guesses
            setCorrectGuesses(guesses => [...guesses, word]);
        }
        else {
            alert('not in word list');
        }        
    }

    return (
        <div>
            <select onChange={ event => setSelectedPuzzle(event.target.value) }>
                <option value="1650">1650</option>
                <option value="1651">1651</option>
                <option value="1658">1658</option>
            </select>

            <h1>Score: { score }</h1>
            <hr />
            <br />
            { data ? 
                <div>
                    <Controls centLetter={ data.centerLetter } letters={ data.outerLetters } checkWordCallback={ checkWord } />

                    <br />
                    <hr />
                    <h2>Words found</h2>
                    <ul style={ {textAlign: 'left', fontSize: '2vh'} }>
                    { correctGuesses.map(word => <li key={ word }>{ word }</li>) }
                    </ul>
                </div>
                :
                <div></div>
            }
        </div>
    )
}

export default App
