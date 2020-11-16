import globalVariable from '@/utils/globalVariable'
import Vue from 'vue'
import App from './App.vue'
import '@grapecity/spread-sheets/styles/gc.spread.sheets.css';

// import spreadJSTable from '../dist/spread-js-table'
// Vue.use(spreadJSTable, { GC })

new Vue({
  el: '#app',
  render: h => h(App)
})
