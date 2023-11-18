import { Fragment, useMemo, type JSX, type PropsWithChildren } from "react"
import { useServerInsertedHTML } from "next/navigation"
import createCache from "@emotion/cache"
import type {
  EmotionCache,
  Options as OptionsOfCreateCache,
} from "@emotion/cache"
import { CacheProvider as DefaultCacheProvider } from "@emotion/react"

type GlobalStyles = {
  name: string
  style: string
}

type CacheProviderProps = PropsWithChildren & {
  value: EmotionCache
}

export type NextAppDirEmotionCacheProviderProps = PropsWithChildren & {
  options: Omit<OptionsOfCreateCache, "insertionPoint">
  CacheProvider?: (props: CacheProviderProps) => JSX.Element | null
}

export default function NextAppDirEmotionCacheProvider(
  props: NextAppDirEmotionCacheProviderProps
) {
  const { options, CacheProvider = DefaultCacheProvider, children } = props

  const registry = useMemo(() => {
    const cache = createCache(options)

    cache.compat = true

    const prevInsert = cache.insert

    let inserted: { name: string; isGlobal: boolean }[] = []

    cache.insert = (...args) => {
      const [selector, serialized] = args

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: !selector,
        })
      }

      return prevInsert(...args)
    }

    const flush = () => {
      const prevInserted = inserted

      inserted = []

      return prevInserted
    }

    return { cache, flush }
  }, [options])

  useServerInsertedHTML(() => {
    const inserted = registry.flush()

    if (inserted.length === 0) return null

    let styles = ""

    let dataEmotionAttribute = registry.cache.key

    const globals: GlobalStyles[] = []

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name]

      if (typeof style !== "boolean") {
        if (isGlobal) globals.push({ name, style })
        else {
          styles += style
          dataEmotionAttribute += ` ${name}`
        }
      }
    })

    return (
      <Fragment>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${registry.cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}

        {styles && (
          <style
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </Fragment>
    )
  })

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>
}
