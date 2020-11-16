import globalVariable from '@/utils/globalVariable'

const customFormatterTest = {};
customFormatterTest.prototype = globalVariable.GC.Spread.Formatter.FormatterBase;
customFormatterTest.format = function (obj) {
    return parseFloat((obj - 0).toFixed(2)) + ''
}
export default customFormatterTest
