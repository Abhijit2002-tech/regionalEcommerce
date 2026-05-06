import { useEffect, useMemo, useState } from 'react'
import './App.css'

type RegionKey = 'rajasthan' | 'west-bengal'
type PaymentMethod = 'upi' | 'card' | 'cod'

type Product = {
  id: string
  name: string
  detail: string
  price: number
  category: string
  badge: string
  sizes?: string[]
}

type Region = {
  key: RegionKey
  name: string
  tagline: string
  hero: string
  accent: string
  short: string
  collections: string[]
  products: Product[]
}

type CartLine = Product & {
  quantity: number
  size?: string
}

type HighlightProduct = Product & {
  regionKey: RegionKey
  regionName: string
  accent: string
}

type SelectedProduct = Product & {
  regionKey?: RegionKey
  regionName?: string
  accent?: string
  selectedSize?: string
}

const regions: Record<RegionKey, Region> = {
  rajasthan: {
    key: 'rajasthan',
    name: 'Rajasthan',
    tagline: 'Royal craft, desert colour, and festive home essentials.',
    hero: 'Block prints, blue pottery, meenakari accents, leather juttis, and handworked textiles inspired by Jaipur, Jodhpur, and Udaipur.',
    accent: 'rajasthan',
    short: 'Jaipur edit',
    collections: ['Bandhani & leheriya', 'Blue pottery', 'Mojari footwear'],
    products: [
      {
        id: 'rj-kurta',
        name: 'Bagru Block Print Kurta',
        detail: 'Natural dye cotton with hand-stamped motifs',
        price: 1499,
        category: 'Fashion',
        badge: 'Bagru',
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      },
      {
        id: 'rj-bowl',
        name: 'Jaipur Blue Pottery Bowl',
        detail: 'Gloss ceramic serveware for festive tables',
        price: 849,
        category: 'Home',
        badge: 'Jaipur',
      },
      {
        id: 'rj-mojari',
        name: 'Handcrafted Mojari',
        detail: 'Soft leather pair with embroidered upper',
        price: 1199,
        category: 'Footwear',
        badge: 'Jodhpur',
      },
      {
        id: 'rj-dupatta',
        name: 'Leheriya Silk Dupatta',
        detail: 'Bright tie-dye drape for festive styling',
        price: 1599,
        category: 'Fashion',
        badge: 'Leheriya',
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      },
      {
        id: 'rj-lamp',
        name: 'Marble Inlay Table Lamp',
        detail: 'Warm home accent with artisan stone work',
        price: 2299,
        category: 'Decor',
        badge: 'Udaipur',
      },
      {
        id: 'rj-earrings',
        name: 'Meenakari Drop Earrings',
        detail: 'Colorful enamel jewellery for wedding looks',
        price: 699,
        category: 'Jewellery',
        badge: 'Meenakari',
      },
    ],
  },
  'west-bengal': {
    key: 'west-bengal',
    name: 'West Bengal',
    tagline: 'Elegant weaves, cultural rituals, and festive Bengali finds.',
    hero: 'Tant sarees, kantha work, terracotta pieces, conch-inspired jewellery, and Durga Puja gifting selected for Bengal homes.',
    accent: 'bengal',
    short: 'Kolkata edit',
    collections: ['Tant & jamdani', 'Kantha craft', 'Terracotta decor'],
    products: [
      {
        id: 'wb-saree',
        name: 'Handloom Tant Saree',
        detail: 'Light cotton drape with classic red border',
        price: 2299,
        category: 'Fashion',
        badge: 'Tant',
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      },
      {
        id: 'wb-cushion',
        name: 'Kantha Stitch Cushion',
        detail: 'Layered textile cover with running-stitch artwork',
        price: 699,
        category: 'Home',
        badge: 'Kantha',
      },
      {
        id: 'wb-horse',
        name: 'Bankura Terracotta Horse',
        detail: 'Statement decor inspired by Bengal folk craft',
        price: 1099,
        category: 'Decor',
        badge: 'Bankura',
      },
      {
        id: 'wb-jamdani',
        name: 'Jamdani Stole',
        detail: 'Soft handwoven stole with delicate motifs',
        price: 1299,
        category: 'Fashion',
        badge: 'Jamdani',
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      },
      {
        id: 'wb-shola',
        name: 'Shola Craft Wall Plate',
        detail: 'Traditional festive decor for puja spaces',
        price: 899,
        category: 'Decor',
        badge: 'Shola',
      },
      {
        id: 'wb-bangles',
        name: 'Conch Inspired Bangles',
        detail: 'White and red jewellery set for cultural occasions',
        price: 799,
        category: 'Jewellery',
        badge: 'Puja edit',
      },
    ],
  },
}

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

