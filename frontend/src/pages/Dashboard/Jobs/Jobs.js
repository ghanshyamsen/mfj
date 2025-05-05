import React from 'react';
import TeenagerJobs from './TeenagerJobs';
import Index from '../JobOpenings/index';


const Jobs = () => {

  const user = JSON.parse(localStorage.getItem('userData'));

  if(user.user_type === 'teenager'){
    return (
      <>
        <TeenagerJobs />
      </>
    );
  }else{
    return (
      <>
        <Index />
      </>
    );
  }

};

export default Jobs;
