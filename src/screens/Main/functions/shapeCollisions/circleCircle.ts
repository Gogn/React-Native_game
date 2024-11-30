// Source: https://www.jeffreythompson.org/collision-detection/table_of_contents.php
export function circleCircle(
  c1x: number,
  c1y: number,
  c1r: number,
  c2x: number,
  c2y: number,
  c2r: number,
) {
  "worklet";
  // get distance between the circle's centers
  // use the Pythagorean Theorem to compute the distance
  let distX = c1x - c2x;
  let distY = c1y - c2y;
  let distance = Math.sqrt( (distX*distX) + (distY*distY) );

  // if the distance is less than the sum of the circle's
  // radii, the circles are touching!
  if (distance <= c1r+c2r) {
    return true;
  }
  return false;
}
