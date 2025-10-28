import './Header.scss';

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <input
          type="text"
          placeholder="Search Something..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      <div className="header-right">
        <button className="icon-button">
          <span className="notification-badge">3</span>
          🔔
        </button>
        <button className="icon-button">
          💬
        </button>
        <button className="icon-button">
          👤
        </button>
        <button className="icon-button">
          🌙
        </button>
        <button className="icon-button theme-button">
          🎨
        </button>
      </div>
    </div>
  );
};

export default Header;
