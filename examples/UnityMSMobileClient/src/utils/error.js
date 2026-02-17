const AVOIDABLE_ERRORS = ['User did not share', 'CANCELLED'];

export const isErrorToastable = e => {
  if (AVOIDABLE_ERRORS.includes(e?.message)) {
    return false;
  }
  return true;
};
