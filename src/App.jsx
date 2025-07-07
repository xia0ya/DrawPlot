import { useState } from 'react';
import './App.css';
import { charts } from './data/charts';
import ChartGallery from './components/ChartGallery';
import MarkdownDescription from './components/MarkdownDescription';

function App() {
  const [selectedChart, setSelectedChart] = useState(null);

  return (
    <div>
      {!selectedChart && (
        <>
          <h1
            style={{
              textAlign: 'center',
              margin: '32px 0 16px',
              fontWeight: 700,
              letterSpacing: 2,
              background: 'linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%)',
              color: '#fff',
              borderRadius: 48,
              display: 'inline-block',
              padding: '18px 48px',
              boxShadow: '0 2px 12px #b6e0ff55',
            }}
          >
            可视化图表展示
          </h1>
          <ChartGallery charts={charts} onImageClick={setSelectedChart} />
        </>
      )}
      {selectedChart && (
        <MarkdownDescription
          markdownFile={selectedChart.markdown}
          onBack={() => setSelectedChart(null)}
          backText="返回图片总览"
        />
      )}
      <footer style={{ textAlign: 'center', color: '#888', margin: '40px 0 16px', fontSize: 14 }}>
        © {new Date().getFullYear()} 数据可视化图表展示
      </footer>
    </div>
  );
}

export default App;
