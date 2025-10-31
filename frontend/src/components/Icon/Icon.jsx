
import "./Icon.scss";

const iconStyle = {
    width: "20px",
    height: "20px"
};

export default function Icon({children, hasNoti, onClick}) {
    return (
        <div className="icon" style={iconStyle} onClick={onClick}>
            {children}
            {hasNoti && <span className="dot"/>}
        </div>
    )
}