import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rumered
            </h3>
            <p className="text-gray-600 text-sm">
              The ultimate platform for college students to showcase their style
              and dorm room setups. Vote on outfits and room tours, and get
              inspired by your peers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/fit-check"
                  className="text-sm text-gray-600 hover:text-violet-600"
                >
                  Fit Check
                </Link>
              </li>
              <li>
                <Link
                  href="/rooms"
                  className="text-sm text-gray-600 hover:text-violet-600"
                >
                  Dorm Rooms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-violet-600"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-violet-600"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2024 Rumered. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
