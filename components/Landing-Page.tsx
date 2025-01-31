import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center   px-4 text-center">
  {/* CRM Introduction */}
  <h1 className="text-5xl font-extrabold  mb-4">Welcome to Our CRM</h1>
  <p className="text-lg text-gray-600 max-w-lg">
    Easily manage your contacts, track orders, and grow your business with our powerful CRM solution.
  </p>

  {/* Access Restriction Notice */}
  <div className=" shadow-md rounded-lg p-6 mt-8 max-w-md w-full">
    <h2 className="text-2xl font-semibold text-red-600">Access Restricted</h2>
    <p className="text-gray-700 mt-2">You currently do not have admin rights.</p>
    <p className="text-gray-600">For assistance, please contact an administrator:</p>

    <div className="mt-4 ">
      <p className="flex items-center"><span className="font-medium">📞 Phone:</span> 412-413-566-3321</p>
      <p className="flex items-center"><span className="font-medium">📧 Email:</span> admin@mail.com</p>
    </div>

    <Button variant={ "link"} disabled >
      Contact Admin
    </Button>
  </div>
</div>
  )
}

