import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

import './slider.scss';

let contentLength = 0;
let contentWidth = 0;
let spaceWidth = 0;
let wrapSpaceWidth = 0;
let itemWidth = 0;
let maxMove = 0;
let temCurX = 0;
let startX = 0;
let startY = 0;
let endX = 0;
let curX = 0;
let groupPosiArr = [];
let groupNum = 0;
let curGroupIndex = 0;
let moving = false;
let touchDir = null;   //'row' === 横向滚动  'col' === 竖向滚动
let moved = false;   //是否移动过，用来区分点击和移动

let Slider = (props, ref) => {
  const {
    groupLength = 2,
    clickScroll,
    crossing,
    className,
    children,
  } = props;

  const touchDom = useRef(null);
  const contentDom = useRef(null);
  const [curStyle, setCurStyle] = useState({});

  useEffect(() => {
    contentLength = contentDom.current.childElementCount;
    contentWidth = contentDom.current.clientWidth;
    itemWidth = contentDom.current.firstChild ? contentDom.current.firstChild.clientWidth : 0;
    spaceWidth = (contentWidth - (itemWidth * contentLength)) / (contentLength - 1);
    groupNum = Math.ceil(contentLength / groupLength);
    maxMove = window.screen.width - touchDom.current.scrollWidth;
    if (contentDom.current.children && contentDom.current.firstChild && groupPosiArr.length === 0) {
      wrapSpaceWidth = contentDom.current.firstChild.offsetLeft;
      for (let i = 0; i < groupNum; i++) {
        groupPosiArr.push(-(contentDom.current.children[i * groupLength].offsetLeft - wrapSpaceWidth));
      }
    }
  });

  /**
   * touchStart
   */
  const touchStart = e => {
    if (moving) true;
    touchDir = null;
    const {
      pageX,
      pageY,
    } = e.touches[0];
    startX = pageX;
    startY = pageY;
  }

  /**
   * touchMove
   */
  const touchMove = e => {
    const {
      pageX,
      pageY,
    } = e.touches[0];
    if (touchDir === 'row' && Ali.isIOS) {
      e.preventDefault();
    }
    if (touchDir === 'col') return;
    if (Math.abs(pageX - startX) > 10 && !moved) {
      moved = true;
    }
    const disX = pageX - startX;
    const disY = pageY - startY;
    if (!touchDir) {
      touchDir = Math.abs(Math.max.call(disX, disY)) > 0.1 ? (Math.abs(disX) > Math.abs(disY) ? 'row' : 'col') : null;
    }
    curX = pageX - startX + temCurX;
    curX >= 0 && (curX = 0);
    curX <= maxMove && (curX = maxMove);
    setCurStyle({
      'transform': `translate3d(${curX}px, 0, 0)`,
      '-webkit-transform': `translate3d(${curX}px, 0, 0)`,
      'transition': 'transform 0.02s linear',
      '-webkit-transition': 'transform 0.02s linear',
    });
    endX = pageX;
  }

  const moveAct = index => {
    curX = groupPosiArr[index] <= maxMove ? maxMove : groupPosiArr[index];
    setCurStyle({
      'transform': `translate3d(${curX}px, 0, 0)`,
      '-webkit-transform': `translate3d(${curX}px, 0, 0)`,
      'transition': 'transform 0.4s ease-in-out',
      '-webkit-transition': 'transform 0.4s ease-in-out',
    });
    temCurX = curX;
    setTimeout(() => {
      setCurStyle({
        'transform': `translate3d(${curX}px, 0, 0)`,
        '-webkit-transform': `translate3d(${curX}px, 0, 0)`,
      });
      moving = false;
    }, 400);
  }

  /**
   * 判断点击到的是否是contentDom的第一级节点
   */
  const isFirstNode = (ele) => Array.from(contentDom.current.childNodes).includes(ele);

  /**
   * 获取点击的是第几个节点
   */
  const getWhichNode = (ele) => {
    if (isFirstNode(ele)) {
      return Array.from(contentDom.current.childNodes).findIndex(e => e === ele);
    }
    if (ele.parentNode) {
      return getWhichNode(ele.parentNode);
    } else {
      return null;
    }
  }

  // 点击滚动到相应到位置
  const scroll = (num) => {
    moveAct(num);
    moving = true;
    startX = 0;
    startY = 0;
    temCurX = curX;
  }

  /**
   * touchEnd
   */
  const touchEnd = e => {
    if (!moved) {  //是点击事件
      /**
       * _curGroupIndex --> 点击在第几组中，如果没有点击到具体到组别，getWhichNode返回值为null, 如此_curGroupIndex则为NaN
       */
      if (!clickScroll) return;
      const _curGroupIndex = Math.floor(getWhichNode(e.target) / groupLength);
      if (Number.isNaN(_curGroupIndex)) return;
      curGroupIndex = _curGroupIndex;
      scroll(curGroupIndex);
      return;
    };
    moved = false;
    const distance = endX - startX;
    const scrollDis = itemWidth / 2;  //滑动阀值
    let dir = Math.abs(distance) > scrollDis ? -(distance / Math.abs(distance)) : 0;
    // 是否允许跨越式翻页 例：从第一组直接翻到第三组第四组等
    if (crossing) {
      let crossNum = Math.abs(Math.ceil((endX - startX) / (itemWidth + spaceWidth)));
      dir = dir * crossNum;
    }

    curGroupIndex = curGroupIndex + dir;
    curGroupIndex < 0 && (curGroupIndex = 0);
    curGroupIndex > (groupNum - 1) && (curGroupIndex = groupNum - 1);
    scroll(curGroupIndex);
  }

  /**
   * 露出主动切换滚动位置的方法
   */
  useImperativeHandle(ref, () => ({
    setActIndexPosition: (index) => {
      const _curGroupIndex = Math.floor(index / groupLength);
      if (Number.isNaN(_curGroupIndex)) return;
      curGroupIndex = _curGroupIndex;
      scroll(curGroupIndex);
    }
  }));

  return (
    <div className={`${className} scroll-wrap`}>
      <div className="scroll-box" ref={touchDom} onTouchStart={touchStart} onTouchMove={touchMove} onTouchCancel={touchEnd} onTouchEnd={touchEnd} style={curStyle}>
        <div className="scroll-content" ref={contentDom}>
          {children}
        </div>
      </div>
    </div>
  )
}

Slider = forwardRef(Slider);

export default Slider;