function createRandomNumFromStartToEnd(start, end) {
  return Math.round(Math.random() * (end - start) + start);
}

function isFunction(val) {
  return typeof val === "function";
}
export { createRandomNumFromStartToEnd, isFunction };
