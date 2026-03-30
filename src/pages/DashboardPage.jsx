import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle, FileText } from "lucide-react";
import "./DashboardPage.css";
import TopNav from "../components/TopNav";
import API_BASE_URL from "./config";
import API from "../api/api";


const DashboardPage = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`${API_BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data || []);
      } catch (e) {
        setWatchlist([]);
      }
    };

    fetchWatchlist();
  }, []);

  return (
    <div className="page-bg">
      <div className="container">
        <TopNav title="" />

        <h1 className="dashboard-title">Welcome 👋</h1>
        <p className="dashboard-subtitle">
          Start a new stock analysis or review your research
        </p>

        <div className="dashboard-actions">
          {/* New Analysis */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/categories")}
          >
            <PlusCircle size={32} className="text-accent" />
            <h3>New Analysis</h3>
            <p>Analyze a stock step by step</p>
          </div>

          {/* Reports */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/report")}
          >
            <FileText size={32} className="text-accent" />
            <h3>Reports</h3>
            <p>View completed research</p>
          </div>

          {/* Watchlist */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/watchlist")}
          >
            <h3>Watchlist</h3>

            {watchlist.length === 0 ? (
              <p className="muted">No stocks added</p>
            ) : (
              watchlist.slice(0, 3).map((item) => (
                <div key={item.stockSymbol} className="watchlist-item">
                  <strong>{item.stockName}</strong>
                  <span>({item.stockSymbol})</span>
                </div>
              ))
            )}

            <span className="link-text">View all →</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
