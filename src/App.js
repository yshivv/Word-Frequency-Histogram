import React, { useState } from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';
import { saveAs } from 'file-saver';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [histogram, setHistogram] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const text = await response.text();
      const words = text.split(/\s+/);
      const frequency = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
      const frequencyArray = Object.entries(frequency).map(([word, frequency]) => ({ word, frequency }));
      const sortedFrequency = frequencyArray.sort((a, b) => b.frequency - a.frequency);
      const top20 = sortedFrequency.slice(0, 20);
      setHistogram(top20);
      toast.success('Histogram is generated');
    } catch (error) {
      console.log(error);
    }
  };

  const handleExport = () => {
    const csvData = 'Word,Frequency\n' + histogram.map(item => `${item.word},${item.frequency}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    toast.success('Exported to CSV');
    saveAs(blob, 'histogram.csv');
  };

  return (
    <div className="App">
      <h1>Word Frequency Histogram</h1>
      <button onClick={handleSubmit}>Submit</button>
      <BarChart width={600} height={300} data={histogram}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="word" />
        <YAxis />
        <Bar dataKey="frequency" fill="#E72C2C" />
      </BarChart>
      <button onClick={handleExport}>Export</button>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
