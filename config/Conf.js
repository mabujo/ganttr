class Conf {
  constructor(options) {

    this.columns = {
      "Task Id": "string",
      "Task Name": "string",
      "Start Date": "date",
      "End Date": "date",
      "Duration": "number",
      "Percent Complete": "number",
      "Dependencies": "string",
      "Story points": "number",
      "Resources": "number",
    } || options.columns;

    this.storyPointDevHours = 12 || options.storyPointDevHours;
    this.storyPointManDays = 1.5 || options.storyPointManDays;
    this.manDayHours = 8 || options.manDayHours;
  }

}

export default Conf;