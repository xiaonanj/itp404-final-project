import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../Navigation";

const Root = () => {
  return (
    <div>
      <Navigation />
      <main className="container mt-4">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Root;
