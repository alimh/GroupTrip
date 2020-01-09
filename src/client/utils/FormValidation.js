/* eslint no-useless-escape: "off" */
export const checkIfNumberError = (n) => {
  if (parseFloat(n) - n !== 0) return 'must be a number';
  return false;
};

export const checkPositiveNumberError = (n) => {
  if (n === '') return false;
  if (parseFloat(n) - n !== 0) return 'must be a number';
  if (n <= 0) return 'must be a positive number';
  return false;
};

export const checkNotBlankError = (n) => {
  if (n === '') return 'cannot be blank';
  return false;
};

export const checkValidDateError = (n) => {
  if (!Date.parse(n)) return 'must be a valid date';
  return false;
};

export const checkValidEmailError = (n) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(n)) return false;
  return 'not a valid email';
};
