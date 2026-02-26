'use client';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface FeatureTileProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  metric?: string;
  color: string;
}

export default function FeatureTile({ href, icon: Icon, title, description, metric, color }: FeatureTileProps) {
  return (
    <Link
      href={href}
      className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-gray-600 hover:-translate-y-0.5 transition-all group block"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
          {metric && <p className="text-xs font-semibold text-cyan-400 mt-2">{metric}</p>}
        </div>
      </div>
    </Link>
  );
}
