import SpreadJsTable from './src/components/SpreadJsTable'
import globalVariable from '@/utils/globalVariable'
import packageJSON from './package'

const components = [
  SpreadJsTable
]

const install = function(Vue, opts = {}) {
  const { GC, ExcelIO } = opts
  
  if (ExcelIO) {
    globalVariable.ExcelIO = ExcelIO
  }
  
  if (GC) {
    globalVariable.GC = GC
  }
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue, {
    GC,
    ExcelIO: GC.Spread.Excel
  });
}

components.forEach(component => {
  component.install = function (Vue, opts = {}){
    const { GC, ExcelIO } = opts
    
    if (ExcelIO) {
      globalVariable.ExcelIO = ExcelIO
    }
    
    if (GC) {
      globalVariable.GC = GC
    }
    Vue.component(component.name, component)
  }
})

export default {
  version: packageJSON.version,
  install,
  SpreadJsTable
}
