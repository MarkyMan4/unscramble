import { useEffect, useState } from 'react'
import Controls from './components/controls'
import './App.css'
import LetterData from './dataTypes/letterData'
import { parse, serialize } from 'cookie';
import 'animate.css';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// this is temporary, I'll remove it once I automate daily collection of puzzles
const availablePuzzles: number[] = [];

for(let i = 1650; i <= 1674; i++) {
    availablePuzzles.push(i);
}

availablePuzzles.reverse();

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
    const [selectedPuzzleId, setSelectedPuzzle] = useState<string>(availablePuzzles[0].toString());
    const [data, setData] = useState<LetterData>();
    const [score, setScore] = useState<number>(0);
    const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);

    useEffect(() => {
        getData(selectedPuzzleId).then(res => setData(res));
        setScore(0);
        setCorrectGuesses([]);

        let cookies = parse(document.cookie);
        if(selectedPuzzleId in cookies) {
            let puzzleData = JSON.parse(cookies[selectedPuzzleId]);
            setScore(puzzleData.score);
            setCorrectGuesses(puzzleData.words);
        }
        else {
            document.cookie = serialize(
                selectedPuzzleId, 
                JSON.stringify({score: 0, words: []}),
                {expires: new Date(2100, 0, 1)}
            );
        }
    }, [selectedPuzzleId])

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
            toast('Already found!', {type: 'warning'});
        }
        else if(word.length < 4) {
            toast('Too short!', {type: 'warning'});
        }
        else if(!word.includes(data!.centerLetter)) {
            toast('Missing center letter!', {type: 'warning'});
        }
        else if(data?.words?.includes(word)) {
            let newScore = 0;

            if(word.length === 4) {
                newScore = score + 1;
            }
            else {
                newScore = score + word.length;

                // if word is a pangram, add 7 points
                if(isPangram(word)) {
                    newScore += 7;
                }
            }

            if(isPangram(word)) {
                toast('Pangram!')
            }
            else {
                toast('Nice!', {type: 'success'})
            }

            setScore(newScore);

            // update score and words found in cookie
            let cookies = parse(document.cookie);
            let puzzleData = JSON.parse(cookies[selectedPuzzleId]);
            puzzleData.score = newScore;
            puzzleData.words.push(word);

            document.cookie = serialize(
                selectedPuzzleId, 
                JSON.stringify(puzzleData),
                {expires: new Date(2100, 0, 1)}
            );

            // add to correct guesses
            setCorrectGuesses(guesses => [...guesses, word].sort());
        }
        else {
            toast('Not in word list!', {type: 'warning'});
        }        
    }

    return (
        <div>
            <select onChange={ event => setSelectedPuzzle(event.target.value) }>
                { availablePuzzles.map(p => <option key={ p } value={ p }>{ p }</option>) }
            </select>

            <h1 className="small-margin-bottom animate__animated animate__pulse" key={ score }>Score: <span>{ score }</span></h1>
            <h3 className="small-margin-bottom">Target score: { Math.floor(data?.maxScore as number * 0.7) }</h3>
            <h3 className="small-margin-bottom">Possible words: { data?.words.length }</h3>
            <hr />
            <ToastContainer 
                position="top-center" 
                pauseOnHover={false}
                theme="light"
                autoClose={2000}
                transition={Zoom}
            />
            <br />
            { data ? 
                <div>
                    <Controls centLetter={ data.centerLetter } letters={ data.outerLetters } checkWordCallback={ checkWord } />

                    <br />
                    <hr />
                    <h2>Words found { correctGuesses.length }</h2>
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
