import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { platform } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [contests, setContests] = useState([]);
  const [error, setError] = useState("");
  const [favoriteUsers, setFavoriteUsers] = useState(() => {
    const saved = localStorage.getItem("cp_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    const history = localStorage.getItem("cp_search_history");
    return history ? JSON.parse(history) : {};
  });

  const fetchUserData = async (searchUsername = username) => {
    if (!searchUsername) {
      setError("Please enter a username");
      return;
    }

    setError("");
    setLoading(true);
    setUserData(null);

    let apiUrl = platform === "leetcode"
      ? `https://leetcode-stats-api.herokuapp.com/${searchUsername}`
      : `https://codeforces.com/api/user.info?handles=${searchUsername}`;

    try {
      const response = await axios.get(apiUrl);
      setUserData(response.data);
      updateSearchHistory(searchUsername);
    } catch (error) {
      setError("User not found! Check username and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateSearchHistory = (searchUsername) => {
    const platformHistory = searchHistory[platform] || [];

    const filteredHistory = platformHistory.filter(item => item !== searchUsername);

    const newHistory = [searchUsername, ...filteredHistory].slice(0, 5);
    const updatedHistory = {
      ...searchHistory,
      [platform]: newHistory
    };

    setSearchHistory(updatedHistory);
    localStorage.setItem("cp_search_history", JSON.stringify(updatedHistory));
  };

  const fetchLeaderboard = async () => {
    try {
      if (platform === "codeforces") {
        const response = await axios.get("https://codeforces.com/api/user.ratedList?activeOnly=true");
        setLeaderboard(response.data.result.slice(0, 5)); 
      } else if (platform === "leetcode") {
        const response = await axios.get("https://third-party-leetcode-api.com/leaderboard");
        setLeaderboard(response.data.slice(0, 5)); // Top 5 Users
      }
    } catch (error) {
      console.error("Error fetching leaderboard", error);
    }
  };

  const fetchUpcomingContests = async () => {
    try {
      if (platform === "codeforces") {
        const response = await axios.get("https://codeforces.com/api/contest.list");
        const upcoming = response.data.result.filter(contest => contest.phase === "BEFORE");
        setContests(upcoming.slice(0, 3)); 
      } else if (platform === "leetcode") {
        setContests([
          { name: "Weekly Contest 345", startTimeSeconds: (Date.now() / 1000) + 86400 },
          { name: "Biweekly Contest 123", startTimeSeconds: (Date.now() / 1000) + 345600 },
          { name: "LeetCode Cup 2025", startTimeSeconds: (Date.now() / 1000) + 604800 }
        ]);
      }
    } catch (error) {
      console.error("Error fetching contests", error);
    }
  };

  const toggleFavorite = (user) => {
    const username = platform === "leetcode" ? user.username : user.result[0].handle;

    if (favoriteUsers.some(fav => fav.username === username && fav.platform === platform)) {
      const updated = favoriteUsers.filter(
        fav => !(fav.username === username && fav.platform === platform)
      );
      setFavoriteUsers(updated);
      localStorage.setItem("cp_favorites", JSON.stringify(updated));
    } else {
      const newFavorite = {
        username,
        platform,
        data: user,
        addedAt: Date.now()
      };
      const updated = [...favoriteUsers, newFavorite];
      setFavoriteUsers(updated);
      localStorage.setItem("cp_favorites", JSON.stringify(updated));
    }
  };

  const isUserFavorite = () => {
    if (!userData) return false;
    const username = platform === "leetcode" ? userData.username : userData.result[0].handle;
    return favoriteUsers.some(fav => fav.username === username && fav.platform === platform);
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchUpcomingContests();
  }, [platform]);

  const formatContestTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPlatformColor = () => {
    return platform === "leetcode" ? "yellow-500" : "blue-500";
  };

  const handleCompare = () => {
    const currentUsername = platform === "leetcode" ? userData.username : userData.result[0].handle;
    navigate(`/compare/${platform}?username1=${currentUsername || username}`);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 text-white p-6">
      <h1 className={`text-3xl font-bold mt-6 text-${getPlatformColor()}`}>
        {platform === "leetcode" ? "LeetCode" : "Codeforces"} User Stats
      </h1>
      <div className="mt-6 flex gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder={`Enter ${platform} username`}
            className={`w-72 p-2 px-3 rounded-l bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-${getPlatformColor()}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchUserData()}
          />
          <button
            onClick={() => setShowHistoryModal(true)}
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            title="Search History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => fetchUserData()}
          className={`bg-${getPlatformColor()} px-4 py-2 rounded-r hover:bg-opacity-80 transition duration-200`}
        >
          Search
        </button>
      </div>
      {/* Error Message */}
      {error && <div className="mt-3 text-red-400">{error}</div>}
      {/* Loading */}
      {loading && (
        <div className="mt-8 flex flex-col items-center">
            <div className={`animate-spin rounded-full  h-12 w-12 border-t-4 border-${getPlatformColor()} border-solid`}></div>
            <p className="mt-3 text-gray-300">Fetching Data...</p>
        </div>
      )}
      {/* User Data */}
      {userData && (
        <div className={`mt-8 bg-gray-800 p-6 rounded-lg w-full max-w-xl shadow-lg text-center border-t-4 border-${getPlatformColor()}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">{platform === "leetcode" ? userData.username : userData.result[0].handle}</h2>
              <p className="text-gray-400 mt-1">
                Ranking: {platform === "leetcode" ? `#${userData.ranking}` : userData.result[0].rank}
              </p>
            </div>
            <button
              onClick={() => toggleFavorite(userData)}
              className="text-yellow-400 hover:text-yellow-300 focus:outline-none"
              title={isUserFavorite() ? "Remove from favorites" : "Add to favorites"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isUserFavorite() ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
          {platform === "leetcode" ? (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-400">Easy</p>
                <p className="text-lg font-semibold text-green-400">{userData.easySolved} / {userData.totalEasy}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-400">Medium</p>
                <p className="text-lg font-semibold text-yellow-400">{userData.mediumSolved} / {userData.totalMedium}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-400">Hard</p>
                <p className="text-lg font-semibold text-red-400">{userData.hardSolved} / {userData.totalHard}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex justify-center items-center gap-8">
                <div>
                  <p className="text-sm text-gray-400">Current Rating</p>
                  <p className="text-xl font-semibold">{userData.result[0].rating}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Max Rating</p>
                  <p className="text-xl font-semibold">{userData.result[0].maxRating}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <img
                  src={userData.result[0].titlePhoto}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border-2 border-gray-600"
                />
              </div>
            </div>
          )}
          {platform === "codeforces" && (
            <div className="mt-4 bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-400">Contribution</p>
              <p className={`text-lg font-semibold ${userData.result[0].contribution >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {userData.result[0].contribution}
              </p>
            </div>
          )}
          <div className="mt-5 flex justify-center gap-3">
            <a
              href={platform === "leetcode"
                ? `https://leetcode.com/${userData.username || username}`
                : `https://codeforces.com/profile/${userData.result[0].handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-${getPlatformColor()} px-4 py-2 rounded text-white hover:bg-opacity-80 transition duration-200`}
            >
              View Profile
            </a>
            <button
              onClick={handleCompare}
              className={`bg-${getPlatformColor()} px-4 py-2 rounded text-white hover:bg-opacity-80 transition duration-200`}
            >
              Compare
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-4xl">
        {/* Leaderboard */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <h3 className={`text-xl font-bold mb-3 text-${getPlatformColor()}`}>Top Coders</h3>
          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full bg-${getPlatformColor()} text-center mr-3`}>{index + 1}</span>
                  <span>{user.handle || user.username}</span>
                </div>
                <span>{user.rating}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Upcoming Contests */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <h3 className={`text-xl font-bold mb-3 text-${getPlatformColor()}`}>Upcoming Contests</h3>
          <div className="space-y-2">
            {contests.map((contest, index) => (
              <div key={index} className="p-2 bg-gray-700 rounded">
                <p className="font-semibold">{contest.name}</p>
                <p className="text-sm text-gray-400">{formatContestTime(contest.startTimeSeconds)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
