// In server folder, create seed.js:
const mongoose = require('mongoose');
const Lead = require('./models/Lead');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const sampleLeads = [
    {
        name: 'Charlie Brown',
        email: 'charlie@startup.io',
        source: 'Website',
        status: 'New',
        notes: []
    },
    {
        name: 'asmah yaseen',
        email: 'asmahy13@gmail.com',
        phone: '+1 (555) 123-4567',
        source: 'LinkedIn',
        status: 'Converted',
        notes: [
            {
                content: 'Initial contact made via LinkedIn message.',
                createdAt: new Date('2026-01-15')
            },
            {
                content: 'Follow-up call scheduled for next week.',
                createdAt: new Date('2026-01-16')
            }
        ]
    },
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1 (555) 987-6543',
        source: 'Referral',
        status: 'Contacted',
        notes: [
            {
                content: 'Referred by Bob Smith.',
                createdAt: new Date('2026-01-14')
            }
        ]
    }
];

async function seedDatabase() {
    try {
        await Lead.deleteMany({});
        await Lead.insertMany(sampleLeads);
        console.log('✅ Sample leads added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();