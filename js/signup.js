import { toggleVisibility, validateField } from "./auth.js";
import { isMin8, isRequired, isSame, isValidEmail, sameAs } from "./utils.js";

const form = document.querySelector(".login-container");
const userEmailInput = document.getElementById("userEmail");
const userNickNameInput = document.getElementById("userNickName");
const userPasswordInput = document.getElementById("userPassword");
const userPasswordCheckInput = document.getElementById("userPasswordCheck");
const submitButton = document.getElementById("submit-button");
const visibilityButton = document.getElementsByClassName("btn_visibility");
document.createElement;
const FIELDS = [
  {
    id: "userEmail",
    rules: [
      { test: isRequired, message: "이메일을 입력해주세요." },
      { test: isValidEmail, message: "잘못된 이메일 형식입니다." },
    ],
  },
  {
    id: "userNickName",
    rules: [{ test: isRequired, message: "닉네임을 입력해주세요." }],
  },
  {
    id: "userPassword",
    rules: [
      { test: isRequired, message: "비밀번호를 입력해주세요." },
      { test: isMin8, message: "비밀번호를 8자 이상 입력해주세요." },
    ],
  },
  {
    id: "userPasswordCheck",
    rules: [
      {
        test: sameAs,
        message: "비밀번호가 일치하지 않습니다.",
        parameters: { otherId: "userPassword" },
      },
    ],
  },
];

const reevaluate = () => {
  // 이메일 유효성 검사 && 문자열 최소 입력 확인
  const ok =
    isValidEmail(userEmailInput.value) &&
    isMin8(userPasswordInput.value) &&
    isRequired(userNickNameInput.value) &&
    isSame(userPasswordInput.value, userPasswordCheckInput.value);

  // 위의 조건을 만족할시 disabled false
  submitButton.disabled = !ok;

  submitButton.classList.toggle("active-button", ok);
  submitButton.classList.toggle("disabled-button", !ok);
};

// 이벤트 위임을 통한 이벤트 리스너 추가
form.addEventListener("focusout", (e) => {
  const field = FIELDS.find((f) => document.getElementById(f.id) === e.target);
  if (!field) return;
  validateField(field.id, field.rules, true);
});

const DEPENDS_ON = {
  userPassword: "userPasswordCheck", // 비밀번호가 바뀌면 확인 필드를 재검증
  userCard: "userCardCheck",
};

// 입력중 조건 만족시 클리어
form.addEventListener("input", (e) => {
  const field = FIELDS.find((f) => document.getElementById(f.id) === e.target);

  if (!field) return;
  validateField(field.id, field.rules, true);

  const dependents = DEPENDS_ON[field.id] || [];
  dependents.forEach((depId) => validateField(depId, field.rules, true));
  reevaluate();
});

// 심화 과제
for (const btn of visibilityButton) {
  btn.addEventListener("click", toggleVisibility);
}
