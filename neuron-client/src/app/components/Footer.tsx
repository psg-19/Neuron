"use client";
import React from "react";
import { IconBrandTwitter, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

export function ModernFooter() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-semibold mb-2">About Us</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We leverage cutting-edge AI technology to provide seamless experiences
              for developers building and deploying smart contracts on the Cosmos
              ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Legal</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#tos" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookie" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="border-t border-neutral-800 pt-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-neutral-500 mb-4 sm:mb-0">
            © {new Date().getFullYear()} Neuron. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#twitter"
              aria-label="Twitter"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <IconBrandTwitter size={18} />
            </a>
            <a
              href="#github"
              aria-label="GitHub"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <IconBrandGithub size={18} />
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <IconBrandLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
