import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin user ----
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "orbit-admin-123";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
  console.log(`✔ admin user "${username}" ready (password from ADMIN_PASSWORD)`);

  // ---- Contact settings ----
  await prisma.contactSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      whatsappNumber: "919999999999",
      whatsappSupportLink: "https://wa.me/919999999999",
      whatsappChannelLink: "",
      telegramUsername: "orbitdev",
      telegramLink: "https://t.me/orbitdev",
      supportMessage: "Hi Orbit Development, I need help with a project.",
      email: "hello@orbitdev.io",
    },
  });

  // ---- Homepage settings ----
  const homepageFeatures = JSON.stringify([
    { title: "Fast Development", desc: "Efficient delivery using modern technologies and reusable architecture.", icon: "bolt" },
    { title: "Premium UI/UX", desc: "Modern interfaces designed around usability and visual quality.", icon: "spark" },
    { title: "Mobile First", desc: "Responsive experiences across mobile, tablet and desktop.", icon: "mobile" },
    { title: "Scalable Architecture", desc: "Applications structured to support future growth.", icon: "layers" },
    { title: "Performance Focused", desc: "Optimized frontend, assets and application performance.", icon: "rocket" },
    { title: "Secure Development", desc: "Security-conscious architecture and implementation.", icon: "shield" },
    { title: "Post-Launch Support", desc: "Support and maintenance after deployment.", icon: "wrench" },
    { title: "Custom Solutions", desc: "Solutions tailored to individual business requirements.", icon: "puzzle" },
  ]);
  await prisma.homepageSettings.upsert({
    where: { id: 1 },
    update: { features: homepageFeatures },
    create: {
      id: 1,
      heroTitle: "BUILDING DIGITAL WORLDS",
      heroSubtitle: "ORBIT DEVELOPMENT",
      heroDescription:
        "We design and ship premium websites, mobile apps and custom software — engineered for speed, scale and a cinematic user experience.",
      ctaPrimary: "EXPLORE OUR WORK",
      ctaSecondary: "CONTACT US",
      features: homepageFeatures,
    },
  });

  // ---- Sample templates (so the site isn't empty; delete from admin anytime) ----
  const samples = [
    {
      title: "Modern E-Commerce Website",
      slug: "modern-ecommerce-website",
      category: "WEBSITE",
      shortDesc: "High-converting storefront with cart, checkout and admin.",
      description:
        "A premium, conversion-focused e-commerce platform with product catalog, cart, secure checkout, order management and a full admin dashboard. Built for speed and scale.",
      coverImage: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80",
      basePrice: 45000,
      extraCharges: "₹5,000 per additional custom page",
      technologies: JSON.stringify(["Next.js", "TypeScript", "Stripe", "PostgreSQL"]),
      techStack: "Next.js · Tailwind · Prisma · PostgreSQL · Stripe",
      features: JSON.stringify(["Product catalog", "Cart & checkout", "Payment gateway", "Admin dashboard", "SEO optimized"]),
      deliveryInfo: "10–14 working days",
      supportInfo: "30 days free post-launch support",
      status: "PUBLISHED",
      order: 1,
    },
    {
      title: "SaaS Landing & Dashboard",
      slug: "saas-landing-dashboard",
      category: "WEBSITE",
      shortDesc: "Marketing site + authenticated product dashboard.",
      description:
        "A complete SaaS front: cinematic marketing landing page plus an authenticated dashboard with charts, billing and user management.",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      basePrice: 60000,
      extraCharges: "Custom integrations quoted separately",
      technologies: JSON.stringify(["Next.js", "TypeScript", "Framer Motion", "Charts"]),
      techStack: "Next.js · Tailwind · Framer Motion · Prisma",
      features: JSON.stringify(["Landing page", "Auth & dashboard", "Analytics charts", "Billing ready", "Dark theme"]),
      deliveryInfo: "12–16 working days",
      supportInfo: "45 days free post-launch support",
      status: "PUBLISHED",
      order: 2,
    },
    {
      title: "Food Delivery App",
      slug: "food-delivery-app",
      category: "APP",
      shortDesc: "Customer app + rider tracking + restaurant panel.",
      description:
        "Cross-platform food delivery experience: browse restaurants, live order tracking, payments, and a restaurant management panel.",
      coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
      basePrice: 50000,
      extraCharges: "₹10,000 for live GPS rider tracking module",
      technologies: JSON.stringify(["React Native", "Node.js", "Maps", "Payments"]),
      techStack: "React Native · Node.js · PostgreSQL · Maps API",
      features: JSON.stringify(["Restaurant browsing", "Live order tracking", "In-app payments", "Push notifications", "Admin panel"]),
      deliveryInfo: "18–24 working days",
      supportInfo: "60 days free post-launch support",
      status: "PUBLISHED",
      order: 1,
    },
    {
      title: "Fitness & Workout App",
      slug: "fitness-workout-app",
      category: "APP",
      shortDesc: "Workout plans, progress tracking and subscriptions.",
      description:
        "A polished fitness companion with guided workout plans, progress tracking, reminders and subscription monetization.",
      coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
      basePrice: 40000,
      extraCharges: "Wearable sync quoted separately",
      technologies: JSON.stringify(["Flutter", "Firebase", "Subscriptions"]),
      techStack: "Flutter · Firebase · Stripe",
      features: JSON.stringify(["Workout plans", "Progress tracking", "Reminders", "Subscriptions", "Offline mode"]),
      deliveryInfo: "16–20 working days",
      supportInfo: "45 days free post-launch support",
      status: "PUBLISHED",
      order: 2,
    },
  ];

  for (const t of samples) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }

  // ---- Sample clients ----
  const clients = [
    { name: "Nova Labs", logo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=80", order: 1 },
    { name: "Vertex", logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=200&q=80", order: 2 },
    { name: "Pulse", logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&q=80", order: 3 },
    { name: "Quantum", logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=200&q=80", order: 4 },
  ];
  for (const c of clients) {
    await prisma.client.upsert({
      where: { id: c.name.toLowerCase() },
      update: {},
      create: { id: c.name.toLowerCase(), ...c },
    });
  }

  console.log("✔ seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
