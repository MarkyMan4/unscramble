import { useEffect, useState } from "react";
// import LetterData from '../dataTypes/letterData'

function Controls({centLetter, letters, checkWordCallback}: {centLetter: string, letters: string[], checkWordCallback: (word: string) => void} ) {
    const [input, setInput] = useState('');
    const [centerLetter, setCenterLetter] = useState<string>('');
    const [outerLetters, setOuterLetters] = useState<string[]>();

    useEffect(() => {
        setCenterLetter(centLetter)
        setOuterLetters(letters);
    }, [centLetter, letters]);

    const getFormattedInput = () => {
        return (
            <div className="user-input">
                { input }
            </div>
        );
    }

    const checkWord = () => {
        checkWordCallback(input);
        setInput('');
    }

    const deleteChar = () => {
        if(input.length === 0) {
            return;
        }

        setInput(val => val.substring(0, val.length - 1));
    }

    return (
        <div key={ centLetter }>
            { getFormattedInput() }
            { outerLetters ? 
                <div>
                    <div onClick={ () => setInput(input + outerLetters[0]) } className="letter-btn">{ outerLetters[0] }</div>
                    <div onClick={ () => setInput(input + outerLetters[1]) } className="letter-btn">{ outerLetters[1] }</div> 
                    <br />
                    <div onClick={ () => setInput(input + outerLetters[2]) } className="letter-btn">{ outerLetters[2] }</div>
                    <div onClick={ () => setInput(input + centerLetter) } className="letter-btn center-letter">{ centerLetter }</div> 
                    <div onClick={ () => setInput(input + outerLetters[3]) } className="letter-btn">{ outerLetters[3] }</div>
                    <br />
                    <div onClick={ () => setInput(input + outerLetters[4]) } className="letter-btn">{ outerLetters[4] }</div>
                    <div onClick={ () => setInput(input + outerLetters[5]) } className="letter-btn">{ outerLetters[5] }</div> 
                    <br />
                    <br />
                    <button onClick={ deleteChar } className="side-margins">delete</button>
                    <button onClick={ checkWord } className="side-margins">enter</button>
                </div>
                :
                <div></div>
            }
        </div>
    )
}

export default Controls;
