var ajax = module.exports = {

  /**
   * Save a sprint to the server
   * @param  {array} sprintData
   */
  saveSprint: function(sprintData) {

    // prepare request
    let request = new Request(window.location.origin + "/sprints/", {
      body: JSON.stringify(sprintData),
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    // send request
    fetch(request)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      return text;
    })
    .catch(function(error) {
        console.error(error);
    });
  },

  /**
   * Get a single sprint
   * @param  {string} sprintId
   * @return {JSON} Sprint promise
   */
  getSprint: function(sprintId) {

    // send request
    return fetch(window.location.origin + "/sprints/" + sprintId)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      return JSON.parse(text);
    })
    .catch(function(error) {
      console.error(error);
    });

  },

  /**
   * Get all sprints
   * @return {JSON} All sprints promise
   */
  getAllSprints: function() {
    // send request
    return fetch(window.location.origin + "/sprints/")
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      return text;
    })
    .catch(function(error) {
      console.error(error);
    });
  }

}