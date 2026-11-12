import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, ShieldCheck, Search, Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    settings,
    cartCount,
    setIsCartOpen,
    setActiveView,
    activeView,
    openCategoryView,
    searchQuery,
    setSearchQuery,
    isAdminAuthenticated,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = (view: string, categorySlug?: string) => {
    if (categorySlug) {
      openCategoryView(categorySlug);
    } else {
      setActiveView(view);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop All', view: 'shop' },
    { label: 'Washing Wear', view: 'shop', categorySlug: 'washing-wear' },
    { label: 'Pure Cotton', view: 'shop', categorySlug: 'pure-cotton' },
    { label: 'Mix Cotton', view: 'shop', categorySlug: 'mix-cotton' },
    { label: 'Premium Suits', view: 'shop', categorySlug: 'premium-unstitched-suits' },
    { label: 'About Us', view: 'about' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#15171c] border-b border-[#2a2c35] text-xs text-[#d4af37] py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3">
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
        <span className="truncate">{settings.announcementText}</span>
        <a
          href={`https://wa.me/${settings.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-white hover:text-[#d4af37] transition-colors underline font-semibold ml-2"
        >
          Chat Now
        </a>
      </div>

      {/* Main Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0d10]/95 backdrop-blur-md border-b border-[#22242c] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Zone 1: Brand Wordmark */}
            <div
              onClick={() => handleNavClick('home')}
              className="cursor-pointer flex flex-col items-start select-none group"
            >
              <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-[#d4af37] transition-colors">
                AL HAFIZ CLOTHS
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-[#d4af37] uppercase font-medium">
                Premium Fabric &middot; Karachi
              </span>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view, link.categorySlug)}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    activeView === link.view && !link.categorySlug
                      ? 'text-[#d4af37] font-semibold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Zone 3: Functional Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-neutral-300 hover:text-[#d4af37] hover:bg-[#1a1b22] rounded-full transition-colors"
                title="Search products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Direct WhatsApp Callout Button */}
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/80 rounded-lg transition-all"
                title="WhatsApp Direct Inquiry"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                <span>+92-326-2444991</span>
              </a>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-white bg-[#181a20] hover:bg-[#23252e] border border-[#2e313c] rounded-full transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-black font-bold text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Shortcut */}
              <button
                onClick={() => handleNavClick('admin')}
                className={`p-2.5 rounded-full border transition-colors ${
                  isAdminAuthenticated
                    ? 'bg-amber-950/50 border-amber-600/50 text-[#d4af37]'
                    : 'bg-[#181a20] border-[#2e313c] text-neutral-400 hover:text-white'
                }`}
                title="Admin Control Panel"
                aria-label="Admin Portal"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="bg-[#121318] border-t border-[#23252e] py-3 px-4 shadow-xl animate-fadeIn">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-[#d4af37] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search washing wear, pure cotton, unstitched suit, color..."
                className="w-full bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setActiveView('shop');
                    setIsSearchOpen(false);
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-neutral-400 hover:text-white px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => {
                  setActiveView('shop');
                  setIsSearchOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-[#d4af37] text-black rounded hover:bg-[#e6c352] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#101115] border-r border-[#22242c] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#22242c]">
                <div className="font-display font-bold text-lg text-white">
                  AL HAFIZ CLOTHS
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.view, link.categorySlug)}
                    className="w-full flex items-center justify-between py-2 text-left text-sm font-medium text-neutral-200 hover:text-[#d4af37] transition-colors border-b border-[#1b1c24]"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#22242c]">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order on WhatsApp</span>
              </a>

              <div className="text-center text-xs text-neutral-400">
                Karachi Delivery: <span className="text-[#d4af37] font-semibold">100% Free</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
