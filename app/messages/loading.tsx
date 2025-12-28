import Navbar from '../components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Mensajes Enviados</h1>
          <p className="text-gray-600">Historial de mensajes enviados a candidatos</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb6731] mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando mensajes...</p>
          </div>
        </div>
      </div>
    </>
  );
}

