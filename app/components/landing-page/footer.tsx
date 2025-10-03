"use client";

import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                KALCER App
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Platform untuk membantu Anda mencapai tujuan dengan lebih efisien
              melalui penjadwalan yang cerdas dan terstruktur.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3 pt-4">
              <Link
                href="https://github.com/dewianaaryani"
                className="w-10 h-10 bg-gray-100 hover:bg-violet-100 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="GitHub"
              >
                <svg
                  className="h-5 w-5 text-gray-600 group-hover:text-violet-600 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/in/dewianaaryani/"
                className="w-10 h-10 bg-gray-100 hover:bg-violet-100 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-5 w-5 text-gray-600 group-hover:text-violet-600 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Hubungi Kami
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 mb-1">
                    Email
                  </p>
                  <p className="text-sm text-gray-600">
                    dewianaaryanir@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 mb-1">
                    Telepon
                  </p>
                  <p className="text-sm text-gray-600">+628 7874 7398 02</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 mb-1">
                    Alamat
                  </p>
                  <p className="text-sm text-gray-600">Bogor, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Aplikasi KALCER. Semua hak
              dilindungi.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
              ></Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
              ></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
