import React from "react";
import AddPackage from "./component/AddPackage";
import ModifyPackage from "./component/ModifyPackage";
import UpdatePackage from "./component/UpdatePackage";

function App() {
  return (
      <div>
          <AddPackage/>
          <br/>
          <ModifyPackage/>
          <br/>
          <UpdatePackage/>
      </div>
  );
}

export default App;
