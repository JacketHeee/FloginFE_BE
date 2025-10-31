import "./SearchPanel.scss"; 
import Icon from "../Icon/Icon";

export default function SearchPanel({
  isButtonSearch = true, 
  placeholder = "search anything ...", 
  backWhite,
  onChange,
  value
}) { 
    return (
        <div className={`panel-search ${backWhite ? "back-white" : ""}`}>
            <Icon> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            </Icon>
            <input
              type="text"
              placeholder={placeholder}
              className="search-input"
              onChange={onChange}
              value={value}
            />
            {isButtonSearch && <button className="search-button">Search</button>}
        </div>
    )
}