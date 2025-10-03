import {
  DEFAULT_LABLE,
  DEFAULT_VISIBILITY,
  FIELDS_CLASSNAME,
} from "../data/DEFAULT_VAILDFIELDS.js";

const createVisibilityButton = (options) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = options.class;
  btn.innerHTML = `<img src="${options.off.src}" alt="${options.off.alt}" />`;
  return btn;
};

const togglePasswordVisibility = (input, btn, options) => {
  const img = btn.querySelector("img");
  const toText = input.type === "password";
  input.type = toText ? "text" : "password";
  if (img) {
    img.src = toText ? options.on.src : options.off.src;
    img.alt = toText ? options.on.alt : options.off.alt;
  }
};

const normalizeVisibility = (v) => {
  if (v === true) return { ...DEFAULT_VISIBILITY };
  if (v && typeof v === "object") {
    return {
      class: v.class || DEFAULT_VISIBILITY.class,
      on: { ...DEFAULT_VISIBILITY.on, ...v.on },
      off: { ...DEFAULT_VISIBILITY.off, ...v.off },
    };
  }
  return null; // visibility 미사용
};

const setAttributes = (el, attrs = {}) => {
  Object.entries(attrs).forEach(([key, value]) => {
    if (value == null) return;

    // class → className 처리
    if (key === "class") {
      el.className = String(value);
      return;
    }

    // disabled 등 boolean 속성 처리
    if (["disabled", "readonly", "required", "checked"].includes(key)) {
      const truthy =
        value === true || value === "true" || value === "" || value === key;
      if (truthy) el.setAttribute(key, "");
      return;
    }

    // 일반 속성
    el.setAttribute(key, String(value));
  });
};

const vaildFieldRender = (rule, html, field, fieldWrapper) => {
  const result = [];

  const visibilityOpts = normalizeVisibility(rule.isVisibility);
  // 속성은 field 레벨
  const attrs = rule.attribute ?? {};
  const lable = document.createElement("label");

  if (rule.lable) {
    lable.className = rule.lable.class ?? DEFAULT_LABLE.class;
    lable.innerHTML = rule.lable.innerContents ?? DEFAULT_LABLE.innerContents;
    setAttributes(lable, { for: rule.attribute.id });

    result.push(lable);
  }

  if (visibilityOpts) {
    // <div><input/><button/></div>
    const wrapper = document.createElement("div");
    const input = document.createElement(html);

    wrapper.className = FIELDS_CLASSNAME.visibility_container;
    input.id = field.id;

    setAttributes(input, attrs);

    const visBtn = createVisibilityButton(visibilityOpts);
    visBtn.addEventListener("click", () =>
      togglePasswordVisibility(input, visBtn, visibilityOpts)
    );

    wrapper.appendChild(input);
    wrapper.appendChild(visBtn);

    // fieldWrapper.appendChild(wrapper);
    result.push(wrapper);
  } else {
    const input = document.createElement(html);

    input.id = field.id;
    if (rule.innerContents) input.innerHTML = rule.innerContents;

    setAttributes(input, attrs);

    result.push(input);
    // if (field.lable || rule.lable) {
    //   fieldWrapper.appendChild(input);
    //   return fieldWrapper;
    // } else {
    // }
  }

  return result;
};

function vaildFieldsRender(fields, containerId = "input-container") {
  const formContainer = document.getElementById(containerId);

  if (!formContainer) {
    console.warn(
      `[vaildFieldsRender] 컨테이너 #${containerId} 를 찾을 수 없습니다.`
    );
    return;
  }

  for (const field of fields) {
    const html = field.html;
    const fieldWrapper = document.createElement("div");
    const lable = document.createElement("label");
    let inputWrapper = [];

    fieldWrapper.className = FIELDS_CLASSNAME.input_container;

    if (field.lable) {
      console.log(field.lable);
      lable.className = field.lable.class ?? DEFAULT_LABLE.class;
      lable.innerHTML =
        field.lable.innerContents ?? DEFAULT_LABLE.innerContents;

      setAttributes(lable, { for: field.id });
      console.log(lable);
      fieldWrapper.appendChild(lable);
    }

    for (const rule of field.rules) {
      inputWrapper.push(vaildFieldRender(rule, html, field, fieldWrapper));
    }

    const flat = inputWrapper.flatMap((el) => el);

    if (flat.length > 1) {
      flat.forEach((el) => fieldWrapper.appendChild(el));
      formContainer.appendChild(fieldWrapper);
    } else {
      formContainer.appendChild(flat[0]);
    }
  }
}

export { vaildFieldsRender };
