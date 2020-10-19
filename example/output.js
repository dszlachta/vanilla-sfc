export function __v_sfc_getTemplates() {
  return {
    default: "\n    <div class=\"component\">\n        {{ data }}\n    </div>\n",
    second: "\n    <span>\n        Second template content\n    </span>\n"
  };
}
export default function component(template, state) {
  return template.replace(/{{\s*[a-z]+\s*}}/, state);
}