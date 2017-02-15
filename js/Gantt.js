import * as helperInstance from "./helpers.js";
import ajax from "./ajax.js";
import Conf from "../config/Conf.js";
const GanttConf = new Conf();
let instance = null;

module.exports = class Gantt {

  constructor(options) {
    // singleton
    if (!instance) {
      instance = this;
    }

    // external load google charts
    google.charts.load('current', {'packages':['gantt']});


    // fetch the sprints and make
    // available for selection
    this.sprints = ajax.getAllSprints();
    this.sprints.then(function(sprints) {
      instance.addSprintsToSelect(JSON.parse(sprints));
    });

    return instance;
  }

  /**
   * Draw the chart for a sprint
   * @param  {string} sprint The sprint name
   */
  drawChart(sprint) {

    // Use the last sprint if no sprint defined
    if (!sprint) {
      var sprint = instance.sprint;
    }

    // google data table
    var data = new google.visualization.DataTable();

    // add configured columns to chart
    for (let column of Object.entries(GanttConf.columns)) {
      data.addColumn(column[1], column[0]);
    }


    if (sprint) {

      // fetch the sprint
      ajax.getSprint(sprint)
        .then(function(values) {

          var formattedSprint = [];
          // set sprint name and sprint in instance
          var sprintName = instance.sprint = values[0];

          // hyphens to spaces
          document.getElementById("chart-title").innerHTML = sprintName.replace(/-/g, " ");

          // remove sprint name
          values.shift();

          // create formatted sprint array
          for (var i = 0; i < values.length; i++) {
            formattedSprint.push(Gantt.formatFetchedSprint(values[i]));
          }

          // add rows to chart
          data.addRows(formattedSprint);

          // calculate height of graph
          var requiredHeight = 120 + (30 * data.getNumberOfRows());
          var chartOptions = {
            height: requiredHeight
          };

          // draw chart
          var chart = new google.visualization.Gantt(document.getElementById('chart-div'));
          chart.draw(data, chartOptions);

          // add information table
          var usTableBody = document.getElementById('user-stories-table-body');
          usTableBody.innerHTML = helperInstance.displayUserStories(values);
        });

    }

  }

  /**
   * Take the data from the JSON and format it
   * according to the configured schema
   * @param  {array} sprint Raw sprint
   * @return {array}        Formatted sprint
   */
  static formatFetchedSprint(sprint) {

    var types = [];
    var typedColumns = [];

    // create array of types
    for (let column of Object.entries(GanttConf.columns)) {
      types.push(column[1]);
    }

    // format entries as per defined types
    for (var i = 0; i < sprint.length; i++) {
      if (types[i] === "number") {
        typedColumns.push(Number.parseInt(sprint[i], 10));
      }
      else if (types[i] == "date") {
        typedColumns.push(new Date(sprint[i]));
      }
      else if (sprint[i] === "null") {
        typedColumns.push(null);
      }
      // string
      else {
        typedColumns.push(sprint[i]);
      }
    }

    return typedColumns;
  }

  /**
   * Add fetch sprints to select options
   * @param {array} sprints Array of sprint names
   */
  addSprintsToSelect (sprints) {

    let sprintSelector = document.getElementById("select-sprint");
    let html = '<option>Select a sprint</option>';

    for (var i = 0; i < sprints.length; i++) {
      html += '<option value="' + sprints[i] + '">' + sprints[i] + '</option>';
    }

    sprintSelector.innerHTML = html;
    instance.addSelectChangeListener(sprintSelector);
  }

  /**
   * Listener for changes on the sprint selector
   * dropdown menu
   * @param {object} element The selectbox element
   */
  addSelectChangeListener (element) {
    document.addEventListener('change', instance.selectChangeHandler, false);
  }

  /**
   * Event handler for changes on the sprint selector
   * @param  {object} event [description]
   */
  selectChangeHandler (event) {
    if (event.target.value
        && event.target.value != "Select a sprint") {
      instance.drawChart(event.target.value);
    }
    else {
      return false;
    }
  }

}