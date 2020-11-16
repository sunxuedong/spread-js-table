/**
 * @func copy
 * @desc 模拟复制行为
 * @param {string} content - 复制的字符串
 */
export const copy = content => {
  // create一个textarea
  var textarea = document.createElement('textarea');
  // 显示在屏幕外
  textarea.style.position = 'fixed'
  textarea.style.left = '-100000px'
  // 插入body
  document.body.appendChild(textarea);
  // 设置textarea的value
  textarea.value = content;
  // 选中textarea中的文字
  textarea.select();
  // 如果支持copy行为，则copy
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    // console.log('复制成功');
  }
  // 从dom中移除
  document.body.removeChild(textarea);
}
