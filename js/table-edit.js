/**
 * Adapted from http://codepen.io/ashblue/pen/mCtuA
 */
  import $ from "jquery";
  import helper from "./helpers.js";
  import ajax from "./ajax.js";
  import Gantt from "./Gantt.js";
  const GanttInstance = new Gantt();

  var $TABLE = $('#add-tasks');

  var $BTN = $('#export-btn');
  var $EXPORT = $('#export');

  // add initial datepickers
  $(document).ready(function () {
    helper.addPickers();
  });

  // enable or disable the export button
  // depending if we have entered a name
  $("#sprint-name").on("input change", function() {
    ($("#sprint-name").val() != "") ? $("#export-btn").prop("disabled", false) : $("#export-btn").prop("disabled", true);
  });

  // add a row
  $('.table-add').click(function () {
    var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
    $TABLE.find('table').append($clone);
    // add picker for new rows
    helper.addPickers();
  });

  // remove a row
  $('.table-remove').click(function () {
    $(this).parents('tr').detach();
  });

  // shift row up
  $('.table-up').click(function () {
    var $row = $(this).parents('tr');
    if ($row.index() === 1) return; // Don't go above the header
    $row.prev().before($row.get(0));
  });

  // shift row down
  $('.table-down').click(function () {
    var $row = $(this).parents('tr');
    $row.next().after($row.get(0));
  });

  // A few jQuery helpers for exporting only
  $.fn.pop = [].pop;
  $.fn.shift = [].shift;

  $BTN.click(function () {
    var $rows = $TABLE.find('tr:not(:hidden)');
    var headers = [];
    var data = [];

    // add the sprint name as first element
    data.push($("#sprint-name").val().replace(/\s+/g, '-'));

    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {
      headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function () {
      var $td = $(this).find('td');
      var cells = [];

      for (var i = 0; i < headers.length; i++) {
        // this cell content
        var cellContents = $td.eq(i).text().trim();
        // add it to array
        cells.push(cellContents);

        if (headers[i] === "start date") {
          helper.calculateData(cellContents, $td, cells);
        }
      }

      data.push(cells);
    });

    // Output the result
    $EXPORT.text(JSON.stringify(data));

    ajax.saveSprint(data);
  });