import axios from 'axios';

const requestGet = ( url, resFunc ) => {
    axios.get( url )
        .then( response => {
            const data = response.data;
            resFunc( data );
        })
        .catch( err => {
            console.error(err);
        })
};


export { requestGet };
