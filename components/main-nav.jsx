import Link from 'next/link';

function Navigation() {
  return (
    (<nav>
      <ul className="flex space-x-4">
        <li>
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
        </li>
        {/* Add more links here */}
      </ul>
    </nav>)
  );
}

export default Navigation;

