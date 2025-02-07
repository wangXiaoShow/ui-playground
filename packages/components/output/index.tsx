import '../../assets/output.scss'
import {useEffect, useState} from 'react'
import { CodeMirror } from '../code-mirror'
import { fileStore } from '../../store/file'
import { OutputSelector } from './output-selector'
import {useEventEmitter} from "ahooks";
import {exceptionType, outputType} from "../../utils/types";
import evtBus from "../../utils/event-bus"
import Preview from "./preview";
import {notification, Spin} from "antd";
interface IOutputProps {
  ssr: boolean
  uno: boolean
}
export default function output(props: IOutputProps) {

  const [curTab, setCurTab] = useState<outputType | 'preview'>('preview')
  const [outMode, setOutputMode] = useState('htmlmixed')
  const setOutputModeCall = () => {
    setOutputMode(curTab === 'css' ? 'css' : 'javascript')
  }

  const [outputCode, setOutputCode] = useState('')
  const setOutputCodeCall = () => {
    const compiledCode = fileStore.activeFile.compiled[curTab as outputType]
    setOutputCode(compiledCode)
  }


  const event$ = useEventEmitter<outputType | 'preview'>()
  event$.useSubscription((type: outputType | 'preview') => {
    setCurTab(type)
  })
  useEffect(()=>{
    if(curTab !== 'preview'){
      setOutputModeCall()
      setOutputCodeCall()
    }
  },[curTab])

  const receiveEvtFromEditor = () =>{
    setOutputModeCall()
    setOutputCodeCall()
  }
  // 接受来自 editor 交互的通知信息
  evtBus.on('editorMessage',receiveEvtFromEditor)
  // 接受来自 fileStore/ header setting 交互的通知信息,更新 output
  evtBus.on('fileMessage',receiveEvtFromEditor)

  // 监控异常
  const [api, contextHolder] = notification.useNotification();
  evtBus.on('exceptionMessage',(data: exceptionType)=>{
    api[data.type]({
      message: data.type.toUpperCase(),
      description:data.msg,
      key:data.msg,
      duration:null,
      placement: 'bottomRight',
    });
  })

  const [loading, setLoading] = useState(true);
  evtBus.on('showLoading',(show:boolean)=>{
    setLoading(show)
  })

  return (
      <Spin spinning={loading} size="large">
        {contextHolder}
        <OutputSelector event$={event$}></OutputSelector>
        <div className="output-container">
            <Preview uno={props.uno} show={curTab === 'preview'}/>
            <CodeMirror readonly={true}
                      mode={outMode}
                      show={curTab !== 'preview'}
                      value={outputCode} />
        </div>
      </Spin>
  )
}
