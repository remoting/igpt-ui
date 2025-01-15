
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import useLoaing from "@/stores/loading";
import moment from 'moment';
import { showToast } from 'vant';
const mdi = new MarkdownIt({
    linkify: false,
    highlight(code, language) {
        const validLang = !!(language && hljs.getLanguage(language))
        if (validLang) {
            const lang = language || ''
            return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
        }
        return highlightBlock(hljs.highlightAuto(code).value, '')
    },
})
const highlightBlock = (str, lang) => {
    return `<pre class="code-block-wrapper hljs"><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}
const loading = useLoaing();
export default {
    isTauri: () => {
        return 'isTauri' in window && !!window.isTauri
    },
    isMobile: () => {
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    },
    clipboard: () => {
        let clipboard = navigator.clipboard || {
            writeText: (text) => {
                let copyInput = document.createElement('input');
                copyInput.value = text;
                document.body.appendChild(copyInput);
                copyInput.select();
                document.execCommand('copy');
                document.body.removeChild(copyInput);
            }
        }
        return clipboard
    },
    mdRender: (md) => {
        return mdi.render(md)
    },
    loadingOff: () => {
        if (loading.status === false) {
            return
        }
        loading.off()
    },
    loadingOn: () => {
        if (loading.status === true) {
            return
        }
        loading.on()
    },
    fmtTime: (date, fmt) => {
        if (date == null) {
            date = moment()
        }
        if (fmt == null) {
            fmt = "YYYY-MM-DD HH:mm:ss"
        }
        return date.format(fmt);
    },
    toast: (msg) => {
        showToast(msg)
    },
    path: function (url) {
        if (this.isMobile()) {
            return "/mobile" + url;
        } else {
            return "/pc" + url;
        }
    },
}