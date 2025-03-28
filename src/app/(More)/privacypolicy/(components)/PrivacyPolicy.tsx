import Link from 'next/link'
import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="w-full md:w-[600px] p-8">
    <h1 className="text-4xl text-center font-bold mb-6">Privacy Policy</h1>
    <p className="text-blue-500 mb-4">Last updated: March 25, 2025</p>
    <p className="mb-4">
        This Privacy Policy describes Our policies and procedures on the
        collection, use and disclosure of Your information when You use the
        Service and tells You about Your privacy rights and how the law protects
        You.
    </p>
    <p className="mb-4">
        We use Your Personal data to provide and improve the Service. By using
        the Service, You agree to the collection and use of information in
        accordance with this Privacy Policy.
        .
    </p>

    <h2 className="text-2xl font-semibold mt-8 mb-4">Interpretation and Definitions</h2>
    <h3 className="text-xl font-medium mt-6 mb-2">Interpretation</h3>
    <p className="mb-4">
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
    </p>

    <h3 className="text-xl font-medium mt-6 mb-2">Definitions</h3>
    <p className="mb-4">For the purposes of this Privacy Policy:</p>
    <ul className="list-disc list-inside mb-4 space-y-2">
        <li><strong>Account:</strong> means a unique account created for You to access our Service or parts of our Service.</li>
        <li><strong>Affiliate:</strong> means an entity that controls, is controlled by, or is under common control with a party.</li>
        <li><strong>Company:</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to GolPro.</li>
        <li><strong>Cookies:</strong> are small files that are placed on Your computer, mobile device or any other device by a website.</li>
        <li><strong>Country:</strong> refers to Bangladesh.</li>
        <li><strong>Device:</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
        <li><strong>Personal Data:</strong> is any information that relates to an identified or identifiable individual.</li>
        <li><strong>Service:</strong> refers to the Website.</li>
        <li><strong>Service Provider:</strong> means any natural or legal person who processes the data on behalf of the Company.</li>
        <li><strong>Usage Data:</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.</li>
        <li>
            <strong>Website:</strong> refers to GolPro, accessible from 
            <Link
                href="https://golpro.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
            >
                https://golpro.vercel.app
            </Link>
        </li>
        <li><strong>You:</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-8 mb-4">Collecting and Using Your Personal Data</h2>

    <h3 className="text-xl font-medium mt-6 mb-2">Types of Data Collected</h3>
    <h4 className="text-lg font-semibold mt-4 mb-2">Personal Data</h4>
    <p className="mb-4">
        While using Our Service, We may ask You to provide Us with certain
        personally identifiable information, including but not limited to:
    </p>
    <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Email address</li>
        <li>First name and last name</li>
        <li>Usage Data</li>
    </ul>

    <h4 className="text-lg font-semibold mt-4 mb-2">Usage Data</h4>
    <p className="mb-4">
        Usage Data is collected automatically when using the Service. This data
        may include information such as Your IP address, browser type, browser
        version, and more.
    </p>

    <h4 className="text-lg font-semibold mt-4 mb-2">Tracking Technologies and Cookies</h4>
    <p className="mb-4">
        We use Cookies and similar tracking technologies to track the activity
        on Our Service and store certain information. Cookies can be &quot;Persistent&quot;
        or &quot;Session&quot; Cookies.
    </p>

    <h3 className="text-xl font-medium mt-6 mb-2">Use of Your Personal Data</h3>
    <p className="mb-4">The Company may use Personal Data for the following purposes:</p>
    <ul className="list-disc list-inside mb-4 space-y-2">
        <li>To provide and maintain our Service</li>
        <li>To manage Your Account</li>
        <li>To contact You</li>
        <li>For business transfers</li>
        <li>To comply with legal obligations</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
    <p className="mb-4">If you have any questions about this Privacy Policy, You can contact us:</p>
    <ul className="list-disc list-inside mb-4">
        <li>Email: golprobd@gmail.com</li>
    </ul>
</div>
  )
}