const getRegionFromPath = (pathname: string): RegionKey | null => {
  const path = pathname.replace(/^\/+/, '').toLowerCase()
  if (path === 'rajasthan') return 'rajasthan'
  if (path === 'west-bengal' || path === 'west-bengal-store') return 'west-bengal'
  return null
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [regionsState, setRegionsState] = useState<Record<RegionKey, Region>>(
    () => JSON.parse(JSON.stringify(regions)),
  )

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeRegion = getRegionFromPath(pathname)
  const isAdmin = pathname.replace(/^\/+/, '').toLowerCase() === 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() =>
    window.localStorage.getItem('deshkart-admin-auth') === 'true',
  )

  const openRegion = (region: RegionKey) => {
    navigate(`/${region}`)
  }

  const handleAdminLogin = (password: string) => {
    const adminPassword = 'DeshKart@2026'
    if (password === adminPassword) {
      window.localStorage.setItem('deshkart-admin-auth', 'true')
      setIsAdminAuthenticated(true)
      navigate('/admin')
      return true
    }
    return false
  }

  const handleAdminLogout = () => {
    window.localStorage.removeItem('deshkart-admin-auth')
    setIsAdminAuthenticated(false)
    navigate('/')
  }

  const handleSaveRegions = (nextRegions: Record<RegionKey, Region>) => {
    setRegionsState(nextRegions)
  }

  if (isAdmin) {
    return isAdminAuthenticated ? (
      <AdminPanel
        regions={regionsState}
        onSave={handleSaveRegions}
        onGoHome={() => navigate('/')}
        onLogout={handleAdminLogout}
      />
    ) : (
      <AdminLogin onLogin={handleAdminLogin} onGoHome={() => navigate('/')} />
    )
  }

  if (activeRegion) {
    return (
      <Storefront
        key={activeRegion}
        region={regionsState[activeRegion]}
        onSelectRegion={openRegion}
        onGoHome={() => navigate('/')}
      />
    )
  }

  return <HomePage regions={regionsState} onSelect={openRegion} />
}

