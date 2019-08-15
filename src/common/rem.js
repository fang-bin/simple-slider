/**
 * pwidth 设计稿尺寸
 * prem 页面分成多少份
 */
export default (pwidth, prem) => {
  const html = document.querySelector('html');
  const oWidth = document.documentElement.clientWidth || document.body.clientWidth;
  html.style.fontSize = oWidth / pwidth * prem + 'px';
}