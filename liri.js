
//Liri takes the following arguments

// * spotify-this-song - take a song title in and return information
// * movie-this - same with movie title
// * do-what-it-says - read from random.txt and return a spotify song search


require("dotenv").config();
let dataKeys = require("./keys.js");
let fs = require('fs'); //file system
let Spotify = require('node-spotify-api');
let request = require('request');
let inquirer = require('inquirer');
let space = "\n" + "         ";
let header = "================= Liri By Mike Smith Found ...=================";
let footer = "\n=============================================================="

// Function that appends to the logfile
function writeToLog(data) {
    fs.appendFile("log.txt", '\r\n\r\n', function(err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.appendFile("log.txt", (data), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log(space + "log.txt has been updated!");
    });
}


// =================================================================
// Spotify 
function getMeSpotify(songTitle) {
    let spotify = new Spotify(dataKeys.spotify);
    // If there is no song name, set the song to The Sign by Ace of Base
    if (!songTitle) {
        songTitle = "The Sign";
    }
    spotify.search({ type: 'track', query: songTitle }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            output =
                header +
                space +  "Artist(s) Name: " + data.tracks.items[0].album.artists[0].name +
                space + "Song Title: " + "'" + songTitle.toUpperCase() + "'" +
                space + "Preview link: " + data.tracks.items[0].album.external_urls.spotify +
                space +"Album Name: " + data.tracks.items[0].album.name +
                footer;
            console.log(output);
            writeToLog(output);
        }
    });

}

///band stuff here

let getMeBand = function(bandName) {
    if(!bandName) {
        bandName = "Elton John"
    }
let URL = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp"

request(URL, function(err, res, body) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    } else {
        let jsonDataBand = JSON.parse(body);
        
        output = space + header +
            space + 'Artist Name: ' + bandName +
            space + 'Name of Venue: ' + jsonDataBand[0].venue.name +
            space + 'Location of Venue: ' + jsonDataBand[0].venue.city +
            space + 'Date of Concert: ' + jsonDataBand[0].datetime +
            "\n" + footer;

        console.log(output);
        writeToLog(output);
        }

})}
///get movie stuff here

let getMeMovie = function(movieName) {

    if (!movieName) {
        movieName = "Mr Nobody";
    }

    let URL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(URL, function(err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            let jsonData = JSON.parse(body);
            output = space + header +
                space + 'Title: ' + jsonData.Title +
                space + 'Year: ' + jsonData.Year +
                space + 'IMDB Rating: ' + jsonData.imdbRating +
                space + 'Tomato Rating: ' + jsonData.Ratings[1].Value +
                space + 'Country: ' + jsonData.Country +
                space + 'Language: ' + jsonData.Language +
                space + 'Plot: ' + jsonData.Plot +
                space + 'Actors: ' + jsonData.Actors +
                "\n" + footer;

            console.log(output);
            writeToLog(output);
        }
    });
};

function doWhatItSays() {
    // Reads the random text file and passes it to the spotify function
    fs.readFile("random.txt", "utf8", function(error, data) {
        getMeSpotify(data);
    });
}
 //use inquire so we can make it easier for user

let questions = [{
        type: 'list',
        name: 'programs',
        message: 'What function do you want to run?',
        choices: ['Spotify Song Search By Title', 'Movie Name By Title', 'What Bands are in Town', 'Do what it says']
    },
    {
        type: 'input',
        name: 'movieChoice',
        message: 'What\'s the name of the movie you would like?',
        when: function(answers) {
            return answers.programs == 'Movie Name By Title';
        }
    },
    {
        type: 'input',
        name: 'songChoice',
        message: 'What\'s the name of the song you would like?',
        when: function(answers) {
            return answers.programs == 'Spotify Song Search By Title';
        }
    },
    {
        type: 'input',
        name: 'bandChoice',
        message: 'What\'s the name of the band you would like to search?',
        when: function(answers) {
            return answers.programs == 'What Bands are in Town';
        }
    },

];

inquirer
    .prompt(questions)
    .then(answers => {
        // Depending on which program the user chose to run it will do the function for that program
        switch (answers.programs) {
            case 'Spotify Song Search By Title':
                getMeSpotify(answers.songChoice);
                break;
            case 'Movie Name By Title':
                getMeMovie(answers.movieChoice);
                break;
            case 'Do what it says':
                doWhatItSays();
                break;
            case 'What Bands are in Town':
                getMeBand(answers.bandChoice);
                break;
            default:
                console.log('Please enter a valid Movie or Song title');
        }
    });
