console.log("main.js loaded");

// Initialize Firebase
try {
    var config = firebaseConfig;
    firebase.initializeApp(config);
    db = firebase.database();
    console.log('Successfully initialized database');
} catch {
    console.log('Failed to initialize database');
}

// Delete this out - just for reference
var title = $('#title');
var wink = $('#wink');
title.css('text-align', 'center');
wink.css('height', '30px');

// Go nuts
class GiphySearch {
    constructor(searchString) {
      this.searchString = "&q=" + searchString;
      
    }
  
    commit() {
        db.push(this);
    }

    getGifs() {
        $.ajax({
            url: "http://api.giphy.com/v1/gifs/search?api_key=" + giphyApiKey + "&limit=20&q=" + this.searchString,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
        })
    }
  
  }
