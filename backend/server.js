const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const adsRoutes = require("./routes/ads");
const postRoutes = require("./routes/post");
const imageRoutes = require("./routes/company_images");
const ProfilePicture = require("./models/profile");
const profilePictureRoutes = require("./routes/profilePicture");
const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/company");
const PendingUser = require("./models/pending_user");
const PendingOrg = require("./models/pending_org");
const companiesRoute = require("./routes/a_companies");
const investorsRoute = require("./routes/investor");
const Investor = require("./models/investors");
const Company = require("./models/company");
const contentRoutes = require("./routes/content");
const Content = require("./models/content");
const marketNewsRoutes = require("./routes/marketNews");
const companyLoginRoutes = require("./routes/company_login");
const fetchImagesRoute = require("./routes/fetch_images");
const FetchPostRoutes = require("./routes/fetch_post");
const PublicAdRoutes = require("./routes/fetch_ad");
const salesRoutes = require('./routes/sales');
const predictionRoutes = require('./routes/prediction');
const messageRoutes = require("./routes/chat");
const forgotPasswordRoutes = require("./routes/ForgotPassword");
const adminRoutes = require("./routes/adminRoutes");
const Ad = require('./models/ads');
const Image = require('./models/company_images');
const Post = require('./models/post');
const Sales = require('./models/sales_schema');
const companyUVRoutes = require("./routes/company_profile_UV");
const companyBannerUVRoutes = require("./routes/company_banner_UV");
const companypostUVRoutes = require("./routes/company_post_UV");
const companysalesUVRoutes = require("./routes/company_sales_uv");
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("Missing SESSION_SECRET in environment variables.");
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

const app = express();

app.use(cookieParser());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose
  .connect("mongodb://localhost:27017/ResearchProject")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/api/pending-users", async (req, res) => {
  try {
    const users = await PendingUser.find({}, { password: 0 }); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/pending-organizations", async (req, res) => {
  try {
    console.log("Fetching pending organizations...");
    const pendingOrgs = await PendingOrg.find({}, "companyEmail");

    if (!pendingOrgs || pendingOrgs.length === 0) {
      console.log("No organizations found.");
      return res
        .status(200)
        .json({ message: "No pending organizations", data: [] });
    }

    res.status(200).json(pendingOrgs);
  } catch (error) {
    console.error("Error fetching pending organizations:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/pending-users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await PendingUser.findById(id, { password: 0 }); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/pending-organizations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await PendingOrg.findById(id);

    if (!organization) {
      return res
        .status(200)
        .json({ message: "Organization not found", data: null });
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error("Error fetching organization details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/api/pending-organizations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting pending organization with ID: ${id}`);

    const deletedOrg = await PendingOrg.findByIdAndDelete(id);

    if (!deletedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Error deleting organization:", error);
    res.status(500).json({ error: "Server error while deleting organization" });
  }
});


app.delete("/api/pending-users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await PendingUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error while deleting user" });
  }
});


app.get("/api/investors", async (req, res) => {
  try {
    const investors = await Investor.find({
      role: { $not: { $regex: /^admin$/i } }, 
    }).lean();
    res.status(200).json(investors);
  } catch (error) {
    console.error("Error fetching investors:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/api/investors/:id", async (req, res) => {
  try {
    const investor = await Investor.findById(req.params.id);

    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    if (investor.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin accounts cannot be deleted" });
    }

    await Investor.findByIdAndDelete(req.params.id);

    await ProfilePicture.findOneAndDelete({ email: investor.email }).catch(
      (err) => {
        console.warn(
          "No profile picture found for this investor, skipping deletion."
        );
      }
    );

    res
      .status(200)
      .json({
        message:
          "Investor deleted successfully, profile picture (if any) also deleted.",
      });
  } catch (error) {
    console.error("Error deleting investor:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/organizations", async (req, res) => {
  try {
    const organizations = await Company.find();
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/organizations/:id", async (req, res) => {
  try {
    const organization = await Company.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/api/organizations/:id", async (req, res) => {
  try {
    const organization = await Company.findByIdAndDelete(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const companyEmail = organization.companyEmail;

    
    await Promise.all([
      Ad.deleteMany({ companyEmail }),
      Image.deleteMany({ companyEmail }),
      Post.deleteMany({ email: companyEmail }),
      Sales.deleteOne({ email: companyEmail }),
    ]);

    res.status(200).json({ message: "Organization and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting organization:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/slider/all", async (req, res) => {
  try {
    const contents = await Content.find();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const updatedContents = contents.map((content) => ({
      ...content._doc,
      image: content.image ? `${baseUrl}${content.image}` : null,
    }));

    res.status(200).json(updatedContents);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log("🔹 Login request received:", req.body);

    if (role === "company") {
      return res.status(400).json({ message: "Use company login API" });
    }

    const user = await Investor.findOne({ email });

    if (!user || !user.role || user.role !== role) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

   
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 86400000,
    });

    res.json({
      message: "Login successful",
      token,
      user: { username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(" Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/protected", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }

    res.json({
      message: "Protected content",
      user: {
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      },
    });
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    res.json({ message: "Logged out successfully" });
  });
});

app.get("/api/profile", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Investor.findOne({ email: decoded.email }).select(
      "fullName email address phoneNumber role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(" Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/companies", companiesRoute);
app.use("/api/investors", investorsRoute);
app.use("/api/content", contentRoutes);
app.use("/api", marketNewsRoutes);
app.use("/api/profile-picture", profilePictureRoutes);
app.use("/api", companyLoginRoutes);
app.use("/api", imageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", adsRoutes);
app.use("/api/company/images", fetchImagesRoute);
app.use("/api", FetchPostRoutes);
app.use("/api", PublicAdRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/predict', predictionRoutes);
app.use("/api", messageRoutes);
app.use("/api", forgotPasswordRoutes);
app.use("/api", adminRoutes);
app.use("/api/company", companyUVRoutes);
app.use("/api/company", companyBannerUVRoutes);
app.use("/api/posts", companypostUVRoutes);
app.use("/api/sales", companysalesUVRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
