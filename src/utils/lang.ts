
function isEmpty(obj: any): boolean {
  if (!obj) {
    return true;
  }
  if (typeof obj === 'string') {
    if (obj === '' || obj.trim() === '') {
      return true;
    }
  }
  if (obj instanceof Array) {
    if (obj.length === 0) {
      return true;
    }
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
