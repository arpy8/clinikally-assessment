"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { FlaskConical, LogOut, User, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FlaskConical className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Demo App</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/doctors">
              <Button variant="ghost">Find Doctors</Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.is_doctor && (
                    <DropdownMenuItem asChild>
                      <Link href="/recommendations/create">Create Recommendation</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link 
                    href="/doctors" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>Find Doctors</span>
                  </Link>

                  {user ? (
                    <>
                      <div className="flex items-center space-x-2 p-2 border-b">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{user.username}</span>
                      </div>
                      
                      {user.is_doctor && (
                        <Link 
                          href="/recommendations/create"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                        >
                          <span>Create Recommendation</span>
                        </Link>
                      )}
                      
                      <button 
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link 
                        href="/login"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button variant="ghost" className="w-full justify-start">
                          Login
                        </Button>
                      </Link>
                      <Link 
                        href="/register"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
