import axios from 'axios';
import axiosRetry from 'axios-retry';

// Make things more robust by retrying stuff
// https://www.npmjs.com/package/axios-retry
axiosRetry(axios, { retries: 3 });

export default axios;
