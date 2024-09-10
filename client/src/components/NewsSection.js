// external links to show news , and images
import { Link } from "react-router-dom";
import img1 from "../assests/img1.jpg";
import img2 from "../assests/img2.jpg";

function NewsSection() {
  
  const linkStyle =
    "bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900 block mb-4";

  return (
    <div className="bg-white shadow-lg rounded-lg p-11 w-1/3">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">
        Category: Transportation News
      </h2>
      <div className="space-y-4">
        {/* external Links to open new page for each newsletter. */}
        <Link
          className={linkStyle}
          target="_blank"
          rel="noopener noreferrer"
          to="https://www.theguardian.com/sustainable-business/transport"
        >
          'The Guardian newsletter for Transportation business'
        </Link>
        <img className="w-full mb-4" src={img1} alt="news1"></img>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyle}
          to="https://www.maritime-executive.com"
        >
          'The Maritime Executive Newsletter'
        </Link>
        <img className="w-full mb-4" src={img2} alt="news2"></img>
      </div>
    </div>
  );
}

export default NewsSection;
