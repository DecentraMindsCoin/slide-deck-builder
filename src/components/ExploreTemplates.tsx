'use client';

import { Sparkles, Briefcase, GraduationCap, TrendingUp, Lightbulb, Users } from 'lucide-react';
import Button from '@/components/shared/Button';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  color: string;
  slides: number;
}

interface ExploreTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

const templates: Template[] = [
  {
    id: 'business-pitch',
    title: 'Business Pitch',
    description: 'Perfect for investor presentations and startup pitches',
    icon: <Briefcase className="w-6 h-6" />,
    prompt: 'Create a professional business pitch deck with problem statement, solution, market opportunity, business model, traction, team, and financial projections',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    slides: 10,
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Showcase your new product with impact',
    icon: <Sparkles className="w-6 h-6" />,
    prompt: 'Create a product launch presentation covering product overview, key features, benefits, target audience, pricing, go-to-market strategy, and call to action',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    slides: 8,
  },
  {
    id: 'educational',
    title: 'Educational Course',
    description: 'Engaging slides for teaching and training',
    icon: <GraduationCap className="w-6 h-6" />,
    prompt: 'Create an educational presentation with learning objectives, key concepts, examples, practice exercises, summary, and additional resources',
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    slides: 12,
  },
  {
    id: 'quarterly-review',
    title: 'Quarterly Review',
    description: 'Present business metrics and achievements',
    icon: <TrendingUp className="w-6 h-6" />,
    prompt: 'Create a quarterly business review with executive summary, key metrics, achievements, challenges, action items, and next quarter goals',
    color: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
    slides: 9,
  },
  {
    id: 'creative-brief',
    title: 'Creative Brief',
    description: 'Present creative concepts and campaigns',
    icon: <Lightbulb className="w-6 h-6" />,
    prompt: 'Create a creative brief presentation with project overview, target audience, creative concept, visual direction, messaging strategy, and deliverables',
    color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
    slides: 7,
  },
  {
    id: 'team-meeting',
    title: 'Team Meeting',
    description: 'Organize and structure team discussions',
    icon: <Users className="w-6 h-6" />,
    prompt: 'Create a team meeting agenda with updates, discussion topics, decisions needed, action items, and next steps',
    color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
    slides: 6,
  },
];

export default function ExploreTemplates({ onSelectTemplate }: ExploreTemplatesProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Explore Templates</h2>
        <p className="text-zinc-400">Start with a professionally designed template</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-gradient-to-br ${template.color} backdrop-blur-sm rounded-2xl border p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
            onClick={() => onSelectTemplate(template.prompt)}
          >
            {/* Icon Badge */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {template.icon}
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">{template.description}</p>
              </div>

              {/* Slide Preview Mockup */}
              <div className="flex gap-1.5 py-3">
                {Array.from({ length: Math.min(template.slides, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-16 bg-zinc-800/50 rounded border border-zinc-700/50 group-hover:border-zinc-600 transition-colors"
                  />
                ))}
                {template.slides > 5 && (
                  <div className="flex items-center justify-center text-zinc-500 text-xs font-medium px-2">
                    +{template.slides - 5}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
                <span className="text-zinc-400 text-xs font-medium">
                  {template.slides} slides
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white group-hover:bg-zinc-800/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.prompt);
                  }}
                >
                  Use Template →
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
