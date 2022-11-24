import { useEffect, useState } from "react";
import LetterData from '../dataTypes/letterData'

function Controls(letterData: LetterData) {
    const [input, setInput] = useState('');
    const [centerLetter, setCenterLetter] = useState<string>('');
    const [outerLetters, setOuterLetters] = useState<string[]>();
    const [words, setWords] = useState<string[]>();

    useEffect(() => {
        setCenterLetter(letterData.centerLetter)
        setOuterLetters(letterData.outerLetters);
        setWords(letterData.words);
    }, [letterData]);

    const getFormattedInput = () => {
        return (
            <div className="user-input">
                { input }
            </div>
        );
    }

    return (
        <div>
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
                    <button onClick={ () => setInput('') } className="side-margins">clear</button>
                    <button className="side-margins">enter</button>
                </div>
                :
                <div></div>
            }
        </div>
    )
}

export default Controls;
