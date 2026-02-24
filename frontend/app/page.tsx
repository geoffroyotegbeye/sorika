'use client';

import { Globe, ShoppingCart, FileText, MessageCircle, Users, TrendingUp, Store, Calendar, Calculator, Receipt, Package, Factory, UserCheck, Target, Mail, Smartphone } from 'lucide-react';

export default function HomePage() {
  const apps = [
    { icon: Globe, name: "Site Web", desc: "Créez votre vitrine en ligne en quelques clics", color: "from-blue-500 to-blue-600" },
    { icon: ShoppingCart, name: "eCommerce", desc: "Vendez 24/7 et boostez votre chiffre d'affaires", color: "from-sky-500 to-blue-500" },
    { icon: FileText, name: "Blog", desc: "Partagez votre expertise et attirez des clients", color: "from-slate-500 to-slate-600" },
    { icon: MessageCircle, name: "Live Chat", desc: "Convertissez vos visiteurs en clients", color: "from-cyan-500 to-blue-500" },
    { icon: Users, name: "CRM", desc: "Ne perdez plus aucune opportunité", color: "from-indigo-500 to-blue-600" },
    { icon: TrendingUp, name: "Ventes", desc: "Gérez vos devis et factures en un clin d'œil", color: "from-blue-600 to-indigo-600" },
    { icon: Store, name: "Point de Vente", desc: "Encaissez rapidement et simplement", color: "from-slate-600 to-slate-700" },
    { icon: Calendar, name: "Abonnements", desc: "Automatisez vos revenus récurrents", color: "from-sky-600 to-blue-600" },
    { icon: Calculator, name: "Comptabilité", desc: "Gardez vos finances sous contrôle", color: "from-slate-500 to-slate-600" },
    { icon: Receipt, name: "Facturation", desc: "Facturez pro et soyez payé plus vite", color: "from-blue-500 to-blue-700" },
    { icon: Package, name: "Inventaire", desc: "Suivez votre stock en temps réel", color: "from-slate-600 to-blue-700" },
    { icon: Factory, name: "Fabrication", desc: "Optimisez votre production", color: "from-gray-600 to-slate-700" },
    { icon: UserCheck, name: "Employés", desc: "Centralisez les infos de votre équipe", color: "from-blue-600 to-indigo-600" },
    { icon: Target, name: "Recrutement", desc: "Trouvez les meilleurs talents", color: "from-indigo-600 to-blue-700" },
    { icon: Mail, name: "Email Marketing", desc: "Fidélisez et engagez vos clients", color: "from-sky-500 to-blue-600" },
    { icon: Smartphone, name: "SMS Marketing", desc: "Touchez vos clients instantanément", color: "from-cyan-600 to-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-[family-name:var(--font-nunito)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-nunito)] bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                Sorika
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#apps" className="text-slate-600 hover:text-slate-900 transition font-medium">
                Applications
              </a>
              <a href="/login" className="text-slate-600 hover:text-slate-900 transition font-medium">
                Connexion
              </a>
              <a 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Lancez-vous
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative elements - couleurs froides */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight font-[family-name:var(--font-caveat)]">
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-slate-700 bg-clip-text text-transparent">
                Tout votre business
              </span>
              <br />
              <span className="text-slate-800">
                sur une plateforme
              </span>
            </h1>
            
            <p className="text-2xl text-slate-600 mb-4 font-medium">
              Simple, efficace, et abordable !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="/register" 
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Lancez-vous - C'est gratuit
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a 
                href="#contact" 
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-full text-lg font-bold hover:border-blue-600 hover:text-blue-600 hover:shadow-lg transition-all"
              >
                Rencontrer un conseiller
              </a>
            </div>

            {/* Floating badges */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-4 py-2 bg-white rounded-full shadow-md border border-slate-200 text-slate-600">
                ✨ Sans carte bancaire
              </span>
              <span className="px-4 py-2 bg-white rounded-full shadow-md border border-slate-200 text-slate-600">
                🚀 Démarrage en 5 min
              </span>
              <span className="px-4 py-2 bg-white rounded-full shadow-md border border-slate-200 text-slate-600">
                💯 500+ entreprises
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Apps Section */}
      <section id="apps" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 font-[family-name:var(--font-caveat)] bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
              Un besoin, une app
            </h2>
            <p className="text-xl text-slate-600">
              Choisissez les applications dont vous avez besoin
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {apps.map((app, index) => {
              const Icon = app.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white rounded-xl p-5 border-2 border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer text-center"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
                  
                  <div className="relative flex flex-col items-center">
                    <div className={`mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${app.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}
                      style={{ 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        transform: 'perspective(1000px) rotateX(0deg)'
                      }}
                    >
                      <Icon className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-slate-700 transition">
                      {app.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-snug">
                      {app.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-500 mb-6">Et bien plus encore...</p>
            <a 
              href="/register" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
            >
              Découvrir toutes les apps
            </a>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-5xl font-bold mb-6 font-[family-name:var(--font-caveat)] text-slate-800">
                  Libérez votre potentiel de croissance
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  Toute la technologie en une seule plateforme. Un logiciel d'entreprise bien conçu.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">Hautement personnalisable</h3>
                      <p className="text-slate-600">Automatisez des actions, concevez des écrans personnalisés</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">Tout-en-un</h3>
                      <p className="text-slate-600">Plus besoin de jongler entre plusieurs outils</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">Support dédié</h3>
                      <p className="text-slate-600">Une équipe à votre écoute pour vous accompagner</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-slate-600 rounded-3xl blur-2xl opacity-20" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl" />
                      <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl" />
                    </div>
                    <div className="h-24 bg-gradient-to-br from-sky-100 to-blue-200 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-sky-600 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white font-[family-name:var(--font-caveat)]">
              Améliorez la qualité de votre travail
            </h2>
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Rejoignez des centaines d'entreprises qui ont transformé leur activité
            </p>
            <a 
              href="/register" 
              className="inline-block px-10 py-5 bg-white text-blue-600 rounded-full text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Lancez-vous - C'est gratuit !
            </a>
            <p className="text-white/80 text-sm mt-6">
              ✨ Aucune carte bancaire requise • Annulation à tout moment
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl font-bold font-[family-name:var(--font-nunito)]">Sorika</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                La plateforme tout-en-un pour digitaliser votre entreprise en Afrique.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Produit</h4>
              <ul className="space-y-3">
                <li><a href="#apps" className="text-slate-400 hover:text-white transition">Applications</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Démo</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Entreprise</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition">À propos</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Centre d'aide</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Communauté</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400">
              © 2026 Sorika. Fait avec ❤️ au Bénin.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
