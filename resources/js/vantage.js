import '../css/vantage.css';
import { createIcons, icons } from 'lucide';
import Chart from 'chart.js/auto';

window.Chart = Chart;

window.lucide = {
    createIcons: () => createIcons({ icons })
};

window.highlightJson = function(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2);
    }
    return json
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, function(match) {
            let cls = 'json-string';
            if (/:$/.test(match)) {
                cls = 'json-key';
                match = match.slice(0, -1) + '<span class="text-slate-400">:</span>';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        })
        .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
        .replace(/\bnull\b/g, '<span class="json-null">null</span>')
        .replace(/\b(-?\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g, '<span class="json-number">$1</span>');
};

document.addEventListener('DOMContentLoaded', () => {
    window.lucide.createIcons();
    
    document.querySelectorAll('[data-json-highlight]').forEach(el => {
        const json = el.textContent;
        el.innerHTML = window.highlightJson(json);
    });
});
