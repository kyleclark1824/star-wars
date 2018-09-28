
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
    return axios.get(`https://swapi.co/api/people/?search=${1}`)
        .then(response => info);
}

module.exports = rest;
