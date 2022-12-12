import { Input, Modal, Select, Switch } from 'antd'
import { useState } from 'react'
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { CarbonSetting } from '../icon/setting'
import { jsdelivrLink } from '../../utils/constant'
import { getUuid } from '../../utils'
import type React from 'react'
import type { ISetting } from '../../play.config'
export interface ICDNItems {
  label: string
  key: string
  value: string
}
interface HeaderSettingProps {
  config: ISetting
  handleSelectCDN: Function
  cdnList: Array<ICDNItems>
}

export const HeaderSetting = (props: HeaderSettingProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  /** *************** handle Switch change(ssr/dev) *****************************/
  const [isDev, setDev] = useState(false)
  const [isSSR, setSSR] = useState(true)
  const onSwitchChange = (value: boolean, type: string) => {
    if (type === 'ssr')
      setDev(value)
    else
      setSSR(value)
  }

  /** ************************* CDN **********************************/
  const [cdn, setCDN] = useState({
    value: jsdelivrLink,
    type: 'jsdelivr',
  })
  const handleCDNSelect = (value: string, option: ICDNItems | Array<ICDNItems>) => {
    let optionInner = option
    if (!Array.isArray(optionInner)) optionInner = [optionInner]
    setCDN({
      value,
      type: optionInner[0].label,
    })
  }

  /** *************** handle deps list *****************************/
  const [depsList, setDepsList] = useState([
    {
      cdnLink: 'www.github.com',
      pkgName: 'unocss',
      key: getUuid(),
    },
    {
      cdnLink: 'www.tailwindcss.com',
      pkgName: 'tailwindcss',
      key: getUuid(),
    },
    {
      cdnLink: 'www.windicss.com',
      pkgName: 'windicss',
      key: getUuid(),
    },

  ])
  function addDepsListItem() {
    setDepsList([...depsList, {
      cdnLink: '',
      pkgName: '',
      key: getUuid(),
    }])
  }
  function delDepsListItem(index: number) {
    const depsListInner = depsList
    depsListInner.splice(index, 1)
    setDepsList([...depsListInner])
  }
  function handleCDNInput(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    key: string) {
    const indexDeps = depsList[index]
    if (key === 'name')
      indexDeps.pkgName = e.target.value
    else
      indexDeps.cdnLink = e.target.value

    const depsListInner = depsList
    depsListInner[index] = indexDeps
    setDepsList([...depsListInner])
  }
  function DepsList() {
    return depsList.map((val, index) => {
      return (
        <div className="header-setting--item" key={val.key}>
          <Input
            defaultValue={val.pkgName}
            onChange={e => handleCDNInput(e, index, 'name')}
            style={{ width: 120, marginRight: '10px' }}
            placeholder="pkgName"
          />
          <Input
            defaultValue={val.cdnLink}
            style={{ width: 200 }}
            onChange={e => handleCDNInput(e, index, 'link')}
            placeholder="cdnLink"
          />
          <DeleteOutlined
            role="button"
            onClick={() => delDepsListItem(index)}
          />
        </div>
      )
    })
  }

  /** ***************** modal *****************************/
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    console.log(cdn)
    console.log(isDev)
    console.log(isSSR)
    console.log(depsList)
    props.handleSelectCDN(cdn.value, cdn.type)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <CarbonSetting className="icon" onClick={showModal} />
      <Modal
        title="Setting"
        className="header-setting"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >

        <div className="header-setting--item">
          {props.config.ssr
            ? <>
              <span className="label">SSR:</span>
              <Switch defaultChecked={isDev} onChange={v => onSwitchChange(v, 'ssr')} />
              </>
            : ''
          }

          {props.config.dev
            ? <>
              <span className="label">DEV:</span>
              <Switch defaultChecked={isSSR} onChange={v => onSwitchChange(v, 'dev')} />
              </>
            : ''
          }

          {props.config.share
            ? <ShareAltOutlined style={{ fontSize: '25px' }} />
            : ''
          }
          {props.config.download
            ? <DownloadOutlined style={{ fontSize: '25px' }} />
            : ''
        }
        </div>
        {props.config.cdn
          ? <div className="header-setting--item">
            <span className="label">CDN:</span>
            <Select
              defaultValue={cdn.value}
              style={{ width: 120 }}
              onChange={handleCDNSelect}
              options={props.cdnList}
            />
            </div>
          : ''
        }
        {props.config.userDeps
          ? <>
            <div className="header-setting--item">
              SET DEPS:
              <PlusCircleOutlined
                role="button"
                onClick={addDepsListItem}
                style={{ fontSize: '20px' }}
              />
            </div>
            {DepsList()}
            </>
          : ''
        }
      </Modal>
    </>
  )
}