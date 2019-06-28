import axios from "axios"
export const GET_ALL_TOKENS = "GET_ALL_TOKENS";
export const GET_TOKEN_DETAILS = "GET_TOKEN_DETAILS";

const BASE_URL = 'https://api.tokenanalyst.io/analytics/last?job=';

export const getAllTokens = allTokens => ({
    type: GET_ALL_TOKENS,
    payload: allTokens
});

export const getTokenDetails = tokenData => ({
    type: GET_TOKEN_DETAILS,
    payload: tokenData
});

export const fetchAllTokens = () => {
    return dispatch => {
        const tokens = ['bnb', 'bat', 'gnt', 'mkr', 'omg', 'rep', 'zil', 'zrx'];
        const acc = [];
        tokens.forEach(token => {
            const transactions = axios.get(`${BASE_URL}${token}_txn_count_24h&format=json`);
            const volume = axios.get(`${BASE_URL}${token}_volume_24h&format=json`);
            axios.all([transactions, volume]).then(axios.spread((trans, vol) => {
                const count = { ...trans.data[0] };
                const volume = { ...vol.data[0] };
                acc.push({ token, count, volume })
                acc.length === tokens.length && dispatch(getAllTokens(acc));
            })).catch(error => {
                console.error(error);
            })
        });
    }
}

export const fetchToken = (token) => {
    return dispatch => {
        const monthlyVolume = axios.get(`${BASE_URL}${token}_volume_30day&format=json`);
        const monthlyCount = axios.get(`${BASE_URL}${token}_count_30day_v5&format=json`);
        return axios.all([monthlyCount, monthlyVolume]).then(axios.spread((trans, vol) => {
            const count = [...trans.data ];
            const volume = [ ...vol.data ];
            dispatch(getTokenDetails({ token, count, volume }))
        })).catch(error => {
            console.error(error);
        })
    }
}

