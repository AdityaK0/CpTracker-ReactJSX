import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function CompareUsers() {
  const location = useLocation();

  const [platform, setPlatform] = useState("leetcode");
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [userData1, setUserData1] = useState(null);
  const [userData2, setUserData2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const us = params.get('username1');
    if (us) {
      setUsername1(us);
    }
  }, [location.search]);

  useEffect(() => {
    // Reset user data when the platform changes
    setUserData1(null);
    setUserData2(null);
  }, [platform]);

  const fetchComparisonData = async () => {
    if (!username1 || !username2) {
      setError("Please enter both usernames");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let responses = [];

      if (platform === "leetcode") {
        responses = await Promise.all([
          axios.get(`https://leetcode-stats-api.herokuapp.com/${username1}`),
          axios.get(`https://leetcode-stats-api.herokuapp.com/${username2}`)
        ]);

        setUserData1(responses[0].data);
        setUserData2(responses[1].data);
      } else if (platform === "codeforces") {
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username1};${username2}`);
        if (response.data.status !== "OK") {
          throw new Error("Codeforces API returned an error");
        }
        setUserData1({ result: [response.data.result[0]] });
        setUserData2({ result: [response.data.result[1]] });
      }

    } catch (error) {
      setError("One or both users not found! Check usernames and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = () => {
    return platform === "leetcode" ? "yellow-500" : "blue-500";
  };

  const calculateComparison = () => {
    if (!userData1 || !userData2) return null;

    console.log("User Data 1:", userData1); // Log userData1 for debugging
    console.log("User Data 2:", userData2); // Log userData2 for debugging

    if (platform === "leetcode") {
      return {
        totalSolved: {
          user1: userData1.totalSolved ?? 0,
          user2: userData2.totalSolved ?? 0,
          winner: (userData1.totalSolved ?? 0) > (userData2.totalSolved ?? 0) ? 1 : (userData1.totalSolved ?? 0) === (userData2.totalSolved ?? 0) ? 0 : 2
        },
        ranking: {
          user1: userData1.ranking ?? 0,
          user2: userData2.ranking ?? 0,
          winner: (userData1.ranking ?? 0) < (userData2.ranking ?? 0) ? 1 : (userData1.ranking ?? 0) === (userData2.ranking ?? 0) ? 0 : 2
        },
        acceptanceRate: {
          user1: userData1.acceptanceRate ?? 0,
          user2: userData2.acceptanceRate ?? 0,
          winner: (userData1.acceptanceRate ?? 0) > (userData2.acceptanceRate ?? 0) ? 1 : (userData1.acceptanceRate ?? 0) === (userData2.acceptanceRate ?? 0) ? 0 : 2
        },
        easySolved: {
          user1: userData1.easySolved ?? 0,
          user2: userData2.easySolved ?? 0,
          winner: (userData1.easySolved ?? 0) > (userData2.easySolved ?? 0) ? 1 : (userData1.easySolved ?? 0) === (userData2.easySolved ?? 0) ? 0 : 2
        },
        mediumSolved: {
          user1: userData1.mediumSolved ?? 0,
          user2: userData2.mediumSolved ?? 0,
          winner: (userData1.mediumSolved ?? 0) > (userData2.mediumSolved ?? 0) ? 1 : (userData1.mediumSolved ?? 0) === (userData2.mediumSolved ?? 0) ? 0 : 2
        },
        hardSolved: {
          user1: userData1.hardSolved ?? 0,
          user2: userData2.hardSolved ?? 0,
          winner: (userData1.hardSolved ?? 0) > (userData2.hardSolved ?? 0) ? 1 : (userData1.hardSolved ?? 0) === (userData2.hardSolved ?? 0) ? 0 : 2
        },
        contributionPoints: {
          user1: userData1.contributionPoints ?? 0,
          user2: userData2.contributionPoints ?? 0,
          winner: (userData1.contributionPoints ?? 0) > (userData2.contributionPoints ?? 0) ? 1 :
                 (userData1.contributionPoints ?? 0) === (userData2.contributionPoints ?? 0) ? 0 : 2
        },
        reputation: {
          user1: userData1.reputation ?? 0,
          user2: userData2.reputation ?? 0,
          winner: (userData1.reputation ?? 0) > (userData2.reputation ?? 0) ? 1 :
                 (userData1.reputation ?? 0) === (userData2.reputation ?? 0) ? 0 : 2
        }
      };
    } else if (platform === "codeforces") {
      return {
        rating: {
          user1: userData1?.result?.[0]?.rating ?? 0,
          user2: userData2?.result?.[0]?.rating ?? 0,
          winner: (userData1?.result?.[0]?.rating ?? 0) > (userData2?.result?.[0]?.rating ?? 0) ? 1 : (userData1?.result?.[0]?.rating ?? 0) === (userData2?.result?.[0]?.rating ?? 0) ? 0 : 2
        },
        maxRating: {
          user1: userData1?.result?.[0]?.maxRating ?? 0,
          user2: userData2?.result?.[0]?.maxRating ?? 0,
          winner: (userData1?.result?.[0]?.maxRating ?? 0) > (userData2?.result?.[0]?.maxRating ?? 0) ? 1 : (userData1?.result?.[0]?.maxRating ?? 0) === (userData2?.result?.[0]?.maxRating ?? 0) ? 0 : 2
        },
        contribution: {
          user1: userData1?.result?.[0]?.contribution ?? 0,
          user2: userData2?.result?.[0]?.contribution ?? 0,
          winner: (userData1?.result?.[0]?.contribution ?? 0) > (userData2?.result?.[0]?.contribution ?? 0) ? 1 : (userData1?.result?.[0]?.contribution ?? 0) === (userData2?.result?.[0]?.contribution ?? 0) ? 0 : 2
        },
        friendsCount: {
          user1: userData1?.result?.[0]?.friendOfCount ?? 0,
          user2: userData2?.result?.[0]?.friendOfCount ?? 0,
          winner: (userData1?.result?.[0]?.friendOfCount ?? 0) > (userData2?.result?.[0]?.friendOfCount ?? 0) ? 1 :
                 (userData1?.result?.[0]?.friendOfCount ?? 0) === (userData2?.result?.[0]?.friendOfCount ?? 0) ? 0 : 2
        }
      };
    }

    return null;
  };

  const comparison = userData1 && userData2 ? calculateComparison() : null;

  const calculateWins = () => {
    if (!comparison) return { user1: 0, user2: 0, ties: 0 };

    let user1Wins = 0;
    let user2Wins = 0;
    let ties = 0;

    Object.values(comparison).forEach(item => {
      if (item.winner === 1) user1Wins++;
      else if (item.winner === 2) user2Wins++;
      else ties++;
    });

    return { user1: user1Wins, user2: user2Wins, ties };
  };

  const wins = calculateWins();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mt-6">Compare CP Users</h1>

      <div className="mt-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${platform === "leetcode" ? `bg-yellow-500` : `bg-gray-700 hover:bg-gray-600`}`}
          onClick={() => setPlatform("leetcode")}
        >
          LeetCode
        </button>
        <button
          className={`px-4 py-2 rounded ${platform === "codeforces" ? `bg-blue-500` : `bg-gray-700 hover:bg-gray-600`}`}
          onClick={() => setPlatform("codeforces")}
        >
          Codeforces
        </button>
      </div>

      <div className="mt-6 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-1">First User</label>
          <input
            type="text"
            placeholder={`Enter ${platform} username`}
            className={`w-full p-2 px-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none`}
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Second User</label>
          <input
            type="text"
            placeholder={`Enter ${platform} username`}
            className={`w-full p-2 px-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none`}
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={fetchComparisonData}
        className={`mt-6 bg-${getPlatformColor()} px-6 py-2 rounded hover:bg-opacity-80 transition duration-200`}
      >
        Compare
      </button>

      {error && <div className="mt-3 text-red-400">{error}</div>}

      {loading && (
        <div className="mt-8 flex flex-col items-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-${getPlatformColor()}`}></div>
          <p className="mt-3 text-gray-300">Fetching Data...</p>
        </div>
      )}

      {comparison && (
        <div className="mt-8 w-full max-w-4xl">
          <div className="bg-gray-800 p-4 rounded-t-lg shadow-lg border-b border-gray-700 flex justify-between items-center">
            <div className="text-xl font-semibold">{username1}</div>
            <div className="flex gap-3 items-center">
              <div className={`text-xl font-bold ${wins.user1 > wins.user2 ? `text-${getPlatformColor()}` : 'text-gray-400'}`}>{wins.user1}</div>
              <div className="text-gray-500">vs</div>
              <div className={`text-xl font-bold ${wins.user2 > wins.user1 ? `text-${getPlatformColor()}` : 'text-gray-400'}`}>{wins.user2}</div>
            </div>
            <div className="text-xl font-semibold">{username2}</div>
          </div>

          <div className="bg-gray-800 p-4 rounded-b-lg shadow-lg space-y-4">
            {platform === "leetcode" ? (
              <>
                <ComparisonRow
                  title="Total Problems Solved"
                  value1={comparison.totalSolved.user1}
                  value2={comparison.totalSolved.user2}
                  winner={comparison.totalSolved.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Global Ranking"
                  value1={comparison.ranking.user1}
                  value2={comparison.ranking.user2}
                  winner={comparison.ranking.winner === 1 ? 2 : comparison.ranking.winner === 2 ? 1 : 0} // Lower is better for ranking
                  platformColor={getPlatformColor()}
                  format="rank"
                />
                <ComparisonRow
                  title="Acceptance Rate"
                  value1={comparison.acceptanceRate.user1}
                  value2={comparison.acceptanceRate.user2}
                  winner={comparison.acceptanceRate.winner}
                  platformColor={getPlatformColor()}
                  format="percent"
                />
                <ComparisonRow
                  title="Easy Problems"
                  value1={comparison.easySolved.user1}
                  value2={comparison.easySolved.user2}
                  winner={comparison.easySolved.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Medium Problems"
                  value1={comparison.mediumSolved.user1}
                  value2={comparison.mediumSolved.user2}
                  winner={comparison.mediumSolved.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Hard Problems"
                  value1={comparison.hardSolved.user1}
                  value2={comparison.hardSolved.user2}
                  winner={comparison.hardSolved.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Contribution Points"
                  value1={comparison.contributionPoints.user1}
                  value2={comparison.contributionPoints.user2}
                  winner={comparison.contributionPoints.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Reputation"
                  value1={comparison.reputation.user1}
                  value2={comparison.reputation.user2}
                  winner={comparison.reputation.winner}
                  platformColor={getPlatformColor()}
                />
              </>
            ) : (
              <>
                <ComparisonRow
                  title="Current Rating"
                  value1={comparison.rating.user1}
                  value2={comparison.rating.user2}
                  winner={comparison.rating.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Max Rating"
                  value1={comparison.maxRating.user1}
                  value2={comparison.maxRating.user2}
                  winner={comparison.maxRating.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Contribution"
                  value1={comparison.contribution.user1}
                  value2={comparison.contribution.user2}
                  winner={comparison.contribution.winner}
                  platformColor={getPlatformColor()}
                />
                <ComparisonRow
                  title="Friends Count"
                  value1={comparison.friendsCount.user1}
                  value2={comparison.friendsCount.user2}
                  winner={comparison.friendsCount.winner}
                  platformColor={getPlatformColor()}
                />
              </>
            )}
          </div>

          <div className="mt-4 p-4 bg-gray-800 rounded-lg text-center">
            <h3 className="text-xl font-bold">Result</h3>
            {wins.user1 > wins.user2 ? (
              <p className="text-lg mt-2"><span className={`text-${getPlatformColor()}`}>{username1}</span> wins with {wins.user1} wins!</p>
            ) : wins.user2 > wins.user1 ? (
              <p className="text-lg mt-2"><span className={`text-${getPlatformColor()}`}>{username2}</span> wins with {wins.user2} wins!</p>
            ) : (
              <p className="text-lg mt-2">It's a tie with {wins.user1} wins each!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ title, value1, value2, winner, platformColor, format }) {
  const formatValue = (value) => {
    if (format === "percent") return `${value}%`;
    if (format === "rank") return `#${value}`;
    return value;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="text-gray-400">{title}</div>
      <div className="flex gap-4 items-center">
        <div className={`${winner === 1 ? `text-${platformColor}` : 'text-gray-400'}`}>{formatValue(value1)}</div>
        <div className="text-gray-500">vs</div>
        <div className={`${winner === 2 ? `text-${platformColor}` : 'text-gray-400'}`}>{formatValue(value2)}</div>
      </div>
    </div>
  );
}
