import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import logoIcon from '../assets/logo-icon.svg'
import { type Link, getUrl, increaseAccess } from '../services/linkService'

export function Redirect() {
  const { urlEncurtada } = useParams()
  const [link, setLink] = useState<Link | null>(null)

  useEffect(() => {
    if (urlEncurtada)
      getUrl(urlEncurtada)
        .then(data => {
          setLink(data)

          if (data)
            setTimeout(() => {
              increaseAccess(data.id)
              window.location.href = data.originalUrl
            }, 1500)
        })
        .catch(_ => {
          window.location.href = './url/notfound'
        })
  }, [urlEncurtada])

  return (
    <div className="flex flex-col h-full w-dvw p-3 justify-center">
      <div className="flex flex-col m-auto max-w-145 px-5 md:px-12 py-12 md:py-16 gap-6 items-center rounded-lg bg-gray-100">
        <img src={logoIcon} alt="logo brevly" className="size-12" />

        <span className="text-xl font-bold text-center text-gray-600">
          Redirecionando...
        </span>

        <div className="flex flex-col gap-1">
          <span className="text-md font-semibold text-center text-gray-500">
            O link será aberto automaticamente em alguns instantes.
          </span>

          <span className="text-md font-semibold text-center text-gray-500">
            Não foi redirecionado?{' '}
            <a
              href={link?.originalUrl}
              className="font-semibold text-blue-base underline"
            >
              Acesse aqui
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}
