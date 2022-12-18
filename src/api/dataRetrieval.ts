import axios from "axios";

export const listPuzzles = async () => {
    return axios.get('https://o56hxnmpvl.execute-api.us-east-2.amazonaws.com/puzzle_retriever/list_puzzles')
        .then(res => res.data)
        .catch(err => {
            console.log('failed to retrieve puzzle list');
            return [];
        });
}

export const retrievePuzzle = async (puzzleId: string) => {
    return axios.get(`https://o56hxnmpvl.execute-api.us-east-2.amazonaws.com/puzzle_retriever/${puzzleId}`)
        .then(res => res.data)
        .catch(err => {
            console.log('failed to retrieve puzzle list');
            return {};
        });
}
