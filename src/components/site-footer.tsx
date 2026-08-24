import Link from 'next/link';

const socialIcons = [
  {
    name: 'GitHub',
    href: 'https://github.com/glaurr',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/glaurr',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/georgeseficu',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.7-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Steam',
    href: 'https://steamcommunity.com/id/astleyr',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.198 2.198 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.217 2.217 0 0 1-1.312-1.568L.33 10.333Z" />
        <path d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.705 1.705 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027Zm2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048Z" />
      </svg>
    ),
  }
];

export function SiteFooter({ dict }) {
  const footerNavigation = {
    main: [
      { name: dict.links.projects, href: '/projects' },
      { name: dict.links.about, href: '/about' },
      { name: dict.links.microapps, href: '/microapps' },
    ],
    social: [
      { name: dict.links.github, href: 'https://github.com/glaurr' },
      { name: dict.links.linkedin, href: 'https://linkedin.com/in/glaurr' },
      { name: dict.links.email, href: 'mailto:glaurr17@gmail.com' },
      { name: dict.links.instagram, href: 'https://instagram.com/georgeseficu' },
      { name: dict.links.steam, href: 'https://steamcommunity.com/id/astleyr' },
    ],
  };

  return (
    <footer className="mt-24 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-950" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="mx-auto max-w-5xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          
          {/* bio + icons */}
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {dict.name}
            </Link>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              {dict.bio}
            </p>
            <div className="flex space-x-6">
              {socialIcons.map((item) => (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Internal Navigation */}
          <div className="md:col-span-1 md:pl-12">
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">{dict.categories.nav}</h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials List */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">{dict.categories.socials}</h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.social.map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
        {/* Sub-footer Area */}
        <div className="mt-16 border-t border-gray-900/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {dict.name}. {dict.copyright}
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400 font-medium">
              {dict.builtBy}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}