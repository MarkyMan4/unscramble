function OuterLetterButton({letter, callbackFn}: {letter: string, callbackFn: (letter: string) => void}) {
    return (
        <div key={ letter } onClick={ () => callbackFn(letter) } className="letter-btn animate__animated animate__flipInX">
            { letter }
        </div>
    )
}

export default OuterLetterButton;