
<<<<<<< Updated upstream
//import React from 'react';

//const PrivacyPolicy: React.FC = () => {
//  return (
//    <div>
//      HELLO WORLD
//    .
//    </div>
 // );
//};

//export default PrivacyPolicy;'''

//import React from 'react';
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Cookie, Users, Clock, RefreshCw, Mail, User } from "lucide-react"

=======
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Cookie, Users, Clock, RefreshCw, Mail, User } from "lucide-react"

>>>>>>> Stashed changes
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f8f8fe]">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-bold text-xl text-[#8c7bff]">
              EmpowerPath
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-[#8c7bff] transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover:text-[#8c7bff] transition-colors">
              Dashboard
            </Link>
            <Link to="/resources" className="text-sm font-medium hover:text-[#8c7bff] transition-colors">
              Resources
            </Link>
            <Link to="/community" className="text-sm font-medium hover:text-[#8c7bff] transition-colors">
              Community
            </Link>
            <Link
              to="/profile"
              className="ml-4 w-8 h-8 rounded-full bg-[#f0eeff] flex items-center justify-center text-[#8c7bff]"
            >
              <span className="sr-only">Profile</span>
              <User size={18} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#8c7bff]">Privacy</span> <span className="text-[#4a9fff]">Policy</span>
          </h1>
          
          <div className="mt-6 max-w-2xl mx-auto">
            <p className="text-lg text-gray-500">
              We value your privacy and are committed to protecting your personal information. This policy outlines how
              we collect, use, and safeguard your data.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:gap-10">
          {/* Information We Collect */}
          <section id="information" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <Eye />
              </div>
              <h2 className="text-2xl font-bold">Information We Collect</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p className="mb-4">
                When you visit the site, we automatically collect certain information about your device, including
                information about your web browser, IP address, time zone, and some of the cookies that are installed on
                your device.
              </p>
              <p className="mb-4">
                Additionally, as you browse the site, we collect information about the individual web pages that you
                view, what websites or search terms referred you to the site, and information about how you interact
                with the site.
              </p>
              <p>We refer to this automatically-collected information as "Device Information."</p>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section id="usage" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <Shield />
              </div>
              <h2 className="text-2xl font-bold">How We Use Your Information</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p className="mb-4">
                We use the information that we collect generally to fulfill any orders placed through the site
                (including processing your payment information, arranging for shipping, and providing you with invoices
                and/or order confirmations).
              </p>
              <p className="mb-4">Additionally, we use this information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Communicate with you;</li>
                <li>Screen our orders for potential risk or fraud;</li>
                <li>
                  When in line with the preferences you have shared with us, provide you with information or advertising
                  relating to our products or services.
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <Cookie />
              </div>
              <h2 className="text-2xl font-bold">Cookies</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p className="mb-4">
                We use cookies to help us remember and process the items in your shopping cart, understand and save your
                preferences for future visits, and compile aggregate data about site traffic and site interactions.
              </p>
              <p>
                You can choose to have your computer warn you each time a cookie is being sent, or you can choose to
                turn off all cookies through your browser settings.
              </p>
            </div>
          </section>

          {/* Third-Party Disclosure */}
          <section id="third-party" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <Users />
              </div>
              <h2 className="text-2xl font-bold">Third-Party Disclosure</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties
                unless we provide you with advance notice. This does not include website hosting partners and other
                parties who assist us in operating our website, conducting our business, or servicing you, so long as
                those parties agree to keep this information confidential.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section id="rights" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <Lock />
              </div>
              <h2 className="text-2xl font-bold">Your Rights</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p className="mb-4">
                If you are a European resident, you have the right to access personal information we hold about you and
                to ask that your personal information be corrected, updated, or deleted. If you would like to exercise
                this right, please contact us.
              </p>
              <p>
                Additionally, if you are a European resident we note that we are processing your information in order to
                fulfill contracts we might have with you, or otherwise to pursue our legitimate business interests
                listed above.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section id="retention" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <Clock />
              </div>
              <h2 className="text-2xl font-bold">Data Retention</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p>
                When you place an order through the site, we will maintain your Order Information for our records unless
                and until you ask us to delete this information.
              </p>
            </div>
          </section>

          {/* Changes */}
          <section id="changes" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <RefreshCw />
              </div>
              <h2 className="text-2xl font-bold">Changes</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p>
                We may update this privacy policy from time to time in order to reflect, for example, changes to our
                practices or for other operational, legal or regulatory reasons.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section id="contact" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f0eeff] p-2 rounded-lg text-[#8c7bff]">
                <Mail />
              </div>
              <h2 className="text-2xl font-bold">Contact Us</h2>
            </div>
            <div className="pl-12 text-gray-500">
              <p className="mb-4">
                For more information about our privacy practices, if you have questions, or if you would like to make a
                complaint, please contact us by e-mail or by mail using the details provided below:
              </p>
              <div className="mt-4 border border-[#e0e0ff] rounded-lg bg-white p-6">
                <address className="not-italic space-y-1">
                  <p className="font-medium">EmpowerPath</p>
                  <p>[Street Address]</p>
                  <p>[City, State/Province, Postal Code]</p>
                  <p>[Country]</p>
                  <p className="mt-2">
                    Email:{" "}
                    <a href="mailto:[your email]" className="text-[#4a9fff] hover:underline">
                      [your email]
                    </a>
                  </p>
                </address>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex justify-center">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#8c7bff] px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#7a69ff]"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#8c7bff]">EmpowerPath</span>
            </div>
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} EmpowerPath. All rights reserved.</div>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-gray-500 hover:text-[#8c7bff] transition-colors">
                Terms
              </Link>

              <Link to="/contact" className="text-sm text-gray-500 hover:text-[#8c7bff] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
