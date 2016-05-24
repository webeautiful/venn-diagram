// p1 and p2 supposed to be like {x: 1, y: 2}
function getPointsDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

// find angle from a point of a circle, prepare for canvas arc function
function getRadByPoint(circle, point) {
  const x0 = circle.x
  const y0 = circle.y
  const x = point.x
  const y = point.y

  const rad = Math.atan2(y0 - y, x - x0)
  return rad < 0 ? -rad : 2 * Math.PI - rad
}

// http://math.stackexchange.com/questions/256100/how-can-i-find-the-points-at-which-two-circles-intersect
// get the intersection points of two circles
function getIntersectionPoints(circle1, circle2) {
  const R = getPointsDistance(circle1, circle2)
  const r1 = circle1.r
  const r2 = circle2.r
  if (r1 + r2 <= R) {
    return []
  }

  const x1 = circle1.x
  const x2 = circle2.x
  const y1 = circle1.y
  const y2 = circle2.y

  const s1X = 0.5 * (x1 + x2) + (r1 * r1 - r2 * r2) * (x2 - x1) / (2 * R * R)
  const s1Y = 0.5 * (y1 + y2) + (r1 * r1 - r2 * r2) * (y2 - y1) / (2 * R * R)
  const tmp = Math.sqrt(2 * (r1 * r1 + r2 * r2) / Math.pow(R, 2) -
    Math.pow(r1 * r1 - r2 * r2, 2) / Math.pow(R, 4) - 1)
  const s2X = 0.5 * tmp * (y2 - y1)
  const s2Y = 0.5 * tmp * (x1 - x2)
  return [
    {x: s1X + s2X, y: s1Y + s2Y},
    {x: s1X - s2X, y: s1Y - s2Y}
  ]
}

function getAllInterSectionPoints(circle1, circle2, circle3) {
  let points = []
  points = points.concat(getIntersectionPoints(circle1, circle2))
  points = points.concat(getIntersectionPoints(circle1, circle3))
  points = points.concat(getIntersectionPoints(circle2, circle3))
  return points
}

function getRGBA(rgb, opacity = 1.0) {
  return ['rgba(', rgb.join(), ',', opacity, ')'].join('')
}

function isInCircle(circle, point) {
  const x0 = circle.x
  const y0 = circle.y
  const r = circle.r
  return Math.sqrt(Math.pow(point.x - x0, 2) + Math.pow(point.y - y0, 2)) < r
}

function detectShape(point, circleOne, circleTwo, circleThree) {
  const sectionOne = isInCircle(circleOne, point) ? 1 : 0
  const sectionTwo = isInCircle(circleTwo, point) ? 2 : 0
  const sectionThree = isInCircle(circleThree, point) ? 4 : 0
  return sectionOne + sectionTwo + sectionThree
}

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

//module.exports = {
export default {
  getPointsDistance,
  getRadByPoint,
  getIntersectionPoints,
  getAllInterSectionPoints,
  getRGBA,
  isInCircle,
  detectShape,
  getMousePos
  // findCenterOfSection
}
