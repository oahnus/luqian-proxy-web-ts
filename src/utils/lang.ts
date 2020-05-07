
function isEmpty(str: string): boolean {
  if (!str) {
    return true;
  }
  if (str === '' || str.trim() === '') {
    return true;
  }
  return false;
}

function isNotEmpty(str: string) {
  return !isEmpty(str)
}

export default {
  isEmpty,
  isNotEmpty
}
