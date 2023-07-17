import { BaseStyle } from '@linebyline/editor'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { invoke } from '@tauri-apps/api'
import { emit, listen } from '@tauri-apps/api/event'
import type { Theme } from '@tauri-apps/api/window'
import { useCallback, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './globalStyles'
import { useGlobalSettingData, useGlobalTheme } from './hooks'
import useGlobalOSInfo from './hooks/useOSInfo'
import { i18nInit } from './i18n'
import { Root, Setting } from '@/router'
import { loadTask, use } from '@/helper/schedule'
import { CacheManager } from '@/helper'

function App() {
  useGlobalOSInfo()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, handler] = useGlobalSettingData()
  const { themeColors, muiTheme, setTheme } = useGlobalTheme()
  const { setSetting } = handler
  const isWeb = (window as any).__TAURI_IPC__ === undefined

  // TODO web need return a editor
  if (!isWeb) {
    use(
      loadTask(
        'confInit',
        () =>
          new Promise((resolve) => {
            invoke<Record<string, any>>('get_app_conf').then((res) => {
              console.log('conf', res)
              setSetting(res)
              setTheme(res.theme)
              i18nInit({ lng: res.language })
              resolve(res)
            })
          }),
      ),
    )
    use(loadTask('cache', () => CacheManager.init()))
  }

  useEffect(() => {
    if (isWeb) return
    const unlisten = eventInit()
    // updaterinit()

    return () => {
      unlisten()
    }
  }, [isWeb])

  const eventInit = useCallback(() => {
    const unListenMenu =  listen<string>('native:menu', ({ payload }) => {
      // TODO Refactor: use a eventemitter in pure web runtime
      emit(payload)
    })

    const unListenChangeTheme = listen('change_theme', ({ payload }) => {
      setTheme(payload as Theme)
    })

    return () => {
      unListenChangeTheme.then((fn) => fn())
      unListenMenu.then((fn) => fn())
    }
  }, [setTheme])

  // const updaterinit = useCallback(async () => {
  //   // TODO 更新默认的 setting
  //   const update = await checkUpdate()
  //   if (update.shouldUpdate)
  //     await installUpdate()
  // }, [])

  return (
    <ThemeProvider theme={themeColors}>
      <MuiThemeProvider theme={muiTheme}>
        <GlobalStyles />
        <BaseStyle />
        <Routes>
          <Route index path="/" element={<Root />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </MuiThemeProvider>
    </ThemeProvider>
  )
}

export default App
