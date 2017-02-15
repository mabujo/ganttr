import $ from "jquery";
const Flatpickr = require("flatpickr");
import Conf from "../config/Conf.js";
const GanttConf = new Conf();

var helper = module.exports = {

  /**
   * [formatDate description]
   * @param  {object} inputDate A date object
   * @return {object}           A custom object ready for formatting
   */
  formatDate: function (inputDate) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var date = new Date(inputDate);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return {
      "day" : day,
      "monthIndex" : monthIndex,
      "year" : year,
      "monthNames" : monthNames
    };
  },

  /**
   * Format date to string
   * @param  {Date}     formattedDate
   * @return {string}   dd-mm-YYYY formatted date
   */
  formatDateString: function(formattedDate) {
    return formattedDate.day + " " +  formattedDate.monthNames[formattedDate.monthIndex] + " " + formattedDate.year;
  },

  /**
  * Work out when a user story should be finished,
  * based on start date, man days from SC estimation,
  * and a number of resources assigned to it
  * @param  {object} startDate   A JS date object
  * @param  {integer} manDays
  * @param  {integer} resources
  * @return {object}  finishDate JS finish date object
  */
  calculateFinishDate: function (startDate, manDays, resources) {
    var finishDate = null;

    // find number of days
    var totalManDays = manDays / resources;

    // date + man days, without weekends
    var prospectiveEndDate = this.addDays(startDate, totalManDays);

    // get number of business days and weekends
    var businessDays = this.getBusinessDays(startDate, prospectiveEndDate);

    // how many days to add, including weekends
    var daysToAdd = businessDays[0] + businessDays[1];

    // add days to start date to get end date
    var finishDate = this.addDays(startDate, daysToAdd);

    return finishDate;
  },

  /**
  * get business days and weekends
  * @param  {object} startDate JavaScript date object representing the start date
  * @param  {object} endDate   JavaScript date object representing the end date
  * @return {array}            Array of for [business days, weekend days]
  */
  getBusinessDays: function (startDate, endDate) {
    var count = [0,0];
    var curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if(!((dayOfWeek == 6) || (dayOfWeek == 0))) {
          // week day
           count[0]++;
        }
        else {
          // weekend
          count[1]++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  },

  /**
  * add days to a date
  * @param {object} date
  * @param {integer} days
  */
  addDays: function (date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
  * display the user stories in a table at the end of the page
  * @param  {array} sprintUserStories  The user story data array
  * @return {string}                   The html as a string ready to append
  */
  displayUserStories: function(sprintUserStories) {
    let html = "";

    // loop through user stories
    for (var i = 0; i < sprintUserStories.length; i++) {

      html += "<tr>";

      // loop through the items of a user story
      var userStory = sprintUserStories[i];
      for (var x = 0; x < userStory.length; x++) {
        html += "<td>";

        // if this is a date object
        if (userStory[x] instanceof Date) {
          let formattedDate = helper.formatDate(userStory[x]);
          html += this.formatDateString(formattedDate);
        }
        // otherwise just print
        else {
          html += userStory[x];
        }
        html += "</td>";
      }

      html += "</tr>";
    }

    return html;
  },

  /**
   * Add date pickers
   */
  addPickers: function () {
    $(".flatpickr").each(function() {
      new Flatpickr(this, {
        onChange: function(selectedDates, dateStr, instance) {
          console.log(selectedDates, dateStr);
          instance.element.innerHTML = helper.formatDateString(helper.formatDate(dateStr));
        }
      });
    });
  },

  /**
   * Calculate some other values based on start date
   * @param  {[type]} cellContents [description]
   * @param  {[type]} row          [description]
   * @return {[type]}              [description]
   */
  calculateData: function(cellContents, row, cells) {
    var startDate = new Date(cellContents);
    var storyPoints = row.filter(".storyPoints").text().trim();
    var resources = row.filter(".resources").text().trim();

    var totalHours = storyPoints * GanttConf.storyPointDevHours;
    var totalManDays = totalHours / GanttConf.manDayHours;

    var endDate = helper.calculateFinishDate(startDate, totalManDays, resources);

    cells.push(endDate);
    // duration
    cells.push(null);
    // % complete
    cells.push(null);
  }



}
