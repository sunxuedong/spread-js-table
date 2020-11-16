// 26进制对应excel列的基本映射
const baseLetters = {
  '0': 'A',
  '1': 'B',
  '2': 'C',
  '3': 'D',
  '4': 'E',
  '5': 'F',
  '6': 'G',
  '7': 'H',
  '8': 'I',
  '9': 'J',
  'a': 'K',
  'b': 'L',
  'c': 'M',
  'd': 'N',
  'e': 'O',
  'f': 'P',
  'g': 'Q',
  'h': 'R',
  'i': 'S',
  'j': 'T',
  'k': 'U',
  'l': 'V',
  'm': 'W',
  'n': 'X',
  'o': 'Y',
  'p': 'Z'
}

/**
 * @func createCellPos
 * @desc 根据索引，在excel列名中获得对应的列名
 */
function createCellPos (i) {
  let cellPos
  const systems26 = (i - 0).toString(26)
  if (systems26.length === 1) {
    cellPos = baseLetters[systems26]
  } else {
    cellPos = systems26.split('').map((item, idx) => {
      if (idx === 0) {
        return baseLetters[item - 1]
      } else {
        return baseLetters[item]
      }
    }).join('')
  }
  return cellPos
}

/**
 * @func compColumn2Letter
 * @desc 生成对应的excel列名组成的数组
 */
export default function compColumn2Letter (length) {
  const column2Letter = []
  for (let i = 0; i < length; i++) {
    column2Letter.push(createCellPos(i))
  }
  return column2Letter
}
