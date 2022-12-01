import { useEffect, useState } from "react";
import OuterLetterButton from "./outerLetterButton";

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

    const scrambleLetters = () => {
        let currentLetters = outerLetters;
        let shuffled = [];

        while(currentLetters!.length > 0) {
            let index = Math.floor(Math.random() * currentLetters!.length);
            shuffled.push(currentLetters![index]);
            currentLetters!.splice(index, 1);
        }

        setOuterLetters(shuffled);
    }

    const updateInput = (letter: string) => {
        setInput(input + letter);
    }

    return (
        <div key={ centLetter }>
            { getFormattedInput() }
            { outerLetters ? 
                <div>
                    <OuterLetterButton letter={ outerLetters[0] } callbackFn={ updateInput } />
                    <OuterLetterButton letter={ outerLetters[1] } callbackFn={ updateInput } />
                    <br />
                    <OuterLetterButton letter={ outerLetters[2] } callbackFn={ updateInput } />
                    <div onClick={ () => setInput(input + centerLetter) } className="letter-btn center-letter">{ centerLetter }</div> 
                    <OuterLetterButton letter={ outerLetters[3] } callbackFn={ updateInput } />
                    <br />
                    <OuterLetterButton letter={ outerLetters[4] } callbackFn={ updateInput } />
                    <OuterLetterButton letter={ outerLetters[5] } callbackFn={ updateInput } />
                    <br />
                    <br />
                    <button onClick={ deleteChar } className="side-margins">delete</button>
                    <button onClick={ scrambleLetters }>&#8634;</button>
                    <button onClick={ checkWord } className="side-margins">enter</button>
                </div>
                :
                <div></div>
            }
        </div>
    )
}

export default Controls;
