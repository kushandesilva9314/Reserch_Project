import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Banner from "./components/banner";
import Service from "./components/service";
import Reviews from "./components/review";
import SliderComponent from "./components/slider";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("http://localhost:3001/api/protected", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          console.log("User is authenticated:", data.user);
          setUser(data.user);

          
          if (data.user.role !== "admin" && data.user.role !== "investor") {
            navigate("/company");
          }
        } else {
          console.log("User is NOT authenticated");
          setUser(null);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        setUser(null);
      });
  }, [navigate]); 

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar user={user} />
      <main className="flex-grow w-full px-6 py-20 mt-16 relative">
        <Banner />
        <Service />
        <SliderComponent />
       {/*  <Reviews /> */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
