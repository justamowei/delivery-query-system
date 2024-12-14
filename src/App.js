import React from "react";
import AddPackage from "./component/AddPackage";
import ModifyPackage from "./component/ModifyPackage";
import UpdatePackage from "./component/UpdatePackage";

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
