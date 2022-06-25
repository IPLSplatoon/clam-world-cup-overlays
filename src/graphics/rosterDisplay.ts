import './styles/graphics-common.scss';

import { createApp } from 'vue';
import RosterDisplay from './pages/rosterDisplay/RosterDisplay.vue';

const app = createApp(RosterDisplay, { position: 'top' });
app.mount('#app');
