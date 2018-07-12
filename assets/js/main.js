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

// Go nuts
var resultsDiv = $('#search-results');
var recentDiv = $('#recent-searches');

class GiphySearch {
    constructor(searchString) {
      this.searchString = searchString;
    }
  
    commit() {
        db.ref("searches").push(this);
    }

    getGifs() {
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?api_key=" + giphyApiKey + "&limit=10&q=" + this.searchString,
            method: 'GET'
        }).then(function(response) {
            var data = response.data;
            console.log(data[0]);
            for (var i = 0; i < data.length; i++) {
                var gifElem = $('<div>');
                gifElem.addClass(['col-sm-6', 'col-md-4', 'col-lg-3']);
                var gifRating = $('<p>');
                gifRating.text('Rating: ' + data[i].rating);
                var gifImg = $('<img>');
                gifImg.attr("src", data[i].images.fixed_width_still.url);
                gifImg.attr("data-static", data[i].images.fixed_width_still.url);
                gifImg.attr("data-dynamic", data[i].images.fixed_width.url);
                gifElem.append([gifRating, gifImg]);
                resultsDiv.append(gifElem);

            }
        })
    }
}

$('body').on('click', 'img', function() {
    var clicked = $($(this)[0]);
    if (clicked.attr('src') === clicked.attr('data-static')) {
        clicked.attr('src', clicked.attr('data-dynamic'));
    } else {
        clicked.attr('src', clicked.attr('data-static'));
    }    
});

$("#run-search").on("click", function(event){

    if (searchParam === ""){
        alert("search can't be null");
    
    } else {
        event.preventDefault();
        var searchParam = $("#search-term").val().trim();
        var newSearch = new GiphySearch(searchParam);
        resultsDiv.empty();
        newSearch.commit();
        newSearch.getGifs()
    }
});

db.ref('searches').on("child_added", function(snapshot) {
    var newItem = $('<button>');
    newItem.text(snapshot.val().searchString)
    newItem.addClass(["btn", "btn-success"]);
    newItem.css('margin-left', '5px');
    newItem.css('margin-right', '5px');
    recentDiv.prepend(newItem);
    
       
});

recentDiv.on('click', '.btn', function() {
    var clicked = $($(this)[0]);
    var searchParam = clicked.text();
    var newSearch = new GiphySearch(searchParam);
        resultsDiv.empty();
        newSearch.getGifs()
    
});

