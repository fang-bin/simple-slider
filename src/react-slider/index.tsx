import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './index.scss';

// 方向
enum Dir {
  row,  //横向
  col,  //纵向
  non,  //未有滚动方向
}

let contentLength: number = 0;
let contentWidth: number = 0;
let spaceWidth: number = 0;
let wrapSpaceWidth: number = 0;
let itemWidth: number = 0;
let maxMove: number = 0;
let temCurX: number = 0;
let startX: number = 0;
let startY: number = 0;
let endX: number = 0;
let curX: number = 0;
let groupPosiArr: number[] = [];
let groupNum: number = 0;
let curGroupIndex: number = 0;
let moving: boolean = false;
let touchDir:Dir = Dir.non;   //row === 横向滚动  col === 竖向滚动  non===未滚动
let moved: boolean = false;   //是否移动过，用来区分点击和移动
const isIOS: boolean = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

interface PropsPort {
  groupLength ?: number;
  clickScroll ?: boolean;
  crossing ?: boolean;
  className ?: string;
  children ?: JSX.Element;
}
let Slider = (props: PropsPort, ref): JSX.Element => {
  groupPosiArr = [];
  const {
    groupLength = 1,  //几个一组
    clickScroll = false,  //点击是否自动滚动到当前所在组
    crossing = false,    //是否可以跨越翻页
    className = '',
    children = null,
  } = props;

  const touchDom = useRef<HTMLDivElement>(null);
  const contentDom = useRef<HTMLDivElement>(null);
  const wrapDom = useRef<HTMLDivElement>(null);
  interface Style {
    transform ?: string;
    transition ?: string;
  }
  const [curStyle, setCurStyle] = useState<Style>({});

  useEffect(() => {
    contentLength = contentDom.current!.childElementCount;
    contentWidth = contentDom.current!.clientWidth;
    itemWidth = contentDom.current!.firstChild ? contentDom.current!.firstChild.clientWidth : 0;
    spaceWidth = (contentWidth - (itemWidth * contentLength)) / (contentLength - 1);
    groupNum = Math.ceil(contentLength / groupLength);
    maxMove = wrapDom.current!.clientWidth - touchDom.current!.scrollWidth;
    if (contentDom.current!.children && contentDom.current!.firstChild && groupPosiArr.length === 0) {
      wrapSpaceWidth = contentDom.current!.firstChild.offsetLeft;
      for (let i = 0; i < groupNum; i++) {
        groupPosiArr.push(-(contentDom.current!.children[i * groupLength].offsetLeft - wrapSpaceWidth));
      }
    }
  });

  /**
   * touchStart
   */
  const touchStart = (e: TouchEvent): void => {
    if (moving) true;
    touchDir = Dir.non;
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
  const touchMove = (e: TouchEvent): void => {
    const {
      pageX,
      pageY,
    } = e.touches[0];
    if (touchDir === Dir.row && isIOS) {
      e.preventDefault();
    }
    if (touchDir === Dir.col) return;
    if (Math.abs(pageX - startX) > 10 && !moved) {
      moved = true;
    }
    const disX = pageX - startX;
    const disY = pageY - startY;
    if (!touchDir) {
      touchDir = Math.abs(Math.max.call(disX, disY)) > 0.1 ? (Math.abs(disX) > Math.abs(disY) ? Dir.row : Dir.col) : Dir.non;
    }
    curX = pageX - startX + temCurX;
    curX >= 0 && (curX = 0);
    curX <= maxMove && (curX = maxMove);
    setCurStyle({
      'transform': `translate3d(${curX}px, 0, 0)`,
      'transition': 'transform 0.02s linear',
    });
    endX = pageX;
  }

  const moveAct = (index: number): void => {
    curX = groupPosiArr[index] <= maxMove ? maxMove : groupPosiArr[index];
    setCurStyle({
      'transform': `translate3d(${curX}px, 0, 0)`,
      'transition': 'transform 0.4s ease-in-out',
    });
    temCurX = curX;
    setTimeout(() => {
      setCurStyle({
        'transform': `translate3d(${curX}px, 0, 0)`,
      });
      moving = false;
    }, 400);
  }

  /**
   * 判断点击到的是否是contentDom的第一级节点
   */
  const isFirstNode = (ele: ChildNode | Node | EventTarget): boolean => Array.from(contentDom.current!.childNodes).includes(ele);

  /**
   * 获取点击的是第几个节点
   */
  const getWhichNode = (ele: ChildNode | Node | EventTarget): number | null => {
    if (isFirstNode(ele)) {
      return Array.from(contentDom.current!.childNodes).findIndex(e => e === ele);
    }
    if (ele.parentNode) {
      return getWhichNode(ele.parentNode);
    } else {
      return null;
    }
  }

  // 点击滚动到相应到位置
  const scroll = (num: number): void => {
    moveAct(num);
    moving = true;
    startX = 0;
    startY = 0;
    temCurX = curX;
  }

  /**
   * touchEnd
   */
  const touchEnd = (e: TouchEvent): void => {
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
    const scrollDis = itemWidth / 3;  //滑动阀值
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
    <div className={`${className} scroll-wrap`} ref={wrapDom}>
      <div className="scroll-box" ref={touchDom} onTouchStart={touchStart} onTouchMove={touchMove} onTouchCancel={touchEnd} onTouchEnd={touchEnd} style={curStyle}>
        <div className="scroll-content" ref={contentDom}>
          {
            children.map((e, i) => {
              return <div key={i}>{e}</div>
            })
          }
        </div>
      </div>
    </div>
  )
}

let _Slider = forwardRef(Slider);

export default _Slider;