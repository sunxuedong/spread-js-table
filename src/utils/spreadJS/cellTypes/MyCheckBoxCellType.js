import globalVariable from '@/utils/globalVariable'

const basePaint = globalVariable.GC.Spread.Sheets.CellTypes.CheckBox.prototype.paint

/**
 * 复选框类
 * */

export default class MyCheckBoxCellType extends globalVariable.GC.Spread.Sheets.CellTypes.CheckBox {
  onCheckHeadBox = () => {}

  constructor ({onCheckHeadBox}) {
    super()
    this.onCheckHeadBox = onCheckHeadBox
  }

  paint (ctx, value, x, y, width, height, style, context) {
    let tag = context.sheet.getTag(context.row, context.col, context.sheetArea)
    if (tag !== true) {
      tag = false
    }
   basePaint.apply(this, [ctx, tag, x, y, width, height, style, context])
  }

  getHitInfo (x, y, cellStyle, cellRect, context) {
    if (context) {
      let {row, col, sheetArea, sheet} = context
      return {
        x,
        y,
        row,
        col,
        cellRect,
        sheetArea,
        isReservedLocation: true,
        sheet
      }
    }
    return null
  }

  processMouseUp (hitInfo) {
    let {sheet, row, col, sheetArea} = hitInfo

    let tag = sheet.getTag(row, col, sheetArea)

    if (tag === undefined || tag === null) {
      sheet.setTag(row, col, true, sheetArea)
    } else {
      sheet.setTag(row, col, !tag, sheetArea)
    }
    tag = sheet.getTag(row, col, sheetArea)

    sheet.suspendPaint()
    //全选和取消全选回调
    this.onCheckHeadBox(tag, col)
    sheet.resumePaint()
  }
}
