const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getDbMode } = require('./db');

// Import wrapped models
const User = require('../models/User');
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');
const Career = require('../models/Career');
const Testimonial = require('../models/Testimonial');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const Newsletter = require('../models/Newsletter');
const JobApplication = require('../models/JobApplication');

const seedData = async () => {
  console.log('Seeding database...');
  const dbMode = getDbMode();
  console.log(`Current DB Mode: ${dbMode}`);

  // In local JSON mode, clear JSON data files first
  if (dbMode === 'local') {
    const dataDir = path.join(__dirname, '../data');
    const files = ['user.json', 'service.json', 'portfolio.json', 'blog.json', 'career.json', 'testimonial.json', 'appointment.json', 'message.json', 'newsletter.json', 'jobapplication.json'];
    files.forEach(f => {
      const filepath = path.join(dataDir, f);
      fs.writeFileSync(filepath, JSON.stringify([], null, 2));
    });
    console.log('Cleared existing local JSON database files.');
  } else {
    // MongoDB mode - drop collections or delete items (simpler to delete items)
    try {
      const mongoose = require('mongoose');
      const collections = Object.keys(mongoose.connection.collections);
      for (const colName of collections) {
        await mongoose.connection.collections[colName].deleteMany({});
      }
      console.log('Cleared existing MongoDB collections.');
    } catch (err) {
      console.error('Error clearing MongoDB collections:', err.message);
    }
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedAdminPassword = await bcrypt.hash('admin123', salt);
  const hashedUserPassword = await bcrypt.hash('user123', salt);

  // 1. Seed Users
  console.log('Seeding users...');
  const adminUser = await User.create({
    name: 'NovaSphere Admin',
    email: 'admin@novasphere.com',
    password: hashedAdminPassword,
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    notifications: []
  });

  const normalUser = await User.create({
    name: 'Jane Doe',
    email: 'user@novasphere.com',
    password: hashedUserPassword,
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane',
    notifications: [
      {
        id: 'notif-1',
        title: 'Profile Created',
        message: 'Welcome to NovaSphere! Your profile has been created successfully.',
        read: false,
        createdAt: new Date().toISOString()
      }
    ]
  });

  // 2. Seed Services
  console.log('Seeding services...');
  const services = [
    {
      title: 'Website Development',
      slug: 'website-development',
      description: 'Stunning, high-performance websites custom built with modern technologies to grow your brand online.',
      features: ['Pristine Responsive Design', 'Search Engine Optimization (SEO)', 'Vibrant Micro-Animations', 'High Speed Optimization', 'Interactive Admin CMS Panel'],
      technologies: ['React.js', 'Vite', 'HTML5/CSS3', 'Node.js', 'Framer Motion'],
      pricing: 'Starting at $2,499',
      icon: 'Globe'
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      description: 'Fully responsive, native and cross-platform mobile apps for iOS and Android built for seamless engagement.',
      features: ['Cross-Platform Capability', 'Offline Database Support', 'Push Notifications Integration', 'Biometric Security Access', 'Smooth Gesture Navigation'],
      technologies: ['React Native', 'Expo', 'Node.js', 'Redux Toolkit', 'Firebase'],
      pricing: 'Starting at $5,999',
      icon: 'Smartphone'
    },
    {
      title: 'AI Solutions',
      slug: 'ai-solutions',
      description: 'Unlock enterprise intelligence with custom machine learning models, NLP assistants, and data predictions.',
      features: ['Automated LLM Fine-Tuning', 'Predictive Analysis Engines', 'Cognitive Customer Support Bots', 'Smart Recommendation Systems', 'Voice/Speech Translation API'],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face'],
      pricing: 'Starting at $9,999',
      icon: 'Cpu'
    },
    {
      title: 'Cloud Computing',
      slug: 'cloud-computing',
      description: 'Migrate, manage, and scale your systems securely with modern serverless cloud infrastructures.',
      features: ['Zero-Downtime Migration', 'Auto-Scaling Architecture', 'Multi-Cloud Management', 'Serverless Functions Deploy', 'Continuous Health Monitoring'],
      technologies: ['AWS', 'Microsoft Azure', 'Google Cloud (GCP)', 'Docker', 'Kubernetes'],
      pricing: 'Starting at $4,499',
      icon: 'Cloud'
    },
    {
      title: 'Cybersecurity Services',
      slug: 'cybersecurity',
      description: 'Protect your valuable digital assets and customer data with robust penetration testing and monitoring.',
      features: ['End-to-End Encryption Audits', 'Active Pentesting & Reporting', '24/7 Security Operations (SOC)', 'Identity & Access Control', 'Compliance Guarantee (GDPR/HIPAA)'],
      technologies: ['OWASP ZAP', 'Wireshark', 'Kali Linux', 'Auth0', 'Cloudflare WAF'],
      pricing: 'Starting at $3,999',
      icon: 'Shield'
    },
    {
      title: 'Digital Marketing',
      slug: 'digital-marketing',
      description: 'Maximize conversions and business reach with data-driven social, search, and content campaigns.',
      features: ['Targeted Lead Generation', 'PPC Ad Campaign Management', 'High-Converting Copywriting', 'Brand Strategy Orchestration', 'Analytical Conversion Reports'],
      technologies: ['Google Ads', 'Meta Business Suite', 'Google Analytics 4', 'Semrush', 'Mailchimp'],
      pricing: 'Starting at $1,499',
      icon: 'BarChart'
    },
    {
      title: 'SEO Optimization',
      slug: 'seo-optimization',
      description: 'Rank higher on search engines to drive consistent, high-quality organic traffic to your website.',
      features: ['Comprehensive Keyword Research', 'On-Page Content Structuring', 'High-Authority Backlink Acquisition', 'Technical SEO Audit & Fixing', 'Local Map SEO Domination'],
      technologies: ['Google Search Console', 'Ahrefs', 'Screaming Frog', 'Yoast SEO', 'Lighthouse'],
      pricing: 'Starting at $999',
      icon: 'Search'
    },
    {
      title: 'UI UX Design',
      slug: 'ui-ux-design',
      description: 'Immersive and intuitive user interfaces backed by research, wireframing, and gorgeous interactive prototypes.',
      features: ['User Persona & Journey Mapping', 'High-Fidelity Wireframes', 'Interactive Clickable Prototypes', 'Responsive Layout Spec Sheet', 'Usability Testing & Analytics'],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Framer', 'Illustrator'],
      pricing: 'Starting at $1,999',
      icon: 'Layers'
    },
    {
      title: 'Software Development',
      slug: 'software-development',
      description: 'Scalable backends, enterprise ERP software, and custom business management tooling.',
      features: ['Secure Microservice API Design', 'Robust SQL/NoSQL Database Setup', 'Legacy Code Migration', 'DevOps Automations CI/CD', 'Real-Time WebSockets Integration'],
      technologies: ['Node.js', 'Express.js', 'Spring Boot', 'PostgreSQL', 'Docker'],
      pricing: 'Starting at $7,499',
      icon: 'Code'
    },
    {
      title: 'E-Commerce Solutions',
      slug: 'e-commerce-solutions',
      description: 'Dynamic digital storefronts designed for maximum conversion, secure checkout, and easy inventory control.',
      features: ['Safe Stripe/PayPal Integration', 'Dynamic Inventory Management', 'Discount Coupon Engine', 'Detailed Customer Analytics', 'Abandoned Cart Automation'],
      technologies: ['Next.js', 'Shopify API', 'Stripe', 'Node.js', 'MongoDB'],
      pricing: 'Starting at $3,499',
      icon: 'ShoppingBag'
    }
  ];

  for (const s of services) {
    await Service.create(s);
  }

  // 3. Seed Portfolio
  console.log('Seeding portfolio...');
  const portfolioItems = [
    {
      title: 'OmniBrain AI Analytics Platform',
      description: 'A premium enterprise SaaS dashboard utilizing machine learning model projections to show real-time business health indices and revenue forecasting charts.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      category: 'AI',
      technologies: ['Python', 'TensorFlow', 'React.js', 'ChartJS', 'FastAPI'],
      client: 'OmniGlobal Inc.',
      liveDemo: 'https://example.com/demo/omnibrain',
      github: 'https://github.com/example/omnibrain'
    },
    {
      title: 'Aegis Sentinel Cybersecurity Suite',
      description: 'An advanced cloud network traffic analyzer utilizing threat detection databases and end-to-end encryption checking protocols.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      category: 'Branding', // Matches Branding / Security branding
      technologies: ['Go', 'Wireshark SDK', 'React', 'Tailwind', 'Docker'],
      client: 'Aegis Financial Corp',
      liveDemo: 'https://example.com/demo/aegis',
      github: 'https://github.com/example/aegis'
    },
    {
      title: 'PulseFit Workout Companion App',
      description: 'A gorgeous, interactive mobile application features biometric login, workout planners, and real-time step counter syncing mechanisms.',
      image: 'https://images.unsplash.com/photo-1510051646317-c834a0952d6d?auto=format&fit=crop&w=800&q=80',
      category: 'Mobile Apps',
      technologies: ['React Native', 'Expo', 'Firebase', 'Redux', 'Apple Health Kit'],
      client: 'PulseFit Corp',
      liveDemo: 'https://example.com/demo/pulsefit',
      github: 'https://github.com/example/pulsefit'
    },
    {
      title: 'Zenith Premium E-Commerce Hub',
      description: 'A high-converting custom digital storefront featuring full product catalogs, filtering systems, user accounts, and direct payment integrations.',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      category: 'Web Development',
      technologies: ['Next.js', 'Stripe', 'Node.js', 'PostgreSQL', 'Framer Motion'],
      client: 'Zenith Apparel Group',
      liveDemo: 'https://example.com/demo/zenith',
      github: 'https://github.com/example/zenith'
    },
    {
      title: 'Aether Cloud Scaling Engine',
      description: 'A cloud virtualization framework offering automatic serverless scaling and centralized load balancer dashboards.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      category: 'UI UX',
      technologies: ['AWS CloudFormation', 'Kubernetes', 'Vue.js', 'Node.js'],
      client: 'Aether Telecommunications',
      liveDemo: 'https://example.com/demo/aether',
      github: 'https://github.com/example/aether'
    }
  ];

  for (const p of portfolioItems) {
    await Portfolio.create(p);
  }

  // 4. Seed Blogs
  console.log('Seeding blogs...');
  const blogs = [
    {
      title: 'The Future of AI in Enterprise Software Development',
      slug: 'future-of-ai-enterprise-software',
      content: 'Artificial Intelligence is shifting from simple assistants to core structural elements of software architecture. In this article, we outline how large language models (LLMs) and cognitive analytics engines are automating traditional coding patterns, improving build times, and redefining project structures. Companies implementing AI integrations early are seeing up to 40% improvements in developer productivity and significant drops in testing cycles.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      category: 'AI Solutions',
      tags: ['AI', 'Tech Trends', 'SaaS', 'Coding'],
      readTime: '6 mins',
      author: 'Dr. Marcus Vance, Chief Scientist',
      views: 124,
      comments: [
        {
          authorName: 'Alex Carter',
          content: 'This was incredibly insightful. We are looking into LLM micro-services right now.',
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      title: 'Cybersecurity Best Practices for Scaling Startups',
      slug: 'cybersecurity-best-practices-startups',
      content: 'Startups often ignore security in favor of shipping speed, leaving them vulnerable to simple exploits. Data compliance models like GDPR and HIPAA require robust access policies from day one. We break down the vital security measures you should deploy immediately: end-to-end token encryption, multi-factor biometric authentication, Web Application Firewalls (WAF), and automated penetration scanners.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      category: 'Cybersecurity',
      tags: ['Security', 'Startups', 'Compliance', 'AWS'],
      readTime: '8 mins',
      author: 'Sarah Jenkins, Chief Security Officer',
      views: 98,
      comments: []
    },
    {
      title: 'Mastering UI/UX: Design Principles that Drive Conversion',
      slug: 'mastering-ui-ux-design-conversion',
      content: 'A beautiful interface is useless if users can\'t figure out how to book a service. Modern UX design is centered around cognitive simplicity, accessibility guidelines, micro-interactions, and visual visual hierarchy. By applying custom glassmorphic cards, logical action buttons, and Outfit fonts, we notice massive gains in retention. Learn the step-by-step wireframing process our team uses to craft premium experiences.',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80',
      category: 'UI UX Design',
      tags: ['UI/UX', 'Web Design', 'Figma', 'Framer Motion'],
      readTime: '5 mins',
      author: 'David Chen, Lead Creative Director',
      views: 245,
      comments: []
    }
  ];

  for (const b of blogs) {
    await Blog.create(b);
  }

  // 5. Seed Careers
  console.log('Seeding careers...');
  const careers = [
    {
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'Remote (US/Europe/Asia)',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      description: 'We are seeking a senior frontend engineer with a deep passion for pixel-perfect React.js systems, high performance rendering, and custom state systems.',
      requirements: ['5+ years developing responsive React apps', 'Advanced knowledge of CSS3 and custom animation frameworks', 'Proficiency in Vite, Node, and REST API structures'],
      responsibilities: ['Architect reusable frontend component libraries', 'Optimize web loading speeds to reach 95+ lighthouse scores', 'Collaborate closely with UI/UX designers to implement premium layouts']
    },
    {
      title: 'Lead AI Engineer',
      department: 'Engineering',
      location: 'Remote (Worldwide)',
      type: 'Full-time',
      salary: '$160,000 - $200,000',
      description: 'Join our intelligence team to build and train custom LLMs, vector search layers, and predictive models for enterprise web systems.',
      requirements: ['Mastery of Python, TensorFlow, and PyTorch', 'Experience fine-tuning models and constructing custom prompt trees', 'Solid backend Express/FastAPI deployment knowledge'],
      responsibilities: ['Create cognitive chat architectures and prediction models', 'Scale AI endpoints with high concurrent traffic requirements', 'Write clean documentation on computational pipeline nodes']
    },
    {
      title: 'Senior UI/UX Designer',
      department: 'Design',
      location: 'Hybrid (New York, NY)',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      description: 'We need a highly creative designer who can translate complex tech solutions into beautiful, minimalist, high-converting digital storefronts and admin dashboards.',
      requirements: ['Expertise in Figma prototyping and design tokens', 'Portfolio demonstrating premium glassmorphic or dark mode web work', 'Strong grasp of web accessibility and CSS layout architectures'],
      responsibilities: ['Draft user flows, wireframes, and pixel-perfect high-fidelity mockups', 'Build design systems for frontend developer handoff', 'Conduct user tests on prototypes to refine interactive hierarchies']
    }
  ];

  for (const c of careers) {
    await Career.create(c);
  }

  // 6. Seed Testimonials
  console.log('Seeding testimonials...');
  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'VP of Product',
      company: 'OmniGlobal',
      content: 'NovaSphere built our analytics suite from the ground up. The design is exceptionally premium and the processing speed surpassed our expectations.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Elena'
    },
    {
      name: 'Marcus Vance',
      role: 'Founder',
      company: 'Zenith Apparel',
      content: 'The e-commerce site they designed doubled our sales within three months. The smooth animations and glassmorphic checkout UI feel incredibly high-end.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Marcus'
    },
    {
      name: 'Tariq Al-Fayed',
      role: 'Director of Technology',
      company: 'Aegis Security',
      content: 'Professional, responsive, and secure. Their cloud consulting migrated our sensitive medical systems with absolute zero-downtime.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Tariq'
    }
  ];

  for (const t of testimonials) {
    await Testimonial.create(t);
  }

  // 7. Seed a sample Booking & Contact message for Jane Doe user
  console.log('Seeding mock appointments and contact messages...');
  await Appointment.create({
    userId: normalUser._id.toString(),
    service: 'Website Development',
    date: '2026-07-15',
    time: '14:00',
    name: 'Jane Doe',
    email: 'user@novasphere.com',
    phone: '+1 555-0199',
    details: 'Requesting custom company website redesign with dark mode and administrative blog dashboard.',
    status: 'Confirmed'
  });

  await Appointment.create({
    userId: normalUser._id.toString(),
    service: 'AI Solutions',
    date: '2026-07-22',
    time: '10:30',
    name: 'Jane Doe',
    email: 'user@novasphere.com',
    phone: '+1 555-0199',
    details: 'Need estimation for AI search assistant integration.',
    status: 'Pending'
  });

  await Message.create({
    name: 'Robert Stark',
    email: 'robert@starkindustries.com',
    subject: 'AI Model Consultation Request',
    message: 'Hello, we are interested in booking a workshop for AI pipeline integrations. Please let us know your availability.',
    isRead: false
  });

  await Message.create({
    name: 'Clara Oswald',
    email: 'clara@tardis.org',
    subject: 'Digital Marketing Support Services',
    message: 'Hello NovaSphere! We would love to collaborate on a targeted search campaign for our London retail branches.',
    isRead: true
  });

  console.log('Database successfully seeded!');
};

// If run directly
if (require.main === module) {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });
  
  const { connectDB } = require('./db');
  
  connectDB().then(async () => {
    try {
      await seedData();
      process.exit(0);
    } catch (err) {
      console.error('Seeding process failed:', err);
      process.exit(1);
    }
  });
}

module.exports = { seedData };
