import globalVariable from '@/utils/globalVariable'
import compColumn2Letter from '@/utils/spreadJS/column2Letter'
import FaverSaver from 'file-saver';
import MyCheckBoxCellType from '@/utils/spreadJS/cellTypes/MyCheckBoxCellType'
import TipCellType from '@/utils/spreadJS/cellTypes/TipCellType'
import ColHeaderTipCellType from '@/utils/spreadJS/cellTypes/ColHeaderTipCellType'
import summaryFormatter from '@/utils/spreadJS/formatters/summaryFormatter'

export default class SpreadJSUtil {
    spread
    sheet
    // vue实例
    vm
    // 表头配置
    columns = []
    // 表头columns的叶子节点，一维的
    leafColumns = []
    // 多表头存放子节点的key值
    columnChildrenKey = 'children'
    // 表格数据
    data = []
    // 总行数
    rowCountNum = 0
    // 选中的表格的索引
    selectedIndex = []
    // 筛选后符合条件的行索引
    filteredInRows = []
    // 筛选后不符合条件的行索引
    filteredOutRows = []
    // excel对应的列头
    column2Letter = []
    // 标识表格是否需要汇总，默认false
    isNeedGather = false
    // 列头共有多少行
    headRowTotalNum = 0
    // 列头共有多少列
    headColTotalNum = 0
    // 标识是否新增过汇总行
    isCreatedGatherRow = false
    // checkboxOpt 复选框或单选框的配置
    checkboxOpt = {
        // 单元格类型
        type: 'checkbox',
        // checkbox所在列的索引
        colIdx: 0,
        // 是否有全选功能，默认为true
        isAbleSelectAll: true
    }
    // 当前spreadjsUtil实例的配置对象
    options = {
        // 奇数列背景色
        oddRowBackColor: '#fff',
        // 偶数列背景色
        evenRowBackColor: '#fff',
        borderLeftColor: '#D0D7E5',
        borderTopColor: '#D0D7E5',
        borderRightColor: '#D0D7E5',
        borderBottomColor: '#D0D7E5',
        // 冻结头列数量
        frozenColumnNum: 0,
        // 冻结尾列数量
        frozenTrailingColumnNum: 0,
        frozenlineColor: '#c0c4cc',
        // 是否换行
        wordWrap: false
    }
    // 选中表头复选框的回调函数，私有函数，仅在类内使用
    _onCheckHeadBox = (tag, col) => {
        // 如果当前没有数据，不做处理
        if (!this.rowCountNum) {
            return false
        }
        // 设置tbody中checkbox的回调函数
        for (var i = 0; i < this.filteredInRows.length; i++) {
            const rowIdx = this.filteredInRows[i]
            var cell = this.sheet.getCell(rowIdx, col)
            if (cell.cellType() instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox) {
                cell.value(tag)
            }
        }

        // 全选框状态变化时更新selectedIndex
        this.selectedIndex = tag ? [...this.filteredInRows] : []

        // 计算selection，当前选择项
        let selection = []
        // tag：true时，即全选
        if (tag) {
            // 如果当前使用spreadJS列头的筛选功能，筛选了数据
            if (this.filteredInRows.length && this.filteredInRows.length < this.rowCountNum) {
                // 全选的数据为已筛选的数据
                selection = this.filteredInRows.map((...args) => {
                    const rowIdx = args[0]
                    return this.data[rowIdx]
                })
            } else {
                selection = this.data
            }
        }
        this.onCheckHeadBox(tag, selection)
    }
    // 选中表头复选框的回调函数，可在类外定义
    onCheckHeadBox = () => {
    }
    // mouseenter的回调函数
    processMouseEnter = () => {
    }
    // mouseleave的回调函数
    processMouseLeave = () => {
    }

    constructor({spread, vm, data = [], options = {}}) {
        this.spread = window.spread = spread
        this.sheet = window.sheet = spread.getActiveSheet()
        // 初始化时设置总行数为0，否则表单下面会默认200行
        this.sheet.setRowCount(0)
        this.vm = vm
        this.options = {...this.options, ...options}
        // 初始化时先显示dataSource，否则列头展示的是字母
        this.sheet.setDataSource([])
    }

    /**
     * @func sheetsRowFilter
     * @desc 设置行过滤器的可见信息
     * @param {object} options - 行过滤器的可见信息
     */
    sheetsRowFilter({options} = {}) {
        options = options || {
            sortByValue: true,
            sortByColor: false,
            filterByColor: false,
            filterByValue: false,
            listFilterArea: true
        }
        // range 第一参数：代表第几行开始 第二个参数：第几列开始  第三个参数：显示多行排序数据  第四个参数：显示多列排序数据
        const range = new globalVariable.GC.Spread.Sheets.Range(0, 0, this.rowCountNum, this.leafColumns.length)
        // 根据range获取默认的行过滤器
        const hideRowFilter = new globalVariable.GC.Spread.Sheets.Filter.HideRowFilter(range)
        // 设置工作表的行过滤器
        this.sheet.rowFilter(hideRowFilter)
        const filter = this.sheet.rowFilter()
        // 遍历columns设置是否显示筛选按钮
        this.leafColumns.forEach((item, col) => {
            const isFilterable = typeof item.isFilterable === 'undefined' ? true : !!item.isFilterable;
            !isFilterable && filter.filterButtonVisible(col, false)
        })
        // 设置行过滤器的可见信息
        filter.filterDialogVisibleInfo(options)
    }

