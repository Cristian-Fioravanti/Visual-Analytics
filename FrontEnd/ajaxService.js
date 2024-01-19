export function getAllDataPCA() {
	return $.ajax({
		url: 'http://localhost:8099/all-data-pca',
		method: 'GET',
		dataType: 'json'
	});
}

export function computePCA(ids) {
	return $.ajax({
		url: 'http://localhost:8099/id-pca',
		method: 'POST',
		data: JSON.stringify({ id: ids }),
		contentType: "application/json; charset=utf-8",
		dataType: 'json'
	});
}