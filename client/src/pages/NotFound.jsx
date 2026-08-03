import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-xl py-32 text-center">
    <p className="font-mono text-brass text-sm tracking-widest uppercase mb-4">404</p>
    <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">Page not found</h1>
    <p className="text-ink/60 mb-8 max-w-md mx-auto">
      The page you're looking for doesn't exist or may have moved.
    </p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
