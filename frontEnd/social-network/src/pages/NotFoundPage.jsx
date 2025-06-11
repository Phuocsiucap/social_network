import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Link
        to="/"
        className="text-blue-600 hover:underline text-lg"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
