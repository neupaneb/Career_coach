import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job';

// Load environment variables
dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'JavaScript'],
    experience: 'senior',
    type: 'full-time',
    description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using React and Node.js. The ideal candidate should have strong experience with TypeScript, MongoDB, and modern web development practices.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong proficiency in React and Node.js',
      'Experience with TypeScript and MongoDB',
      'Knowledge of RESTful APIs and microservices',
      'Excellent problem-solving skills'
    ],
    benefits: [
      'Health insurance',
      '401(k) matching',
      'Flexible work hours',
      'Remote work options',
      'Professional development budget'
    ],
    applicationUrl: 'https://techcorp.com/careers/senior-fullstack',
    isActive: true
  },
  {
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD'
    },
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Tailwind'],
    experience: 'mid',
    type: 'full-time',
    description: 'Join our fast-growing startup as a Frontend Developer. You will work on building beautiful and responsive user interfaces using React and modern CSS frameworks. We value creativity and attention to detail.',
    requirements: [
      '3+ years of frontend development experience',
      'Proficiency in React and JavaScript',
      'Experience with CSS frameworks like Tailwind',
      'Strong UI/UX design sense',
      'Ability to work in a fast-paced environment'
    ],
    benefits: [
      'Equity options',
      'Health insurance',
      'Unlimited PTO',
      'Learning budget',
      'Gym membership'
    ],
    applicationUrl: 'https://startupxyz.com/jobs/frontend',
    isActive: true
  },
  {
    title: 'Backend Developer',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    salary: {
      min: 90000,
      max: 140000,
      currency: 'USD'
    },
    skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Express', 'REST API'],
    experience: 'mid',
    type: 'full-time',
    description: 'We are seeking a talented Backend Developer to design and implement scalable server-side solutions. You will work with Node.js and Python to build robust APIs and microservices.',
    requirements: [
      '3+ years of backend development experience',
      'Strong knowledge of Node.js and Python',
      'Experience with MongoDB and PostgreSQL',
      'Understanding of RESTful API design',
      'Familiarity with cloud platforms (AWS, Azure)'
    ],
    benefits: [
      'Competitive salary',
      'Health and dental insurance',
      'Remote work flexibility',
      'Conference attendance',
      '401(k) plan'
    ],
    applicationUrl: 'https://cloudtech.com/careers/backend',
    isActive: true
  },
  {
    title: 'Junior Software Engineer',
    company: 'InnovateLabs',
    location: 'Seattle, WA',
    salary: {
      min: 60000,
      max: 85000,
      currency: 'USD'
    },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    experience: 'entry',
    type: 'full-time',
    description: 'Perfect opportunity for a recent graduate or someone starting their career in software development. You will work alongside experienced developers to build web applications and learn best practices.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Knowledge of JavaScript and React',
      'Understanding of databases',
      'Strong problem-solving abilities',
      'Willingness to learn and grow'
    ],
    benefits: [
      'Mentorship program',
      'Health insurance',
      'Learning resources',
      'Flexible schedule',
      'Career growth opportunities'
    ],
    applicationUrl: 'https://innovatelabs.com/jobs/junior-engineer',
    isActive: true
  },
  {
    title: 'Full Stack Developer',
    company: 'Digital Innovations',
    location: 'Remote',
    salary: {
      min: 100000,
      max: 150000,
      currency: 'USD'
    },
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'AWS'],
    experience: 'mid',
    type: 'full-time',
    description: 'Remote opportunity for a Full Stack Developer to work on cutting-edge web applications. You will be part of a distributed team building scalable solutions using modern technologies.',
    requirements: [
      '4+ years of full-stack development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with cloud services (AWS)',
      'Strong communication skills',
      'Ability to work independently'
    ],
    benefits: [
      '100% remote work',
      'Competitive salary',
      'Health insurance',
      'Home office stipend',
      'Flexible hours'
    ],
    applicationUrl: 'https://digitalinnovations.com/careers/fullstack-remote',
    isActive: true
  },
  {
    title: 'React Developer',
    company: 'WebCraft Studios',
    location: 'Los Angeles, CA',
    salary: {
      min: 85000,
      max: 130000,
      currency: 'USD'
    },
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'CSS', 'HTML'],
    experience: 'mid',
    type: 'full-time',
    description: 'We are looking for a skilled React Developer to create engaging user interfaces for our clients. You will work with a talented team of designers and developers to deliver exceptional web experiences.',
    requirements: [
      '3+ years of React development experience',
      'Strong knowledge of JavaScript and TypeScript',
      'Experience with state management (Redux)',
      'Understanding of modern CSS',
      'Portfolio demonstrating React projects'
    ],
    benefits: [
      'Health insurance',
      'Dental and vision',
      '401(k) matching',
      'Professional development',
      'Team events'
    ],
    applicationUrl: 'https://webcraft.com/jobs/react-developer',
    isActive: true
  },
  {
    title: 'Node.js Developer',
    company: 'API Masters',
    location: 'Boston, MA',
    salary: {
      min: 95000,
      max: 145000,
      currency: 'USD'
    },
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'JavaScript', 'TypeScript'],
    experience: 'senior',
    type: 'full-time',
    description: 'Senior Node.js Developer needed to lead API development and backend architecture. You will design and implement scalable server solutions and mentor junior developers.',
    requirements: [
      '6+ years of Node.js development',
      'Expert-level knowledge of Express and MongoDB',
      'Experience designing RESTful APIs',
      'Strong understanding of microservices',
      'Leadership and mentoring experience'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Stock options',
      'Leadership training',
      'Conference budget'
    ],
    applicationUrl: 'https://apimasters.com/careers/nodejs-senior',
    isActive: true
  },
  {
    title: 'Software Engineer Intern',
    company: 'TechStart Inc.',
    location: 'Chicago, IL',
    salary: {
      min: 3000,
      max: 5000,
      currency: 'USD'
    },
    skills: ['JavaScript', 'React', 'Node.js', 'Git'],
    experience: 'entry',
    type: 'internship',
    description: 'Summer internship opportunity for students interested in software development. You will work on real projects, learn from experienced engineers, and gain valuable industry experience.',
    requirements: [
      'Currently pursuing a degree in Computer Science',
      'Basic knowledge of JavaScript and web development',
      'Strong desire to learn',
      'Good communication skills',
      'Available for 12-week internship'
    ],
    benefits: [
      'Mentorship',
      'Networking opportunities',
      'Potential full-time offer',
      'Stipend',
      'Learning resources'
    ],
    applicationUrl: 'https://techstart.com/internships/software-engineer',
    isActive: true
  },
  {
    title: 'MongoDB Database Developer',
    company: 'DataDriven Solutions',
    location: 'Denver, CO',
    salary: {
      min: 110000,
      max: 160000,
      currency: 'USD'
    },
    skills: ['MongoDB', 'Node.js', 'JavaScript', 'Database Design', 'NoSQL'],
    experience: 'senior',
    type: 'full-time',
    description: 'We need an experienced MongoDB developer to optimize our database architecture and improve query performance. You will work with large-scale data systems and ensure data integrity.',
    requirements: [
      '5+ years of MongoDB experience',
      'Strong understanding of NoSQL databases',
      'Experience with database optimization',
      'Knowledge of Node.js',
      'Experience with large-scale systems'
    ],
    benefits: [
      'Health insurance',
      '401(k) matching',
      'Remote work options',
      'Professional certifications',
      'Competitive salary'
    ],
    applicationUrl: 'https://datadriven.com/careers/mongodb-developer',
    isActive: true
  },
  {
    title: 'TypeScript Developer',
    company: 'TypeSafe Systems',
    location: 'Portland, OR',
    salary: {
      min: 90000,
      max: 135000,
      currency: 'USD'
    },
    skills: ['TypeScript', 'React', 'Node.js', 'JavaScript', 'Express'],
    experience: 'mid',
    type: 'full-time',
    description: 'Join our team as a TypeScript Developer to build type-safe applications. You will work with modern TypeScript features and help maintain code quality across our codebase.',
    requirements: [
      '3+ years of TypeScript development',
      'Strong knowledge of React and Node.js',
      'Understanding of type systems',
      'Experience with modern JavaScript',
      'Attention to code quality'
    ],
    benefits: [
      'Health insurance',
      'Flexible work schedule',
      'Learning budget',
      '401(k) plan',
      'Team building activities'
    ],
    applicationUrl: 'https://typesafe.com/jobs/typescript-developer',
    isActive: true
  }
];

async function seedJobs() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/career-coach';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing jobs (optional - comment out if you want to keep existing jobs)
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    // Insert sample jobs
    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Successfully seeded ${insertedJobs.length} jobs`);

    // Display summary
    console.log('\n📊 Job Summary:');
    const byExperience = await Job.aggregate([
      { $group: { _id: '$experience', count: { $sum: 1 } } }
    ]);
    byExperience.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} jobs`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

// Run the seed function
seedJobs();

