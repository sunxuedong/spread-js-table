<template>
  <div class="spreadRoot">
    <div class="spreadBody" id="spreadBody">
      <div class="componentContainer gc-scrollbar-thin">
        <div class="spreadContainer" id="Data_report">
          <gc-spread-sheets
            :newTabVisible="newTabVisible"
            :tabStripVisible="tabStripVisible"
            :allowUserDragDrop="allowUserDragDrop"
            :allowUserDragFill="allowUserDragFill"
            :showHorizontalScrollbar="showHorizontalScrollbar"
            :showVerticalScrollbar="showVerticalScrollbar"
            :scrollbarMaxAlign="scrollbarMaxAlign"
            :scrollbarShowMax="scrollbarShowMax"
            :allowUserZoom="allowUserZoom"
            :allowUserResize="allowUserResize"
            :grayAreaBackColor="grayAreaBackColor"
            :isProtected="isProtected"
            :backColor="backColor"
            :hostClass="hostClass"
            @workbookInitialized="spreadInitHandle"
          >
            <gc-worksheet :autoGenerateColumns="autoGenerateColumns"></gc-worksheet>
          </gc-spread-sheets>
        </div>
      </div>
    </div>
    <div class="spreadPages">
      <div class="count-number" v-show="isShowFilteredNumber && isFilterdSomeData">
        在
        <span>{{ rowCountBeforeFilter }}</span> 条记录中找到
        <span class="filtered-number">{{ rowCountAfterFilter }}</span> 条
      </div>
      <div v-show="selectHint" class="hint" style="color:red;">
        <span>计数:{{selectionCount}}</span>
        <span v-if="isCalcute">合计: {{sum.toFixed(2)}};平均: {{average.toFixed(2)}}</span> (不包含汇总行)
      </div>
      <div v-show="!selectHint"></div>
    </div>
  </div>