    /**
     * @func sheetsRowCheckBox
     * @desc 设置哪些列的表头单元格是checkbox，如果diaplayName是全选，则设置该列表头的单元格为checkbox
     */
    sheetsRowCheckBox() {
        const column = this.leafColumns.find((column, index) => {
            return !!column.cellType && column.cellType instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox
        })
        // 如果找到了选择框的column
        if (column) {
            // 如果是单选框
            if (column.type === 'radio') {
                // type为单选类型
                this.checkboxOpt.type = 'radio'
                // 是否有全选功能
                this.checkboxOpt.isAbleSelectAll = false
                // 否则是复选框
            } else if (column.type === 'checkbox' || typeof column.type === 'undefined') {
                // type为复选类型
                this.checkboxOpt.type = 'checkbox'
                // 如果是全选，那么设置头部单元格为全选的checkbox
                if (column.displayName === '全选') {
                    // 是否有全选功能
                    this.checkboxOpt.isAbleSelectAll = true
                    // 设置单元格类型为checkbox
                    this.sheet.setCellType(0, column.colIdx, new MyCheckBoxCellType({
                            vm: this.vm,
                            onCheckHeadBox: this._onCheckHeadBox
                        }),
                        globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
                } else {
                    // 是否有全选功能
                    this.checkboxOpt.isAbleSelectAll = false
                }
            }

            // 存储列索引
            this.checkboxOpt.colIdx = column.colIdx
        }
    }

    /**
     * @func sheetsSetTipCellType
     * @desc 设置单元格类型为TipCellType（用于注册hover单元格事件）
     */
    sheetsSetTipCellType() {
        const defaultStyle = this.sheet.getDefaultStyle();
        defaultStyle.cellType = new TipCellType({
            processMouseEnter: (hitinfo) => {
                typeof this.processMouseEnter === 'function' && this.processMouseEnter({hitinfo, sheetArea: globalVariable.GC.Spread.Sheets.SheetArea.viewport})
            },
            processMouseLeave: (hitinfo) => {
                typeof this.processMouseLeave === 'function' && this.processMouseLeave({hitinfo, sheetArea: globalVariable.GC.Spread.Sheets.SheetArea.viewport})
            }
        });
        this.sheet.setDefaultStyle(defaultStyle);
    }

    /**
     * @func sheetsSetColHeaderTipCellType
     * @desc 设置colHeader单元格类型为TipCellType（用于注册hover单元格事件）
     */
    sheetsSetColHeaderTipCellType() {
        const colHeaderDefaultStyle = this.sheet.getDefaultStyle(globalVariable.GC.Spread.Sheets.SheetArea.colHeader);
        colHeaderDefaultStyle.cellType = new ColHeaderTipCellType({
            processMouseEnter: (hitinfo) => {
                typeof this.processMouseEnter === 'function' && this.processMouseEnter({hitinfo, sheetArea: globalVariable.GC.Spread.Sheets.SheetArea.colHeader})
            },
            processMouseLeave: (hitinfo) => {
                typeof this.processMouseLeave === 'function' && this.processMouseLeave({hitinfo, sheetArea: globalVariable.GC.Spread.Sheets.SheetArea.colHeader})
            }
        });
        this.sheet.setDefaultStyle(colHeaderDefaultStyle, globalVariable.GC.Spread.Sheets.SheetArea.colHeader);
    }

    /**
     * @func resetInsProps
     * @desc 重置实例的属性
     */
    resetInsProps() {
        this.selectedIndex = []
        this.filteredInRows = []
        this.filteredOutRows = []
        // 有汇总行的话，删除汇总行
        this.deleteGatherRow()
    }

    /**
     * @func setDataSource
     * @desc 设置表单数据
     */
    setDataSource(data = []) {
        this.spread.suspendPaint()
        // 重置实例的属性
        this.resetInsProps()
        // 去除vue对data的watch
        data = [...data]
        this.data = data
        this.rowCountNum = data.length
        this.filteredInRows = data.map((...args) => {
            const rowIdx = args[1]
            return rowIdx
        })
        // 设置数据
        this.sheet.setDataSource([...data])
        // 设置行过滤器的可见信息
        this.sheetsRowFilter({data})
        // 设置行样式
        this.setAllRowStyle()
        // 设置单元格内文字样式
        this.setLetterStyle()
        // 设置列的冻结的分割线颜色
        this.setFrozenlineColor(this.options.frozenlineColor)
        // 在行底部添加汇总行，如果当前有数据，并且已定义了列头（ps：需根据列头来判断需要汇总哪些列）
        this.rowCountNum && this.columns.length && this.setSummaryData()
        this.spread.resumePaint()
    }

    /**
     * @func setLetterStyle
     * @desc 设置单元格内文字样式
     */
    setLetterStyle() {
        this.leafColumns.forEach((column, colIdx) => {
            // 设置文字颜色的回调函数
            if (typeof column.setColor === 'function') {
                this.data.forEach((row, rowIdx) => {
                    const color = column.setColor(row[column.name])
                    color && this.sheet.getRange(rowIdx, colIdx).foreColor(color)
                })
            }
        })
    }

    /**
     * @func deleteGatherRow
     * @desc 删除汇总行
     */
    deleteGatherRow() {
        // 如果显示过汇总行，则删除汇总行
        if (this.isCreatedGatherRow) {
            this.isCreatedGatherRow = false
            // 汇总行解冻
            this.sheet.frozenTrailingRowCount(0)
            // 删除汇总行（ps：此时rowCount一定是最后一行的汇总行 的行号）
            this.sheet.deleteRows(this.rowCountNum, 1)
        }
    }

    /**
     * @func setSummaryData
     * @desc 设置表单最后的汇总行
     * @desc 过滤、重新绑定列、设置data，都需要调用该方法汇总
     */
    setSummaryData() {
        // 获取过滤后的行索引、过滤后的总行数
        const {rowCount, filteredInRows} = this.getFilteredColumnsIndex()
        // 表格是否需要汇总
        const isNeedGather = this.leafColumns.some(item => item.isNeedGather && (typeof item.isVisible === 'undefined' || !!item.isVisible))

        // 如果表格需要汇总
        if (isNeedGather) {
            // 如果总行数大于0
            if (rowCount) {
                // 如果没新增过汇总行，则新增汇总行
                if (!this.isCreatedGatherRow) {
                    this.isCreatedGatherRow = true
                    // 新增一行
                    this.sheet.addRows(this.rowCountNum, 1)
                    // 设置新增行的行头
                    this.sheet.setValue(this.rowCountNum, 0, '汇总', globalVariable.GC.Spread.Sheets.SheetArea.rowHeader)
                    // 将汇总行的cellType设置成text类型
                    this.sheet.getRange(this.rowCountNum, -1, 1, -1).cellType(new globalVariable.GC.Spread.Sheets.CellTypes.Text()).formatter(summaryFormatter).locked(true)
                    // 冻结汇总行
                    this.sheet.frozenTrailingRowCount(1)
                }

                // 设置汇总值的计算
                const computeFormula = () => {
                    let filteredInRowsMark = filteredInRows.map(rowIdx => {
                        return {
                            rowIdx: rowIdx + 1,
                            isAdded: false
                        }
                    })
                    let lastRowItem
                    let formulaArray = [() => `SUM(`]
                    for (let i = 0; i < filteredInRowsMark.length; i++) {
                        const rowItem = filteredInRowsMark[i]
                        // 首次进入循环
                        if (typeof lastRowItem === 'undefined') {
                            formulaArray.push(
                                (rowIdx => colLetter => `${colLetter}${rowIdx}`)(rowItem.rowIdx)
                            )
                            rowItem.isAdded = true
                            // 非首次进入循环
                        } else {
                            // 如果需要跳行汇总
                            if (rowItem.rowIdx - lastRowItem.rowIdx !== 1) {
                                // 判断上次循环的行是否汇总过，如果没汇总过，则需要加入计算
                                if (!lastRowItem.isAdded) {
                                    formulaArray.push(
                                        ((lastRowIdx, rowIdx) => colLetter => `:${colLetter}${lastRowIdx},${colLetter}${rowIdx}`)(lastRowItem.rowIdx, rowItem.rowIdx)
                                    )
                                    lastRowItem.isAdded = true
                                    // 如果汇总过，则只计算当前行
                                } else {
                                    formulaArray.push(
                                        (rowIdx => colLetter => `,${colLetter}${rowIdx}`)(rowItem.rowIdx)
                                    )
                                }
                                rowItem.isAdded = true
                                // 如果继续接上了，不需要跳行
                            } else {
                                // 判断是否是最后一行，只有最后一行需要加上来
                                if (i === filteredInRowsMark.length - 1) {
                                    // 最后一行如果没加上来，那一定是继续（上一行，不是跳行的，所以直接:拼接就行）
                                    if (!rowItem.isAdded) {
                                        formulaArray.push(
                                            (rowIdx => colLetter => `:${colLetter}${rowIdx}`)(rowItem.rowIdx)
                                        )
                                        rowItem.isAdded = true
                                    }
                                }
                            }
                        }
                        lastRowItem = rowItem
                    }
                    formulaArray.push(() => ')')
                    return formulaArray
                }

                // 生成公式数组，这样做的目的是减少遍历此时，只遍历公式数组就行，否则每次都需要遍历filteredInRows
                const formulaArray = computeFormula()

                this.leafColumns.forEach(column => {
                    if (column.isNeedGather) {
                        this.sheet.setFormula(this.rowCountNum, column.colIdx, `=${formulaArray.map(formulaFunc => formulaFunc(this.column2Letter[column.colIdx])).join('')}`)
                    }
                })
            }
            // 如果不需要汇总，则检查是否汇总过，如果汇总过，则删除汇总行（因为现在不需要汇总了）
        } else {
            this.deleteGatherRow()
        }
    }

    /**
     * @func getFilteredColumnsIndex
     * @desc 获取当前有哪些列被筛选出来了
     */
    getFilteredColumnsIndex() {
        const sheet = this.sheet
        const rowFilter = sheet.rowFilter();
        const range = rowFilter.range;
        const filteredInRows = [],
            filteredOutRows = [];
        for (var i = range.row, last = range.row + range.rowCount; i < last; i++) {
            if (rowFilter.isRowFilteredOut(i)) {
                filteredOutRows.push(i);
            } else {
                filteredInRows.push(i);
            }
        }
        this.filteredInRows = [...filteredInRows]
        this.filteredOutRows = [...filteredOutRows]
        return {
            filteredInRows: [...filteredInRows],
            filteredOutRows: [...filteredOutRows],
            rowCount: range.rowCount
        }
    }

    /**
     * @func sheetsStyle
     * @desc 设置sheet样式
     */
    sheetsStyle({font = '12px MicrosoftYaHei', rowHeight = 23} = {}) {
        let defautStyle = this.sheet.getDefaultStyle();
        defautStyle.font = font
        defautStyle.hAlign = globalVariable.GC.Spread.Sheets.HorizontalAlign.center;
        defautStyle.vAlign = globalVariable.GC.Spread.Sheets.VerticalAlign.center;
        this.sheet.setDefaultStyle(defautStyle);
        // 列头部字体大小
        this.sheet.getRange(0, 0, this.headRowTotalNum, this.leafColumns.length, globalVariable.GC.Spread.Sheets.SheetArea.colHeader).font(font);
        // 设置单元格默认行高
        this.sheet.defaults.rowHeight = rowHeight;
        // 设置头部列高
        this.sheet.setRowHeight(0, rowHeight, globalVariable.GC.Spread.Sheets.SheetArea.colHeader);
    }

    /**
     * @func sheetsStyle
     * @desc 设置表格保护
     */
    setProtected({option = {}, isProtected = true} = {}) {
        // 表单保护配置
        option = {
            allowSelectLockedCells: true,
            allowSelectUnlockedCells: true,
            allowFilter: true,
            allowSort: true,
            allowResizeRows: true,
            allowResizeColumns: true,
            allowEditObjects: false,
            allowDragInsertRows: false,
            allowDragInsertColumns: false,
            allowInsertRows: false,
            allowInsertColumns: false,
            allowDeleteRows: false,
            allowDeleteColumns: false,
            ...option
        }
        this.sheet.options.protectionOptions = option
        this.sheet.options.isProtected = isProtected
        // 遍历表头，根据isProtect属性判断是否需要对该列设置表单保护
        this.leafColumns.forEach((item, idx) => {
            const isProtect = typeof item.isProtect === 'undefined' ? true : !!item.isProtect;
            this.sheet.getRange(-1, idx, -1, 1).locked(isProtect)
        })
    }

    /**
     * @func calcuteTotal
     * @desc 选中单元格后，计算汇总
     */
    calcuteTotal(sheet, sheetName) {
        // sum：总数，average：平均值
        let isCalcute = false,
            sum = 0,
            average = 0
        // let selectionCount = sheetName.newSelections[0].rowCount * sheetName.newSelections[0].colCount;
        //从哪列开始选
        let col = sheetName.newSelections[0].col;
        // 从哪行开始选
        // let row = sheetName.newSelections[0].row;
        // 选中多少列
        let colCount = sheetName.newSelections[0].colCount;
        // 选中多少行
        let rowCount = sheetName.newSelections[0].rowCount;
        // 求平均值
        // 求平均值的逻辑待完善，待到有具体需求时调整
        if (colCount === 1 && col === 5) {
            isCalcute = true;
            sum = 0
            average = 0;
            for (let i = 0; i < rowCount; i++) {
                sum += this.sheet.getValue(rowCount, col);
            }
            if (sum === 0) {
                average = 0;
            } else {
                average = sum.toFixed(2) / rowCount;
            }
        } else {
            isCalcute = false
        }
        return {
            isCalcute,
            sum,
            average
        }
    }

    /**
     * @func getRowAndColumnData
     * @desc 根据row（行数）, col（列数），获得当前的行数据、列数据
     */
    getRowAndColumnData(row, col) {
        const column = this.leafColumns.find(item => item.displayName === this.sheet.getDataColumnName(col))
        column.property = column.name
        return {
            row: this.data[row],
            column
        }
    }

    /**
     * @func onCheckBoxChange
     * @desc 选中表格tbody中checkbox的回调函数
     */
    onCheckBoxChange({sheet, row, col}) {
        // 如果正在编辑，退出编辑（解决双击tbody中checkbox导致checkbox样式改变的问题）
        if (sheet.isEditing()) {
            sheet.endEdit(true)
        }
        this.spread.suspendPaint()
        // 选中行 复选框 回调
        // 获得当前操作复选框的值
        const checkBoxStatus = sheet.getValue(row, col);
        // 获得当前操作复选框在selectedIndex的索引
        const eq = this.selectedIndex.indexOf(row);

        // 如果当前是复选框
        if (this.checkboxOpt.type === 'checkbox') {
            // 如果选中了复选框，并且selectedIndex里没有复选框所在行的索引
            if (checkBoxStatus && eq === -1) {
                // 添加行索引
                this.selectedIndex.push(row)
                // 如果当前没选中，并且selectedIndex里有当前行的行索引
            } else if (!checkBoxStatus && eq > -1) {
                // 删除行索引
                this.selectedIndex.splice(eq, 1)
            }

            // 获得头部的单元格
            const colHeaderCell = sheet.getCell(0, col, globalVariable.GC.Spread.Sheets.SheetArea.colHeader);

            // 如果头部的单元格是MyCheckBoxCellType的实例
            if (colHeaderCell.cellType() instanceof MyCheckBoxCellType) {
                // checkStatus 初始值为 true
                let checkStatus = true;

                // 循环当前已过滤的数据（ps：如果未过滤，filteredInRows就是所有行的索引）
                for (var i = 0; i < this.filteredInRows.length; i++) {
                    const rowIdx = this.filteredInRows[i]
                    var cell = sheet.getCell(rowIdx, col);

                    // 如果单元格是checkBox类型，并且单元格是false
                    if (cell.cellType() instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox && !cell.value()) {
                        // 那么全选按钮的状态一定是false
                        checkStatus = false;
                        break;
                    }
                }

                // 设置头部单元格的状态
                colHeaderCell.tag(checkStatus);
            }
            // 如果当前是单选框
        } else if (this.checkboxOpt.type === 'radio') {
            // 如果当前是选中状态
            if (checkBoxStatus) {
                // 存储当前行索引
                this.selectedIndex = [row]
                // 遍历当前过滤的数据
                for (let i = 0; i < this.filteredInRows.length; i++) {
                    // 获得行索引
                    const rowIdx = this.filteredInRows[i]
                    // 获得cell
                    const cell = this.sheet.getCell(rowIdx, col)
                    // 如果是checkbox
                    if (cell.cellType() instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox) {
                        // 将非本行的其他行置为false
                        if (rowIdx !== row) {
                            cell.value(false)
                        }
                    }
                }
                // 如果当前是取消选中状态
            } else {
                // 清空当前存储的索引
                this.selectedIndex = []
            }
        }


        this.spread.resumePaint()
        return {
            result: this.selectedIndex.map(eq => {
                return this.data[eq];
            })
        }
    }

    /**
     * @func setTBodyCheckboxStatus
     * @desc 设置选中表格中checkbox的选择状态，包括了全选时设置表头的选择状态
     */
    setTBodyCheckboxStatus({checkStatus = false, col} = {}) {
        const idx = this.leafColumns.findIndex(item => item.cellType instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox)
        if (idx > -1) {
            col = idx
            this.sheet.suspendPaint();
            for (let i = 0; i < this.sheet.getRowCount(); i++) {
                const cell = this.sheet.getCell(i, col);
                if (cell.cellType() instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox) {
                    cell.value(checkStatus);
                }
            }
            const colHeaderCell = this.sheet.getCell(0, col, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
            if (colHeaderCell.cellType() instanceof MyCheckBoxCellType) {
                colHeaderCell.tag(checkStatus)
            }
            if (!checkStatus) {
                // 清空实例的filteredInRows
                this.selectedIndex = []
            }
            this.sheet.resumePaint();
        }
    }

    /**
     * @func bindColumns
     * @desc 绑定列名
     * @param {array} columns - 列头数组
     * @param {object} columns.isProtect 是否保护列
     * @param {object} columns.isFilterable 是否显示过滤按钮
     * @param {object} columns.isNeedGather 是否需要汇总
     * @param {object} columns.isVisible 是否显示该列
     */
    bindColumns(columns = [], headRowTotalNum, headColTotalNum) {
        this.spread.suspendPaint()
        columns = columns.length && columns || this.columns
        // 绑定列名
        this.extTableColumns({columns, headRowTotalNum, headColTotalNum})
        // 设置列的属性
        this.setColumnAttibute(columns)
        // 指示在绑定数据上下文时是否自动生成列
        this.sheet.autoGenerateColumns = false;
        this.spread.resumePaint()
    }

    /**
     * @func getHeadRowTotalNum
     * @desc 计算表格总行数
     * @param {array} node - 表头节点对象
     * @param {object} headRowTotalNum - 总行数
     */
    getHeadRowTotalNum(node, headRowTotalNum = 1) {
        return node[this.columnChildrenKey] && node[this.columnChildrenKey].length
            // 递归计算，调用sort函数时为了取回最大行数
            ?
            node[this.columnChildrenKey].map(child => this.getHeadRowTotalNum(child, headRowTotalNum + 1)).sort((a, b) => b - a)[0] :
            headRowTotalNum
    }

    /**
     * @func getHeadColTotalNum
     * @desc 计算表格总行数
     * @param {array} node - 表头节点对象
     * @param {object} headRowTotalNum - 总列数
     */
    getHeadColTotalNum(node, headColTotalNum = 1) {
        if (node[this.columnChildrenKey] && node[this.columnChildrenKey].length) {
            node[this.columnChildrenKey].forEach(child => (headColTotalNum = this.getHeadColTotalNum(child, headColTotalNum)))
        } else {
            return headColTotalNum + 1
        }
        return headColTotalNum
    }

    /**
     * @func extTableColumns
     * @desc 递归绑定列
     * @param {array} columns - 表头节点对象
     * @param {object} headRowTotalNum - 总行数
     * @param {object} headColTotalNum - 总列数
     */
    extTableColumns({columns, headRowTotalNum, headColTotalNum}) {
        let key = this.columnChildrenKey
        // 列数，从 -1 开始
        let colNum = -1
        // node.columnNum 标记该节点下有多少叶子节点
        const rootNode = {displayName: 'root', [key]: columns}

        // 表头总行数
        headRowTotalNum = headRowTotalNum || this.getHeadRowTotalNum(rootNode) - 1
        this.headRowTotalNum = headRowTotalNum
        // 表头总列数
        headColTotalNum = headColTotalNum || this.getHeadColTotalNum(rootNode) - 1
        this.headColTotalNum = headColTotalNum

        this.sheet.setRowCount(headRowTotalNum, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
        this.sheet.setColumnCount(headColTotalNum, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
        /**
         * @func loop
         * @desc 循环生成表头
         * @param {object} node - 表头根节点对象
         * @param {number} curRowNum - 当前行数 ps: 计算过程中使用
         */
        const loop = (node, curRowNum = 0) => {
            node.columnNum = 0
            // 非叶子节点
            if (node[key] && node[key].length) {
                const localColNum = colNum + 1,
                    innerCurRowNum = curRowNum
                node[key].forEach(child => {
                    // 递归，如果是非root节点，行数+1
                    loop(child, node !== rootNode ? curRowNum + 1 : curRowNum)
                    // 计算当前节点的子节点数量
                    node.columnNum += child.columnNum
                })
                // 如果是非子节点
                if (node !== rootNode) {
                    // 设置跨行
                    this.sheet.addSpan(innerCurRowNum, localColNum, 1, node.columnNum, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
                    // node.columnNum 为当前跨列数，如果当前需要跨列（即大于1），那么设置不可以resize column
                    if (node.columnNum > 1) {
                        this.sheet.setColumnResizable(localColNum, false, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
                    }
                    // 设置显示的value
                    this.sheet.setValue(innerCurRowNum, localColNum, node.displayName, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
                    // 标记节点的行索引
                    node.rowIdx = innerCurRowNum
                    // 标记节点的列索引
                    node.colIdx = localColNum
                }
                // 叶子节点
            } else {
                // 子节点的columnNum肯定是1
                node.columnNum = 1
                // 列数++
                colNum++
                // 设置显示的value
                this.sheet.setValue(curRowNum, colNum, node.displayName, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
                // 标记节点的行索引
                node.rowIdx = curRowNum
                // 标记节点的列索引
                node.colIdx = colNum
                // 设置cellType
                this.setBranchingCellType(node)
                // bindColumn
                this.sheet.bindColumn(colNum, {...node})
                // 设置跨行
                this.sheet.addSpan(curRowNum, colNum, headRowTotalNum - curRowNum, 1, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
                // headRowTotalNum - curRowNum 为当前跨行数，如果当前需要跨行（即大于1），那么设置不可以resize row
                if (headRowTotalNum - curRowNum > 1) {
                    this.sheet.setRowResizable(curRowNum, false, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
                }
            }
        }
        loop(rootNode)
    }

    /**
     * @func setBranchingCellType
     * @desc 设置cellType
     * @param {object} leafNode - 列头的叶子节点
     */
    setBranchingCellType(leafNode) {
        if (leafNode.cellType) {
            // cellType是button
            if (leafNode.cellType instanceof globalVariable.GC.Spread.Sheets.CellTypes.Button) {
                this.setButtonCellType(leafNode)
            }
        }
    }

    /**
     * @func setButtonCellType
     * @desc 设置cellType为button的属性
     * @param {object} leafNode - 列头的叶子节点
     */
    setButtonCellType(leafNode) {
        const button = leafNode.cellType
        button.buttonBackColor('transparent')
        button.text('button')
        typeof leafNode.configCellType === 'function' && leafNode.configCellType(button)
    }

    /**
     * @func computeTableColumns
     * @desc 计算表头节点的属性
     * @param {array} columns - 表头节点对象
     * @param {object} headRowTotalNum - 总行数
     * @param {object} headColTotalNum - 总列数
     */
    computeTableColumns({columns, headRowTotalNum, headColTotalNum}) {
        let key = this.columnChildrenKey
        // 列数，从 -1 开始
        let colNum = -1
        // node.columnNum 标记该节点下有多少叶子节点
        const rootNode = {displayName: 'root', [key]: columns}

        // 表头总行数
        headRowTotalNum = headRowTotalNum || this.getHeadRowTotalNum(rootNode) - 1
        this.headRowTotalNum = headRowTotalNum
        // 表头总列数
        headColTotalNum = headColTotalNum || this.getHeadColTotalNum(rootNode) - 1
        this.headColTotalNum = headColTotalNum

        /**
         * @func loop
         * @desc 循环生成表头
         * @param {object} node - 表头根节点对象
         * @param {number} curRowNum - 当前行数 ps: 计算过程中使用
         */
        const loop = (node, curRowNum = 0) => {
            node.columnNum = 0
            // 非叶子节点
            if (node[key] && node[key].length) {
                const localColNum = colNum + 1,
                    innerCurRowNum = curRowNum
                node[key].forEach(child => {
                    // 递归，如果是非root节点，行数+1
                    loop(child, node !== rootNode ? curRowNum + 1 : curRowNum)
                    // 计算当前节点的子节点数量
                    node.columnNum += child.columnNum
                })
                // 如果是非子节点
                if (node !== rootNode) {
                    node.rowIdx = innerCurRowNum
                    // 标记节点的列索引
                    node.colIdx = localColNum
                }
                // 叶子节点
            } else {
                // 子节点的columnNum肯定是1
                node.columnNum = 1
                // 列数++
                colNum++
                // 标记节点的行索引
                node.rowIdx = curRowNum
                // 标记节点的列索引
                node.colIdx = colNum
            }
        }
        loop(rootNode)
    }

    /**
     * @func exporting
     * @desc excel导出
     * @param {string} arguments[0].name - 名称
     * @param {array} arguments[0].data - 导出的数据，默认为当前数据
     */
    exporting({name = 'export', data = this.data, disableExportCols = []} = {}) {
        // 挂起绘制
        // （由后面会使用setDataSource设置全部数据，而全部数据是不需要显示的，所以挂起）
        this.spread.suspendPaint()
        const ex = new globalVariable.ExcelIO.IO();
        // 存储当前的数据（ps：最后导出成功再设置回来）
        const storeData = this.data
        // 设置全部数据
        this.setDataSource(data)
        // 先禁掉表单保护
        this.sheet.options.isProtected = false
        // 获得导出数据
        let json = this.spread.toJSON({
            includeBindingSource: true,
            columnHeadersAsFrozenRows: true
        })

        // 获得当前sheet
        const sheet = json.sheets.Sheet1

        // 如果当前有汇总行，则导出时删除汇总行
        if (this.isCreatedGatherRow) {
            delete sheet.data.dataTable[data.length + 1]
        }

        // disableExportIndex 不需要导出的列索引
        const disableExportIndex = sheet.columns.reduce((current, item, index) => {
            // CheckBox 默认不导出 或 ableExport来控制是否导出 或 disableExportCols中包含了列name
            if ((typeof item.ableExport === 'boolean' && !item.ableExport) ||
              item.cellType instanceof globalVariable.GC.Spread.Sheets.CellTypes.CheckBox ||
              disableExportCols.includes(item.name)
            ) {
                current.push(index)
            }
            return current
        }, [])
      
        // 如果设置了disableExportCols，即设置了不导出哪些列
        if (disableExportCols.length) {
          // 将所有的列的visible设置为true（因为有的场景是，当前页面显示的列和导出的列不同）
          sheet.columns.forEach(item => {
            item.visible = true
          })
        }
      
        if (disableExportIndex.length) {
            // 删除列头
            disableExportIndex.forEach((colIdx, index) => {
              sheet.columns.splice(colIdx - index, 1)
            })

            // 在 dataTable 中删除列数据
            Object.keys(sheet.data.dataTable).forEach(key => {
                disableExportIndex.forEach(colIdx => {
                    delete sheet.data.dataTable[key][colIdx]
                })
                // 重新排序
                Object.keys(sheet.data.dataTable[key]).forEach((keyIdx, idx) => {
                    sheet.data.dataTable[key][idx] = sheet.data.dataTable[key][keyIdx]
                })
                //导出最后一列重复
                delete sheet.data.dataTable[key][sheet.columns.length]
            })
            // 设置列总数
            json.sheets.Sheet1.columnCount = json.sheets.Sheet1.columns.length
        }
        // 保存
        return new Promise((resolve, reject) => {
            ex.save(
                json,
                blob => {
                    FaverSaver.saveAs(blob, `${name}.xlsx`)
                    // 恢复表单保护
                    this.sheet.options.isProtected = true
                    // 将数据重新设置为当前页面的数据
                    this.setDataSource(storeData)
                    // 恢复渲染
                    this.spread.resumePaint()
                    resolve()
                },
                e => {
                    console.log(e)
                    reject(e)
                }
            )
        })
    }

    /**
     * @func refresh
     * @desc 刷新spread
     * @desc ps：有时spreadTable的父元素高度变化，spreadTable的高度不会自适应
     * @desc ps：调用该方法来自适应父元素高度
     */
    refresh() {
        this.spread.refresh()
    }

    /**
     * @func setContextMenu
     * @desc 设置菜单（如果传入空数组则是取消右侧菜单）
     */
    setContextMenu({menuData = []} = {}) {
        this.spread.contextMenu.menuData = menuData
    }

    /**
     * @func setCopyPasteHeaderOptions
     * @desc 设置在复制粘贴数据的时候，是否需要包含行头数据或者列头数据
     * @desc 默认是不可以复制列头、行头
     */
    setCopyPasteHeaderOptions(value = globalVariable.GC.Spread.Sheets.CopyPasteHeaderOptions.noHeaders) {
        this.spread.options.copyPasteHeaderOptions = value
    }

    /**
     * @func getSheetCommonStyle
     * @desc 获取单元格统一的样式实例（ps：默认隔行变色）
     * @param {Number} index 数组的索引
     */
    getSheetCommonStyle(index) {
        const style = new globalVariable.GC.Spread.Sheets.Style()
        // 偶数行
        if (index % 2 === 0) {
            style.backColor = this.options.evenRowBackColor
            // 奇数行
        } else {
            style.backColor = this.options.oddRowBackColor
        }

        // 设置border
        style.borderTop = new globalVariable.GC.Spread.Sheets.LineBorder(this.options.borderTopColor, globalVariable.GC.Spread.Sheets.LineStyle.thin)
        style.borderRight = new globalVariable.GC.Spread.Sheets.LineBorder(this.options.borderRightColor, globalVariable.GC.Spread.Sheets.LineStyle.thin)
        style.borderBottom = new globalVariable.GC.Spread.Sheets.LineBorder(this.options.borderBottomColor, globalVariable.GC.Spread.Sheets.LineStyle.thin)
        style.borderLeft = new globalVariable.GC.Spread.Sheets.LineBorder(this.options.borderLeftColor, globalVariable.GC.Spread.Sheets.LineStyle.thin)

        return style
    }

    /**
     * @func setAllRowStyle
     * @desc 设置行样式
     */
    setAllRowStyle() {
        this.spread.suspendPaint()
        for (let i = 0, len = this.filteredInRows.length; i < len; i++) {
            // 样式对象实例
            const style = this.getSheetCommonStyle(i)
            // 行索引
            const rowIdx = this.filteredInRows[i]
            // 如果存在vue实例，则将渲染方法暴露出去
            if (this.vm) {
                // 将style抛出到外部，在外部设置后，再setStyle
                this.vm.$emit('render-row', {rowIdx, rowData: this.data[rowIdx], style})
            }
            // 初始化spreadJSUtil实例时，存在没有columns的可能
            // 当没有columns时，需要render行
            if (this.leafColumns.length) {
                this.leafColumns.forEach((...args) => {
                    const innerStyle = style.clone()
                    // 如果存在vue实例，则将渲染方法暴露出去
                    if (this.vm) {
                        this.vm.$emit('render-cell', {rowIdx, colIdx: args[1], column: args[0], rowData: this.data[rowIdx], style: innerStyle})
                    }
                    this.sheet.setStyle(rowIdx, args[1], innerStyle)
                    // 设置单元格，允许换行
                    this.sheet.getCell(rowIdx, args[1]).wordWrap(this.options.wordWrap)
                })
            } else {
                this.sheet.setStyle(rowIdx, -1, style)
            }
            // 设置行自适应高度
            this.sheet.autoFitRow(rowIdx)
        }
        this.spread.resumePaint()
    }

    /**
     * @func setSingleRowStyle
     * @desc 设置行样式
     * @param {number} rowIdx - 行索引
     * @param {function} setStyle - 设置样式的回调函数
     */
    setSingleRowStyle({
                          rowIdx, setStyle = () => {
        }
                      }) {
        // 样式对象实例
        const style = this.getSheetCommonStyle(rowIdx)
        // 如果setStyle是回调函数
        if (typeof setStyle === 'function') {
            // 将style抛出油外部处理
            setStyle(style)
        }
        // 设置行样式
        this.sheet.setStyle(rowIdx, -1, style)
    }

    /**
     * @func setRowStripColor
     * @desc 设置行渐变色的奇数行、偶数行背景色
     */
    setRowStripColor({oddRowBackColor, evenRowBackColor, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor}) {
        this.options.oddRowBackColor = oddRowBackColor || '#fff'
        this.options.evenRowBackColor = evenRowBackColor || '#fff'
        this.options.borderLeftColor = borderLeftColor || borderColor || '#D0D7E5'
        this.options.borderTopColor = borderTopColor || borderColor || '#D0D7E5'
        this.options.borderRightColor = borderRightColor || borderColor || '#D0D7E5'
        this.options.borderBottomColor = borderBottomColor || borderColor || '#D0D7E5'
    }

    /**
     * @func setCellStyle
     * @desc 设置某个cell的样式
     * @param {Object.rowIdx} 行索引
     * @param {Object.colName} 列名称
     * @param {Object.setStyle} 回调函数，形参为style对象
     */
    setCellStyle({
                     rowIdx, colName, setStyle = () => {
        }
                 }) {
        this.spread.suspendPaint()
        const idx = this.leafColumns.findIndex(item => item.name === colName)
        if (idx > -1) {
            const style = this.sheet.getActualStyle(rowIdx, idx, globalVariable.GC.Spread.Sheets.SheetArea.viewport, true)
            // 如果setStyle是回调函数
            if (typeof setStyle === 'function') {
                // 将style抛出由外部处理
                setStyle(style)
                this.sheet.setStyle(rowIdx, idx, style, globalVariable.GC.Spread.Sheets.SheetArea.viewport)
            }
        }
        this.spread.resumePaint()
    }
  
    /**
     * @func setAutoFitColumn
     * @desc 设置列自适应宽度
     * @param colIdx 列索引
     */
    setAutoFitColumn (colIdx) {
      this.leafColumns.forEach((...args) => {
        const [ column, rowIdx ] = args
        if (typeof column.size !== 'number') {
          this.sheet.autoFitColumn(rowIdx)
        }
      })
    }
    
    /**
     * @func setColumnAttibute
     * @desc 设置列的属性
     * @param {array} columns - 列头数组
     * @param {boolean} isComputeTableColumns - 是否需要计算列头属性
     */
    setColumnAttibute(columns = [], isComputeTableColumns = false) {
        if (!columns.length) {
            return false
        }

        this.columns = columns

        // 如果需要计算列头属性
        if (isComputeTableColumns) {
            this.computeTableColumns({columns})
        }

        // 设置列头的样式，并存储叶子节点
        this.leafColumns = this.setColHeaderStyle(columns)
        
        // 设置列的冻结
        this.setColumnsFrozen()

        // 设置行过滤器的可见信息
        this.sheetsRowFilter({data: this.data})

        // 根据columns索引生成excel列头
        this.column2Letter = compColumn2Letter(this.leafColumns.length)
        // setColumnVisible后，需要重新计算汇总（ps：因为有可能增加显示了一些需要汇总的列）
        this.setSummaryData()
    
        // 设置表单保护
        this.setProtected();
    }

    /**
     * @func setColHeaderStyle
     * @desc 设置列头的样式
     * @param {array} columns - 列头数组
     */
    setColHeaderStyle(columns, leafColumns = []) {
        this.spread.suspendPaint()
        columns.forEach((column) => {
            let style = this.sheet.getActualStyle(column.rowIdx, column.colIdx, globalVariable.GC.Spread.Sheets.SheetArea.colHeader, true)
            if (this.vm) {
                this.vm.$emit('render-header', {style, column, colIdx: column.colIdx, rowIdx: column.rowIdx})
            }
            this.sheet.setStyle(column.rowIdx, column.colIdx, style, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
            if (column[this.columnChildrenKey] && column[this.columnChildrenKey].length) {
                this.setColHeaderStyle(column[this.columnChildrenKey], leafColumns)
            } else {
                // 设置列的显示隐藏
                this.setColumnVisible(column)
                // 存储叶子节点
                leafColumns.push(column)
            }
        })
        this.spread.resumePaint()
        return leafColumns
    }

    /**
     * @func setColumnsFrozen
     * @desc 设置列的冻结
     */
    setColumnsFrozen() {
        const frozenColumnNum = this.options.frozenColumnNum
        const frozenTrailingColumnNum = this.options.frozenTrailingColumnNum
        // 冻结头列
        frozenColumnNum && this.sheet.frozenColumnCount(frozenColumnNum)
        // 冻结尾列
        frozenTrailingColumnNum && this.sheet.frozenTrailingColumnCount(frozenTrailingColumnNum)
        // 设置列的冻结的分割线颜色，如果当前有数据，则设置颜色，否则透明
        this.setFrozenlineColor(this.rowCountNum > 0 ? this.options.frozenlineColor : 'transparent')
    }

    /**
     * @func setFrozenlineColor
     * @desc 设置列的冻结的分割线颜色（ps：没有数据时，线的颜色是透明的，有数据时，线的颜色是黑色）
     */
    setFrozenlineColor(frozenlineColor) {
        // 如果没设置冻结列的数量，return
        if (!this.options.frozenColumnNum && !this.options.frozenTrailingColumnNum) {
            return false
        }
        // 如果当前无数据，设置frozenlineColor为透明的，要不太难看
        if (!this.rowCountNum) {
            frozenlineColor = 'transparent'
        }
        this.sheet.options.frozenlineColor = frozenlineColor
    }

    /**
     * @func setSingleColHeaderStyle
     * @desc 设置某一个列头的样式
     * @param {Object.colName} 列名称
     * @param {Object.setStyle} 回调函数，形参为style对象
     */
    setSingleColHeaderStyle({
                                colName, setStyle = () => {
        }
                            }) {
        if (typeof setStyle === 'function') {
            const colIdx = this.columns.findIndex(item => item.name === colName)
            let style = new globalVariable.GC.Spread.Sheets.Style();
            setStyle(style)
            this.sheet.setStyle(-1, colIdx, style, globalVariable.GC.Spread.Sheets.SheetArea.colHeader)
        }
    }

    /**
     * @func setColumnVisible
     * @desc 设置列的显示隐藏
     */
    setColumnVisible(column) {
        this.sheet.setColumnVisible(column.colIdx, typeof column.isVisible === 'undefined' || !!column.isVisible)
    }

    /**
     * @func letCanvasMousedownBubble
     * @desc 使canvas的mousedown事件冒泡出去
     * @desc（ps：spreadjs阻止了canvas的mousedown冒泡）
     */
    letCanvasMousedownBubble() {
        this.vm.$el.querySelector('#vp_vp').addEventListener('mousedown', () => {
            const event = new Event('mousedown')
            document.dispatchEvent(event)
        })
    }

}
