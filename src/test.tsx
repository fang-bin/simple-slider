import './test.scss';
/**
 * react测试
 */
import React from 'react';
import ReactDom from 'react-dom';
import Slider from './index-react';
const list = [1,2,3];
const App = () => {
  return (
    <Slider className="slider">
      {
        list.map(e => {
          return <div>{e}</div>
        })
      }
    </Slider>
  )
}
ReactDom.render(<App />, document.querySelector('#app'));
