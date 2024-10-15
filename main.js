import './scss/main.scss';
import MainChecherboard from './src/modules/main-checkerboard/MainCheckerboard.js';

const wrapper = document.querySelector('.render-app');
const checkerboard = new MainChecherboard();

wrapper.appendChild(checkerboard.component);
