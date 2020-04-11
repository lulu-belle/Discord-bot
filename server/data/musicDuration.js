function formatDuration(duration) {
  let durationStr = "";

  if (duration.hours > 0) {
    if (duration.hours > 9) durationStr += `${duration.hours}:`;
    else durationStr += `0${duration.hours}:`;
  }

  if (duration.minutes > 9) durationStr += `${duration.minutes}:`;
  else durationStr += `0${duration.minutes}:`;

  if (duration.seconds > 9) durationStr += `${duration.seconds}`;
  else durationStr += `0${duration.seconds}`;

  return durationStr;
}

function getTotalSecondes(duration) {
  let secondes = 0;
  if (duration.hours > 0) secondes += duration.hours * 3600;
  if (duration.minutes > 0) secondes += duration.minutes * 60;
  if (duration.seconds > 0) secondes += duration.seconds;
  return secondes;
}

module.exports = {
  formatDuration: formatDuration,
  getTotalSecondes: getTotalSecondes
};
