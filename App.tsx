import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Layanan from './pages/Layanan';
import TentangKami from './pages/TentangKami';
import BeforeAfter from './pages/BeforeAfter';
import Kontak from './pages/Kontak';
import KlinikMatras from './pages/KlinikMatras';
import KlinikSofa from './pages/KlinikSofa';
import SanoClean from './pages/SanoClean';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/tentang-kami" element={<TentangKami />} />
        <Route path="/before-after" element={<BeforeAfter />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/klinik-matras" element={<KlinikMatras />} />
        <Route path="/klinik-sofa" element={<KlinikSofa />} />
        <Route path="/sano-clean" element={<SanoClean />} />
      </Routes>
    </Layout>
  );
};

export default App;