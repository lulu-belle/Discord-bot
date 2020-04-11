function randomColor() {
  let color = "#";
  "#000000".replace(/0/g, function() {
    color += (~~(Math.random() * 16)).toString(16);
  });
  return color;
}
module.exports = randomColor;
