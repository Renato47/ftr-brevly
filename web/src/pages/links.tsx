import { zodResolver } from '@hookform/resolvers/zod'
import {
  Copy,
  DownloadSimple,
  Link as LinkIcon,
  Spinner,
  Trash,
} from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

import logoImg from '../assets/logo.svg'
import { Input } from '../components/Input'
import { LoadBar } from '../components/loadBar'
import { env } from '../env'
import {
  type Link,
  createLink,
  deleteLink,
  downloadLinksCsv,
  listLinks,
} from '../services/linkService'

const linkSchema = z.object({
  originalUrl: z
    .string({ message: 'Informe uma url válida.' })
    .url({ message: 'Informe uma url válida.' }),
  shortenedUrl: z.string().min(3, {
    message: 'Informe uma url minúscula e sem espaço/caracter especial.',
  }),
})

type LinkSchema = z.infer<typeof linkSchema>

export function Links() {
  const [links, setLinks] = useState<Link[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LinkSchema>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      originalUrl: '',
      shortenedUrl: '',
    },
  })

  const onSubmit = async (data: LinkSchema) => {
    setIsSubmitting(true)

    createLink(data.shortenedUrl, data.originalUrl)
      .then(data => {
        if (data) {
          reset()
          loadLinks()
        }
      })
      .catch(err => {
        if (err.response.status === 409)
          toast.error(
            <div className="flex flex-col gap-1 text-md text-danger">
              <p className="font-bold">Erro no cadastro</p>
              <p>Essa URL encurtada já existe.</p>
            </div>
          )
        else toast.error(<p className="font-bold text-md text-danger">{err}</p>)
      })
      .finally(() => setIsSubmitting(false))
  }

  const handleCopyLink = (shortenedUrl: string) => {
    navigator.clipboard.writeText(
      `http://${env.VITE_FRONTEND_URL}/${shortenedUrl}`
    )

    toast.info(
      <div className="flex flex-col gap-1 text-sm text-blue-dark">
        <p className="font-bold">Link copiado com sucesso</p>
        <p>{`O link ${shortenedUrl} foi copiado para a área de transferência.`}</p>
      </div>
    )
  }

  const handleDeleteLink = (link: Link) => {
    if (
      window.confirm(`Você realmente quer apagar o link ${link.shortenedUrl}?`)
    )
      deleteLink(link.id).then(() => loadLinks())
  }

  const handleDownloadCsv = () => {
    setIsDownloading(true)

    downloadLinksCsv().finally(() => setIsDownloading(false))
  }

  const loadLinks = async () => {
    setIsLoading(true)

    listLinks()
      .then(data => setLinks(data))
      .catch(err => alert(err))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    const handleFocus = () => {
      if (window.document.hidden) return

      setIsLoading(true)

      listLinks()
        .then(data => setLinks(data))
        .catch(err => alert(err))
        .finally(() => setIsLoading(false))
    }

    window.addEventListener('visibilitychange', handleFocus)

    setIsLoading(true)

    listLinks()
      .then(data => setLinks(data))
      .catch(err => alert(err))
      .finally(() => setIsLoading(false))

    return () => {
      window.removeEventListener('visibilitychange', handleFocus)
    }
  }, [])

  return (
    <div className="w-dvw">
      <div className="flex flex-col max-w-245 h-dvh m-auto p-3 gap-6 md:gap-8">
        <img
          src={logoImg}
          alt="brevly logo"
          className="w-24 mt-8 md:mt-22 self-center md:self-start"
        />

        <div className="flex flex-col md:flex-row gap-3 md:gap-5 overflow-hidden">
          <div className="md:w-1/2">
            <form
              className="flex flex-col p-6 md:p-8 gap-5 md:gap-6 bg-gray-100 rounded-lg"
              onSubmit={handleSubmit(onSubmit)}
            >
              <span className="text-lg text-gray-600 font-bold">Novo link</span>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <Controller
                    name="originalUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="LINK ORIGINAL"
                        placeholder="www.exemplo.com.br"
                        error={errors.originalUrl?.message}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col">
                  <Controller
                    name="shortenedUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="LINK ENCURTADO"
                        prefix="brev.ly/"
                        error={errors.shortenedUrl?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-md font-semibold p-[15px] rounded-lg bg-blue-base hover:bg-blue-dark text-white ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar link'}
              </button>
            </form>
          </div>

          <div className="flex flex-col md:grow overflow-hidden">
            <div className="flex flex-col p-6 md:p-8 gap-4 md:gap-5 rounded-lg bg-gray-100 overflow-hidden relative">
              {isLoading && <LoadBar />}

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-">Meus links</span>

                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={handleDownloadCsv}
                  className={`flex gap-1.5 text-sm font-semibold p-2 rounded bg-gray-200 text-gray-500 
                    border border-gray-200 not-disabled:hover:border-blue-base not-disabled:hover:cursor-pointer 
                    ${links.length === 0 || isDownloading ? 'opacity-50' : ''}`}
                >
                  {isDownloading ? (
                    <Spinner className="size-4 text-gray-600 animate-spin" />
                  ) : (
                    <DownloadSimple className="size-4 text-gray-600" />
                  )}
                  Baixar CSV
                </button>
              </div>

              {links.length > 0 ? (
                <div
                  className="flex flex-col overflow-auto 
                    [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-thumb]:bg-blue-dark [&::-webkit-scrollbar-track]:bg-gray-200"
                >
                  {links.map(link => (
                    <div key={link.id} className="flex flex-col gap-4 mr-1">
                      <hr className="h-px border-none bg-gray-200" />

                      <div className="flex items-center">
                        <div className="flex flex-col gap-1 mr-auto">
                          <a
                            href={`http://${env.VITE_FRONTEND_URL}/${link.shortenedUrl}`}
                            className="text-md text-blue-base font-semibold"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {`${env.VITE_FRONTEND_URL}/${link.shortenedUrl}`}
                          </a>

                          <span className="text-sm text-gray-500">
                            {link.originalUrl}
                          </span>
                        </div>

                        <span className="text-sm mr-5 text-gray-500">
                          {link.accessCount} acessos
                        </span>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            className="flex size-8 rounded-sm bg-gray-200 items-center justify-center 
                            hover:border hover:border-blue-base hover:cursor-pointer"
                          >
                            <Copy
                              onClick={() => handleCopyLink(link.shortenedUrl)}
                              className="size-4"
                            />
                          </button>

                          <button
                            type="button"
                            className="flex size-8 rounded-sm bg-gray-200 items-center justify-center 
                            hover:border hover:border-blue-base hover:cursor-pointer"
                            onClick={() => handleDeleteLink(link)}
                          >
                            <Trash className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <hr className="h-px border-none bg-gray-200" />

                  <div className="flex flex-col gap-4 items-center">
                    {isLoading ? (
                      <>
                        <Spinner className="mt-4 size-8 text-gray-400 animate-spin" />

                        <span className="uppercase mb-6 text-xs text-gray-500">
                          carregando links...
                        </span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mt-4 size-8 text-gray-400" />

                        <span className="uppercase mb-6 text-xs text-gray-500">
                          ainda não existem links cadastrados
                        </span>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
