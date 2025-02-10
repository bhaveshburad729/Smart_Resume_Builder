
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8010/', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});