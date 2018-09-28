
import axios from 'axios';

var rest = {
    MakeCustSearchRequest,
    MakeDetailsRequests
}

function MakeCustSearchRequest(data) {
    return axios.get(`https://swapi.co/api/people/?search=${data}`)
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
            console.log("species:", species);
            returnObj.species = species.data
            if (info.films.length) {
                let promiseArray = info.films.map(url => axios.get(url));
                return axios.all(promiseArray)
            }
        })
        .then(films => {
            console.log("films:", films);
            var filmArray = [];
            films.forEach(film => {
                filmArray.push(film);
            });
            returnObj.films = filmArray;
            return returnObj;
        })
}

module.exports = rest;
