const fetch = require('node-fetch');

const baseUrl = 'http://localhost:4000/';

const request = async(path='', method='GET', body={})=>{
	let fullPath = `${baseUrl}${path}`;

	let resStatus = 200;
	let resBody = {};

	let fetchOptions = {};
	if(method === 'POST' || method === 'PUT'){fetchOptions = { method: method,headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }}
	if(method === 'GET'){fetchOptions = { method: method }}

	await fetch(fullPath, fetchOptions).then((res)=>{
		resStatus = res.status;
		let respond = res;
		console.log("respondxxxx",respond)
		return respond.json();
	}).then((resJson) =>{
		resBody = resJson
	})

	let res = {status: resStatus, body: resBody}
	return res;
}

module.exports = {request}