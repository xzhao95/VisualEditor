import React from 'react'
import "./Pipeline.less"

export interface Pipeline{
    stages: Stage[];
}
interface Stage{
    title: string;
    jobs: Job[];
}
interface Job{
    name: string;
    status: 'success' | 'fail';
    time: number; //毫秒时间戳
}

function formatTime(time:number) {
    var hours = parseInt(time / (1000 * 60 * 60) + "");
    var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60)+ "")
    var seconds = parseInt((time % (1000 * 60)) / 1000+ "");
    return ('00' + hours).substr(-2) + ":" + ('00' + minutes).substr(-2) + ":" + ('00' + seconds).substr(-2)
}

const Job:React.FC<{job: Job}> = function (props) {
    return (
        <div className="job-item">
            <span className="job-line-before"></span>
            <div className="job-left">
                <i className={"iconfont icon-" + props.job.status}></i>
                {props.job.name}
            </div>
            <span className="job-time">{formatTime(props.job.time)}</span>
            <span className="job-line-after"></span>
        </div>
    )
}

const Stage:React.FC<{stage: Stage}> = function(props) {
    return (
        <div className="stage-item">
            <div className="stage-item-name">{props.stage.title}</div>
            {props.stage.jobs.map((item, index) => <Job job={item} key={index}/>)}
        </div>
    )
}

export const Pipeline:React.FC<{pipeline: Pipeline}> = function (props) {
    return (
        <div className="pipeline">
            {props.pipeline.stages.map((item, index) => <Stage stage={item} key={index}/>)}
        </div>
    )
}