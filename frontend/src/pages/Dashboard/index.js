import TeenagerDashboard from "./TeenagerDashboard";
import ParentsDashboard from "./YourChild/AddYourChild";
import ManagerDashboard from "./ManagerDashboard/index";

import userDataHook from "../../userDataHook";


const Dashboard = () => {

  const userData = userDataHook();

  switch (userData.user_type) {
    case "manager":
    case "subuser":
      return (
        <>
          <ManagerDashboard />
        </>
      )
    break;


    case "parents":
      return (
        <>
          <ParentsDashboard />
        </>
      )
    break;

    case "teenager":

      return (
        <>
          <TeenagerDashboard />
        </>
      )

    break;
  }

};

export default Dashboard;
