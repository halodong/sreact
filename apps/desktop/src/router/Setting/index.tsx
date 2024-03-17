import classNames from 'classnames'
import type { ReactNode } from 'react'
import { memo, useEffect, useState } from 'react'
import SettingGroup from './component/SettingGroup'
import { Container } from './styles'
import type { SettingData } from '@/router/Setting/settingMap'
import settingMap from '@/router/Setting/settingMap'
import Logo from '@/assets/logo.svg?react'
import { invoke } from '@tauri-apps/api/core'
import { KeyboardTable } from './KeyboardTable'
import { CopyButton } from '@/components/UI/Button'
import { Button } from 'zens'
import useAppInfoStore from '@/stores/useAppInfoStore'
import type { Update } from '@tauri-apps/plugin-updater'
import { check } from '@tauri-apps/plugin-updater'
import { installUpdate } from '@/helper/updater'
import { useTranslation } from 'react-i18next'

export interface DialogTitleProps {
  children?: ReactNode
  onClose: () => void
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

function isSettingGroup(group: Setting.SettingGroup | Setting.SettingItem): group is Setting.SettingGroup {
  return typeof group === 'object'
}

function Setting() {
  const [value, setValue] = useState(0)
  const [confPath, setConfPath] = useState('')
  const { appInfo } = useAppInfoStore()
  const { t } = useTranslation()
  const [update, setUpdate] = useState<Update | null>(null)
  const settingDataGroupsKeys = Object.keys(settingMap).filter(
    (key) => key !== 'i18nKey',
  ) as (keyof typeof settingMap)[]
  const curGroupKey = settingDataGroupsKeys[value] as Exclude<keyof SettingData, 'i18nKey'>
  const curGroup = settingMap[curGroupKey] as Setting.SettingGroup
  const curGroupKeys = Object.keys(curGroup).filter((key) => key !== 'i18nKey')as Exclude<keyof SettingData, 'i18nKey'>[]

  useEffect(() => {
    check().then((u) => {
      setUpdate(u)
    })
    invoke('get_app_conf_path').then((res: unknown) => {
      setConfPath(res as string)
    })
  }, [])

  const renderCurrentSettingData = () => {
    if (curGroupKey === 'keyboard') {
      return <KeyboardTable />
    }

    return curGroupKeys.map((key) => {
      const group = curGroup[key]
      if (isSettingGroup(group)) {
        return <SettingGroup key={key} group={group} groupKey={key} categoryKey={curGroupKey} />
      }
    })
  }

  return (
    <Container>
      <div id='sidebar'>
        <div className='sidebar-title'>
          <Logo />
        </div>
        {/* TODO search */}
        {/* <div id="search-form" role="search">
          <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
        </div> */}
        <nav>
          <ul>
            {settingDataGroupsKeys.map((groupKey, index) => {
              const group = settingMap[groupKey] as Setting.SettingGroup
              return (
                <li
                  key={groupKey}
                  className={classNames({
                    active: index === value,
                  })}
                  {...a11yProps(index)}
                  onClick={() => {
                    setValue(index)
                  }}
                >
                  {t(group.i18nKey)}
                </li>
              )
            })}
          </ul>
        </nav>
        <div className='sidebar-version__container'>
          <span>
            {t('about.version')}: {appInfo.version}
          </span>
          {update ? (
            <Button
              size='small'
              btnType='primary'
              onClick={() => {
                installUpdate(update)
                setUpdate(null)
              }}
            >
              {t('about.install')}
              {t('about.newVersion')}: {update.version}
            </Button>
          ) : null}
        </div>
      </div>
      <div id='detail'>
        <div className='conf-path'>
          <small>
            Path: {confPath} <CopyButton text={confPath} />
          </small>
        </div>
        {renderCurrentSettingData()}
      </div>
    </Container>
  )
}

export default memo(Setting)
