var rest = {
    MakeCustSearchRequest
}

function MakeCustSearchRequest(data) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `https://swapi.co/api/people/?search=${data}`, true);
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
			{
				resolve(JSON.parse(xhr.responseText));
                // resolve(xhr.responseText);
			}
			else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200)
			{
				reject(xhr.status + '');
			}
		};
		xhr.send();
	});
}

module.exports = rest;
