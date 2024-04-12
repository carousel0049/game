import React, {memo} from "react";
import {Routes, Route} from "react-router-dom";
import Main from "./pages/main";

function Router() {

  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default memo(Router);
