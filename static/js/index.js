const sample_request = function(callback) {
    axios.get('load-list', {
        params: {
            id: 1
        }
    })
      .then(function (response) {
        console.log(response);
        callback(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
};

const loadData = function() {
    sample_request(function(list) {
        let data = '';
        console.log(list)
        for(let element in list)
            data += list[element] + ' ';
        $('#test').html(data);
    });
}

$(document).ready(function() {
    console.log('READY');
});