import React, { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { FaEnvelope, FaPhone, FaUserTie, FaIndustry, FaInfoCircle } from "react-icons/fa"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"

const CompanyBannerUV = ({ companyEmail }) => {
  const [company, setCompany] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!companyEmail) return

    const fetchCompanyDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3001/api/company/uv/details/${companyEmail}`)
        setCompany(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to load company details")
        console.error("Error fetching company details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyDetails()
  }, [companyEmail])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    setCompany(null)
    axios
      .get(`http://localhost:3001/api/company/uv/details/${companyEmail}`)
      .then((response) => {
        setCompany(response.data)
        setError(null)
      })
      .catch((err) => {
        setError("Failed to load company details")
        console.error("Error fetching company details:", err)
      })
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10 max-w-7xl mx-auto">
        <Loader2 className="h-8 w-8 text-gray-500 animate-spin mr-3" />
        <p className="text-gray-600 font-medium">Loading company information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md shadow-md max-w-7xl mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md self-start"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mb-10"
      style={{ maxWidth: "95vw" }}
    >
      <div className="bg-white rounded-b-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-amber-500">
          <div className="flex items-center">
            <div className="w-3 h-12 bg-amber-500 mr-4"></div>
            <h1 className="text-2xl font-bold text-white tracking-tight">COMPANY PROFILE</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white relative">
          <div className="relative bg-slate-50 p-6">
            {/* Industrial pattern overlay */}
            <div
              className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 10px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            {/* Main content */}
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={<FaEnvelope className="h-5 w-5" />} label="Email Address" value={company.companyEmail} />
                <InfoItem icon={<FaPhone className="h-5 w-5" />} label="Phone Number" value={company.companyPhone} />
                <InfoItem icon={<FaUserTie className="h-5 w-5" />} label="Business Owner" value={company.ownerName} />
                <InfoItem icon={<FaIndustry className="h-5 w-5" />} label="Business Type" value={company.businessType} />
              </div>

              {/* Description section */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaInfoCircle className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wider">Company Description</h3>
                    <div className="mt-2 p-4 bg-slate-50 border-l-2 border-slate-300 text-slate-700">
                      {company.companyDescription}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mt-1">
      <div className="p-2 bg-slate-100 rounded-md text-slate-700 border border-slate-200">{icon}</div>
    </div>
    <div className="ml-4">
      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</h3>
      <p className="mt-1 text-base font-medium text-slate-800">{value}</p>
    </div>
  </div>
)

export default CompanyBannerUV
