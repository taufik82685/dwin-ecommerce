import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Default Settings
  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      website_logo: '/logo.png',
      homepage_banner: '/banner.jpg',
      theme_color: '#00d2ff', // Cyberpunk Neo-Blue
      delivery_charge: 120,
      advance_payment_amount: 100,
      checkout_fields: JSON.stringify([
        { id: 'name', label: 'Full Name', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'address', label: 'Delivery Address', type: 'text', required: true },
        { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
      ])
    }
  })

  // 2. Create Admin User
  const adminEmail = 'admin@esports.com'
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password: 'hashed_password_placeholder', // Usually bcrypt in an actual route
      role: 'ADMIN'
    }
  })

  // 3. Create Categories
  const category1 = await prisma.category.create({
    data: {
      category_name: 'Gaming Mice',
      category_image: 'https://images.unsplash.com/photo-1527814050087-14227918a93e?w=800'
    }
  })

  const category2 = await prisma.category.create({
    data: {
      category_name: 'Mechanical Keyboards',
      category_image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'
    }
  })

  // 4. Create Mock Products
  await prisma.product.create({
    data: {
      product_name: 'Cyberpunk Elite Mouse M1',
      description: 'Ultra-lightweight gaming mouse with neon RGB accents.',
      price: 4500,
      discount_price: 3999,
      category_id: category1.id,
      stock_quantity: 50,
      featured: true,
      product_images: ['https://images.unsplash.com/photo-1615663245857-ac93100318b3?w=800'],
      tags: ['FPS', 'Esports']
    }
  })

  await prisma.product.create({
    data: {
      product_name: 'HyperDrive Mech Keyboard TKL',
      description: 'Tenkeyless mechanical keyboard with optical switches.',
      price: 8500,
      category_id: category2.id,
      stock_quantity: 30,
      featured: true,
      product_images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'],
      tags: ['RGB', 'Tactile']
    }
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
