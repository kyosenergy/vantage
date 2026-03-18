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

window.copyToClipboard = async function(text, buttonElement) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers or non-secure contexts
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        
        if (buttonElement) {
            const originalHTML = buttonElement.innerHTML;
            buttonElement.innerHTML = '<i data-lucide="check" class="w-4 h-4" aria-hidden="true"></i> Copied!';
            buttonElement.classList.add('text-green-600');
            window.lucide.createIcons();
            
            setTimeout(() => {
                buttonElement.innerHTML = originalHTML;
                buttonElement.classList.remove('text-green-600');
                window.lucide.createIcons();
            }, 2000);
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.lucide.createIcons();
    
    document.querySelectorAll('[data-json-highlight]').forEach(el => {
        const json = el.textContent;
        el.innerHTML = window.highlightJson(json);
    });
});