function HomePage({
  regions,
  onSelect,
}: {
  regions: Record<RegionKey, Region>
  onSelect: (region: RegionKey) => void
}) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [homeCart, setHomeCart] = useState<CartLine[]>([])
  const [homePaymentMethod, setHomePaymentMethod] = useState<PaymentMethod>('upi')
  const [homeOrderPlaced, setHomeOrderPlaced] = useState(false)
  const [homePaymentStatus, setHomePaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [homeCheckoutError, setHomeCheckoutError] = useState('')
  const [homeCustomer, setHomeCustomer] = useState({
    name: '',
    mobile: '',
    address: '',
  })
  const [isHomeCheckoutVisible, setIsHomeCheckoutVisible] = useState(false)
  const highlightedProducts: HighlightProduct[] = [
    { ...regions.rajasthan.products[0], regionKey: 'rajasthan', regionName: 'Rajasthan', accent: 'rajasthan' },
    { ...regions['west-bengal'].products[0], regionKey: 'west-bengal', regionName: 'West Bengal', accent: 'bengal' },
    { ...regions.rajasthan.products[1], regionKey: 'rajasthan', regionName: 'Rajasthan', accent: 'rajasthan' },
    { ...regions['west-bengal'].products[2], regionKey: 'west-bengal', regionName: 'West Bengal', accent: 'bengal' },
    { ...regions.rajasthan.products[3], regionKey: 'rajasthan', regionName: 'Rajasthan', accent: 'rajasthan' },
    { ...regions['west-bengal'].products[4], regionKey: 'west-bengal', regionName: 'West Bengal', accent: 'bengal' },
  ]

  const trendingProducts = highlightedProducts.slice(0, 4)
  const heroSlides = highlightedProducts.slice(0, 3)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [heroSlides.length])

  useEffect(() => {
    if (!homeCart.length) {
      setIsHomeCheckoutVisible(false)
      return
    }

    const checkout = document.getElementById('home-checkout')
    if (!checkout) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHomeCheckoutVisible(entry.isIntersecting)
      },
      { threshold: 0.2 },
    )

    observer.observe(checkout)
    return () => observer.disconnect()
  }, [homeCart.length])

  const activeHeroProduct = heroSlides[activeSlide]
  const homeCartCount = homeCart.reduce((sum, item) => sum + item.quantity, 0)
  const homeSubtotal = homeCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const homeDelivery = homeSubtotal > 1999 || homeSubtotal === 0 ? 0 : 99
  const homeTotal = homeSubtotal + homeDelivery

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product as SelectedProduct)
    setSelectedSize(product.sizes?.[0] || '')
  }

  const addHomeCart = (product: Product, size?: string) => {
    setHomeOrderPlaced(false)
    setHomePaymentStatus('idle')
    setHomeCheckoutError('')
    setHomeCart((current) => {
      const existing = current.find((line) => line.id === product.id && line.size === size)
      if (existing) {
        return current.map((line) =>
          line.id === product.id && line.size === size ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }
      return [...current, { ...product, quantity: 1, size }]
    })

    window.setTimeout(() => {
      document.getElementById('home-checkout')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const changeHomeQuantity = (id: string, quantity: number) => {
    setHomePaymentStatus('idle')
    setHomeCheckoutError('')
    setHomeCart((current) =>
      current
        .map((line) => (line.id === id ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    )
  }

  const placeHomeOrder = () => {
    if (!homeCart.length) {
      setHomeCheckoutError('Add at least one product before placing the order.')
      return
    }

    if (!homeCustomer.name.trim() || homeCustomer.mobile.trim().length < 10 || !homeCustomer.address.trim()) {
      setHomeCheckoutError('Enter customer name, 10 digit mobile number, and delivery address.')
      return
    }

    setHomeCheckoutError('')
    setHomeOrderPlaced(false)
    setHomePaymentStatus('processing')

    window.setTimeout(() => {
      setHomePaymentStatus('success')
      setHomeOrderPlaced(true)
    }, 900)
  }

  const goToHomeCheckout = () => {
    const checkout = document.getElementById('home-checkout')
    checkout?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState({}, '', '#home-checkout')
  }

  return (
    <main className="home-shell">
      <nav className="topbar" aria-label="Store navigation">
        <strong>DeshKart</strong>
        <div className="home-nav">
          <a href="#trending">Trending</a>
          <a href="#states">States</a>
          <a href="#highlights">Highlights</a>
          <a className="cart-pill" href="#home-checkout">
            {homeCartCount > 0 ? `Proceed to payment (${homeCartCount})` : 'Cart 0'}
          </a>
        </div>
      </nav>

      <section className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">Regional ecommerce marketplace</p>
          <h1>Shop curated craft from Rajasthan and West Bengal.</h1>
          <p>
            A culture-first home page with trending products, selected regional
            highlights, and quick entry into each state storefront.
          </p>
          <div className="hero-actions">
            <a href="#trending">Explore trending</a>
            <button type="button" onClick={() => onSelect('west-bengal')}>
              Shop West Bengal
            </button>
          </div>
        </div>

        <div className={`home-feature autoslider ${activeHeroProduct.accent}`}>
          <div className="autoslider-track">
            {heroSlides.map((product, index) => (
              <article
                className={index === activeSlide ? 'active' : ''}
                key={`hero-${product.id}`}
                aria-hidden={index !== activeSlide}
              >
                <span>{product.regionName} highlight</span>
                <strong>{product.name}</strong>
                <p>{product.detail}</p>
                <button type="button" onClick={() => onSelect(product.regionKey)}>
                  Shop {product.regionName}
                </button>
              </article>
            ))}
          </div>
          <div className="slider-dots" aria-label="Hero slider controls">
            {heroSlides.map((product, index) => (
              <button
                className={index === activeSlide ? 'active' : ''}
                key={`dot-${product.id}`}
                type="button"
                aria-label={`Show ${product.name}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="trending-section" id="trending">
        <div className="section-heading">
          <p className="eyebrow">Trending now</p>
          <h2>Best picks from both states</h2>
        </div>
        <div className="trending-grid">
          {trendingProducts.map((product) => (
            <article className={`trend-card ${product.accent}`} key={product.id}>
              <button
                className="product-art detail-trigger"
                type="button"
                onClick={() => openProductDetails(product)}
              >
                <span>{product.badge}</span>
              </button>
              <p>{product.regionName}</p>
              <h3>{product.name}</h3>
              <strong>{formatMoney(product.price)}</strong>
              <div className="product-actions">
                <button type="button" onClick={() => openProductDetails(product)}>
                  Details
                </button>
                <button type="button" onClick={() => addHomeCart(product)}>
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="state-section" id="states">
        <div className="section-heading">
          <p className="eyebrow">Shop by region</p>
          <h2>Choose a state storefront</h2>
        </div>
        <div className="region-grid" aria-label="Available states">
          {Object.values(regions).map((region) => (
            <button
              className={`region-tile ${region.accent}`}
              key={region.key}
              type="button"
              onClick={() => onSelect(region.key)}
            >
              <span>{region.short}</span>
              <strong>{region.name}</strong>
              <small>{region.tagline}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="highlight-slider-section" id="highlights">
        <div className="section-heading">
          <p className="eyebrow">Product slider</p>
          <h2>Highlighted products only</h2>
        </div>
        <div className="highlight-slider" aria-label="Highlighted product slider">
          {highlightedProducts.map((product) => (
            <article className={`slider-card ${product.accent}`} key={`slider-${product.id}`}>
              <button
                className="slider-art detail-trigger"
                type="button"
                onClick={() => openProductDetails(product)}
              >
                <span>{product.badge}</span>
              </button>
              <div>
                <p>{product.regionName}</p>
                <h3>{product.name}</h3>
                <small>{product.detail}</small>
              </div>
              <div className="slider-footer">
                <strong>{formatMoney(product.price)}</strong>
                <div className="slider-actions">
                  <button type="button" onClick={() => openProductDetails(product)}>
                    Details
                  </button>
                  <button type="button" onClick={() => addHomeCart(product)}>
                    Add cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {homeCart.length > 0 && (
        <section className="home-checkout-section" id="home-checkout">
          <div className="section-heading">
            <p className="eyebrow">Checkout</p>
            <h2>Place order from home cart</h2>
          </div>
          <div className="home-checkout-grid">
            <div className="home-cart-list">
              {homeCart.map((item) => (
                  <div className="cart-line" key={`home-${item.id}-${item.size ?? 'default'}`}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{formatMoney(item.price)}</span>
                    </div>
                    <div className="qty-stepper" aria-label={`${item.name} quantity`}>
                      <button type="button" onClick={() => changeHomeQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => changeHomeQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <aside className="checkout-panel home-checkout-panel">
              <form className="checkout-form">
                <label>
                  Full name
                  <input
                    placeholder="Customer name"
                    value={homeCustomer.name}
                    onChange={(event) =>
                      setHomeCustomer((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Mobile number
                  <input
                    inputMode="numeric"
                    placeholder="10 digit number"
                    value={homeCustomer.mobile}
                    onChange={(event) =>
                      setHomeCustomer((current) => ({ ...current, mobile: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Delivery address
                  <textarea
                    placeholder="House no, area, city, state"
                    rows={3}
                    value={homeCustomer.address}
                    onChange={(event) =>
                      setHomeCustomer((current) => ({ ...current, address: event.target.value }))
                    }
                  />
                </label>
              </form>

              <div className={`payment-box gateway-card ${homePaymentMethod}`}>
                <div className="gateway-heading">
                  <div>
                    <p className="eyebrow">Payment gateway</p>
                    <h3>Secure demo payment</h3>
                  </div>
                  <span>{homePaymentStatus === 'processing' ? 'Processing' : 'Ready'}</span>
                </div>
                <div className="payment-options">
                  {[
                    { id: 'upi', label: 'UPI' },
                    { id: 'card', label: 'Card' },
                    { id: 'cod', label: 'COD' },
                  ].map((method) => (
                    <button
                      className={homePaymentMethod === method.id ? 'active' : ''}
                      key={`home-${method.id}`}
                      type="button"
                      aria-pressed={homePaymentMethod === method.id}
                      onClick={() => {
                        setHomePaymentMethod(method.id as PaymentMethod)
                        setHomePaymentStatus('idle')
                        setHomeCheckoutError('')
                        setHomeOrderPlaced(false)
                      }}
                    >
                      {method.label}
                      {homePaymentMethod === method.id && <span>Selected</span>}
                    </button>
                  ))}
                </div>
                <PaymentFields method={homePaymentMethod} />
                <div className="gateway-note">
                  {homePaymentMethod === 'upi' && 'Customer can pay using UPI ID or QR scan.'}
                  {homePaymentMethod === 'card' && 'Card details are for demo UI only; no live charge is made.'}
                  {homePaymentMethod === 'cod' && 'Cash will be collected at delivery.'}
                </div>
              </div>

              <div className="order-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatMoney(homeSubtotal)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{homeDelivery ? formatMoney(homeDelivery) : 'Free'}</strong>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <strong>{formatMoney(homeTotal)}</strong>
                </div>
              </div>

              <button
                className="place-order"
                disabled={homePaymentStatus === 'processing'}
                type="button"
                onClick={placeHomeOrder}
              >
                {homePaymentStatus === 'processing'
                  ? 'Processing payment...'
                  : `Payment / Place order ${formatMoney(homeTotal)}`}
              </button>
              {homeCheckoutError && <p className="error-message">{homeCheckoutError}</p>}
              {homeOrderPlaced && (
                <p className="success-message">
                  Payment successful. Order placed from homepage cart.
                </p>
              )}
            </aside>
          </div>
        </section>
      )}

      {homeCart.length > 0 && !isHomeCheckoutVisible && (
        <div className="sticky-payment-bar">
          <div>
            <span>{homeCartCount} items</span>
            <strong>{formatMoney(homeTotal)}</strong>
          </div>
          <button type="button" onClick={goToHomeCheckout}>
            Proceed to payment
          </button>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          primaryActionLabel={selectedProduct.sizes ? 'Add to cart' : `Shop ${selectedProduct.regionName}`}
          onClose={() => setSelectedProduct(null)}
          onPrimaryAction={() => {
            if (selectedProduct.sizes) {
              addHomeCart(selectedProduct, selectedSize)
            } else {
              onSelect(selectedProduct.regionKey!)
            }
            setSelectedProduct(null)
          }}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
        />
      )}
    </main>
  )
}

function AdminPanel({
  regions,
  onSave,
  onGoHome,
  onLogout,
}: {
  regions: Record<RegionKey, Region>
  onSave: (regions: Record<RegionKey, Region>) => void
  onGoHome: () => void
  onLogout: () => void
}) {
  const [activeRegion, setActiveRegion] = useState<RegionKey>('rajasthan')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    detail: '',
    price: 0,
    category: 'Fashion',
    badge: '',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  })

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct)
      return
    }

    setFormData({
      id: '',
      name: '',
      detail: '',
      price: 0,
      category: 'Fashion',
      badge: '',
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    })
  }, [activeRegion, editingProduct])

  const region = regions[activeRegion]

  const updateFormField = (field: keyof Product, value: string) => {
    setFormData((current) => {
      if (field === 'price') {
        return { ...current, price: Number(value) }
      }
      if (field === 'sizes') {
        return {
          ...current,
          sizes: value.split(',').map((size) => size.trim()).filter(Boolean),
        }
      }
      return { ...current, [field]: value }
    })
  }

  const saveProduct = () => {
    const normalizedName = formData.name.trim()
    if (!normalizedName) return

    const newId =
      formData.id ||
      `${activeRegion}-${normalizedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
    const updatedProduct: Product = {
      ...formData,
      id: newId,
      sizes: formData.sizes && formData.sizes.length ? formData.sizes : ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    }

    const updatedProducts = region.products.some((item) => item.id === newId)
      ? region.products.map((item) => (item.id === newId ? updatedProduct : item))
      : [...region.products, updatedProduct]

    onSave({
      ...regions,
      [activeRegion]: {
        ...region,
        products: updatedProducts,
      },
    })
    setEditingProduct(null)
  }

  const deleteProduct = (productId: string) => {
    const updatedProducts = region.products.filter((item) => item.id !== productId)
    onSave({
      ...regions,
      [activeRegion]: {
        ...region,
        products: updatedProducts,
      },
    })
    if (editingProduct?.id === productId) {
      setEditingProduct(null)
    }
  }

  return (
    <main className="admin-shell">
      <nav className="topbar" aria-label="Admin navigation">
        <strong>DeshKart Admin</strong>
        <div className="home-nav">
          <button type="button" onClick={onGoHome}>
            Home
          </button>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
          <button type="button" onClick={() => setActiveRegion('rajasthan')}>
            Rajasthan
          </button>
          <button type="button" onClick={() => setActiveRegion('west-bengal')}>
            West Bengal
          </button>
        </div>
      </nav>

      <section className="admin-hero">
        <div className="section-heading">
          <p className="eyebrow">Admin dashboard</p>
          <h2>Manage {region.name} products</h2>
        </div>
        <div className="admin-actions-bar">
          <button type="button" onClick={() => setEditingProduct(null)}>
            Add new product
          </button>
        </div>
      </section>

      <div className="admin-layout">
        <section className="admin-form-panel">
          <div className="section-heading">
            <p className="eyebrow">Product details</p>
            <h2>{editingProduct ? 'Edit product' : 'Create product'}</h2>
          </div>
          <div className="admin-form">
            <label>
              Name
              <input
                value={formData.name}
                onChange={(event) => updateFormField('name', event.target.value)}
              />
            </label>
            <label>
              Badge
              <input
                value={formData.badge}
                onChange={(event) => updateFormField('badge', event.target.value)}
              />
            </label>
            <label>
              Category
              <input
                value={formData.category}
                onChange={(event) => updateFormField('category', event.target.value)}
              />
            </label>
            <label>
              Price
              <input
                type="number"
                value={formData.price}
                onChange={(event) => updateFormField('price', event.target.value)}
              />
            </label>
            <label>
              Detail
              <textarea
                value={formData.detail}
                onChange={(event) => updateFormField('detail', event.target.value)}
              />
            </label>
            <label>
              Sizes
              <input
                value={(formData.sizes ?? []).join(', ')}
                onChange={(event) => updateFormField('sizes', event.target.value)}
                placeholder="S, M, L, XL, XXL, XXXL"
              />
            </label>
            <div className="admin-form-actions">
              <button type="button" onClick={saveProduct}>
                Save product
              </button>
              <button type="button" onClick={() => setEditingProduct(null)}>
                Reset form
              </button>
            </div>
          </div>
        </section>

        <section className="admin-product-list">
          <div className="section-heading">
            <p className="eyebrow">Product catalog</p>
            <h2>{region.products.length} items</h2>
          </div>
          <div className="admin-grid">
            {region.products.map((product) => (
              <article className="admin-card" key={product.id}>
                <div className="admin-card-header">
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                </div>
                <p>{product.detail}</p>
                <div className="admin-card-meta">
                  <span>{product.badge}</span>
                  <span>{product.sizes?.join(', ')}</span>
                  <span>{formatMoney(product.price)}</span>
                </div>
                <div className="admin-card-actions">
                  <button type="button" onClick={() => setEditingProduct(product)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function AdminLogin({
  onLogin,
  onGoHome,
}: {
  onLogin: (password: string) => boolean
  onGoHome: () => void
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!onLogin(password)) {
      setError('Incorrect password. Try again.')
      return
    }
    setError('')
  }

  return (
    <main className="admin-login-shell">
      <nav className="topbar" aria-label="Admin login navigation">
        <strong>DeshKart Admin</strong>
        <div className="home-nav">
          <button type="button" onClick={onGoHome}>
            Home
          </button>
        </div>
      </nav>
      <section className="admin-login-panel">
        <div className="section-heading">
          <p className="eyebrow">Admin sign in</p>
          <h2>Authorized users only</h2>
        </div>
        <div className="admin-form">
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <div className="admin-form-actions">
            <button type="button" onClick={submit}>
              Sign in
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

function Storefront({
  region,
  onSelectRegion,
  onGoHome,
}: {
  region: Region
  onSelectRegion: (region: RegionKey) => void
  onGoHome: () => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<CartLine[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [checkoutError, setCheckoutError] = useState('')
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    address: '',
  })

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(region.products.map((item) => item.category)))],
    [region.products],
  )

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase()
    return region.products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesSearch =
        !search ||
        [product.name, product.detail, product.category, product.badge]
          .join(' ')
          .toLowerCase()
          .includes(search)
      return matchesCategory && matchesSearch
    })
  }, [category, query, region.products])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal > 1999 || subtotal === 0 ? 0 : 99
  const total = subtotal + delivery
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product as SelectedProduct)
    setSelectedSize(product.sizes?.[0] || '')
  }

  const addToCart = (product: Product, size?: string) => {
    setOrderPlaced(false)
    setPaymentStatus('idle')
    setCheckoutError('')
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id && line.size === size)
      if (existing) {
        return current.map((line) =>
          line.id === product.id && line.size === size ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }
      return [...current, { ...product, quantity: 1, size }]
    })
  }

  const changeQuantity = (id: string, quantity: number) => {
    setPaymentStatus('idle')
    setCheckoutError('')
    setCart((current) =>
      current
        .map((line) => (line.id === id ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    )
  }

  const placeOrder = () => {
    if (!cart.length) {
      setCheckoutError('Add at least one product before placing the order.')
      return
    }

    if (!customer.name.trim() || customer.mobile.trim().length < 10 || !customer.address.trim()) {
      setCheckoutError('Enter customer name, 10 digit mobile number, and delivery address.')
      return
    }

    setCheckoutError('')
    setOrderPlaced(false)
    setPaymentStatus('processing')

    window.setTimeout(() => {
      setPaymentStatus('success')
      setOrderPlaced(true)
    }, 900)
  }

  return (
    <main className={`storefront ${region.accent}`}>
      <nav className="store-nav" aria-label={`${region.name} store navigation`}>
        <button className="brand-button" type="button" onClick={onGoHome}>
          DeshKart
        </button>
        <div className="nav-actions">
          <button type="button" onClick={onGoHome}>
            Home
          </button>
          <a href="#products">Products</a>
          <a href="#checkout">Checkout</a>
          <select
            aria-label="Select shopping state"
            value={region.key}
            onChange={(event) => onSelectRegion(event.target.value as RegionKey)}
          >
            <option value="rajasthan">Rajasthan</option>
            <option value="west-bengal">West Bengal</option>
          </select>
        </div>
      </nav>

      <section className="store-hero">
        <div>
          <p className="eyebrow">{region.name} collection</p>
          <h1>{region.tagline}</h1>
          <p>{region.hero}</p>
          <div className="hero-actions">
            <a href="#products">Shop products</a>
            <a href="#checkout">Cart: {itemCount}</a>
          </div>
        </div>
        <div className="culture-panel" aria-label={`${region.name} cultural theme`}>
          <span>{region.short}</span>
          <strong>{region.name}</strong>
        </div>
      </section>

      <section className="collections-band" id="collections">
        {region.collections.map((collection) => (
          <article key={collection}>
            <span />
            <h2>{collection}</h2>
          </article>
        ))}
      </section>

      <section className="shop-layout" id="products">
        <div className="catalog-area">
          <div className="section-heading">
            <p className="eyebrow">Featured today</p>
            <h2>Local products for {region.name}</h2>
          </div>

          <div className="shop-tools" role="search">
            <label className="search-box">
              <span>Search</span>
              <input
                type="search"
                placeholder="Search saree, pottery, jewellery..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="filter-tabs" aria-label="Product categories">
              {categories.map((item) => (
                <button
                  className={item === category ? 'active' : ''}
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <button
                  className="product-art detail-trigger"
                  type="button"
                  onClick={() => openProductDetails(product)}
                >
                  <span>{product.badge}</span>
                </button>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.detail}</p>
                </div>
                <strong>{formatMoney(product.price)}</strong>
                <div className="product-actions">
                  <button type="button" onClick={() => openProductDetails(product)}>
                    Details
                  </button>
                  <button type="button" onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>

          {!filteredProducts.length && (
            <p className="empty-state">No products found. Try another search.</p>
          )}
        </div>

        <aside className="checkout-panel" id="checkout">
          <div className="cart-header">
            <div>
              <p className="eyebrow">Secure checkout</p>
              <h2>Your cart</h2>
            </div>
            <strong>{itemCount} items</strong>
          </div>

          <div className="cart-lines">
            {cart.length ? (
              cart.map((item) => (
                <div className="cart-line" key={`${item.id}-${item.size ?? 'default'}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatMoney(item.price)}</span>
                  </div>
                  <div className="qty-stepper" aria-label={`${item.name} quantity`}>
                    <button type="button" onClick={() => changeQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Cart is empty. Add products to begin checkout.</p>
            )}
          </div>

          <form className="checkout-form">
            <label>
              Full name
              <input
                placeholder="Customer name"
                value={customer.name}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, name: event.target.value }))
                }
              />
            </label>
            <label>
              Mobile number
              <input
                inputMode="numeric"
                placeholder="10 digit number"
                value={customer.mobile}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, mobile: event.target.value }))
                }
              />
            </label>
            <label>
              Delivery address
              <textarea
                placeholder={`House no, area, city, ${region.name}`}
                rows={3}
                value={customer.address}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, address: event.target.value }))
                }
              />
            </label>
          </form>

          <div className={`payment-box gateway-card ${paymentMethod}`}>
            <div className="gateway-heading">
              <div>
                <p className="eyebrow">Payment gateway</p>
                <h3>{region.name} secure payment</h3>
              </div>
              <span>{paymentStatus === 'processing' ? 'Processing' : 'Ready'}</span>
            </div>
            <div className="payment-options">
              {[
                { id: 'upi', label: 'UPI' },
                { id: 'card', label: 'Card' },
                { id: 'cod', label: 'COD' },
              ].map((method) => (
                <button
                  className={paymentMethod === method.id ? 'active' : ''}
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(method.id as PaymentMethod)
                    setPaymentStatus('idle')
                    setCheckoutError('')
                  }}
                >
                  {method.label}
                  {paymentMethod === method.id && <span>Selected</span>}
                </button>
              ))}
            </div>
            <PaymentFields method={paymentMethod} />
            <div className="gateway-note">
              {paymentMethod === 'upi' && 'Customer can pay using UPI ID or QR scan.'}
              {paymentMethod === 'card' && 'Card details are for demo UI only; no live charge is made.'}
              {paymentMethod === 'cod' && 'Cash will be collected at delivery.'}
            </div>
          </div>

          <div className="order-summary">
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{delivery ? formatMoney(delivery) : 'Free'}</strong>
            </div>
            <div className="grand-total">
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>
          </div>

          <button
            className="place-order"
            disabled={paymentStatus === 'processing' || !cart.length}
            type="button"
            onClick={placeOrder}
          >
            {paymentStatus === 'processing'
              ? 'Processing payment...'
              : `Pay & place order ${formatMoney(total)}`}
          </button>
          {checkoutError && <p className="error-message">{checkoutError}</p>}
          {orderPlaced && (
            <p className="success-message">
              Payment successful. {region.name} order confirmed.
            </p>
          )}
        </aside>
      </section>

      {selectedProduct && (
        <ProductDetailsModal
          product={{ ...selectedProduct, regionName: region.name, accent: region.accent }}
          primaryActionLabel="Add to cart"
          onClose={() => setSelectedProduct(null)}
          onPrimaryAction={() => {
            addToCart(selectedProduct, selectedSize)
            setSelectedProduct(null)
          }}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
        />
      )}
    </main>
  )
}

function ProductDetailsModal({
  product,
  primaryActionLabel,
  onClose,
  onPrimaryAction,
  selectedSize,
  onSizeChange,
}: {
  product: SelectedProduct
  primaryActionLabel: string
  onClose: () => void
  onPrimaryAction: () => void
  selectedSize?: string
  onSizeChange?: (size: string) => void
}) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className={`product-modal ${product.accent ?? ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close details" onClick={onClose}>
          ×
        </button>
        <div className="modal-art">
          <span>{product.badge}</span>
        </div>
        <div className="modal-copy">
          <p className="eyebrow">{product.regionName ?? product.category}</p>
          <h2 id="product-modal-title">{product.name}</h2>
          <p>{product.detail}</p>
          <dl>
            <div>
              <dt>Category</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{formatMoney(product.price)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>Fast regional dispatch with secure packaging</dd>
            </div>
          </dl>
          {product.sizes && onSizeChange && (
            <div className="size-selector">
              <dt>Size</dt>
              <dd>
                <select
                  value={selectedSize}
                  onChange={(e) => onSizeChange(e.target.value)}
                  aria-label="Select size"
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </button>
            <button type="button" onClick={onClose}>
              Continue browsing
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PaymentFields({ method }: { method: PaymentMethod }) {
  if (method === 'upi') {
    return (
      <div className="upi-fields">
        <input placeholder="name@upi" aria-label="UPI ID" />
        <div className="qr-demo" aria-label="Demo QR code">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (method === 'card') {
    return (
      <div className="card-fields">
        <input inputMode="numeric" placeholder="Card number" aria-label="Card number" />
        <input inputMode="numeric" placeholder="MM/YY" aria-label="Card expiry" />
        <input inputMode="numeric" placeholder="CVV" aria-label="Card CVV" />
      </div>
    )
  }

  return <p className="cod-note">Pay in cash when the order reaches the customer.</p>
}

export default App
