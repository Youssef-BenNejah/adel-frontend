import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Category from './pages/Category.jsx'
import Product from './pages/Product.jsx'
import Packs from './pages/Packs.jsx'
import CartPage from './pages/CartPage.jsx'
import SearchResults from './pages/SearchResults.jsx'

import AdminLayout from './admin/AdminLayout.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'
import AdminLogin from './admin/pages/Login.jsx'
import AdminDashboard from './admin/pages/Dashboard.jsx'
import AdminProducts from './admin/pages/Products.jsx'
import AdminOrders from './admin/pages/Orders.jsx'
import AdminCustomers from './admin/pages/Customers.jsx'
import AdminSettings from './admin/pages/Settings.jsx'
import AdminPromotions from './admin/pages/Promotions.jsx'
import AdminLanding from './admin/pages/Landing.jsx'
import AdminCategories from './admin/pages/Categories.jsx'
import AdminPacks from './admin/pages/Packs.jsx'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categorie/:slug" element={<Category />} />
          <Route path="/produit/:id" element={<Product />} />
          <Route path="/packs" element={<Packs />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/recherche" element={<SearchResults />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="packs" element={<AdminPacks />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="clients" element={<AdminCustomers />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="accueil" element={<AdminLanding />} />
            <Route path="parametres" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </CartProvider>
  )
}
