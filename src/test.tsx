// 兼容移动端方案
import setRem from '@/common/rem.js';
setRem(750, 100);
import './test.scss';

/**
 * react测试
 */
import React from 'react';
import ReactDom from 'react-dom';
import Slider from './index-react';
const list = [1,2,3,4];
const App = () => {
  return (
    <Slider className="slider">
      {
        list.map((e, i) => {
          return <div className={`item item${i+1}`} key={i}>{e}</div>
        })
      }
    </Slider>
  )
}
ReactDom.render(<App />, document.querySelector('#app'));
