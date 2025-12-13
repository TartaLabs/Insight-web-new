import React from 'react';
import { ArrowUpRight, Shield, FileText, LifeBuoy } from 'lucide-react';

interface MenuProps {
  onNavigate: (page: string) => void;
}

const links = [
  { id: 'privacy', title: 'Privacy Policy', desc: 'Data Protection & Usage', color: 'text-tech-blue', icon: Shield },
  { id: 'terms', title: 'Terms of Use', desc: 'User Agreement', color: 'text-white', icon: FileText },
  { id: 'support', title: 'Support', desc: 'Help Center', color: 'text-blue-400', icon: LifeBuoy },
];

export const Menu: React.FC<MenuProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border border-white/10">
      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => onNavigate(link.id)}
          className="group relative bg-deep-bg p-8 hover:bg-surface transition-colors flex flex-col justify-between h-32 md:h-40 text-left w-full"
        >
          <div className="flex justify-between items-start w-full">
            <div
              className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${link.color} group-hover:bg-white/10 transition-colors`}
            >
              <link.icon size={16} />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:translate-x-1 transition-transform">
              {link.title}
            </h3>
            <p className="text-xs font-mono text-gray-500 mt-1">{link.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
