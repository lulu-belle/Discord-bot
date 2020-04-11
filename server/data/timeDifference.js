const moment = require("moment");

module.exports = timeStamp => {
  let a = moment(new Date());
  let b = moment(timeStamp);
  let dayDiff = a.diff(b, "days");
  let yearDiff = a.diff(b, "years");
  let result = dayDiff == 1 ? `${dayDiff} day ago` : `${dayDiff} days ago`;
  if (yearDiff >= 1) {
    let daysPlus = dayDiff - Math.floor(dayDiff / 365) * 365;
    result =
      daysPlus == 0
        ? yearDiff == 1
          ? `${yearDiff} year ago`
          : `${yearDiff} years ago`
        : yearDiff == 1
        ? daysPlus == 1
          ? `${yearDiff} year, ${daysPlus} day ago`
          : `${yearDiff} year, ${daysPlus} days ago`
        : daysPlus == 1
        ? `${yearDiff} years, ${daysPlus} day ago`
        : `${yearDiff} years, ${daysPlus} days ago`;
  }
  return result;
};
