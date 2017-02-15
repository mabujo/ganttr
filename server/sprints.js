var fs = require('fs');
var path = require('path');
var sprintDir = path.dirname(require.main.filename) + '/gantts/';

var sprints = module.exports = {

  /**
   * Get a single sprint
   * @param  {object} req
   * @param  {object} res
   * @return {object / false}
   */
  get: function(req, res) {

    // read file
    var text = fs.readFileSync(sprintDir + req.params.id + ".json", 'utf-8').toString();

    if (text) {
      console.log("Served sprint : " + req.params.id);

      return text;
    }
    else {
      return false;
    }

  },

  /**
   * Get all sprints
   * @return {object / false}
   */
  getAll: function() {

    var files = fs.readdirSync(sprintDir);
    var sprints = [];

    if (files) {

      for (var i = 0; i < files.length; i++) {
        sprints.push(files[i].replace(".json", ""));
      }

      return sprints;
    }
    else {
      return false;
    }

  },

  /**
   * Save a sprint to /gantts/sprint-name
   * @param  {object} req  Request object
   * @return {boolean}     success / fail
   */
  save: function(req) {

    // sprint name is first item in array
    var sprintName = req.body[0];

    // create file path for this sprint
    var filePath = path.join(sprintDir + sprintName + '.json');

    // write file
    fs.writeFile(filePath, JSON.stringify(req.body), function(err) {
      if (err) {
        return false;
      }

      console.log("Saved file: " + sprintName);
    });

    // success
    return true;
  }

}