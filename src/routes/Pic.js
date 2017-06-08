import React from 'react';
import { connect } from 'dva';
import styles from './Users.css';

import Component from '../components/Pics';
import MainLayout from '../components/MainLayout/MainLayout';

function Pics({location}) {

const path = { location }.location.pathname;


  return (
     <MainLayout location={location}>
      <div className={styles.normal}>
        <Component title="吃饭没"/>
      </div>
    </MainLayout>
  );


}



export default connect()(Pics);
