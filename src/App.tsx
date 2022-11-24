import { useEffect, useState } from 'react'
import Controls from './components/controls'
import './App.css'
import LetterData from './dataTypes/letterData'

const getData = async (): Promise<any> => {
    return fetch(
        'src/data/test.json', 
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
    const [data, setData] = useState<LetterData>();

    useEffect(() => {
        getData().then(res => setData(res));
    }, [])

    return (
        <div>
            <h1>Unscramble</h1>
            <hr />
            { data ? 
                <div>
                    <Controls centerLetter={ data.centerLetter } outerLetters={ data.outerLetters } words={ data.words } />
                </div>
                :
                <div></div>
            }
        </div>
    )
}

export default App
