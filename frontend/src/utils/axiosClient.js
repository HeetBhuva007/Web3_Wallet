import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://web3-wallet-6s17.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;