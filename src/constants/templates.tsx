import { Truck, MapPin, Shield, Radio, FileText, Users } from 'lucide-react';
import type { TextStyle } from '@/types/slides';

export interface TemplateTheme {
  // Slide-level styles
  slideBackground: string;
  
  // Title styles
  titleStyle: TextStyle;
  
  // Content styles (for paragraphs and bullets)
  contentStyle: TextStyle;
  
  // Accent color for UI elements
  accentColor: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  color: string;
  slides: number;
  theme: TemplateTheme;
}

export const templates: Template[] = [
  {
    id: 'convoy-operation',
    title: 'Convoy Operation',
    description: 'Plan and execute multi-vehicle convoy missions',
    icon: <Truck className="w-6 h-6" />,
    prompt: 'Build a presentation for a 4-vehicle convoy operation from Austin, TX to Fort Hood, TX. Include mission overview, route planning with waypoints and checkpoints, vehicle manifest and crew assignments, timeline and departure schedule, communications plan with radio frequencies, security protocols and threat assessment, contingency plans for emergencies, fuel and logistics requirements, rules of engagement, and post-mission debrief procedures.',
    color: 'from-green-700/20 to-green-900/20 border-green-700/30',
    slides: 12,
    theme: {
      slideBackground: '#1C1917', // Stone-900 (tactical dark)
      titleStyle: {
        fontSize: 46,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        color: '#84CC16', // Lime-500 (military green)
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0.5,
      },
      contentStyle: {
        fontSize: 20,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        color: '#D6D3D1', // Stone-300
        textAlign: 'left',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      accentColor: '#65A30D', // Lime-600
    },
  },
  {
    id: 'tactical-briefing',
    title: 'Tactical Briefing',
    description: 'Mission briefings and operational orders',
    icon: <MapPin className="w-6 h-6" />,
    prompt: 'Create a tactical mission briefing covering situation analysis, mission statement and objectives, execution plan with phases and timelines, service support and logistics, command and signal procedures, terrain and weather analysis, enemy forces assessment, friendly forces disposition, coordinating instructions, and risk mitigation strategies.',
    color: 'from-slate-600/20 to-slate-800/20 border-slate-600/30',
    slides: 10,
    theme: {
      slideBackground: '#0F172A', // Slate-900 (tactical blue-gray)
      titleStyle: {
        fontSize: 48,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        color: '#94A3B8', // Slate-400
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0.3,
      },
      contentStyle: {
        fontSize: 20,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        color: '#CBD5E1', // Slate-300
        textAlign: 'left',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      accentColor: '#64748B', // Slate-500
    },
  },
  {
    id: 'training-exercise',
    title: 'Training Exercise',
    description: 'Military training programs and drills',
    icon: <Shield className="w-6 h-6" />,
    prompt: 'Create a military training exercise presentation with training objectives and learning outcomes, safety protocols and risk management, exercise scenario and parameters, participant roles and responsibilities, equipment and resource requirements, performance evaluation criteria, timeline and schedule of events, after-action review procedures, lessons learned documentation, and certification requirements.',
    color: 'from-amber-700/20 to-yellow-800/20 border-amber-700/30',
    slides: 11,
    theme: {
      slideBackground: '#292524', // Stone-800 (field tan dark)
      titleStyle: {
        fontSize: 46,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        color: '#FCD34D', // Amber-300
        textAlign: 'left',
        lineHeight: 1.3,
        letterSpacing: 0.4,
      },
      contentStyle: {
        fontSize: 20,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        color: '#E7E5E4', // Stone-200
        textAlign: 'left',
        lineHeight: 1.7,
        letterSpacing: 0,
      },
      accentColor: '#F59E0B', // Amber-500
    },
  },
  {
    id: 'comms-plan',
    title: 'Communications Plan',
    description: 'Radio protocols and signal procedures',
    icon: <Radio className="w-6 h-6" />,
    prompt: 'Create a military communications plan covering radio frequency assignments and backup channels, call signs and authentication procedures, communication windows and schedules, signal operating instructions (SOI), encryption and security protocols, emergency communication procedures, radio check procedures, communication equipment inventory, troubleshooting and maintenance, and communication flow diagrams.',
    color: 'from-blue-800/20 to-cyan-900/20 border-blue-800/30',
    slides: 9,
    theme: {
      slideBackground: '#172554', // Blue-950 (signal blue)
      titleStyle: {
        fontSize: 46,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        color: '#60A5FA', // Blue-400
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0.2,
      },
      contentStyle: {
        fontSize: 20,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        color: '#BFDBFE', // Blue-200
        textAlign: 'left',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      accentColor: '#3B82F6', // Blue-500
    },
  },
  {
    id: 'operation-order',
    title: 'Operation Order (OPORD)',
    description: 'Formal military operation directives',
    icon: <FileText className="w-6 h-6" />,
    prompt: 'Create a formal military operation order (OPORD) presentation with situation overview and intelligence, mission statement, commander\'s intent and end state, concept of operations with phases, tasks to subordinate units, coordinating instructions and control measures, service support and logistics plan, command and signal procedures, annexes and appendices, and execution timeline with decision points.',
    color: 'from-red-900/20 to-orange-900/20 border-red-900/30',
    slides: 13,
    theme: {
      slideBackground: '#1C1917', // Stone-900 (command red-brown)
      titleStyle: {
        fontSize: 48,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        color: '#FCA5A5', // Red-300
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0.3,
      },
      contentStyle: {
        fontSize: 20,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        color: '#FEE2E2', // Red-100
        textAlign: 'left',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      accentColor: '#EF4444', // Red-500
    },
  },
  {
    id: 'unit-briefing',
    title: 'Unit Briefing',
    description: 'Personnel updates and unit coordination',
    icon: <Users className="w-6 h-6" />,
    prompt: 'Create a military unit briefing with personnel status and readiness report, upcoming operations and training schedule, administrative updates and policy changes, equipment status and maintenance requirements, safety incidents and lessons learned, awards and recognition, personnel movements and assignments, unit morale and welfare initiatives, commander\'s guidance and priorities, and questions and clarifications.',
    color: 'from-gray-700/20 to-zinc-800/20 border-gray-700/30',
    slides: 8,
    theme: {
      slideBackground: '#27272A', // Zinc-800 (neutral gray)
      titleStyle: {
        fontSize: 44,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        color: '#A1A1AA', // Zinc-400
        textAlign: 'left',
        lineHeight: 1.3,
        letterSpacing: 0.2,
      },
      contentStyle: {
        fontSize: 20,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        color: '#E4E4E7', // Zinc-200
        textAlign: 'left',
        lineHeight: 1.7,
        letterSpacing: 0,
      },
      accentColor: '#71717A', // Zinc-500
    },
  },
];
