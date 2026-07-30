import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import { randomUUID } from 'crypto';

const adapter = new PrismaPg({
  connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, username: true }, take: 15 });
  console.log(`Fetched ${users.length} users`);
  const userIds = users.map((u: { id: string }) => u.id);

  let totalInserted = 0;

  const spaces: Array<{ slug: string; posts: Array<{ title: string; body: string }> }> = [
    {
      slug: "the-fire",
      posts: [
        { title: "15,000 steps before 8 AM changed everything", body: "For the past 60 days I haven't missed a single morning. 15k steps, matcha, 40g protein before touching Slack. My CAC dropped 18% and I closed 3 enterprise deals. The correlation between physical discipline and sales performance is real. Who else is tracking this? Currently using a Garmin + Notion dashboard to correlate steps with pipeline velocity. Sharing my template below." },
        { title: "Cold plunge accountability thread \u2014 Day 1/30", body: "Starting today. 3 minutes at 5\u00b0C every morning. Building a B2B SaaS is mentally brutal and I've noticed my decision fatigue kicking in hard after 3 PM. Read that cold exposure increases dopamine 250% for hours. If I don't post here tomorrow, call me out publicly. That's the whole point of this space." },
        { title: "The 5 AM club is not a flex \u2014 it's a necessity in LATAM", body: "Here in CDMX, if you're not done with your deep work by 11 AM, the city swallows you whole. Traffic, tr\u00e1mites, family obligations. I've been doing 5 AM to 11 AM as my sacred building block for 14 months. Revenue is up 3.2x. The key isn't waking up early \u2014 it's protecting those hours with military discipline. No calls. No WhatsApp. No exceptions." },
        { title: "Burnt out at $8K MRR \u2014 how I rebuilt from zero", body: "November last year: 4 clients, $8K MRR, and a complete mental breakdown. I was sleeping 4 hours, eating garbage, and my code was becoming spaghetti. Took December completely off. Rebuilt my entire routine: 7 hours sleep minimum, Brazilian Jiu-Jitsu 3x/week, Sunday meal prep. Came back in January, rebuilt the pipeline, and hit $14K MRR by March. Burnout is not a badge of honor." },
        { title: "Duolingo streaks and startup discipline are the same muscle", body: "986-day Duolingo streak. 847-day GitHub commit streak. The people who dismiss streaks as vanity metrics don't understand compounding. Every day you show up to something small, you're reinforcing the identity of someone who finishes what they start. My team knows: if it's green on my profile, the deal closes on time. Psychology matters more than strategy." },
        { title: "Walking meetings are underrated for technical founders", body: "Started doing all 1:1s as walking meetings. 45 minutes, AirPods, no screen. Three things happened: (1) my average daily steps went from 6K to 14K, (2) engineers started being more honest without a screen between us, (3) I started solving architecture problems mid-walk that I'd been stuck on for days. Movement unlocks the brain differently." },
        { title: "Weekly fitness challenge: 100 pull-ups every day this week", body: "Posting this publicly so I don't back out. 100 pull-ups every day for 7 days. Why? Because building a startup is 90% mental and 10% skill. Training your mind to do hard things on demand is the single most transferable skill. I'll post daily updates in the comments. Who's in? Doesn't have to be pull-ups \u2014 pick your hard thing." },
        { title: "Sleep tracking revealed my biggest productivity leak", body: "Three months of Whoop data. On nights I slept < 6 hours, my next-day close rate was 4%. On 7.5+ hours: 23%. Not a typo. I was essentially working twice as hard for 1/6 the result on bad sleep days. Now I treat 10 PM as a hard cutoff. No exceptions. Told my co-founder to fire me if he catches me online past 10:30. Best decision this year." },
        { title: "Fasted training and cognitive performance for devs", body: "Been experimenting with fasted morning workouts followed by a high-protein breakfast before coding. The difference in mental clarity during my 8 AM-noon block is night and day. Blood sugar stability = fewer bugs. Tested this across 3 sprints: 42% fewer production incidents on the fasted-training protocol. N=1 but compelling enough that my whole team is trying it." },
        { title: "No alcohol for 100 days \u2014 what it did to my MRR", body: "Documented this publicly on X. Days 1-30: nothing noticeable. Days 30-60: sleep HRV improved 22%, started waking up naturally at 5:45 without alarm. Days 60-100: shipped 4 features, closed 7 deals, $4K \u2192 $11K MRR. Correlation or causation? Both. Better decisions compound. Not preaching \u2014 just reporting my data. Club soda with lime works fine at networking events." },
      ]
    },
  ];

  for (const space of spaces) {
    const slug = space.slug;
    console.log(`\n=== ${slug} ===`);
    for (let i = 0; i < space.posts.length; i++) {
      const p = space.posts[i];
      const authorId = userIds[Math.floor(Math.random() * userIds.length)];
      const day = 14 + (i % 16);
      const hour = (10 + i) % 24;
      const minute = (i * 7) % 60;

      await prisma.communityPost.create({
        data: {
          id: randomUUID(),
          authorId,
          content: `**${p.title}**\n\n${p.body}`,
          space: slug,
          imageUrls: [],
          isPinned: false,
          isEdited: false,
          isDeleted: false,
          visibility: "PUBLIC",
          createdAt: new Date(`2026-07-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00-06:00`),
        },
      });
      console.log(`  [${i + 1}/10] OK`);
      totalInserted++;
    }
  }

  console.log(`\n\nTest complete: ${totalInserted} posts inserted.`);
}

main()
  .then(() => { console.log("Done"); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
