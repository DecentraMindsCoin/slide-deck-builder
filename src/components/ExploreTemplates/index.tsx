'use client';

import Button from '@/components/ui/Button';
import { templates, type Template } from '@/constants/templates';

interface ExploreTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

export default function ExploreTemplates({ onSelectTemplate }: ExploreTemplatesProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 -mt-12">
      <div className="mb-8">
        <h2 className="font-rajdhani text-3xl font-bold text-white mb-2 uppercase tracking-tight">Explore Templates</h2>
        <p className="text-zinc-400">Start with a professionally designed template</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-linear-to-br ${template.color} backdrop-blur-sm rounded-2xl border p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
            onClick={() => onSelectTemplate(template)}
          >
            {/* Icon Badge */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {template.icon}
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="font-rajdhani text-xl font-bold text-white mb-2 uppercase tracking-tight">{template.title}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">{template.description}</p>
              </div>

              {/* Slide Preview Mockup */}
              <div className="flex gap-1.5 py-3">
                {Array.from({ length: Math.min(template.slides, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-16 rounded border border-zinc-700/50 group-hover:border-zinc-600 transition-all overflow-hidden"
                    style={{ backgroundColor: template.theme.slideBackground }}
                  >
                    {/* Mini slide content preview */}
                    <div className="h-full p-1 flex flex-col gap-0.5">
                      {/* Title bar */}
                      <div 
                        className="h-1.5 rounded-full opacity-80"
                        style={{ 
                          backgroundColor: template.theme.titleStyle.color,
                          width: i === 0 ? '80%' : i === 1 ? '70%' : '75%'
                        }}
                      />
                      {/* Content lines */}
                      <div className="flex-1 flex flex-col gap-0.5 justify-center">
                        <div 
                          className="h-0.5 rounded-full opacity-60"
                          style={{ 
                            backgroundColor: template.theme.contentStyle.color,
                            width: '90%'
                          }}
                        />
                        <div 
                          className="h-0.5 rounded-full opacity-60"
                          style={{ 
                            backgroundColor: template.theme.contentStyle.color,
                            width: '75%'
                          }}
                        />
                        <div 
                          className="h-0.5 rounded-full opacity-60"
                          style={{ 
                            backgroundColor: template.theme.contentStyle.color,
                            width: '85%'
                          }}
                        />
                      </div>
                    </div>
                  </div>
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
                    onSelectTemplate(template);
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
