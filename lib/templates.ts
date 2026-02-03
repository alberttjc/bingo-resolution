export interface BingoTemplate {
  id: string
  name: string
  description: string
  category: string
  goals: string[]
}

export const templates: BingoTemplate[] = [
  {
    id: 'balanced-mix',
    name: 'Balanced Mix',
    description: 'A well-rounded collection covering all aspects of life',
    category: 'All-Around',
    goals: [
      'Read 12 books this year',
      'Exercise 3x per week',
      'Save $5000 this year',
      'Call family weekly',
      'Learn a new language',
      'Declutter one room',
      'Cook healthy meals 5x/week',
      'Update resume',
      'Try a new hobby',
      'Volunteer monthly',
      'Drink 8 glasses of water',
      'Start journaling',
      'Create a budget',
      'Host dinner parties',
      'Take an online course',
      'Organize closets',
      'Meditate 10 min/day',
      'Network 1x per month',
      'Travel to new place',
      'Plant a garden',
      'Get 8 hours of sleep',
      'Join a club',
      'Learn to code',
      'Reduce screen time'
    ]
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Focus on physical wellness and healthy habits',
    category: 'Wellness',
    goals: [
      'Exercise 3x per week',
      'Drink 8 glasses of water daily',
      'Get 8 hours of sleep',
      'Try a new workout class',
      'Meal prep on Sundays',
      'Cut down on sugar',
      'Take daily vitamins',
      'Stretch every morning',
      'Walk 10,000 steps daily',
      'Try yoga or meditation',
      'Cook healthy meals 5x/week',
      'Limit alcohol consumption',
      'Run a 5K',
      'Join a sports team',
      'Track calories for 30 days',
      'Try a new healthy recipe',
      'Do a fitness challenge',
      'Schedule annual check-up',
      'Practice mindful eating',
      'Take the stairs daily',
      'Learn proper form',
      'Hire a personal trainer',
      'Complete a 30-day challenge',
      'Reduce screen time before bed'
    ]
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    description: 'Self-improvement and learning goals',
    category: 'Development',
    goals: [
      'Read 12 books this year',
      'Learn a new language',
      'Take an online course',
      'Start journaling daily',
      'Practice gratitude',
      'Meditate 10 min/day',
      'Listen to educational podcasts',
      'Attend a workshop',
      'Learn a new skill',
      'Set monthly goals',
      'Practice public speaking',
      'Write a blog post',
      'Learn to code',
      'Take up a creative hobby',
      'Attend a conference',
      'Find a mentor',
      'Read inspiring biographies',
      'Learn an instrument',
      'Take photography classes',
      'Start a side project',
      'Join a book club',
      'Learn to cook new cuisines',
      'Practice mindfulness',
      'Develop a morning routine'
    ]
  },
  {
    id: 'career-professional',
    name: 'Career & Professional',
    description: 'Advance your career and professional skills',
    category: 'Career',
    goals: [
      'Update resume and LinkedIn',
      'Network 1x per month',
      'Ask for a raise',
      'Learn new software',
      'Get a certification',
      'Attend industry events',
      'Find a mentor',
      'Mentor someone else',
      'Complete training program',
      'Improve time management',
      'Set career goals',
      'Build professional portfolio',
      'Start a side business',
      'Improve presentation skills',
      'Learn project management',
      'Read industry publications',
      'Join professional association',
      'Take leadership course',
      'Volunteer for new projects',
      'Improve work-life balance',
      'Develop expertise area',
      'Build personal brand',
      'Schedule quarterly reviews',
      'Organize workspace'
    ]
  },
  {
    id: 'finance-savings',
    name: 'Finance & Savings',
    description: 'Build better money habits and savings',
    category: 'Finance',
    goals: [
      'Save $5000 this year',
      'Create a budget',
      'Track expenses daily',
      'Pay off credit card debt',
      'Build emergency fund',
      'Invest in retirement',
      'Cancel unused subscriptions',
      'Pack lunch 3x per week',
      'Have no-spend weekends',
      'Review insurance policies',
      'Negotiate bills',
      'Learn about investing',
      'Set up automatic savings',
      'Reduce impulse purchases',
      'Use cash-back apps',
      'Create financial goals',
      'Meet with financial advisor',
      'Increase income stream',
      'Save for vacation',
      'Review credit report',
      'Start investment account',
      'Pay extra on loans',
      'Buy quality over quantity',
      'Set savings milestones'
    ]
  },
  {
    id: 'relationships-social',
    name: 'Relationships & Social',
    description: 'Strengthen connections with others',
    category: 'Social',
    goals: [
      'Call family weekly',
      'Schedule monthly friend dates',
      'Write thank you notes',
      'Join a club or group',
      'Attend social events',
      'Be more present',
      'Practice active listening',
      'Compliment someone daily',
      'Volunteer in community',
      'Host dinner parties',
      'Reconnect with old friends',
      'Send birthday cards',
      'Support local businesses',
      'Be more generous',
      'Limit social media',
      'Have meaningful conversations',
      'Attend family gatherings',
      'Make new friends',
      'Show appreciation more',
      'Help neighbors',
      'Join sports league',
      'Organize group activities',
      'Be vulnerable with loved ones',
      'Create family traditions'
    ]
  },
  {
    id: 'home-lifestyle',
    name: 'Home & Lifestyle',
    description: 'Improve your living space and daily life',
    category: 'Lifestyle',
    goals: [
      'Declutter one room per month',
      'Start a garden',
      'Organize closets',
      'Deep clean quarterly',
      'Donate unused items',
      'DIY home project',
      'Create a cleaning schedule',
      'Redecorate a room',
      'Fix things promptly',
      'Start composting',
      'Reduce plastic use',
      'Buy houseplants',
      'Organize digital files',
      'Create a home office',
      'Improve lighting',
      'Upgrade bedding',
      'Install smart home devices',
      'Paint a room',
      'Organize garage',
      'Create cozy spaces',
      'Add art to walls',
      'Maintain appliances',
      'Go paperless',
      'Create emergency kit'
    ]
  }
]

export function getTemplate(id: string): BingoTemplate | undefined {
  return templates.find(t => t.id === id)
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
