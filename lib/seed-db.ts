import { prisma } from './db';
import { hash } from 'bcrypt';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create test users
    const testUsers = [
      {
        name: 'Test Brand',
        email: 'brand@example.com',
        password: 'password123',
      },
      {
        name: 'Test Influencer',
        email: 'influencer@example.com',
        password: 'password123',
      },
    ];

    for (const user of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        const hashedPassword = await hash(user.password, 10);
        
        const newUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            hashedPassword,
          },
        });

        console.log(`Created user: ${newUser.name} (${newUser.email})`);

        // Create brand profile for brand user
        if (user.email === 'brand@example.com') {
          await prisma.brandProfile.create({
            data: {
              userId: newUser.id,
              companyName: 'Test Brand Inc.',
              industry: 'Technology',
              description: 'A test brand for demonstration purposes.',
              website: 'https://testbrand.example.com',
              profileComplete: true,
            },
          });
          console.log(`Created brand profile for: ${newUser.name}`);

          // Create some test campaigns
          const campaign = await prisma.campaign.create({
            data: {
              title: 'Social Media Product Launch',
              description: 'Looking for influencers to help launch our new product on social media.',
              requirements: 'At least 5,000 followers on Instagram or TikTok. Must be able to create high-quality content.',
              budget: 1000,
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              platforms: ['Instagram', 'TikTok'],
              categories: ['Technology', 'Lifestyle'],
              creatorId: newUser.id,
              brandId: (await prisma.brandProfile.findUnique({ where: { userId: newUser.id } }))!.id,
            },
          });
          console.log(`Created campaign: ${campaign.title}`);
        }

        // Create influencer profile for influencer user
        if (user.email === 'influencer@example.com') {
          const influencerProfile = await prisma.influencerProfile.create({
            data: {
              userId: newUser.id,
              bio: 'A test influencer account for demonstration purposes.',
              location: 'New York, USA',
              categories: ['Lifestyle', 'Technology', 'Fashion'],
              profileComplete: true,
            },
          });
          console.log(`Created influencer profile for: ${newUser.name}`);

          // Add social platforms for the influencer
          await prisma.socialPlatform.create({
            data: {
              platform: 'Instagram',
              username: 'test_influencer',
              url: 'https://instagram.com/test_influencer',
              followers: 10000,
              influencerProfileId: influencerProfile.id,
            },
          });

          await prisma.socialPlatform.create({
            data: {
              platform: 'TikTok',
              username: 'test_influencer',
              url: 'https://tiktok.com/@test_influencer',
              followers: 15000,
              influencerProfileId: influencerProfile.id,
            },
          });
          console.log('Added social platforms for the influencer');

          // Add metrics for the influencer
          await prisma.metrics.create({
            data: {
              averageEngagement: 5.2,
              audienceDemographics: {
                ageGroups: {
                  '18-24': 35,
                  '25-34': 45,
                  '35-44': 15,
                  '45+': 5,
                },
                genderSplit: {
                  female: 65,
                  male: 35,
                },
              },
              contentCategories: ['Lifestyle', 'Technology', 'Travel'],
              influencerProfileId: influencerProfile.id,
            },
          });
          console.log('Added metrics for the influencer');
        }
      } else {
        console.log(`User already exists: ${existingUser.email}`);
      }
    }

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
} 