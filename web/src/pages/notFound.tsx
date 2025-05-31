import img404 from '../assets/404.svg'

export function NotFound() {
  return (
    <div className="flex flex-col h-full w-dvw p-3 justify-center">
      <div className="flex flex-col m-auto max-w-145 px-5 md:px-12 py-12 md:py-16 gap-6 items-center rounded-lg bg-gray-100">
        <img src={img404} alt="404 logo" className="w-41 md:w-48" />

        <span className="text-xl font-bold text-center text-gray-600">
          Link não encontrado
        </span>

        <span className="text-md font-semibold text-center text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{' '}
          <a href="/" className="font-semibold text-blue-base underline">
            brev.ly
          </a>
          .
        </span>
      </div>
    </div>
  )
}
