import React, { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { FaEnvelope, FaPhone, FaUserTie, FaIndustry, FaInfoCircle } from "react-icons/fa"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"

const CompanyBanner = () => {
  const [company, setCompany] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3001/api/company/protected", {
        withCredentials: true,
      })
      console.log("Company Data:", response.data)
      setCompany(response.data.user)
      setError(null)
    } catch (err) {
      setError("Failed to load company details")
      console.error("Error fetching company details:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanyDetails()
  }, [])

  const handleRetry = () => {
    fetchCompanyDetails()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 max-w-7xl mx-auto bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/10">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
          <p className="text-slate-200 font-medium">Loading company profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg shadow-lg max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex flex-col">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-200 font-medium">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md self-start transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
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
      className="mx-auto mb-10 w-full max-w-7xl"
    >
      <div className="overflow-hidden rounded-xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">Company Profile</h1>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
              Verified
            </div>
          </div>
        </div>

        {/* Pattern Background */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 20px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Content */}
        <div className="relative p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard icon={<FaEnvelope />} label="Email Address" value={company.companyEmail} />
            <InfoCard icon={<FaPhone />} label="Phone Number" value={company.companyPhone} />
            <InfoCard icon={<FaUserTie />} label="Business Owner" value={company.ownerName} />
            <InfoCard icon={<FaIndustry />} label="Business Type" value={company.businessType} />
          </div>

          {/* Description section */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex flex-col md:flex-row items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20">
                  <FaInfoCircle className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <div className="md:ml-4 flex-1">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
                  About the Company
                </h3>
                <div className="p-5 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-200 leading-relaxed">
                  {company.companyDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-start p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors duration-200">
    <div className="flex-shrink-0">
      <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400">
        {icon}
      </div>
    </div>
    <div className="ml-4 flex-1 overflow-hidden">
      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</h3>
      <p className="mt-1 text-base font-medium text-white truncate" title={value}>{value}</p>
    </div>
  </div>
)

export default CompanyBanner