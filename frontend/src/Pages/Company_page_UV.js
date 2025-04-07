import React from "react";
import { useLocation } from "react-router-dom";
import Banner from "./components/Company_UV/Company_banner_UV";
import Profile_sec from "./components/Company_UV/Company_profile_UV";
import Footer from "./components/footer";
import Post from "./components/Company_UV/Company_post_UV";
import Chart from "./components/Company_UV/Company_sales_UV"; 

function CompanyUV() {
  const location = useLocation();
  const companyEmail = location.state?.companyEmail || "";

  return (
    <div>
      <Profile_sec companyEmail={companyEmail} />
      <Banner companyEmail={companyEmail} />
      <Post companyEmail={companyEmail} />
      <Chart companyEmail={companyEmail} />
      <Footer />
    </div>
  );
}

export default CompanyUV;
