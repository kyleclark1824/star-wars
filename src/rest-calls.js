
import axios from 'axios';

var rest = {
    MakeCustSearchRequest,
    MakeDetailsRequests
}

function MakeCustSearchRequest(data, url) {
    console.log(data, url ? "has" : "doens't");
    var requestUrl = url ? url : `https://swapi.co/api/people/?search=${data}`;
    console.log("request: ", requestUrl);
    return axios.get(requestUrl)
        .then(response => response.data);
}

function MakeDetailsRequests(info) {
    // NEED TO MAKE ALL CALLS TO GET ADDITIONAL DETAILS!!
    console.log("INfo in details:", info);
    var returnObj = info;
    return Promise.resolve()
        .then( function() {
            if (info.species) {
                return axios.get(info.species[0])
            }
        })
        .then(species => {
            returnObj.species = species.data
            if (info.films.length) {
                let promiseArray = info.films.map(url => axios.get(url));
                return axios.all(promiseArray)
            }
        })
        .then(films => {
            var filmArray = [];
            films.forEach(film => {
                filmArray.push(film);
            });
            returnObj.films = filmArray;
            return returnObj;
        })
}

module.exports = rest;
