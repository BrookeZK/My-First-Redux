const songList = {
1:"Yeah I'm gonna take my horse to the old town road, I'm gonna ride 'til I can't no more, I'm gonna take my horse to the old town road, I'm gonna ride 'til I can't no more (Kio, Kio)".split(','),
2: "Twenty-five years and my life is still, Trying to get up that great big hill of hope, For a destination, I realized quickly when I knew I should, That the world was made up of this brotherhood of man, For whatever that means, And so I cry sometimes when I'm lying in bed, Just to get it all out what's in my head, And I, I am feeling a little peculiar, And so I wake in the morning and I step outside, And I take a deep breath and I get real high, and I Scream from the top of my lungs, What's going on?, And I say hey yeah yeah hey yeah yeah, I said hey what's going on?, And I say hey yeah yeah hey yeah yeah,I said hey what's going on?".split(', ')
};

//initial redux state
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Old Town Road",
      artist: "Lil Nas X",
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      title: "What's Goin' On",
      artist: "Four Non-Blondes",
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0,
    }
  }
};

// REDUX REDUCER
const lyricsChangeReducer = (state = initialState.songsById, action) => {

  // Declares several variables used below, without yet defining.
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;

  switch (action.type) {
    case 'NEXT_LYRIC':

      // Locates the arrayPosition of the song whose ID was provided
      // in the action's payload, and increments it by one:
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;

      // Creates a copy of that song's entry in the songsById state slice,
      // and adds the updated newArrayPosition value we just calculated as its arrayPosition:
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })

      // Creates a copy of the entire songsById state slice, and adds the
      // updated newSongsById state entry we just created to this new copy:
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });

      // Returns the entire newSongsByIdStateSlice we just constructed, which will
      // update state in our Redux store to match this returned value:
      return newSongsByIdStateSlice;

    case 'RESTART_SONG':

      // Creates a copy of the song entry in songsById state slice whose ID matches
      // the currentSongId included with the action, sets the copy's arrayPosition value
      // to 0:
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })

      // Creates a copy of the entire songsById state slice, and adds the
      // updated newSongsByIdEntry we just created to this copy:
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });

      // Returns the entire newSongsByIdStateSlice we just constructed, which will
      // update the songsById state slice in our Redux store to match the new slice returned:
      return newSongsByIdStateSlice;

      // If action is neither 'NEXT_LYRIC' nor 'RESTART_STATE' type, return existing state:
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
    return action.newSelectedSongId 
    default:
    return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: lyricsChangeReducer
})

//store
const { createStore } = Redux;
const store = createStore(rootReducer);
console.log(store.getState());

// JEST TESTS + SETUP
const { expect } = window;

expect(lyricsChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

expect(lyricsChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2})).toEqual({
  1: {
    title: "Old Town Road",
    artist: "Lil Nas X",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1,
  }
})

expect(lyricsChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: "Old Town Road",
    artist: "Lil Nas X",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0,
  }
});

expect(songChangeReducer(initialState.currentSongId, { type: 'CHANGE_SONG', newSelectedSongId: 1})).toEqual(1);
expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));
expect(store.getState().songsById).toEqual(lyricsChangeReducer(undefined, { type: null }));

expect(rootReducer(initialState, { type: null})).toEqual(initialState);


//Rendering state in dom
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }
  if (store.getState().currentSongId) {
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

const renderSongs = () => {
  const songsById = store.getState().songsById;
  for (const songKey in songsById) {
    const song = songsById[songKey]
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

window.onload = function() {
  renderSongs();
  renderLyrics();
}

//click listeners
const userClick = () => {
  if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].songArray.length -1) {
    store.dispatch({ type: 'RESTART_SONG',
                      currentSongId: store.getState().currentSongId } );
  } else {
    store.dispatch({ type: 'NEXT_LYRIC',
                      currentSongId: store.getState().currentSongId } );
  }
}

const selectSong = (newSongId) => {
  let action;
  if (store.getState().currentSongId) {
    action = {
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    }
    store.dispatch(action);
  } 
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

//subscribe to redux store
store.subscribe(renderLyrics);
