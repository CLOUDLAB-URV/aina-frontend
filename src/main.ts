import { createApp } from "vue";
import "./style.css";
import App from "@/App.vue";
import router from "@/router/index.ts";
import Button from "primevue/button";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import FileUpload from "primevue/fileupload";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import { createPinia } from "pinia";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Textarea from 'primevue/textarea';
import { createI18n } from "vue-i18n";
import english from "@/langs/english";
import spanish from "@/langs/spanish";
import catalan from "@/langs/catalan";

const app = createApp(App);
const pinia = createPinia();
const i18n = createI18n({
  legacy:false, 
  locale:'cat',
  fallbackLocale:'es',
  messages:{
    'en': english.messages,
    'es':spanish.messages,
    'cat': catalan.messages
  }
});

app.use(i18n)
app.use(router);
app.use(ToastService);

const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
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
          950: "{cyan.950}",
        },
        datable:{
          row:{
            selected:{
              background:"{gray.600}"
            }
          }
        },
        highlight:{
          background:"{gray.900}",
          color:"{gray.50}",
        },
      },
      dark: {
        overlay: {
          popover: {
            background: "{gray.900}",
          },
        },
        content: {
          hover: {
            background: "{gray.700}",
          },
          background: "{gray.900}",
        },
        primary: {
          color: "{cyan.400}",
        },
        surface: {
          // 50: "{cyan.50}",
          100: "{gray.600}",
          // 200: "{cyan.200}",
          // 300: "{cyan.300}",
          // 400: "{cyan.400}",
          // 500: "{cyan.500}",
          // 600: "{cyan.600}",
          // 700: "{cyan.700}",
          // 800: "{cyan.800}",
          // 900: "{cyan.900}",
          950: "{gray.700}",
        },
        highlight:{
          background:"{gray.50}",
          color:"{gray.950}"
        },
        datable: {
          row: {
            striped: {
              background: "{gray.900}",
            },
          },
        },
      },
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});

app.use(ToastService);
app.component("Toast", Toast);
app.component("Button", Button);
app.component("FileUpload", FileUpload);
app.component("InputText", InputText);
app.component("Tabs", Tabs);
app.component("TabList", TabList);
app.component("TabPanel", TabPanel);
app.component("Tab", Tab);
app.component("TabPanels", TabPanels);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Checkbox", Checkbox);
app.component("Dialog", Dialog);
app.component("Accordion", Accordion);
app.component("AccordionPanel", AccordionPanel);
app.component("AccordionHeader", AccordionHeader);
app.component("AccordionContent", AccordionContent);
app.component("TextArea", Textarea);
app.use(pinia);
app.mount("#app");
