import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.min.css';
export const HighlightPlugin = {
    install(Vue) {
        Vue.directive('highlight', {
            mounted(el) {
                highlightElement(el);
            },
            updated(el) {
                highlightElement(el);
            },
        })
    }
}
/**
 * 对元素的内容进行高亮处理
 * @param {HTMLElement} element
 */
function highlightElement(element) {
    hljs.highlightElement(element);
}
