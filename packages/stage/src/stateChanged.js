// @flow
function is(x, y) {
  return x === y;
}

export default function stateChanged(update, prevState) {
  if (is(update, prevState)) return false;

  if (typeof update !== 'object' || update === null) {
    return false;
  }

  const keys = Object.keys(update);
  if (keys.length === 0) {
    return false;
  }

  for (let i = 0; i < keys.length; i += 1) {
    if (!is(prevState[keys[i]], update[keys[i]])) {
      return true;
    }
  }

  return false;
}
