module.exports = UNIX_timestamp => {
  let a = new Date(UNIX_timestamp);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let amPm = "am";
  if (hour >= 12) {
    hour -= 12;
    amPm = "pm";
  }
  if (hour == 0) {
    hour = 12;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  let time = `${month} ${date}, ${year} at ${hour}:${min}${amPm}`;
  return time;
};
