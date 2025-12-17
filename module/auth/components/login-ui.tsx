'use client'

import { signIn } from "@/lib/auth-client"
import { GithubIcon } from "lucide-react"
import { useState } from "react"

const LoginUI = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGithubLogin = async () => {
    setIsLoading(true)
    try {
      await signIn.social({ provider: "github" })
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-black to-zinc-900 text-white flex">
      
      {/* Left Section */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-12 py-16">
        <div className="max-w-lg">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 text-2xl font-bold mb-6">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black">
                CR
              </div>
              <span>CodeRabbit</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Cut Code Review Time & Bugs in Half.
              <span className="block text-primary">Instantly.</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed">
              Supercharge your team to ship faster with the most advanced AI code review tool.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16">
        <div className="w-full max-w-sm">
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400">Login using the following provider</p>
          </div>

          {/* GitHub Button */}
          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-black rounded-lg font-semibold
                       hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center gap-3 mb-8"
          >
            <GithubIcon size={20} />
            {isLoading ? "Signing in..." : "Login with GitHub"}
          </button>

          {/* Links */}
          <div className="space-y-4 text-center text-sm text-gray-400">
            <div>
              New to CodeRabbit?{" "}
              <a className="text-primary font-semibold hover:underline cursor-pointer">
                Sign Up
              </a>
            </div>
            <div>
              <a className="text-primary font-semibold hover:underline cursor-pointer">
                Self Hosted Services
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-700 flex justify-center gap-4 text-xs text-gray-500">
            <a className="hover:text-gray-400 cursor-pointer">Terms of Service</a>
            <span>and</span>
            <a className="hover:text-gray-400 cursor-pointer">Privacy Policy</a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginUI
