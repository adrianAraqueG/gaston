import { Link } from 'react-router-dom';
import { 
  FaMoneyBillWave, 
  FaChartBar, 
  FaMobileAlt, 
  FaArrowRight,
  FaWhatsapp,
  FaTag,
  FaBriefcase
} from 'react-icons/fa';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-indigo-600 mb-4">
            Gastón
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
            Tu asistente inteligente para gestionar gastos
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Registra tus gastos e ingresos desde WhatsApp de forma rápida y sencilla. 
            Visualiza todo en una aplicación web moderna y completa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3 text-base sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Iniciar Sesión
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
          Características
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 rounded-full p-4">
                <FaWhatsapp className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Registra gastos e ingresos directamente desde WhatsApp. Envía mensajes de texto o notas de voz.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <FaMoneyBillWave className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Gastos e Ingresos</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Gestiona tanto tus gastos como tus ingresos. Visualiza el balance en tiempo real.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 rounded-full p-4">
                <FaChartBar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resúmenes</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Obtén resúmenes mensuales de tus gastos e ingresos. Analiza tus finanzas fácilmente.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-4">
                <FaTag className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Categorías</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Organiza tus transacciones con categorías personalizables. Crea y gestiona tus propias categorías.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 rounded-full p-4">
                <FaBriefcase className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bolsillos</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Organiza tu dinero en bolsillos. Asigna gastos a diferentes bolsillos para mejor control.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-100 rounded-full p-4">
                <FaMobileAlt className="h-8 w-8 text-teal-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aplicación Web</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Accede desde cualquier dispositivo. Interfaz responsive optimizada para móviles y tablets.
            </p>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-full font-bold text-lg sm:text-xl">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Regístrate desde WhatsApp
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Inicia una conversación con Gastón en WhatsApp. El bot te guiará en el proceso de registro.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-full font-bold text-lg sm:text-xl">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Registra tus transacciones
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Envía mensajes como "Almuerzo 15000" o "ingreso salario 2000000". Gastón entenderá y registrará automáticamente.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-full font-bold text-lg sm:text-xl">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Visualiza en la web
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Accede a la aplicación web para ver todos tus gastos e ingresos, generar resúmenes y gestionar categorías.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-indigo-600 rounded-lg shadow-lg p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-indigo-100 mb-6 sm:mb-8 text-base sm:text-lg">
            Inicia sesión o regístrate desde WhatsApp para comenzar a gestionar tus finanzas.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base sm:text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
          >
            Iniciar Sesión
            <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

