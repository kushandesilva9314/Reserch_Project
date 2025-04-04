import React from "react";
import Banner from "./components/company_banner";
import Profile_sec from "./components/profile_section";
import Footer from "./components/footer";
import Post from "./components/company_post";
import Chart from "./components/sales_cahrt"; 

function Company() {
  return (
    <div>
      <Profile_sec />
      <Banner />
      <Post/>
      <Chart/>
      <Footer />
    </div>
  );
}

export default Company;
