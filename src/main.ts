import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'
import router from '@/router/index.ts'
import Button from 'primevue/button'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';


const app = createApp(App)
app.use(router)

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{cyan.50}",
      100: "{cyan.100}",
      200: "{cyan.200}",
      300: "{cyan.300}",
      400: "{cyan.400}",
      500: "{cyan.500}",
      600: "{cyan.600}",
      700: "{cyan.700}",
      800: "{cyan.800}",
      900: "{cyan.900}",
      950: "{cyan.950}"
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
});

app.mount('#app')
app.component('Button', Button);
