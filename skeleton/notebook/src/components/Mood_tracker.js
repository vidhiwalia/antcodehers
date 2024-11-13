// ORIGINAL CODE BUT WAS GIVING SOME CANVAS ID ERROR SO USED CHATGPT CODE BELOW


// import React, { useState, useEffect } from 'react';
// import Chart from 'chart.js/auto';
// import './css/style.css'; // Assuming you still want to use external CSS

// const MoodTracker = () => {
//   const [mood, setMood] = useState('happy');
//   const [chartInstance, setChartInstance] = useState(null);

//   // Function to handle mood submission
//   const logMood = async (e) => {
//     e.preventDefault();
//     const response = await fetch('http://localhost:5000/api/moods/log', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ mood }),
//     });

//     if (response.ok) {
//       alert('Mood logged successfully!');
//       fetchMoodHistory();
//     }
//   };

//   // Function to fetch mood history and render the chart
//   const fetchMoodHistory = async () => {
//     const response = await fetch('http://localhost:5000/api/moods/history');
//     const moods = await response.json();

//     const moodCounts = moods.reduce((counts, mood) => {
//       counts[mood.mood] = (counts[mood.mood] || 0) + 1;
//       return counts;
//     }, {});

//     const labels = Object.keys(moodCounts);
//     const data = Object.values(moodCounts);

//     // Destroy the previous chart instance before creating a new one
//     if (chartInstance) {
//       chartInstance.destroy();
//     }

//     const newChartInstance = new Chart(document.getElementById('moodChart'), {
//       type: 'bar',
//       data: {
//         labels: labels,
//         datasets: [{
//           label: 'Mood Count',
//           data: data,
//           backgroundColor: [
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(255, 99, 132, 0.2)',
//             'rgba(255, 206, 86, 0.2)',
//             'rgba(153, 102, 255, 0.2)',
//           ],
//           borderColor: [
//             'rgba(75, 192, 192, 1)',
//             'rgba(255, 99, 132, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(153, 102, 255, 1)',
//           ],
//           borderWidth: 1,
//         }],
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     });

//     setChartInstance(newChartInstance);
//   };

//   // Fetch mood history on page load
//   useEffect(() => {
//     fetchMoodHistory();
//   }, []);

//   return (
//     <div className="container">
//       <h1>Mood Tracker</h1>
//       <form onSubmit={logMood}>
//         <label htmlFor="mood">How are you feeling?</label>
//         <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)} required>
//           <option value="happy">Happy</option>
//           <option value="sad">Sad</option>
//           <option value="neutral">Neutral</option>
//           <option value="anxious">Anxious</option>
//         </select>
//         <button type="submit">Log Mood</button>
//       </form>
//       <canvas id="moodChart"></canvas>
//     </div>
//   );
// };

// export default MoodTracker;



import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
const MoodTracker = () => {
  const chartRef = useRef(null);
  const [moodData, setMoodData] = useState([]);
  
  // Function to log mood
  const handleSubmit = async (e) => {
    e.preventDefault();
    const mood = e.target.mood.value;

    const response = await fetch('http://localhost:5000/api/moods/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood }),
    });

    if (response.ok) {
      alert('Mood logged successfully!');
      fetchMoodHistory();
    }
  };

  // Function to fetch mood history and render chart
  const fetchMoodHistory = async () => {
    const response = await fetch('http://localhost:5000/api/moods/history');
    const moods = await response.json();

    const moodCounts = moods.reduce((counts, mood) => {
      counts[mood.mood] = (counts[mood.mood] || 0) + 1;
      return counts;
    }, {});

    const labels = Object.keys(moodCounts);
    const data = Object.values(moodCounts);

    // Destroy existing chart before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    const ctx = document.getElementById('moodChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Count',
          data: data,
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  };

  // Fetch mood history on page load
  // useEffect(() => {
  //   fetchMoodHistory();
  // }, []);

  let navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('token')) {
          fetchMoodHistory()
        }
        else {
            navigate("/login")
        }

    }, [])
  return (
    <div className="container">
      <h1>Mood Tracker</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mood">How are you feeling?</label>
        <select id="mood" name="mood" required>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="neutral">Neutral</option>
          <option value="anxious">Anxious</option>
        </select>
        <button type="submit">Log Mood</button>
      </form>
      <canvas id="moodChart"></canvas>
    </div>
  );
};

export default MoodTracker;