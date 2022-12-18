import { ReactElement, useEffect, useState } from 'react'
import Controls from './components/controls'
import './App.css'
import LetterData from './dataTypes/letterData'
import { parse, serialize } from 'cookie';
import 'animate.css';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Triangle } from  'react-loader-spinner'
import { listPuzzles, retrievePuzzle } from './api/dataRetrieval';


function App() {
    const [availablePuzzles, setAvailablePuzzles] = useState<number[]>([]);
    const [selectedPuzzleId, setSelectedPuzzle] = useState<string>('1');
    const [data, setData] = useState<LetterData>();
    const [score, setScore] = useState<number>(0);
    const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);

    useEffect(() => {
        listPuzzles().then(res => {
            let ids = res as number[];
            setAvailablePuzzles(ids);
            setSelectedPuzzle(ids[0].toString());
        });
    }, []);

    useEffect(() => {
        if(!selectedPuzzleId) {
            return;
        }

        retrievePuzzle(selectedPuzzleId).then(res => setData(res));
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

    const getDisplay = (): ReactElement => {
        if(availablePuzzles.length === 0) {
            return (
                <Triangle
                    height="80"
                    width="80"
                    color="rgb(12, 131, 243)"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    visible={true}
              />
            )
        }
        
        return (
            <div>
                <select onChange={ event => setSelectedPuzzle(event.target.value) }>
                    { availablePuzzles?.map(p => <option key={ p } value={ p }>{ p }</option>) }
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

    return getDisplay()
}

export default App
