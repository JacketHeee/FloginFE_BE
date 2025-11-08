import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './Dashboard.scss';

const Dashboard = ({ children }) => {

  return (
    <div className='nen'>
        <div className="dashboard-layout">
          <Sidebar />
          <div className="dashboard-content">
            <Header />
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
