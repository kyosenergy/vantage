import '../css/vantage.css';
import { createIcons, icons } from 'lucide';
import Chart from 'chart.js/auto';

window.Chart = Chart;

window.lucide = {
    createIcons: () => createIcons({ icons })
};

document.addEventListener('DOMContentLoaded', () => {
    window.lucide.createIcons();
});
