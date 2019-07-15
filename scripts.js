const songLyricsArray = "Yeah I'm gonna take my horse to the old town road, I'm gonna ride 'til I can't no more, I'm gonna take my horse to the old town road, I'm gonna ride 'til I can't no more (Kio, Kio)".split(',');

//initial redux state
const initialState = {
  songLyricsArray: songLyricsArray,
  arrayPosition: 0,
}

//Reducer
const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case 'NEXT_LYRIC':
      let newArrayPosition = state.arrayPosition + 1;
      newState = {
        songLyricsArray: state.songLyricsArray,
        arrayPosition: newArrayPosition,
      }
      return newState;
    case 'RESTART_SONG':
      newState = initialState;
      return newState;
    default:
      return state;
  }
}

// JEST TESTS + SETUP
const { expect } = window;

expect(reducer(initialState, { type: null })).toEqual(initialState);

expect(reducer(initialState, { type: 'NEXT_LYRIC'})).toEqual({
  songLyricsArray: songLyricsArray,
  arrayPosition: 1
})

expect(reducer({
  songLyricsArray: songLyricsArray,
  arrayPosition: 1,
  },
  { type: 'RESTART_SONG' })
).toEqual(initialState);

//store
const { createStore } = Redux;
const store = createStore(reducer);
console.log(store.getState());

//Rendering state in dom
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }
  const currentLine = store.getState().songLyricsArray[store.getState().arrayPosition];
  const renderedLine = document.createTextNode(currentLine);
  document.getElementById('lyrics').appendChild(renderedLine);
}

window.onload = function() {
  renderLyrics();
}

//click listener
const userClick = () => {
  const currentState = store.getState();
  if (currentState.arrayPosition === currentState.songLyricsArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG' } );
  } else {
    store.dispatch({ type: 'NEXT_LYRIC' } );
  }
}

//subscribe to redux store
store.subscribe(renderLyrics);
