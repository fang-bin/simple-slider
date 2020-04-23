/**
 * pwidth 设计稿尺寸
 * prem 页面分成多少份
 */
export default (pwidth: number, prem: number): void => {
  const html: HTMLElement | null = document.querySelector('html');
  const oWidth = document.documentElement.clientWidth || document.body.clientWidth;
  html && (html.style.fontSize = oWidth / pwidth * prem + 'px');
}