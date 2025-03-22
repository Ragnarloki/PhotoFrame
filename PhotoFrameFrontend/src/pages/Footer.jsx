import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900  -mb-20 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} PhotoFrame Shop. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
