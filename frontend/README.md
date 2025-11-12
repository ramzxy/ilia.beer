# 🍺 Buy Me a Beer

A beautiful, modern donation page built with Next.js and Buy Me a Coffee. Accept beer donations with a simple, no-hassle setup!

## ✨ Features

- 💳 **Buy Me a Coffee Integration** - Easy payment setup, no business registration needed
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🌙 **Dark Mode** - Automatic dark mode support
- 📱 **Mobile Friendly** - Works perfectly on all devices
- ⚡ **Super Fast** - No backend complexity
- 🔒 **Secure** - Payments handled by Buy Me a Coffee

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Update your Buy Me a Coffee username**:
   - Edit `app/components/buy-me-a-coffee-button.tsx`
   - Change `data-slug="rmxzy"` to your username

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

That's it! No API keys, no database setup, no webhooks needed! 🎉

## 🎨 Customization

Edit `app/page.tsx` to customize:
- The headline and description
- The "Why support me?" section
- Colors and styling (all Tailwind CSS)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Payments**: Buy Me a Coffee
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## 📁 Project Structure

```
ilia.beer/
├── app/
│   ├── components/
│   │   └── buy-me-a-coffee-button.tsx   # Buy Me a Coffee button
│   └── page.tsx                         # Home page
├── SETUP-BMC.md                         # Setup instructions
└── README.md
```

## 📊 Viewing Your Supporters

All supporter names and payments are visible in your Buy Me a Coffee dashboard:
- Go to [buymeacoffee.com/dashboard](https://www.buymeacoffee.com/dashboard)
- See all supporters, amounts, and messages
- Export data if needed

## 💡 Why Buy Me a Coffee?

Perfect for creators in regions like Netherlands where Stripe requires KVK registration:
- ✅ No business registration needed
- ✅ No tax forms or legal paperwork
- ✅ Start accepting payments immediately
- ✅ They handle all compliance
- ✅ See supporter names in dashboard

## 🚀 Deploy to Production

**Vercel (Recommended)**:
```bash
npm run build
vercel --prod
```

Your site will be live at your custom domain or Vercel subdomain!

## 📝 License

MIT

## 🙏 Support

If you find this useful, buy me a beer! 🍺 → [buymeacoffee.com/rmxzy](https://www.buymeacoffee.com/rmxzy)

---

Built with ❤️ using Next.js and Buy Me a Coffee
