'use-strict';

const { default: axios } = require('axios');
const Axios = require('axios');
const BASE_URL = "https://api.nitrado.net";
const TIME_OUT = 10000;



class ApiHelper {

    create(access_token)
    {
       return Axios.create({
            baseURL: BASE_URL,
            timeout: TIME_OUT,
            headers: {'Authorization': 'Bearer '+ access_token}
       });
    }

    // getId()
    // {
    //     Axios.get('/services').then(response => {
    //         return id = response.data.data.services[0]['id'];
    //     });        
    // }

    

    // getService(endpoint, service)
    // {
    //     Axios.get('/' + endpoint + this.getId + service).then(response => {
    //         console.log(response.data);
    //     });        
    // }
}

module.exports = ApiHelper;