import { Outlet } from 'react-router-dom'
import TopNav from './TopNav.jsx'
import BottomTabBar from './BottomTabBar.jsx'
import CartToast from '../CartToast.jsx'
import Footer from '../Footer.jsx'
import AnnouncementBar from '../AnnouncementBar.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <AnnouncementBar />
      <TopNav />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomTabBar />
      <CartToast />
    </div>
  )
}