</template>
<script>
  import globalVariable from '@/utils/globalVariable'
  import SpreadJSUtil from '@/utils/spreadJS/SpreadJSUtil';
  import { copy } from '@/utils/mockBroswerBehavior';

  export default {
    name: 'SpreadJsTable',
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      isShowFilteredNumber: {
        type: Boolean,
        default: true
      },
      oddRowBackColor: {
        type: String,
        default: '#dcdcdc'
      },
      evenRowBackColor: {
        type: String,
        default: '#ffffff'
      },
      frozenColumnNum: {
        type: Number,
        default: 0
      },
      frozenTrailingColumnNum: {
        type: Number,
        default: 0
      },
      // 是否换行
      wordWrap: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      columns: {
        handler(n, o) {
          // 在columns初始为空数组，即未定义列头时
          if (!o.length) {
            // 初始化设置
            this.initialSet();
            // 如果当前已定义列头，则控制列头显隐即可
          } else {
            // 清空表格的选中状态（ps：如果重新设置列头之前有了选中操作，那么需要重置选中）
            this.clearTableCheckStatus();
            // 设置表格列头
            this.spreadJS.setColumnAttibute(n, true);
            // 设置行样式（ps：如果重新设置列头之前有了过滤操作，那么需要重新设置行样式）
            this.spreadJS.setAllRowStyle();
          }
          // 重新填充数据（ps：重新填充数据会根据最新的列头进行一些结算，并且可以清空筛选状态）
          // this.spreadJS.setDataSource(this.data)
        }
      },
      data: {
        handler(value) {
          // 设置表格data
          this.spreadJS.setDataSource(value);
          // 清空表格选中状态
          this.clearTableCheckStatus();
        }
      }
    },
    computed: {
      // 是否使用spreadJS过滤了数据
      isFilterdSomeData() {
        return this.rowCountAfterFilter !== this.rowCountBeforeFilter && this.rowCountAfterFilter > 0;
      }
    },
    activated() {
      // 激活时刷新一下组件，否则会显示错乱
      this.$nextTick(() => {
        this.refresh();
      });
    },
    data() {
      return {
        newTabVisible: false, // 是否显示新建表格按钮（new)
        tabStripVisible: false, // 是否显示底部的sheet标签
        allowUserDragDrop: false, // 是否允许拖放单元格
        allowUserDragFill: false, // 是否允许拖动填充
        rowHeaderVisible: true, // 是否显示行头
        columnHeaderVisible: true, // 是否显示列头
        showHorizontalScrollbar: true, // 是否显示横向滚动条
        showVerticalScrollbar: true, // 是否显示纵向滚动条
        scrollbarMaxAlign: true, // 滚动条是否对齐视图中表单的最后一行或一列。
        scrollbarShowMax: true, // 是否基于表单全部的行列总数显示滚动条。
        allowUserZoom: false, // 是否允许缩放
        allowUserResize: true, // 是否允许改变行列宽高
        isProtected: true, //不可被编辑
        grayAreaBackColor: '#F8F8FF', //区域背景
        backColor: '#fff', //表格背景
        spread: null,
        autoGenerateColumns: true,
        hostClass: 'spread-host',
        selectHint: false, //选择时 下方提示
        selectionCount: 0, //选中单元格的数,
        sum: 0,
        average: 0,
        isCalcute: false,
        gaugeTime: 0,
        spreadJS: {},
        rowCountBeforeFilter: 0,
        rowCountAfterFilter: 0
      };
    },
    methods: {
      // spread初始化
      spreadInitHandle(spread) {
        const options = {
          spread,
          vm: this,
          data: this.data,
          options: {
            oddRowBackColor: this.oddRowBackColor,
            evenRowBackColor: this.evenRowBackColor,
            frozenColumnNum: this.frozenColumnNum,
            frozenTrailingColumnNum: this.frozenTrailingColumnNum,
            wordWrap: this.wordWrap
          }
        };
        // 实例化
        this.spreadJS = new SpreadJSUtil(options);
        // 使canvas的mousedown事件冒泡出去
        this.spreadJS.letCanvasMousedownBubble();
        // 如果列头没有定义，则暂时不去初始化一些设置，等到在watch中监听到columns变化了，再去初始化这些设置
        this.columns.length && this.initialSet();
      },
      // initialSet 配置
      initialSet() {
        // 绑定表头
        this.spreadJS.bindColumns(this.columns);
        // 设置表格数据
        this.spreadJS.setDataSource(this.data)
        // 设置在复制粘贴数据的时候，不需要列头
        this.spreadJS.setCopyPasteHeaderOptions(globalVariable.GC.Spread.Sheets.CopyPasteHeaderOptions.noHeaders);
        // 设置表头的全选
        this.spreadJS.sheetsRowCheckBox();
        // 设置表头样式
        this.spreadJS.sheetsStyle();
        // 设置contextMenu（点击鼠标右键后，出现的列表）
        this.spreadJS.setContextMenu();
        // 设置单元格类型为TipCellType（用于注册hover单元格事件）
        this.spreadJS.sheetsSetTipCellType();
        // 设置colHeader单元格类型为TipCellType（用于注册hover单元格事件）
        this.spreadJS.sheetsSetColHeaderTipCellType()
        // 添加事件监听
        this.addSheetEventListener();
      },
      addSheetEventListener() {
        // 在列刚刚被自动过滤时的事件监听
        this.addRangeFilteredListener();
        // 单元格选择发生更改的事件监听
        // this.addSelectionChangedListener()
        // 双击单元格的事件监听
        this.addCellDoubleClickListener();
        // 单击单元格中的按钮，复选框或超链接的事件监听
        this.addButtonClickedListener();
        // 列头单元格checkbox的选中事件监听
        this.addCheckHeadBoxListener();
        // 添加单元格的mouseEnter事件监听
        this.addProcessMouseEnterListener();
        // 添加单元格的mouseLeave事件监听
        this.addProcessMouseLeaveListener();
        // 添加在剪贴板粘贴时的事件（在剪贴板粘贴，即复制行为）
        this.addClipboardPastedListener();
      },
      // 在列刚刚被自动过滤时的事件监听
      addRangeFilteredListener() {
        this.spreadJS.sheet.bind(globalVariable.GC.Spread.Sheets.Events.RangeFiltered, (e, info) => {
          try {
            // 获取过滤后的行索引、过滤后的总行数
            const { filteredInRows, rowCount } = this.spreadJS.getFilteredColumnsIndex();
            this.rowCountBeforeFilter = rowCount;
            this.rowCountAfterFilter = filteredInRows.length;
            // 清空表格的选中状态
            this.clearTableCheckStatus();
            // 设置表单最后的汇总行
            this.spreadJS.setSummaryData();
            // 不知为何页面卡顿，只好将清空选中状态、设置表单汇总的操作，放到下次宏任务执行时执行
            requestAnimationFrame(() => {
              // 设置隔行变色
              this.spreadJS.setAllRowStyle();
            });
          } catch (err) {
            console.log(err);
          }
        });
      },
      // 单元格选择发生更改的事件监听
      addSelectionChangedListener() {
        // 在工作表上的单元格选择发生更改时发生
        this.spreadJS.sheet.bind(globalVariable.GC.Spread.Sheets.Events.SelectionChanged, (sheet, sheetName) => {
          this.selectHint = true;
          this.selectionCount = sheetName.newSelections[0].rowCount * sheetName.newSelections[0].colCount;
          // 选中单元格，计算汇总
          const { isCalcute, sum, average } = this.spreadJS.calcuteTotal(sheet, sheetName);
          this.isCalcute = isCalcute;
          this.sum = sum;
          this.average = average;
        });
      },
      // 在单元格中两次按下鼠标左键（双击）的事件监听
      addCellDoubleClickListener() {
        // 当用户在单元格中两次按下鼠标左键（双击）时发生
        this.spreadJS.sheet.bind(globalVariable.GC.Spread.Sheets.Events.CellDoubleClick, (sheet, sheetName) => {
          // 有数据的时候，再处理doubleClick事件
          if (this.data.length) {
            if (Date.now() - this.gaugeTime > 1000) {
              this.gaugeTime = Date.now();
              // 如果是单击列标题，那么退出不做任何操作
              if (sheetName.sheetArea === globalVariable.GC.Spread.Sheets.SheetArea.colHeader) {
                return false;
              }
              const { row, column } = this.spreadJS.getRowAndColumnData(sheetName.row, sheetName.col);
              this.$emit('cell-db-click', row, column);
              this.$emit('row-db-click', row, column);
            } else {
              return false;
            }
          }
        });
      },
      // 单击单元格中的按钮，复选框，单选框或超链接的事件监听
      addButtonClickedListener() {
        this.spreadJS.spread.bind(globalVariable.GC.Spread.Sheets.Events.ButtonClicked, (e, args) => {
          const { sheet, row, col } = args;
          const cellType = sheet.getCellType(row, col);
          // 如果是点击单元格中的复选框或单选框
          if (cellType instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox) {
            // 选中表格tbody中checkbox的回调函数
            const { result } = this.spreadJS.onCheckBoxChange({ sheet, row, col });
            this.selectionChange(result);
            // 如果是点击单元格中的按钮
          } else if (cellType instanceof globalVariable.GC.Spread.Sheets.CellTypes.Button) {
            const data = this.spreadJS.getRowAndColumnData(row, col);
            this.clickButton({ ...data, text: cellType.text() });
          }
        });
      },
      // 表头单元格checkbox的选中事件监听
      addCheckHeadBoxListener() {
        // 点击表头全选时的回调函数
        this.spreadJS.onCheckHeadBox = (...args) => {
          const selection = args[1];
          // 当选择项发生变化时会触发该事件
          this.selectionChange(selection);
        };
      },
      // 单元格的mouseEnter事件监听
      addProcessMouseEnterListener() {
        this.spreadJS.processMouseEnter = ({ hitinfo, sheetArea }) => {
          // 如果是划入tbody中的单元格
          if (sheetArea === globalVariable.GC.Spread.Sheets.SheetArea.viewport) {
            const { row, column } = this.spreadJS.getRowAndColumnData(hitinfo.row, hitinfo.col);
            this.$emit('cell-mouse-enter', row, column, hitinfo);
            // 如果是划入thead中的单元格
          } else if (sheetArea === globalVariable.GC.Spread.Sheets.SheetArea.colHeader) {
            const { column } = this.spreadJS.getRowAndColumnData(hitinfo.row, hitinfo.col);
            this.$emit('header-cell-mouse-enter', column, hitinfo);
          }
        };
      },
      // 单元格的mouseLeave事件监听
      addProcessMouseLeaveListener() {
        this.spreadJS.processMouseLeave = ({ hitinfo, sheetArea }) => {
          // 如果是划出tbody中的单元格
          if (sheetArea === globalVariable.GC.Spread.Sheets.SheetArea.viewport) {
            const {row, column} = this.spreadJS.getRowAndColumnData(hitinfo.row, hitinfo.col);
            this.$emit('cell-mouse-leave', row, column, hitinfo);
            // 如果是划出thead中的单元格
          } else if (sheetArea === globalVariable.GC.Spread.Sheets.SheetArea.colHeader) {
            const { column } = this.spreadJS.getRowAndColumnData(hitinfo.row, hitinfo.col);
            this.$emit('header-cell-mouse-leave', column, hitinfo);
          }
        };
      },
      // 在剪贴板粘贴时的事件（在剪贴板粘贴，即复制行为）
      addClipboardPastedListener() {
        this.spreadJS.spread.bind(globalVariable.GC.Spread.Sheets.Events.ClipboardChanged, (sender, args) => {
          // 如果当前筛选了数据
          if (this.spreadJS.filteredOutRows.length) {
            // 分割复制的数据
            const textSplitByEnter = args.copyData.text.split(/[(\r\n)\r\n]+/);
            /**
             * 判断复制的数据长度是否小于data长度（ps：以此来判断是否是点击列头复制的行为）
             * 解决的问题是使用spreadJS进行数据筛选后，点击列头复制时，复制的是所有行的数据，而不是筛选显示的行数据
             **/
            if (textSplitByEnter.length >= this.data.length) {
              // filteredTextArr 根据已过滤的行索引，在textSplitByEnter中找到已过滤的数据
              const filteredText = this.spreadJS.filteredInRows
                .reduce((accumulator, currentValue) => {
                  textSplitByEnter[currentValue] && accumulator.push(textSplitByEnter[currentValue]);
                  return accumulator;
                }, [])
                .join('\n');
              copy(filteredText);
            }
          }
        });
      },
      // 当选择项发生变化时会触发该事件
      selectionChange(selection) {
        this.$emit('selection-change', selection);
      },
      // 点击单元格中button
      clickButton(data) {
        this.$emit('button-click', data);
      },
      // 刷新sheet
      refresh() {
        this.spreadJS.refresh();
      },
      /**
       * @func setCellStyle
       * @desc 设置某个cell的样式
       * @param {Object.rowIdx} 行索引
       * @param {Object.colName} 列名称
       * @param {Object.setStyle} 回调函数，形参为cell对象
       */
      setCellStyle({ rowIdx, colName, setStyle = () => {} }) {
        this.spreadJS.setCellStyle({ rowIdx, colName, setStyle });
      },
      // 清空表格的选中状态
      clearTableCheckStatus() {
        // 清空选中状态
        this.spreadJS.setTBodyCheckboxStatus();
        // 将selection置为空数组
        this.selectionChange([]);
      },
      // 导出
      exporting(options) {
        options = { name: 'export', exportedBy: 'spreadJS', ...options };
        if (options.exportedBy === 'spreadJS') {
          return this.exportingBySpreadJS(options);
        } else if (options.exportedBy === 'origin') {
          return this.exportingByOrigin(options);
        }
      },
      // spreadJS导出
      exportingBySpreadJS(options) {
        // 默认导出当前页数据
        options.data = options.data || this.data;
        return this.spreadJS.exporting(options);
      },
      // 由原始方法导出
      exportingByOrigin(options) {
        const columns = this.spreadJS.leafColumns.reduce((columns, item) => {
          if (item.displayName && item.name) {
            columns.push({
              label: item.displayName,
              prop: item.name
            });
          }
          return columns;
        }, []);
        const data = {
          title: options.name,
          columns: columns,
          // 默认导出当前页数据
          data: options.data || this.data
        };

        this.$export.excel(data);
      },
      /**
       * @func setSingleRowStyle
       * @desc 设置行样式
       * @param {number} rowIdx - 行索引
       * @param {function} setStyle - 设置样式的回调函数
       */
      setSingleRowStyle({ rowIdx, setStyle = () => {} }) {
        this.spreadJS.setSingleRowStyle({ rowIdx, setStyle });
      },
      /**
       * @func setSingleColHeaderStyle
       * @desc 设置某一个列头的样式
       * @param {Object.colName} 列名称
       * @param {Object.setStyle} 回调函数，形参为style对象
       */
      setSingleColHeaderStyle({ colName, setStyle = () => {} }) {
        this.spreadJS.setSingleColHeaderStyle({ colName, setStyle });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .spreadRoot {
    height: 100%;
    .spreadBody {
      position: relative;
      height: 100%;
      background: #ffffff;
      .componentContainer {
        position: absolute;
        left: 0px;
        top: 0;
        bottom: 0;
        right: 0px;
        box-sizing: border-box;
        // overflow-y:auto ;
        // overflow-x: hidden;
      }
      .spreadContainer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        // box-shadow: 0 0 20px grey;
      }
      .spread-host {
        width: 100%;
        height: 100%;
      }
    }
  }
  .count-number {
    font-size: 12px;
    position: absolute;
    bottom: -15px;
    &::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
      width: 0;
    }
    .filtered-number {
      color: #ff0b00;
    }
  }
  .spreadPages {
    position: relative;
    display: flex;
    justify-content: space-between;
    background: #ffffff;
  }
</style>
