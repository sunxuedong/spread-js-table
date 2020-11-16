import GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-vue';
import '@grapecity/spread-sheets-charts';
import '@grapecity/spread-sheets-resources-zh';
GC.Spread.Common.CultureManager.culture('zh-cn');
import ExcelIO from '@grapecity/spread-excelio';
export default {
  GC,
  ExcelIO
}
