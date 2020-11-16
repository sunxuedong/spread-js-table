import globalVariable from '@/utils/globalVariable'

/**
 * 划过提示类
 * */

export default class ColHeaderTipCellType extends globalVariable.GC.Spread.Sheets.CellTypes.ColumnHeader {
  // mouseenter 回调函数
  processMouseEnter = () => {}
  // mouseleave 回调函数
  processMouseLeave = () => {}
  constructor ({processMouseEnter, processMouseLeave}) {
    super()
    this.processMouseEnter = processMouseEnter
    this.processMouseLeave = processMouseLeave
  }

  getHitInfo (x, y, cellStyle, cellRect, context) {
    return {
      x: x,
      y: y,
      row: context.row,
      col: context.col,
      cellStyle: cellStyle,
      cellRect: cellRect,
      sheetArea: context.sheetArea
    };
  }

  processMouseEnter (hitinfo) {
    // 执行回调
    typeof this.processMouseEnter === 'function' && this.processMouseEnter(hitinfo)
  }

  processMouseLeave (hitinfo) {
    // 执行回调
    typeof this.processMouseLeave === 'function' && this.processMouseLeave(hitinfo)
  }

}
