const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const subjects = [
  {
    name: 'Mathematics',
    slug: 'mathematics',
    icon: '📐',
    description: 'Algebra, calculus, geometry, and more',
    topics: [
      { name: 'Algebra', slug: 'algebra' },
      { name: 'Calculus', slug: 'calculus' },
      { name: 'Geometry', slug: 'geometry' },
      { name: 'Statistics', slug: 'statistics' },
      { name: 'Trigonometry', slug: 'trigonometry' },
      { name: 'Linear Algebra', slug: 'linear-algebra' },
    ],
  },
  {
    name: 'Physics',
    slug: 'physics',
    icon: '⚛️',
    description: 'Mechanics, thermodynamics, electromagnetism',
    topics: [
      { name: 'Classical Mechanics', slug: 'classical-mechanics' },
      { name: 'Thermodynamics', slug: 'thermodynamics' },
      { name: 'Electromagnetism', slug: 'electromagnetism' },
      { name: 'Optics', slug: 'optics' },
      { name: 'Quantum Physics', slug: 'quantum-physics' },
      { name: 'Waves & Sound', slug: 'waves-sound' },
    ],
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
    icon: '🧪',
    description: 'Organic, inorganic, and physical chemistry',
    topics: [
      { name: 'Organic Chemistry', slug: 'organic-chemistry' },
      { name: 'Inorganic Chemistry', slug: 'inorganic-chemistry' },
      { name: 'Physical Chemistry', slug: 'physical-chemistry' },
      { name: 'Biochemistry', slug: 'biochemistry' },
      { name: 'Periodic Table', slug: 'periodic-table' },
    ],
  },
  {
    name: 'Biology',
    slug: 'biology',
    icon: '🧬',
    description: 'Cell biology, genetics, ecology',
    topics: [
      { name: 'Cell Biology', slug: 'cell-biology' },
      { name: 'Genetics', slug: 'genetics' },
      { name: 'Ecology', slug: 'ecology' },
      { name: 'Human Anatomy', slug: 'human-anatomy' },
      { name: 'Evolution', slug: 'evolution' },
      { name: 'Microbiology', slug: 'microbiology' },
    ],
  },
  {
    name: 'Computer Science',
    slug: 'computer-science',
    icon: '💻',
    description: 'Programming, algorithms, data structures',
    topics: [
      { name: 'Data Structures', slug: 'data-structures' },
      { name: 'Algorithms', slug: 'algorithms' },
      { name: 'Operating Systems', slug: 'operating-systems' },
      { name: 'Databases', slug: 'databases' },
      { name: 'Networking', slug: 'networking' },
      { name: 'Web Development', slug: 'web-development' },
    ],
  },
  {
    name: 'History',
    slug: 'history',
    icon: '📜',
    description: 'World history, civilizations, modern era',
    topics: [
      { name: 'Ancient Civilizations', slug: 'ancient-civilizations' },
      { name: 'Medieval Period', slug: 'medieval-period' },
      { name: 'Modern History', slug: 'modern-history' },
      { name: 'World Wars', slug: 'world-wars' },
      { name: 'American History', slug: 'american-history' },
    ],
  },
  {
    name: 'English Literature',
    slug: 'english-literature',
    icon: '📖',
    description: 'Poetry, prose, drama, literary analysis',
    topics: [
      { name: 'Poetry', slug: 'poetry' },
      { name: 'Shakespeare', slug: 'shakespeare' },
      { name: 'Modern Literature', slug: 'modern-literature' },
      { name: 'Literary Analysis', slug: 'literary-analysis' },
      { name: 'Grammar & Writing', slug: 'grammar-writing' },
    ],
  },
  {
    name: 'Economics',
    slug: 'economics',
    icon: '📈',
    description: 'Micro, macro economics, finance',
    topics: [
      { name: 'Microeconomics', slug: 'microeconomics' },
      { name: 'Macroeconomics', slug: 'macroeconomics' },
      { name: 'International Trade', slug: 'international-trade' },
      { name: 'Financial Markets', slug: 'financial-markets' },
      { name: 'Economic Theory', slug: 'economic-theory' },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  for (const subjectData of subjects) {
    const { topics, ...subjectFields } = subjectData;

    const subject = await prisma.subject.upsert({
      where: { slug: subjectFields.slug },
      update: subjectFields,
      create: subjectFields,
    });

    console.log(`  Subject: ${subject.name}`);

    for (const topicData of topics) {
      await prisma.topic.upsert({
        where: {
          subjectId_slug: {
            subjectId: subject.id,
            slug: topicData.slug,
          },
        },
        update: { name: topicData.name },
        create: {
          ...topicData,
          subjectId: subject.id,
        },
      });
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
