import "./Devider.scss"

export default function Devider({isVer=false}) {
    return (
        <div className={`devider ${isVer? "isVer" : ""}`}/>
    )
}