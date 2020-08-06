import React, { useState} from 'react';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import { BackTop } from 'antd';
import { BrowserRouter, Route } from "react-router-dom";

import './App.scss';

// import Request from './util/request';


// const App = () => {
//   const [userInfo, setUserInfo] = useState(false);
//   const [loading, setLoading] = useState(false);

//   !loading && !userInfo && Request.get('/userInfo', {
//     beforeSend: () => {
//       setLoading(true)
//     } 
//   }).then(data => {
//     setUserInfo(data)
//   }).finally(()=>{
//     setLoading(false)
//   });

//   return  <>
//     {
//       userInfo && <div div className="App" >
//         <BrowserRouter>
//           <Route path="/" exact={true} component={Home} />
//           <Route path="/login" component={LoginPage} />
//         </BrowserRouter>
//         <BackTop
//           visibilityHeight={50}
//         />
//       </div>
//     }
//   </>
// };

const App = () => {
  return <div div className="App" >
    <BrowserRouter>
      <Route path="/" exact={true} component={Home} />
      <Route path="/login" component={LoginPage} />
    </BrowserRouter>
    <BackTop
      visibilityHeight={50}
    />
  </div>
}

export default App;