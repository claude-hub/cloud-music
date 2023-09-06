import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Detail, Home } from './views';

const RouteComp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/singers/:name" element={<Detail />}></Route>
        {/* <Route path="/" element={<Layout />}> */}
        {/* <Route index element={<Home />} /> */}
        {/* <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default RouteComp;
