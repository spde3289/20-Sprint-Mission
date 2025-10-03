/** 이메일 정규식 검사 */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** 값의 최소 길이 검사 */
const isMinLength = (v, length) => length >= v.length;

/** 공백 확인 */
const isRequired = (v) => v.trim().length > 0;

/** 문자열 일치 확인 */
const isSame = (a, b) => String(a) === String(b);

/** dovument에 접근 */
const byId = (id) => document.getElementById(id);

/** 다른 필드와의 값을 비교 */
const sameAs = (value, parameters) =>
  isSame(value, byId(parameters.otherId).value);

export { byId, isMinLength, isRequired, isSame, isValidEmail, sameAs };
