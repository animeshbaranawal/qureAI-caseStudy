import axios from 'axios';

export default axios.create({
	baseURL: "http://192.168.29.40:8000",
	headers: {
		"Content-Type" : "application/json",
	},
});